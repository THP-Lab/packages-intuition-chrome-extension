import {
  Button,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Icon,
  Identity,
  IdentityTag,
  IdentityTagSize,
  ProfileCard,
  Tags,
  Text,
  toast,
  Trunctacular,
} from '@0xintuition/1ui'
import { GetAtomQuery } from '@0xintuition/graphql'

import { multivaultAbi } from '@lib/abis/multivault'
import { useBatchCreateTriple } from '@lib/hooks/useBatchCreateTriple'
import { useLoaderFetcher } from '@lib/hooks/useLoaderFetcher'
import logger from '@lib/utils/logger'
import {
  getAtomDescriptionGQL,
  getAtomIdGQL,
  getAtomImageGQL,
  getAtomIpfsLinkGQL,
  getAtomLabelGQL,
} from '@lib/utils/misc'
import { CreateLoaderData } from '@routes/resources+/create'
import {
  CREATE_RESOURCE_ROUTE,
  GENERIC_ERROR_MSG,
  MULTIVAULT_CONTRACT_ADDRESS,
} from 'app/consts'
import { TransactionActionType } from 'app/types/transaction'
import { formatUnits } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import { createIdentityArrays } from './list-utils'

interface AddIdentitiesReviewProps {
  dispatch: (action: TransactionActionType) => void
  objectVaultId: string
  identitiesToAdd: GetAtomQuery['atom'][]
}

export default function AddIdentitiesReview({
  dispatch,
  objectVaultId,
  identitiesToAdd,
}: AddIdentitiesReviewProps) {
  const feeFetcher = useLoaderFetcher<CreateLoaderData>(CREATE_RESOURCE_ROUTE)

  const { tripleCost, minDeposit } = (feeFetcher.data as CreateLoaderData) ?? {
    tripleCost: BigInt(0),
    minDeposit: BigInt(0),
  }

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { address } = useAccount()

  const {
    writeContractAsync: writeBatchCreateTriple,
    awaitingWalletConfirmation,
    awaitingOnChainConfirmation,
  } = useBatchCreateTriple()

  const {
    subjectIdentityVaultIds,
    predicateHasTagVaultIds,
    objectIdentityVaultIds,
  } = createIdentityArrays(identitiesToAdd, objectVaultId)

  const estimatedFees = formatUnits(
    BigInt(tripleCost) * BigInt(subjectIdentityVaultIds.length) +
      BigInt(minDeposit) * BigInt(objectIdentityVaultIds.length),
    18,
  )

  async function handleOnChainCreateTags() {
    if (
      walletClient &&
      !awaitingOnChainConfirmation &&
      !awaitingWalletConfirmation &&
      publicClient &&
      writeBatchCreateTriple &&
      address
    ) {
      try {
        dispatch({ type: 'APPROVE_TRANSACTION' })
        logger('[BEGIN ONCHAIN CREATE')
        logger('subjectIdentityVaultIds:', subjectIdentityVaultIds)
        logger('predicateHasTagVaultIds:', predicateHasTagVaultIds)
        logger('objectIdentityVaultIds:', objectIdentityVaultIds)
        const txHash = await writeBatchCreateTriple({
          address: MULTIVAULT_CONTRACT_ADDRESS,
          abi: multivaultAbi,
          functionName: 'batchCreateTriple',
          args: [
            subjectIdentityVaultIds,
            predicateHasTagVaultIds,
            objectIdentityVaultIds,
          ],
          value:
            BigInt(tripleCost) * BigInt(objectIdentityVaultIds.length) +
            BigInt(minDeposit) * BigInt(objectIdentityVaultIds.length),
        })
        dispatch({ type: 'TRANSACTION_PENDING' })
        if (txHash) {
          const receipt = await publicClient.waitForTransactionReceipt({
            hash: txHash,
          })
          dispatch({
            type: 'TRANSACTION_COMPLETE',
            txHash,
            txReceipt: receipt,
          })
        }
      } catch (error) {
        logger('ERROR', error)
        console.error('error', error)
        if (error instanceof Error) {
          let errorMessage = 'Error in onchain transaction.'
          if (error.message.includes('insufficient')) {
            errorMessage =
              'Insufficient funds. Please add more OP to your wallet and try again.'
          }
          if (error.message.includes('rejected')) {
            errorMessage = 'Transaction rejected. Try again when you are ready.'
          }
          dispatch({
            type: 'TRANSACTION_ERROR',
            error: errorMessage,
          })
          toast.error(GENERIC_ERROR_MSG)
          return
        }
      }
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <Button
            onClick={(e) => {
              e.preventDefault()
              dispatch({ type: 'START_TRANSACTION' })
            }}
            variant="ghost"
            size="icon"
          >
            <Icon name="arrow-left" className="h-4 w-4" />
          </Button>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center m-auto">
        <Icon name="await-action" className="h-20 w-20 text-neutral-50/30" />
        <div className="flex flex-col items-center gap-5 mt-5">
          <Text
            variant="headline"
            weight="medium"
            className="text-secondary-foreground/70"
          >
            Review your Identities
          </Text>
        </div>
        <div className="flex p-6 items-center">
          <Tags>
            <div className="flex flex-wrap gap-2 items-center">
              {identitiesToAdd.map((identity) => (
                <HoverCard key={identity?.id} openDelay={150} closeDelay={150}>
                  <HoverCardTrigger>
                    <IdentityTag
                      key={identity?.id}
                      size={IdentityTagSize.md}
                      variant={Identity.nonUser}
                      imgSrc={identity?.image ?? ''}
                    >
                      <Trunctacular
                        value={identity?.label ?? ''}
                        disableTooltip
                      />
                    </IdentityTag>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" align="center" className="w-max">
                    <div className="flex flex-col gap-4 w-80 max-md:w-[80%]">
                      <ProfileCard
                        variant={
                          identity?.type ===
                          ('Account' || 'Person' || 'Default')
                            ? Identity.user
                            : Identity.nonUser
                        }
                        avatarSrc={getAtomImageGQL(identity)}
                        name={getAtomLabelGQL(identity)}
                        id={getAtomIdGQL(identity)}
                        bio={getAtomDescriptionGQL(identity)}
                        ipfsLink={getAtomIpfsLinkGQL(identity)}
                      />
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </Tags>
        </div>
        {!!estimatedFees && (
          <Text variant="body" className="text-primary/50">
            Estimated Fees: {estimatedFees}
          </Text>
        )}
      </div>
      <DialogFooter className="!justify-center !items-center">
        <div className="flex flex-col items-center gap-1 ">
          <Button
            variant="primary"
            onClick={handleOnChainCreateTags}
            className="w-40"
          >
            Confirm
          </Button>
        </div>
      </DialogFooter>
    </>
  )
}
