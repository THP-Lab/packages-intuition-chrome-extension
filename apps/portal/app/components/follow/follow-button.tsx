import { useEffect, useState } from 'react'

import { Button, cn } from '@0xintuition/1ui'

import { stakeModalAtom } from '@lib/state/store'
import { getChainEnvConfig } from '@lib/utils/environment'
import { useNavigation } from '@remix-run/react'
import { CURRENT_ENV } from 'app/consts'
import {
  TransactionActionType,
  TransactionStateType,
} from 'app/types/transaction'
import { useSetAtom } from 'jotai'
import { formatUnits } from 'viem'
import { useAccount, useSwitchChain } from 'wagmi'

interface FollowButtonProps {
  val: string
  setMode: (mode: 'follow' | 'unfollow') => void
  handleAction: () => void
  handleClose: () => void
  dispatch: (action: TransactionActionType) => void
  state: TransactionStateType
  min_deposit: string
  walletBalance: string
  conviction_price: string
  user_assets: string
  setValidationErrors: (errors: string[]) => void
  setShowErrors: (show: boolean) => void
  isLoadingConfig: boolean
  className?: string
}

const FollowButton: React.FC<FollowButtonProps> = ({
  val,
  setMode,
  handleAction,
  handleClose,
  dispatch,
  state,
  min_deposit,
  walletBalance,
  conviction_price,
  user_assets,
  setValidationErrors,
  setShowErrors,
  className,
  isLoadingConfig,
}) => {
  const { switchChain } = useSwitchChain()

  const handleSwitch = () => {
    if (switchChain) {
      switchChain({ chainId: getChainEnvConfig(CURRENT_ENV).chainId })
    }
  }

  const { address, chain } = useAccount()

  const formattedConvictionPrice = formatUnits(BigInt(conviction_price), 18)

  const getButtonText = () => {
    if (val === '') {
      return 'Enter an Amount'
    } else if (state.status === 'review-transaction') {
      return 'Confirm'
    } else if (state.status === 'awaiting') {
      return 'Continue in Wallet'
    } else if (state.status === 'transaction-pending') {
      return 'Pending'
    } else if (
      state.status === 'transaction-confirmed' ||
      state.status === 'complete'
    ) {
      return 'Go to Profile'
    } else if (state.status === 'error') {
      return 'Retry'
    } else if (chain?.id !== getChainEnvConfig(CURRENT_ENV).chainId) {
      return 'Switch Network'
    }
    return `${user_assets > '0' ? 'Increase Follow' : 'Follow'}`
  }

  const setStakeModalActive = useSetAtom(stakeModalAtom)

  const navigation = useNavigation()
  const [navigationStarted, setNavigationStarted] = useState(false)

  useEffect(() => {
    if (navigation.state !== 'idle') {
      setNavigationStarted(true)
    }
  }, [navigation.state])

  useEffect(() => {
    if (navigation.state === 'idle' && navigationStarted) {
      setStakeModalActive({
        isOpen: false,
        id: null,
        vaultId: '0',
      })
      setNavigationStarted(false)
    }
  }, [navigation.state, navigationStarted])

  return (
    <Button
      variant="primary"
      onClick={(e) => {
        e.preventDefault()
        if (
          state.status === 'complete' ||
          state.status === 'transaction-confirmed'
        ) {
          handleClose()
        } else if (state.status === 'review-transaction') {
          handleAction()
        } else if (chain?.id !== getChainEnvConfig(CURRENT_ENV).chainId) {
          handleSwitch()
        } else if (val !== '') {
          const errors = []
          if (+val < +min_deposit) {
            errors.push(`Minimum deposit is ${min_deposit} ETH`)
          }
          if (+val * +formattedConvictionPrice > +walletBalance) {
            errors.push('Insufficient funds')
          }

          if (errors.length > 0) {
            setValidationErrors(errors)
            setShowErrors(true)
          } else {
            setMode('follow')
            dispatch({ type: 'REVIEW_TRANSACTION' })
            setValidationErrors([])
          }
        }
      }}
      disabled={
        !address ||
        val === '' ||
        state.status === 'confirm' ||
        state.status === 'transaction-pending' ||
        state.status === 'awaiting' ||
        isLoadingConfig
      }
      className={cn(`w-40`, className)}
    >
      {getButtonText()}
    </Button>
  )
}

export default FollowButton
