import {
  Button,
  DialogHeader,
  DialogTitle,
  Icon,
  IconName,
  Identity,
  ProfileCard,
  Text,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@0xintuition/1ui'

import { formatBalance } from '@lib/utils/misc'
import { CreateLoaderData } from '@routes/resources+/create'
import { IdentityTransactionActionType } from 'app/types'
import { formatUnits } from 'viem'

interface CreateIdentityReviewProps {
  dispatch: (action: IdentityTransactionActionType) => void
  identity: {
    imageUrl?: string | null
    displayName?: string
    description?: string
    externalReference?: string
    initialDeposit?: string
  }
  initialDeposit: string
  fees: CreateLoaderData
}

const InfoTooltip: React.FC<{ content: React.ReactNode }> = ({ content }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Icon name={IconName.circleQuestionMark} className="h-4 w-4" />
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const calculateFees = (initialDeposit: string, fees: CreateLoaderData) => {
  const epsilon = 1e-18
  const atomCostDecimal = +formatUnits(BigInt(fees.atomCost), 18)
  // const atomCreationFeeDecimal = +formatUnits(BigInt(fees.atomCreationFee), 18)

  return {
    totalFees:
      +initialDeposit > epsilon
        ? +initialDeposit + atomCostDecimal
        : atomCostDecimal,
    atomCreationFee: +formatBalance(fees.atomCreationFee, 18),
  }
}

const CreateIdentityReview: React.FC<CreateIdentityReviewProps> = ({
  dispatch,
  identity,
  initialDeposit,
  fees,
}) => {
  const { totalFees, atomCreationFee } = calculateFees(initialDeposit, fees)

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <Button
            onClick={() => dispatch({ type: 'START_TRANSACTION' })}
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
          <Text variant="headline" weight="medium" className="text-white/70">
            Review your identity
          </Text>
          <div className="p-6 rounded-xl theme-border flex">
            <ProfileCard
              variant={Identity.nonUser}
              avatarSrc={identity?.imageUrl ?? ''}
              name={identity?.displayName ?? ''}
              bio={identity?.description ?? ''}
              id={''}
              externalLink={identity?.externalReference ?? ''}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            {identity.initialDeposit && (
              <Text
                variant="base"
                weight="normal"
                className="text-neutral-50/50 flex items-center gap-1"
              >
                Initial Deposit: {identity.initialDeposit} ETH
                <InfoTooltip
                  content={
                    <div className="flex flex-col gap-2 max-w-xs">
                      <Text variant="base" weight="medium">
                        Your initial deposit will create a position for you on
                        your identity at the time of creation.
                      </Text>
                    </div>
                  }
                />
              </Text>
            )}
            <Text
              variant="base"
              weight="normal"
              className="text-neutral-50/50 flex items-center gap-1"
            >
              Estimated Fees: {totalFees.toFixed(4)} ETH
              <InfoTooltip
                content={
                  <div className="flex flex-col gap-2">
                    <Text variant="base" weight="medium">
                      Atom Creation Fee: {atomCreationFee} ETH
                    </Text>
                  </div>
                }
              />
            </Text>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateIdentityReview
