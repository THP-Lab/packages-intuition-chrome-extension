import { useEffect, useState } from 'react'

import { Button } from '@0xintuition/1ui'

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

interface StakeButtonProps {
  val: string
  mode: string | undefined
  handleAction: () => void
  handleClose: () => void
  dispatch: (action: TransactionActionType) => void
  state: TransactionStateType
  min_deposit: string
  walletBalance: string
  user_conviction: string
  setValidationErrors: (errors: string[]) => void
  setShowErrors: (show: boolean) => void
  conviction_price: string
  id?: string
  claimOrIdentity?: string
  className?: string
}

const StakeButton: React.FC<StakeButtonProps> = ({
  val,
  mode,
  handleAction,
  handleClose,
  dispatch,
  state,
  min_deposit,
  walletBalance,
  user_conviction,
  setValidationErrors,
  setShowErrors,
  conviction_price,
}) => {
  const { switchChain } = useSwitchChain()

  const handleSwitch = () => {
    if (switchChain) {
      switchChain({ chainId: getChainEnvConfig(CURRENT_ENV).chainId })
    }
  }

  const { address, chain } = useAccount()

  const formattedConvictionPrice = formatUnits(BigInt(conviction_price), 18)
  const formattedUserConviction = formatUnits(BigInt(user_conviction), 18)

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
      return 'Close'
    } else if (state.status === 'error') {
      return 'Retry'
    } else if (chain?.id !== getChainEnvConfig(CURRENT_ENV).chainId) {
      return 'Switch Network'
    }
    return `Review ${mode === 'deposit' ? 'Deposit' : 'Redeem'}`
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
          dispatch({ type: 'APPROVE_TRANSACTION' })
          handleAction()
        } else if (chain?.id !== getChainEnvConfig(CURRENT_ENV).chainId) {
          handleSwitch()
        } else if (val !== '') {
          const errors = []
          if (mode === 'deposit' && +val < +min_deposit) {
            errors.push(`Minimum deposit is ${min_deposit} ETH`)
          }
          if (
            mode === 'deposit'
              ? +val > +walletBalance
              : +val > +formattedUserConviction * +formattedConvictionPrice
          ) {
            errors.push('Insufficient funds')
          }

          if (errors.length > 0) {
            setValidationErrors(errors)
            setShowErrors(true)
          } else {
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
        state.status === 'awaiting'
      }
      className="w-40 mx-auto mt-10"
    >
      {getButtonText()}
    </Button>
  )
}

export default StakeButton
