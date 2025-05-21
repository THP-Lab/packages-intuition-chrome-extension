/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef, useState } from 'react'

import {
  Avatar,
  Icon,
  IconName,
  Separator,
  Text,
  TextVariant,
  toast,
} from '@0xintuition/1ui'
import {
  ApiError,
  IdentitiesService,
  IdentityPresenter,
  UserPresenter,
  UsersService,
} from '@0xintuition/api'

import PrivyLogout from '@client/privy-logout'
import { BridgeToBase } from '@components/bridge-to-base'
import EditProfileModal from '@components/edit-profile/modal'
import { Header } from '@components/header'
import { InfoTooltip } from '@components/info-tooltip'
import RelicOnboadingVideo from '@components/relic-onboarding-video/relic-onboarding-video'
import SiteWideBanner from '@components/site-wide-banner'
import SubmitButton from '@components/submit-button'
import { UsdTooltip } from '@components/usd-tooltip'
import { multivaultAbi } from '@lib/abis/multivault'
import { useCreateAtom } from '@lib/hooks/useCreateAtom'
import {
  identityTransactionReducer,
  initialIdentityTransactionState,
  useTransactionState,
} from '@lib/hooks/useTransactionReducer'
import { getEthPrice } from '@lib/services/pricefeeds'
import { editProfileModalAtom } from '@lib/state/store'
import logger from '@lib/utils/logger'
import { getMaintenanceMode } from '@lib/utils/maintenance'
import { formatBalance, sliceString } from '@lib/utils/misc'
import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { CreateLoaderData } from '@routes/resources+/create'
import { fetchWrapper } from '@server/api'
import { requireUserWallet } from '@server/auth'
import { FeatureFlags, getFeatureFlags } from '@server/env'
import { MULTIVAULT_CONTRACT_ADDRESS, PATHS } from 'app/consts'
import {
  IdentityTransactionActionType,
  IdentityTransactionStateType,
} from 'app/types'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { ClientOnly } from 'remix-utils/client-only'
import { formatUnits, toHex } from 'viem'
import { useConnectorClient, usePublicClient } from 'wagmi'

export async function loader({ request }: LoaderFunctionArgs) {
  getMaintenanceMode()
  const featureFlags = getFeatureFlags()

  const wallet = await requireUserWallet(request)
  if (!wallet) {
    return redirect('/login')
  }

  const url = new URL(request.url)
  const isCreating = url.searchParams.get('setupProfile') === 'true'

  let userObject
  try {
    userObject = await fetchWrapper(request, {
      method: UsersService.getUserByWalletPublic,
      args: {
        wallet,
      },
    })
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 400 || error.status === 404)
    ) {
      console.error('No user found in DB, needs to enter invite code')
      return json({ wallet, featureFlags })
    }
    throw error
  }

  if (!userObject) {
    return redirect('/invite')
  }

  let userIdentity
  try {
    userIdentity = await fetchWrapper(request, {
      method: IdentitiesService.getIdentityById,
      args: { id: wallet },
    })
  } catch (e) {
    console.error('No user identity associated with wallet')
  }

  if (userIdentity && !isCreating) {
    throw redirect(`${PATHS.HOME}`)
  }

  const ethPrice = await getEthPrice()

  return json({
    wallet,
    userIdentity,
    userObject,
    isCreating,
    featureFlags,
    ethPrice,
  })
}

interface CreateButtonWrapperProps {
  atomCost: bigint
  setEditProfileModalActive: (active: boolean) => void
}

