import {
  ActivePositionCard,
  Badge,
  Claim,
  ClaimPosition,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Icon,
  Identity,
  Text,
} from '@0xintuition/1ui'

import { InfoTooltip } from '@components/info-tooltip'
import StakingRadioGroup from '@components/staking-radio-group'
import { TransactionState } from '@components/transaction-state'
import { formatBalance } from '@lib/utils/misc'
import {
  TransactionActionType,
  TransactionStateType,
} from 'app/types/transaction'

import FollowReview from './follow-review'

interface FollowFormProps {
  walletBalance: string
  identityLabel: string
  identityAvatar: string
  user_assets: string
  entry_fee: string
  exit_fee: string
  val: string
  setVal: (val: string) => void
  min_deposit: string
  mode: string | undefined
  dispatch: (action: TransactionActionType) => void
  state: TransactionStateType
  showErrors: boolean
  setShowErrors: (show: boolean) => void
  validationErrors: string[]
  setValidationErrors: (errors: string[]) => void
}

export default function FollowForm({
  walletBalance,
  identityLabel,
  identityAvatar,
  user_assets,
  entry_fee,
  exit_fee,
  val,
  setVal,
  min_deposit,
  mode,
  dispatch,
  state,
  showErrors,
  setShowErrors,
  validationErrors,
  setValidationErrors,
}: FollowFormProps) {
  return (
    <>
      {state.status === 'idle' ? (
        <>
          <DialogHeader>
            <DialogTitle className="justify-between">
              <div className="flex items-center justify-between w-full mr-2.5">
                <div className="justify-center items-center gap-2 inline-flex">
                  <Text variant="base" weight="medium">
                    {+user_assets > 0 ? 'Increase Follow' : 'Follow User'}{' '}
                  </Text>
                  <InfoTooltip
                    title="Follow"
                    content="In Intuition, follows are not binary - you can signal how much you want to follow someone by depositing more tokens. This is helpful for curating your &lsquo;follow&rsquo; list, allowing you to rank some people higher than others."
                  />
                  <div className="w-4 h-4 relative" />
                </div>
                <Badge>
                  <Icon name="wallet" className="h-4 w-4" />
                  {(+walletBalance).toFixed(2)} ETH
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription>
              <Text variant="caption" className="text-neutral-50/50">
                Stake on a user&apos;s follow claim to create or strengthen your
                connection.
              </Text>
            </DialogDescription>
          </DialogHeader>
          <div className="h-full w-full flex-col pt-5 md:px-10 pb-10 gap-5 inline-flex">
            <div className="flex-col justify-center items-start gap-2.5 inline-flex">
              <div className="flex flex-row mx-auto">
                <Claim
                  subject={{
                    variant: Identity.nonUser,
                    label: 'I',
                    imgSrc: '',
                    id: 'ipfs://QmQoLT5G6yxbBJSvdpJzB3z66cqWLKJXEgDJxASzVsZnuw',
                    description:
                      'A first-person singular pronoun used by a speaker to refer to themselves. For example, "I am studying for a test". "I" can also be used to refer to the narrator of a first-person singular literary work.',
                    ipfsLink:
                      'https://ipfs.io/ipfs/QmQoLT5G6yxbBJSvdpJzB3z66cqWLKJXEgDJxASzVsZnuw',
                    shouldHover: false,
                  }}
                  predicate={{
                    variant: Identity.nonUser,
                    label: 'am following',
                    imgSrc: '',
                    id: 'https://schema.org/FollowAction',
                    description:
                      'The act of forming a personal connection with someone/something (object) unidirectionally/asymmetrically to get updates polled from.',
                    ipfsLink: 'https://schema.org/FollowAction',
                    shouldHover: false,
                  }}
                  object={{
                    variant: Identity.user,
                    label: identityLabel,
                    imgSrc: identityAvatar,
                    id: '',
                    description: '',
                    ipfsLink: '',
                    link: '',
                    shouldHover: false,
                  }}
                  maxIdentityLength={16}
                />
              </div>
              <div className="flex flex-row items-center justify-center w-full">
                <div className="w-full bg-neutral-50/5 rounded-lg border border-neutral-300/10 flex-col justify-start items-start inline-flex">
                  <ActivePositionCard
                    value={Number(formatBalance(user_assets, 18))}
                    claimPosition={
                      +user_assets > 0 ? ClaimPosition.claimFor : null
                    }
                  />
                </div>
              </div>
            </div>
            <div className="rounded-t-lg bg-primary-950/15 w-full">
              <StakingRadioGroup
                setVal={setVal}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                showErrors={showErrors}
                setShowErrors={setShowErrors}
                min_deposit={min_deposit}
              />
            </div>
          </div>
        </>
      ) : state.status === 'review-transaction' ? (
        <div className="h-full flex flex-col">
          <FollowReview
            mode={mode}
            val={val}
            dispatch={dispatch}
            state={state}
            identityLabel={identityLabel}
            identityAvatar={identityAvatar}
            user_assets={user_assets}
            entry_fee={entry_fee}
            exit_fee={exit_fee}
          />
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <TransactionState
            status={state.status}
            txHash={state.txHash}
            type={mode === 'follow' ? 'follow' : 'unfollow'}
          />
        </div>
      )}
    </>
  )
}
