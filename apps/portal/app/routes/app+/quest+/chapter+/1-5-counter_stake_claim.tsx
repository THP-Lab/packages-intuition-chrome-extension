import { useEffect } from 'react'

import { Button, ButtonSize, ButtonVariant } from '@0xintuition/1ui'
import {
  ClaimPresenter,
  ClaimsService,
  GetPositionByIdResponse,
  IdentityPresenter,
  PositionPresenter,
  PositionsService,
  QuestStatus,
  UserQuest,
  UserQuestsService,
  UsersService,
} from '@0xintuition/api'

import { ErrorPage } from '@components/error-page'
import StakeClaimActivity from '@components/quest/activities/stake-claim-activity'
import StakeClaimUnderlyingIdentitiesActivity from '@components/quest/activities/stake-claim-underlying-identities-activity'
import {
  Header,
  Hero,
  MDXContentView,
  QuestBackButton,
} from '@components/quest/detail/layout'
import { QuestCriteriaCard } from '@components/quest/quest-criteria-card'
import { QuestPointsDisplay } from '@components/quest/quest-points-display'
import QuestSuccessModal from '@components/quest/quest-success-modal'
import StakeModal from '@components/stake/stake-modal'
import { useQuestCompletion } from '@lib/hooks/useQuestCompletion'
import { useQuestMdxContent } from '@lib/hooks/useQuestMdxContent'
import { stakeModalAtom } from '@lib/state/store'
import { getQuestObjects } from '@lib/utils/app'
import logger from '@lib/utils/logger'
import { invariant } from '@lib/utils/misc'
import { getQuestCriteria, getQuestId, QuestRouteId } from '@lib/utils/quest'
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import {
  Form,
  useActionData,
  useLoaderData,
  useRevalidator,
} from '@remix-run/react'
import { fetchWrapper } from '@server/api'
import { requireUser, requireUserId } from '@server/auth'
import { getVaultDetails } from '@server/multivault'
import { getUserQuest } from '@server/quest'
import { CHAPTER_5_MP3, CURRENT_ENV } from 'app/consts'
import {
  ClaimElement,
  ClaimElementType,
  MDXContentVariant,
  VaultDetailsType,
} from 'app/types'
import { useAtom } from 'jotai'

const ROUTE_ID = QuestRouteId.COUNTER_STAKE_CLAIM