export function CreateButton({
  atomCost,
  setEditProfileModalActive,
}: CreateButtonWrapperProps) {
  const { wallet } = useLoaderData<{ wallet: string }>()
  const { state, dispatch } = useTransactionState<
    IdentityTransactionStateType,
    IdentityTransactionActionType
  >(identityTransactionReducer, initialIdentityTransactionState)

  const publicClient = usePublicClient()
  const {
    writeContractAsync: writeCreateIdentity,
    awaitingWalletConfirmation,
    awaitingOnChainConfirmation,
  } = useCreateAtom()

  // off-chain fetcher
  const offChainFetcher = useFetcher<OffChainFetcherData>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createdIdentity = offChainFetcher?.data?.identity
  const emitterFetcher = useFetcher()
  logger('createdIdentity', createdIdentity)

  const { data: walletClient } = useConnectorClient()

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  interface OffChainFetcherData {
    success: 'success' | 'error'
    identity: IdentityPresenter
  }

  // Handle On-Chain Transaction
  async function handleOnChainCreateIdentity({
    atomData,
  }: {
    atomData: string
  }) {
    if (
      !awaitingOnChainConfirmation &&
      !awaitingWalletConfirmation &&
      wallet &&
      publicClient &&
      atomCost
    ) {
      try {
        dispatch({ type: 'APPROVE_TRANSACTION' })

        const txHash = await writeCreateIdentity({
          address: MULTIVAULT_CONTRACT_ADDRESS,
          abi: multivaultAbi,
          functionName: 'createAtom',
          args: [toHex(atomData)],
          value: atomCost,
        })

        if (txHash) {
          dispatch({ type: 'TRANSACTION_PENDING' })
          const receipt = await publicClient.waitForTransactionReceipt({
            hash: txHash,
          })
          logger('receipt', receipt)
          dispatch({
            type: 'TRANSACTION_COMPLETE',
            txHash,
            txReceipt: receipt,
          })
        }
      } catch (error) {
        logger('error', error)
        setLoading(false)
        if (error instanceof Error) {
          let errorMessage = 'Failed transaction'
          if (error.message.includes('insufficient')) {
            errorMessage = 'Insufficient funds'
          }
          if (error.message.includes('rejected')) {
            errorMessage = 'Transaction rejected'
          }
          dispatch({
            type: 'TRANSACTION_ERROR',
            error: errorMessage,
          })
          toast.error(errorMessage)
          return
        }
      }
    } else {
      logger(
        'Cannot initiate on-chain transaction, a transaction is already pending, a wallet is already signing, or a wallet is not connected',
      )
    }
  }

  function handleIdentityTxReceiptReceived() {
    logger('createdIdentity', createdIdentity)
    if (createdIdentity) {
      logger(
        'Submitting to emitterFetcher with identity_id:',
        createdIdentity.identity_id,
      )
      emitterFetcher.submit(
        { identity_id: createdIdentity.identity_id },
        { method: 'post', action: '/actions/create-emitter' },
      )
    }
  }

  useEffect(() => {
    if (state.status === 'complete') {
      handleIdentityTxReceiptReceived()
      setEditProfileModalActive(true)
    }
  }, [state.status])

  useEffect(() => {
    if (
      offChainFetcher.state === 'idle' &&
      offChainFetcher.data !== null &&
      offChainFetcher.data !== undefined
    ) {
      const responseData = offChainFetcher.data as OffChainFetcherData
      if (responseData !== null) {
        if (createdIdentity !== undefined && responseData.identity) {
          const { identity_id } = responseData.identity
          dispatch({
            type: 'PUBLISHING_IDENTITY',
          })
          handleOnChainCreateIdentity({ atomData: identity_id })
        }
      }
      if (offChainFetcher.data === null || offChainFetcher.data === undefined) {
        console.error('Error in offchain data creation.:', offChainFetcher.data)
        dispatch({
          type: 'TRANSACTION_ERROR',
          error: 'Error in offchain data creation.',
        })
      }
    }
  }, [offChainFetcher.state, offChainFetcher.data, dispatch])

  useEffect(() => {
    if (state.status === 'error') {
      setLoading(false)
    }
  }, [state.status])

  // Handle Initial Form Submit
  const handleSubmit = async () => {
    logger('handleSubmit')
    try {
      if (walletClient) {
        dispatch({ type: 'START_TRANSACTION' })
        const formData = new FormData()
        formData.append('display_name', walletClient.account.address)
        formData.append('identity_id', walletClient.account.address)

        for (const [key, value] of formData.entries()) {
          logger(`${key}: ${value}`)
        }

        try {
          dispatch({ type: 'PREPARING_IDENTITY' })
          navigate('?setupProfile=true', { replace: true })
          offChainFetcher.submit(formData, {
            action: '/actions/create-profile',
            method: 'post',
          })
        } catch (error: unknown) {
          if (error instanceof Error) {
            let errorMessage = 'Error in creating offchain identity data.'
            if (error.message.includes('rejected')) {
              errorMessage = 'Signature rejected. Try again when you are ready.'
            }
            dispatch({
              type: 'TRANSACTION_ERROR',
              error: errorMessage,
            })
            toast.error(errorMessage)
            dispatch({ type: 'START_TRANSACTION' })
            return
          }
          console.error('Error creating identity', error)
        }

        setLoading(true)
      }
    } catch (error: unknown) {
      logger(error)
    }
  }

  return (
    <>
      <SubmitButton
        loading={loading}
        onClick={handleSubmit}
        buttonText="Create Identity"
        loadingText="Creating Identity..."
      />
    </>
  )
}

