import { TransactionStatusType } from '@0xintuition/1ui'

import { TransactionReceipt } from 'viem'

export type TStatus = string

export type BaseTransactionStateType<TStatus> = {
  status: TStatus
  txHash?: `0x${string}`
  imageUrl?: string
  displayName?: string
  description?: string
  externalReference?: string
  error?: string
  identityId?: string
}

export type TransactionActionType =
  | { type: 'START_TRANSACTION' }
  | { type: 'APPROVE_TRANSACTION' }
  | { type: 'REVIEW_TRANSACTION' }
  | { type: 'CONFIRM_TRANSACTION' }
  | { type: 'TRANSACTION_PENDING' }
  | { type: 'TRANSACTION_CONFIRMED' }
  | {
      type: 'TRANSACTION_COMPLETE'
      txHash?: `0x${string}`
      txReceipt: TransactionReceipt
    }
  | { type: 'TRANSACTION_HASH'; txHash?: `0x${string}` }
  | { type: 'TRANSACTION_ERROR'; error: string }

export type IdentityTransactionActionType =
  | { type: 'START_TRANSACTION' }
  | { type: 'START_IMAGE_UPLOAD' }
  | {
      type: 'IMAGE_UPLOAD_COMPLETE'
      imageUrl: string
      displayName: string
      description: string
      externalReference: string
    }
  | { type: 'REVIEW_TRANSACTION' }
  | { type: 'PREPARING_IDENTITY' }
  | { type: 'PUBLISHING_IDENTITY' }
  | { type: 'APPROVE_TRANSACTION' }
  | { type: 'CONFIRM_TRANSACTION' }
  | { type: 'TRANSACTION_PENDING' }
  | { type: 'TRANSACTION_CONFIRMED' }
  | {
      type: 'TRANSACTION_COMPLETE'
      txHash?: `0x${string}`
      txReceipt: TransactionReceipt
      identityId?: string
    }
  | { type: 'TRANSACTION_HASH'; txHash?: `0x${string}` }
  | { type: 'TRANSACTION_ERROR'; error: string }

export type TransactionStateType =
  BaseTransactionStateType<TransactionStatusType>
export type IdentityTransactionStateType =
  BaseTransactionStateType<TransactionStatusType>

export const TransactionSuccessAction = {
  VIEW: 'view',
  CLOSE: 'close',
}

export type TransactionSuccessActionType =
  (typeof TransactionSuccessAction)[keyof typeof TransactionSuccessAction]