export async function loader({ request }: LoaderFunctionArgs) {
  const id = getQuestId(ROUTE_ID)
  invariant(id, 'id is required')

  // get fallback claim
  const counterStakeClaimFallbackClaimId =
    getQuestObjects(CURRENT_ENV).counterstakeClaimFallbackClaim.id

  const user = await requireUser(request)
  invariant(user, 'Unauthorized')
  invariant(user.wallet?.address, 'User wallet is required')

  const { userQuest, quest } = await getUserQuest(request, id)
  invariant(userQuest, 'User quest not found')
  invariant(quest, 'Quest not found')

  let position: GetPositionByIdResponse | PositionPresenter | undefined
  let claim: ClaimPresenter | undefined
  let userQuests: UserQuest[] = []
  let dependsOnUserQuest: UserQuest | undefined
  let identities: Record<
    string,
    {
      vaultDetails: VaultDetailsType
      identity: IdentityPresenter
      type: ClaimElementType
    }
  > = {}
  if (userQuest && userQuest.quest_completion_object_id) {
    position = await fetchWrapper(request, {
      method: PositionsService.getPositionById,
      args: {
        id: userQuest.quest_completion_object_id,
      },
    })
    logger('Fetched position', position)
  }

  if (position) {
    invariant(position.claim_id, 'position must be on an claim')
    claim = await fetchWrapper(request, {
      method: ClaimsService.getClaimById,
      args: {
        id: position.claim_id,
      },
    })
  } else {
    if (quest.depends_on_quest) {
      const { id: userId } = await fetchWrapper(request, {
        method: UsersService.getUserByWalletPublic,
        args: {
          wallet: user.wallet?.address as `0x${string}`,
        },
      })
      const { data } = await fetchWrapper(request, {
        method: UserQuestsService.search,
        args: {
          requestBody: {
            userId,
          },
        },
      })
      userQuests = data
      dependsOnUserQuest = userQuests.find(
        (userQuest) =>
          userQuest.quest_id === quest.depends_on_quest &&
          userId === userQuest.user_id,
      )
    }

    const dependsOnClaimId =
      counterStakeClaimFallbackClaimId ??
      dependsOnUserQuest?.quest_completion_object_id //TODO: Update when we decide how to handle ensuring user doesnt have an existing stake
    claim = await fetchWrapper(request, {
      method: ClaimsService.getClaimById,
      args: {
        id: dependsOnClaimId,
      },
    })
  }
  logger('Fetched claim', claim)

  const vaultDetails = await getVaultDetails(
    claim.contract,
    claim.vault_id,
    user.wallet?.address as `0x${string}`,
    claim.counter_vault_id,
  )

  // if position fetch underlying vault details
  if (position && claim) {
    const { subject, predicate, object } = claim
    const subjectVaultId = subject?.vault_id
    const objectVaultId = object?.vault_id
    const predicateVaultId = predicate?.vault_id
    const vaultDetails = await Promise.all([
      getVaultDetails(
        subject?.contract ?? '',
        subjectVaultId ?? '',
        user.wallet?.address as `0x${string}`,
      ),
      getVaultDetails(
        predicate?.contract ?? '',
        predicateVaultId ?? '',
        user.wallet?.address as `0x${string}`,
      ),
      getVaultDetails(
        object?.contract ?? '',
        objectVaultId ?? '',
        user.wallet?.address as `0x${string}`,
      ),
    ])
    identities = [subject, predicate, object].reduce(
      (acc, identity, index) => {
        if (identity) {
          acc[identity.id] = {
            vaultDetails: vaultDetails[index],
            identity,
            type: [
              ClaimElement.Subject,
              ClaimElement.Predicate,
              ClaimElement.Object,
            ][index],
          }
        }
        return acc
      },
      {} as Record<
        string,
        {
          vaultDetails: VaultDetailsType
          identity: IdentityPresenter
          type: ClaimElementType
        }
      >,
    )
  }

  return json({
    quest,
    userQuest,
    claim,
    position,
    vaultDetails,
    userWallet: user.wallet?.address,
    identities,
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request)
  invariant(userId, 'Unauthorized')

  const formData = await request.formData()
  const questId = formData.get('questId') as string

  try {
    const updatedUserQuest = await fetchWrapper(request, {
      method: UserQuestsService.completeQuest,
      args: {
        questId,
      },
    })
    if (updatedUserQuest.status === QuestStatus.COMPLETED) {
      return json({ success: true })
    }
  } catch (error) {
    logger('Error completing quest', error)
    return json({ success: false })
  }
  return json({ success: false })
}

export default function Quests() {
  const {
    quest,
    userQuest,
    claim,
    position,
    vaultDetails,
    userWallet,
    identities,
  } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const {
    checkQuestSuccess,
    isLoading: checkQuestSuccessLoading,
    successModalOpen,
    setSuccessModalOpen,
  } = useQuestCompletion(userQuest)
  const { introBody, mainBody, mainBody2, closingBody } = useQuestMdxContent(
    quest.id,
  )
  const [stakeModalActive, setStakeModalActive] = useAtom(stakeModalAtom)
  const { revalidate } = useRevalidator()

  function handleOpenForActivityModal() {
    setStakeModalActive((prevState) => ({
      ...prevState,
      isOpen: true,
      id: claim.claim_id,
      modalType: 'claim',
      claim,
      mode: 'deposit',
      direction: 'for',
    }))
  }

  function handleOpenAgainstActivityModal() {
    setStakeModalActive((prevState) => ({
      ...prevState,
      isOpen: true,
      id: claim.claim_id,
      modalType: 'claim',
      claim,
      mode: 'deposit',
      direction: 'against',
    }))
  }

  function handleSellClick() {
    setStakeModalActive((prevState) => ({
      ...prevState,
      isOpen: true,
      id: claim.claim_id,
      modalType: 'claim',
      claim,
      mode: 'redeem',
      direction: 'against',
    }))
    logger('redeem claim', claim)
  }
  function handleSellIdentityClick(identity: IdentityPresenter) {
    setStakeModalActive((prevState) => ({
      ...prevState,
      isOpen: true,
      id: identity.id,
      modalType: 'identity',
      identity,
      mode: 'redeem',
    }))
    logger('redeem identity', identity)
  }

  function handleCloseActivityModal() {
    setStakeModalActive((prevState) => ({
      ...prevState,
      isOpen: false,
      mode: undefined,
    }))
    revalidate()
  }

  function handleActivitySuccess(args: {
    identity?: IdentityPresenter
    claim?: ClaimPresenter
    vaultDetailsProp?: VaultDetailsType
    direction?: 'for' | 'against'
  }) {
    const { claim } = args
    logger('Activity success', claim)
    if (
      (claim && userQuest.status !== QuestStatus.CLAIMABLE) ||
      userQuest.status !== QuestStatus.COMPLETED
    ) {
      logger('Firing off check quest success')
      checkQuestSuccess()
    }
  }

  useEffect(() => {
    if (actionData?.success) {
      setSuccessModalOpen(true)
    }
  }, [actionData])

  return (
    <div className="px-10 w-full max-w-7xl mx-auto flex flex-col gap-10 max-lg:px-4 max-md:gap-4">
      <div className="flex flex-col gap-10 mb-5 max-md:gap-5 max-md:mb-2">
        <Hero imgSrc={`${quest.image}-header`} />
        <div className="flex flex-col gap-10 max-md:gap-4">
          <QuestBackButton />
          <Header
            position={quest.position}
            title={quest.title}
            questStatus={userQuest?.status}
            questAudio={CHAPTER_5_MP3}
          />
          <MDXContentView body={introBody} variant={MDXContentVariant.LORE} />
          <QuestCriteriaCard
            criteria={getQuestCriteria(quest.condition)}
            questStatus={userQuest?.status ?? QuestStatus.NOT_STARTED}
            points={quest.points}
          />
        </div>
        <MDXContentView body={mainBody} />
        <StakeClaimActivity
          status={userQuest?.status ?? QuestStatus.NOT_STARTED}
          claim={claim}
          position={position}
          handleForClick={handleOpenForActivityModal}
          handleAgainstClick={handleOpenAgainstActivityModal}
          handleSellClick={handleSellClick}
          vaultDetails={vaultDetails}
          direction={'against'}
          isLoading={checkQuestSuccessLoading}
          isDisabled={
            checkQuestSuccessLoading ||
            userQuest?.status === QuestStatus.CLAIMABLE
          }
        />
        <MDXContentView
          body={mainBody2}
          shouldDisplay={
            userQuest?.status === QuestStatus.CLAIMABLE ||
            (userQuest?.status === QuestStatus.COMPLETED && !!position)
          }
        />
        {!!identities.length &&
          !!position &&
          (userQuest?.status === QuestStatus.CLAIMABLE ||
            userQuest?.status === QuestStatus.COMPLETED) && (
            <StakeClaimUnderlyingIdentitiesActivity
              identities={identities}
              handleSellClick={handleSellIdentityClick}
              status={userQuest.status}
            />
          )}

        <MDXContentView
          body={closingBody}
          variant={MDXContentVariant.LORE}
          shouldDisplay={
            userQuest?.status === QuestStatus.CLAIMABLE ||
            (userQuest?.status === QuestStatus.COMPLETED && !!position)
          }
        />

        <div className="flex flex-col items-center justify-center w-full gap-2 pb-20 max-md:pb-5">
          <Form method="post">
            <input type="hidden" name="questId" value={quest.id} />
            <Button
              type="submit"
              variant={ButtonVariant.primary}
              size={ButtonSize.lg}
              disabled={userQuest?.status !== QuestStatus.CLAIMABLE}
            >
              {userQuest?.status === QuestStatus.COMPLETED
                ? 'Complete'
                : 'Complete Quest'}
            </Button>
          </Form>
          <QuestPointsDisplay
            points={quest.points}
            questStatus={userQuest?.status ?? QuestStatus.NOT_STARTED}
          />
        </div>
      </div>
      <StakeModal
        open={stakeModalActive.isOpen}
        claim={claim}
        userWallet={userWallet}
        contract={claim.contract}
        vaultId={claim.counter_vault_id}
        vaultDetailsProp={vaultDetails}
        onClose={handleCloseActivityModal}
        onSuccess={handleActivitySuccess}
        direction={stakeModalActive.direction}
      />
      <QuestSuccessModal
        quest={quest}
        userQuest={userQuest}
        isOpen={successModalOpen}
        routeId={ROUTE_ID}
        onClose={() => setSuccessModalOpen(false)}
      />
    </div>
  )
}

export function ErrorBoundary() {
  return <ErrorPage routeName="quest/chapter/1-5" />
}
