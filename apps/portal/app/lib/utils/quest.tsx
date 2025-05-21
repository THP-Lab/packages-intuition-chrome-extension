// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck content-collections folder is not available at build time
import { QuestCondition } from '@0xintuition/api'

import { allQuests, QuestContentType } from 'content-collections'

export function getQuestContentBySlug(slug: string): QuestContentType | null {
  const quest = allQuests.find((quest) => quest.slug === slug)
  if (!quest) {
    return null
  }
  return quest
}

export function getQuestCriteriaShort(condition: QuestCondition) {
  switch (condition) {
    case QuestCondition.CREATE_ATOM:
      return 'Create an Atom'
    case QuestCondition.STAKE_IDENTITY:
      return 'Stake on an Atom'
    case QuestCondition.CREATE_CLAIM:
      return 'Create a Triple'
    case QuestCondition.STAKE_CLAIM:
      return 'Stake ETH ‘For’ a Triple'
    case QuestCondition.COUNTER_STAKE_CLAIM:
      return 'Stake ETH ‘Against’ a Triple'
    case QuestCondition.ALWAYS_TRUE:
      return 'View a Query'
    default:
      return 'Unknown'
  }
}

export function getQuestCriteria(condition: QuestCondition) {
  switch (condition) {
    case QuestCondition.CREATE_ATOM:
      return 'Create an Identity for any web3 project, topic, or concept of your choosing.'
    case QuestCondition.STAKE_IDENTITY:
      return 'Indicate your conviction in and support of an Atom / Identity by staking on the Atom / Identity’s Vault.'
    case QuestCondition.CREATE_CLAIM:
      return 'Practice creating a Triple, also known as a ‘Claim’, to create a semantic statement about a web3 project or topic of your choosing.'
    case QuestCondition.STAKE_CLAIM:
      return 'Signal agreement with a specific semantic statement by staking on the Triple / Claim’s respective Positive Vault.'
    case QuestCondition.COUNTER_STAKE_CLAIM:
      return 'Signal disagreement with a specific semantic statement by staking on the Triple / Claim’s respective Negative Vault.'
    case QuestCondition.ALWAYS_TRUE:
      return 'Get a feel for the power of Atoms / Triples by viewing a basic query, also known as a ‘List’.'
    default:
      return 'Unknown'
  }
}

export const QuestRouteId = {
  CREATE_ATOM: '1-1-create_atom',
  STAKE_IDENTITY: '1-2-stake_identity',
  CREATE_CLAIM: '1-3-create_claim',
  STAKE_CLAIM: '1-4-stake_claim',
  COUNTER_STAKE_CLAIM: '1-5-counter_stake_claim',
  ALWAYS_TRUE: '1-6-always_true',
} as const

export type QuestRouteIdType = (typeof QuestRouteId)[keyof typeof QuestRouteId]

const questIdMap = {
  [QuestRouteId.CREATE_ATOM]: 'b4b7e0ed-a69a-4a0a-bf9b-8bf0afe979f9',
  [QuestRouteId.STAKE_IDENTITY]: '3b5315bb-f29b-4320-9997-6928b4bbf3e9',
  [QuestRouteId.CREATE_CLAIM]: 'dacdd63d-f978-433e-aeb0-54d165e8f936',
  [QuestRouteId.STAKE_CLAIM]: 'ac22e180-9923-4481-9cba-31e88f223e58',
  [QuestRouteId.COUNTER_STAKE_CLAIM]: '89ef2072-2428-4695-994e-3c83c3f7f3be',
  [QuestRouteId.ALWAYS_TRUE]: '90cf4398-f7e5-4ec7-8088-c64d2da6a715',
} as const

export function getQuestId(routeId: string): string | null {
  return questIdMap[routeId as keyof typeof questIdMap] || null
}

export function getQuestRouteId(id: string): QuestRouteIdType | null {
  return (
    (Object.entries(questIdMap).find(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => value === id,
    )?.[0] as QuestRouteIdType) || null
  )
}

// TODO: ENG-0000: Replace this with proper dependency handling
export function getNextQuestRouteId(routeId: QuestRouteIdType) {
  switch (routeId) {
    case QuestRouteId.CREATE_ATOM:
      return QuestRouteId.STAKE_IDENTITY
    case QuestRouteId.STAKE_IDENTITY:
      return QuestRouteId.CREATE_CLAIM
    case QuestRouteId.CREATE_CLAIM:
      return QuestRouteId.STAKE_CLAIM
    case QuestRouteId.STAKE_CLAIM:
      return QuestRouteId.COUNTER_STAKE_CLAIM
    case QuestRouteId.COUNTER_STAKE_CLAIM:
      return QuestRouteId.ALWAYS_TRUE
    case QuestRouteId.ALWAYS_TRUE:
      return null
  }
}
