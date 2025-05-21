import React, { useEffect, useState } from 'react'

import {
  Badge,
  Button,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Icon,
  Input,
  Text,
  toast,
} from '@0xintuition/1ui'
import { ClaimPresenter } from '@0xintuition/api'
import { GetAtomQuery, useGetTripleQuery } from '@0xintuition/graphql'

import CreateClaimReview from '@components/create-claim/create-claim-review'
import { IdentitySelector } from '@components/identity/identity-selector'
import { InfoTooltip } from '@components/info-tooltip'
import WrongNetworkButton from '@components/wrong-network-button'
import { multivaultAbi } from '@lib/abis/multivault'
import { useCheckClaim } from '@lib/hooks/useCheckClaim'
import { useCreateClaimConfig } from '@lib/hooks/useCreateClaimConfig'
import { useCreateTriple } from '@lib/hooks/useCreateTriple'
import { useGetWalletBalance } from '@lib/hooks/useGetWalletBalance'
import {
  initialTransactionState,
  transactionReducer,
  useTransactionState,
} from '@lib/hooks/useTransactionReducer'
import { createClaimModalAtom } from '@lib/state/store'
import { getChainEnvConfig } from '@lib/utils/environment'
import logger from '@lib/utils/logger'
import { useNavigate } from '@remix-run/react'
import {
  CURRENT_ENV,
  GENERIC_ERROR_MSG,
  MULTIVAULT_CONTRACT_ADDRESS,
  PATHS,
} from 'app/consts'
import { ClaimElement, ClaimElementType } from 'app/types'
import {
  TransactionActionType,
  TransactionStateType,
  TransactionSuccessAction,
  TransactionSuccessActionType,
} from 'app/types/transaction'
import { useAtomValue } from 'jotai'
import { Address, decodeEventLog, parseUnits } from 'viem'
import { useAccount, usePublicClient } from 'wagmi'

import { TransactionState } from '../transaction-state'

interface ClaimFormProps {
  wallet: string
  onSuccess?: (claim: ClaimPresenter) => void
  onClose: () => void
  successAction?: TransactionSuccessActionType
}

export function ClaimForm({
  wallet,
  onClose,
  onSuccess,
  successAction = TransactionSuccessAction.VIEW,
}: ClaimFormProps) {
  const { state, dispatch } = useTransactionState<
    TransactionStateType,
    TransactionActionType
  >(transactionReducer, initialTransactionState)

  const isTransactionStarted = [
    'approve',
    'awaiting',
    'confirm',
    'review-transaction',
    'transaction-pending',
    'transaction-confirmed',
    'complete',
    'error',
  ].includes(state.status)

  return (
    <div className="flex flex-col h-full">
      {!isTransactionStarted && (
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Icon name="bubble-annotation" />
              <Text variant="headline">Make a claim about an identity</Text>
            </div>
          </DialogTitle>
          <DialogDescription>
            Claim anything about anything. &rsquo;Claims&lsquo; in Intuition,
            also referred to as &rsquo;Triples&lsquo;, are structured in
            Semantic Triple format - similar to that of a sentence. For example,
            a Triple could be [Alice] [is] [trustworthy]. This keeps our
            attestations tidy!
          </DialogDescription>
        </DialogHeader>
      )}
      <div className="flex-grow">
        <CreateClaimForm
          wallet={wallet}
          state={state}
          dispatch={dispatch}
          onClose={onClose}
          onSuccess={onSuccess}
          successAction={successAction}
        />
      </div>
    </div>
  )
}

interface CreateClaimFormProps {
  wallet: string
  state: TransactionStateType
  dispatch: React.Dispatch<TransactionActionType>
  onSuccess?: (claim: ClaimPresenter) => void
  successAction?: TransactionSuccessActionType
  onClose: () => void
}

