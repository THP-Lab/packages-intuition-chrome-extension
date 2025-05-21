import {
  Button,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Icon,
  Tags,
  TagWithValue,
  Text,
  toast,
} from '@0xintuition/1ui'
import { GetAtomQuery } from '@0xintuition/graphql'

import { multivaultAbi } from '@lib/abis/multivault'
import { useBatchCreateTriple } from '@lib/hooks/useBatchCreateTriple'
import { useLoaderFetcher } from '@lib/hooks/useLoaderFetcher'
import { CreateLoaderData } from '@routes/resources+/create'
import {
  CREATE_RESOURCE_ROUTE,
  GENERIC_ERROR_MSG,
  MULTIVAULT_CONTRACT_ADDRESS,
} from 'app/consts'
import { TransactionActionType } from 'app/types/transaction'
import { formatUnits } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'

import { createTagArrays } from './tag-utils'

interface TagsReviewProps {
  dispatch: (action: TransactionActionType) => void
  subjectVaultId: string
  tags: GetAtomQuery['atom'][]
}

export default function TagsReview({
  dispatch,
  subjectVaultId,
  tags,
}: TagsReviewProps) {
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
    objectTagVaultIds,
  } = createTagArrays(tags, subjectVaultId)

  const estimatedFees = formatUnits(
    BigInt(tripleCost) * BigInt(subjectIdentityVaultIds.length),
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
        const txHash = await writeBatchCreateTriple({
          address: MULTIVAULT_CONTRACT_ADDRESS,
          abi: multivaultAbi,
          functionName: 'batchCreateTriple',
          args: [
            subjectIdentityVaultIds,
            predicateHasTagVaultIds,
            objectTagVaultIds,
          ],
          value:
            BigInt(tripleCost) * BigInt(subjectIdentityVaultIds.length) +
            BigInt(minDeposit) * BigInt(subjectIdentityVaultIds.length),
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
        <DialogTitle className="justify-between">
          <div className="flex flex-row gap-2">
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
          </div>
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
            Review your Tags
          </Text>
        </div>
        <div className="flex p-6 items-center">
          <Tags>
            <div className="flex flex-wrap gap-2 items-center">
              {tags.map((tag, index) => (
                <TagWithValue
                  key={index}
                  label={tag?.label ?? ''}
                  value={0} // TODO: (ENG-4782) temporary until we have tag count
                />
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
      <DialogFooter className="!justify-center !items-center mt-20">
        <div className="flex flex-col items-center gap-1">
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