export default function Profile() {
  const { wallet, userObject, featureFlags, ethPrice } = useLoaderData<{
    wallet: string
    userObject: UserPresenter
    featureFlags: FeatureFlags
    ethPrice: string
  }>()

  const loaderFetcher = useFetcher<CreateLoaderData>()
  const loaderFetcherUrl = '/resources/create'
  const loaderFetcherRef = useRef(loaderFetcher.load)
  useEffect(() => {
    loaderFetcherRef.current = loaderFetcher.load
  })

  useEffect(() => {
    loaderFetcherRef.current(loaderFetcherUrl)
  }, [loaderFetcherUrl])

  const { atomCost: atomCostAmount, atomCreationFee } =
    (loaderFetcher.data as CreateLoaderData) ?? {
      vaultId: BigInt(0),
      atomCost: BigInt(0),
      atomCreationFee: BigInt(0),
      protocolFee: BigInt(0),
      entryFee: BigInt(0),
    }

  const atomCost = BigInt(atomCostAmount ? atomCostAmount : 0)

  const [editProfileModalActive, setEditProfileModalActive] =
    useAtom(editProfileModalAtom)
  const [showVideo, setShowVideo] = useState(false)

  return (
    <div>
      <SiteWideBanner featureFlags={featureFlags} />
      <div className="flex flex-col justify-between min-h-screen w-full p-4 md:p-8">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <AnimatePresence mode="wait">
            {!showVideo ? (
              <motion.div
                key="createForm"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="md:w-[600px] mdh-[307px] flex-col justify-start items-start gap-6 md:gap-[42px] inline-flex"
              >
                <div className="md:h-[37px] flex-col justify-start items-start gap-6 flex">
                  <div className="self-stretch md:h-[37px] flex-col justify-start items-start gap-2.5 flex">
                    <div className="self-stretch text-white text-2xl md:text-3xl font-semibold text-center md:text-left">
                      Create Your Decentralized Identifier
                    </div>
                  </div>
                </div>
                <div className="md:h-28 p-6 bg-black rounded-[10px] shadow border border-solid border-neutral-300/20 backdrop-blur-xl flex-col justify-center items-center gap-6 flex w-full">
                  <div className="md:w-[552px] justify-between items-center inline-flex w-full flex-col md:flex-row">
                    <div className="md:grow md:shrink md:basis-0 h-16 justify-start items-center gap-2 md:gap-4 flex">
                      <div className="md:w-[70px] pr-1.5 justify-start items-center flex">
                        <Avatar name="" src="" />
                      </div>
                      <div className="flex-col justify-start items-start gap-[3px] inline-flex">
                        <div className="justify-start items-end gap-1.5 inline-flex">
                          <div className="text-neutral-200 text-base font-medium leading-normal">
                            {sliceString(wallet, 6, 4)}
                          </div>
                          <div className="w-[0px] self-stretch pb-0.5 justify-start items-end gap-2.5 flex">
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ClientOnly>
                      {() => (
                        <div className="flex flex-col gap-1">
                          <CreateButton
                            atomCost={atomCost}
                            setEditProfileModalActive={
                              setEditProfileModalActive
                            }
                          />
                          <PrivyLogout wallet={wallet} />
                          <Text
                            variant={TextVariant.caption}
                            className="text-secondary-foreground items-center flex flex-row gap-1"
                          >
                            Est. Cost:{' '}
                            <UsdTooltip
                              ethValue={formatBalance(atomCost, 18)}
                              usdValue={(
                                +formatBalance(atomCost, 18) * +ethPrice
                              ).toFixed(2)}
                            />
                            <InfoTooltip
                              title="Atom Cost"
                              icon={IconName.circleInfo}
                              trigger={
                                <Icon
                                  name={IconName.circleQuestionMark}
                                  className="h-4 w-4"
                                />
                              }
                              content={
                                <div className="flex flex-col gap-2 w-full">
                                  <Text variant="base">
                                    The cost to create an atom, or atomCost, is
                                    the sum of atom creation fee, atom wallet
                                    initial deposit amount, and minting of the
                                    min shares required to instantiate the atom
                                    vault.
                                  </Text>
                                  <div className="flex flex-row w-full justify-between">
                                    <Text variant="base" weight="medium">
                                      Atom Wallet Deposit:
                                    </Text>
                                    <Text
                                      variant="base"
                                      weight="medium"
                                      className="text-success"
                                    >
                                      {+formatUnits(
                                        BigInt(
                                          atomCost - BigInt(atomCreationFee),
                                        ),
                                        18,
                                      ) - 0.000000000001}{' '}
                                      ETH
                                    </Text>
                                  </div>
                                  <div className="flex flex-row w-full justify-between">
                                    <Text variant="base" weight="medium">
                                      Atom Creation Fee:
                                    </Text>
                                    <Text
                                      variant="base"
                                      weight="medium"
                                      className="text-destructive"
                                    >
                                      {formatUnits(BigInt(atomCreationFee), 18)}{' '}
                                      ETH
                                    </Text>
                                  </div>
                                  <div className="flex flex-row w-full justify-between">
                                    <Text variant="base" weight="medium">
                                      Min Shares:
                                    </Text>
                                    <Text
                                      variant="base"
                                      weight="medium"
                                      className="text-destructive"
                                    >
                                      0.000000000001 ETH
                                    </Text>
                                  </div>
                                  <Separator />
                                  <div className="flex flex-row w-full justify-between">
                                    <Text variant="base" weight="medium">
                                      Atom Cost:
                                    </Text>
                                    <Text
                                      variant="base"
                                      weight="medium"
                                      className="text-destructive"
                                    >
                                      {formatUnits(atomCost, 18)} ETH
                                    </Text>
                                  </div>
                                </div>
                              }
                            />
                          </Text>
                        </div>
                      )}
                    </ClientOnly>
                  </div>
                </div>
                <div className="md:w-[600px] justify-start items-start gap-6 inline-flex">
                  <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-6 inline-flex">
                    <div className="self-stretch md:h-[74px] flex-col justify-start items-start gap-2.5 flex">
                      <div className="self-stretch text-white text-base font-medium leading-normal">
                        Welcome to the world of Intuition.
                      </div>
                      <div className="self-stretch text-white/40 text-sm font-normal leading-tight">
                        By completing this step, you&#39;ll create an
                        &#39;Atom&#39; for your Ethereum address - a universally
                        referenceable node in the Intuition Trust Graph,
                        representative of you. With this, you&#39;ll be able to
                        make claims about things, and will allow claims to be
                        made about you - taking the first step in your journey
                        towards better intuition in all of your interactions.
                      </div>
                    </div>
                  </div>
                </div>
                <BridgeToBase />
              </motion.div>
            ) : (
              <RelicOnboadingVideo variant="v3" link={PATHS.QUEST} />
            )}
          </AnimatePresence>
        </div>
        <EditProfileModal
          userObject={userObject}
          open={editProfileModalActive}
          onClose={() => {
            setEditProfileModalActive(false)
            setShowVideo(true)
          }}
        />
        <PrivyLogout wallet={wallet} />
      </div>
    </div>
  )
}