function CreateClaimForm({
  wallet,
  state,
  dispatch,
  onClose,
  successAction = TransactionSuccessAction.VIEW,
}: CreateClaimFormProps) {
  const { subject, predicate, object } = useAtomValue(createClaimModalAtom)

  const [isSubjectPopoverOpen, setIsSubjectPopoverOpen] = useState(false)
  const [isPredicatePopoverOpen, setIsPredicatePopoverOpen] = useState(false)
  const [isObjectPopoverOpen, setIsObjectPopoverOpen] = useState(false)
  const [claimExists, setClaimExists] = useState(false)
  const [lastTxHash, setLastTxHash] = useState<string | undefined>(undefined)
  const [initialDeposit, setInitialDeposit] = useState<string>('0')
  const [vaultId, setVaultId] = useState<string | undefined>(undefined)
  const [selectedIdentities, setSelectedIdentities] = useState<{
    subject: GetAtomQuery['atom'] | null
    predicate: GetAtomQuery['atom'] | null
    object: GetAtomQuery['atom'] | null
  }>({
    subject: subject ?? null,
    predicate: predicate ?? null,
    object: object ?? null,
  })

  const { data: configData, isLoading: isLoadingConfig } =
    useCreateClaimConfig()

  const { fees } = configData ?? {}

  const { data: claimCheckData, refetch: refetchClaimCheck } = useCheckClaim({
    subjectId: selectedIdentities.subject?.vault_id,
    predicateId: selectedIdentities.predicate?.vault_id,
    objectId: selectedIdentities.object?.vault_id,
  })

  const { data: claimData, refetch: refetchClaim } = useGetTripleQuery(
    { tripleId: vaultId ? parseFloat(vaultId) : 0 },
    {
      enabled: Boolean(vaultId),
      retry: 1,
      retryDelay: 2000,
      refetchInterval: (query) => {
        if (query.state.status === 'success') {
          return false
        }
        return 2000
      },
      queryKey: ['get-triple', { id: vaultId ? parseFloat(vaultId) : 0 }],
    },
  )

  const navigate = useNavigate()

  const publicClient = usePublicClient()
  const { address, chain } = useAccount()

  const {
    writeContractAsync: writeCreateTriple,
    awaitingWalletConfirmation,
    awaitingOnChainConfirmation,
    receipt: txReceipt,
  } = useCreateTriple()

  // form

  async function handleOnChainCreateTriple({
    subjectVaultId,
    predicateVaultId,
    objectVaultId,
  }: {
    subjectVaultId: string
    predicateVaultId: string
    objectVaultId: string
  }) {
    if (
      !awaitingOnChainConfirmation &&
      !awaitingWalletConfirmation &&
      publicClient &&
      writeCreateTriple &&
      address
    ) {
      try {
        dispatch({ type: 'APPROVE_TRANSACTION' })
        const txHash = await writeCreateTriple({
          address: MULTIVAULT_CONTRACT_ADDRESS,
          abi: multivaultAbi,
          functionName: 'createTriple',
          args: [subjectVaultId, predicateVaultId, objectVaultId],
          value:
            (fees?.tripleCost ? BigInt(fees.tripleCost) : 0n) +
            parseUnits(
              initialDeposit && initialDeposit !== '' ? initialDeposit : '0',
              18,
            ),
        })
        dispatch({ type: 'TRANSACTION_PENDING' })
        if (txHash) {
          const receipt = await publicClient.waitForTransactionReceipt({
            hash: txHash,
          })

          type EventLogArgs = {
            sender: Address
            receiver?: Address
            owner?: Address
            vaultId: string
          }

          if (
            receipt?.logs[0].data &&
            receipt?.transactionHash !== lastTxHash
          ) {
            const decodedLog = decodeEventLog({
              abi: multivaultAbi,
              data: receipt?.logs[0].data,
              topics: receipt?.logs[0].topics,
            })

            const topics = decodedLog as unknown as {
              eventName: string
              args: EventLogArgs
            }
            setVaultId(topics.args.vaultId.toString())
            setLastTxHash(receipt.transactionHash)
          }
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

  useEffect(() => {
    if (txReceipt && vaultId) {
      refetchClaim()
    }
  }, [txReceipt, vaultId, refetchClaim])

  useEffect(() => {
    if (txReceipt) {
      if (claimData) {
        dispatch({
          type: 'TRANSACTION_COMPLETE',
          txHash: txReceipt.transactionHash,
          txReceipt,
        })
      }
    }
  }, [claimData, txReceipt, vaultId])

  const handleSubmit = async () => {
    try {
      dispatch({ type: 'CONFIRM_TRANSACTION' })
      if (
        selectedIdentities.subject !== null &&
        selectedIdentities.predicate !== null &&
        selectedIdentities.object !== null
      ) {
        handleOnChainCreateTriple({
          subjectVaultId: selectedIdentities.subject?.vault_id ?? '',
          predicateVaultId: selectedIdentities.predicate?.vault_id ?? '',
          objectVaultId: selectedIdentities.object?.vault_id ?? '',
        })
      }
    } catch (error: unknown) {
      logger(error)
    }
  }

  const handleIdentitySelection = (
    type: ClaimElementType,
    identity: GetAtomQuery['atom'],
  ) => {
    setSelectedIdentities((prev) => ({
      ...prev,
      [type]: identity,
    }))

    if (type === 'subject') {
      setIsSubjectPopoverOpen(false)
    } else if (type === 'predicate') {
      setIsPredicatePopoverOpen(false)
    } else if (type === 'object') {
      setIsObjectPopoverOpen(false)
    }
  }

  const walletBalance = useGetWalletBalance(
    address ?? (wallet as `0x${string}`),
  )

  useEffect(() => {
    if (
      selectedIdentities.subject &&
      selectedIdentities.predicate &&
      selectedIdentities.object
    ) {
      refetchClaimCheck()
    }
  }, [
    selectedIdentities.subject,
    selectedIdentities.object,
    selectedIdentities.predicate,
  ])

  useEffect(() => {
    if (claimCheckData) {
      setClaimExists(claimCheckData.result !== '0')
    }
  }, [claimCheckData, selectedIdentities])

  const Divider = () => (
    <span className="h-px w-2.5 flex bg-border/30 self-end mb-[1.2rem] max-sm:hidden" />
  )

  const isWrongNetwork = chain?.id !== getChainEnvConfig(CURRENT_ENV).chainId

  return (
    <>
      <div className="h-full flex flex-col">
        {state.status === 'idle' ? (
          <div className="flex flex-col items-center justify-between h-full">
            <div className="flex-grow flex items-center justify-center max-sm:items-start max-sm:mt-4">
              <div className="flex flex-col items-center gap-14">
                <div className="flex items-center max-sm:flex-col max-sm:gap-3">
                  <IdentitySelector
                    type={ClaimElement.Subject}
                    isOpen={isSubjectPopoverOpen}
                    onOpenChange={setIsSubjectPopoverOpen}
                    selectedIdentity={selectedIdentities.subject}
                    onSelect={(identity) =>
                      handleIdentitySelection(ClaimElement.Subject, identity)
                    }
                  />
                  <Divider />
                  <IdentitySelector
                    type={ClaimElement.Predicate}
                    isOpen={isPredicatePopoverOpen}
                    onOpenChange={setIsPredicatePopoverOpen}
                    selectedIdentity={selectedIdentities.predicate}
                    onSelect={(identity) =>
                      handleIdentitySelection(ClaimElement.Predicate, identity)
                    }
                  />
                  <Divider />
                  <IdentitySelector
                    type={ClaimElement.Object}
                    isOpen={isObjectPopoverOpen}
                    onOpenChange={setIsObjectPopoverOpen}
                    selectedIdentity={selectedIdentities.object}
                    onSelect={(identity) =>
                      handleIdentitySelection(ClaimElement.Object, identity)
                    }
                  />
                </div>
                <div className="flex flex-row items-center justify-center">
                  <div className="flex w-full max-w-md flex-col mx-auto">
                    <div className="flex flex-row items-center justify-between mb-1">
                      <div className="inline-flex gap-1">
                        <div className="self-stretch flex-col justify-start items-start flex">
                          <div className="flex w-full items-center justify-between gap-1">
                            <Text
                              variant="caption"
                              className="text-secondary-foreground"
                            >
                              Initial Deposit
                            </Text>
                            <InfoTooltip
                              title="Initial Deposit"
                              content="To &lsquo;claim a thing about a thing&rsquo;, you must stake on the Claim. This deposit is akin to you signaling that you believe the Claim to be True. Without depositing, the Claim will exist, but you will not be expressing it! The more you stake, the more shares of the Claim you will receive."
                            />
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-transparent">
                        <Icon name="wallet" className="h-4 w-4" />
                        {(+walletBalance).toFixed(2)} ETH
                      </Badge>
                    </div>
                    <Input
                      placeholder="0"
                      startAdornment="ETH"
                      value={initialDeposit}
                      onChange={(e) => {
                        e.preventDefault()
                        let inputValue = e.target.value
                        if (inputValue.startsWith('.')) {
                          inputValue = `0${inputValue}`
                        }
                        const sanitizedValue = inputValue.replace(
                          /[^0-9.]/g,
                          '',
                        )
                        if (sanitizedValue.split('.').length > 2) {
                          return
                        }
                        setInitialDeposit(sanitizedValue)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-auto">
              {isWrongNetwork ? (
                <WrongNetworkButton />
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={(e) => {
                    e.preventDefault()
                    dispatch({ type: 'REVIEW_TRANSACTION' })
                  }}
                  disabled={
                    !address ||
                    claimExists ||
                    isLoadingConfig ||
                    selectedIdentities.subject === null ||
                    selectedIdentities.predicate === null ||
                    selectedIdentities.object === null ||
                    ['confirm', 'transaction-pending', 'awaiting'].includes(
                      state.status,
                    )
                  }
                  className="w-40 mx-auto"
                >
                  {claimExists ? 'Claim Exists' : 'Review'}
                </Button>
              )}
            </div>
          </div>
        ) : state.status === 'review-transaction' && fees ? (
          <div className="h-full flex flex-col">
            <CreateClaimReview
              dispatch={dispatch}
              selectedIdentities={selectedIdentities}
              initialDeposit={initialDeposit}
              fees={fees}
            />
            <div className="mt-auto">
              {isWrongNetwork ? (
                <WrongNetworkButton />
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  disabled={
                    !address ||
                    selectedIdentities.subject === null ||
                    selectedIdentities.predicate === null ||
                    selectedIdentities.object === null ||
                    ['confirm', 'transaction-pending', 'awaiting'].includes(
                      state.status,
                    )
                  }
                  className="w-40 mx-auto"
                >
                  Create Claim
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <TransactionState
              status={state.status}
              txHash={state.txHash}
              type="claim"
              successButton={
                txReceipt && (
                  <Button
                    type="button"
                    variant="primary"
                    className="w-40"
                    onClick={() => {
                      if (successAction === TransactionSuccessAction.VIEW) {
                        navigate(`${PATHS.CLAIM}/${vaultId}`)
                      }

                      onClose()
                    }}
                  >
                    {successAction === TransactionSuccessAction.VIEW
                      ? 'View Claim'
                      : 'Close'}
                  </Button>
                )
              }
              errorButton={
                <Button
                  type="button"
                  variant="primary"
                  className="mt-auto w-40"
                  onClick={() => {
                    if (txReceipt) {
                      dispatch({ type: 'TRANSACTION_PENDING' })
                      refetchClaim()
                    } else {
                      dispatch({ type: 'START_TRANSACTION' })
                    }
                  }}
                >
                  Retry
                </Button>
              }
            />
          </div>
        )}
      </div>
    </>
  )
}
