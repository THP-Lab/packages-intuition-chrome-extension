import { useEffect, useState } from 'react'

import {
  ActivePositionCard,
  Claim,
  Icon,
  IconName,
  Identity,
  IdentityTag,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Text,
  TextVariant,
  TextWeight,
} from '@0xintuition/1ui'
import { ClaimPresenter, IdentityPresenter } from '@0xintuition/api'

import { InfoTooltip } from '@components/info-tooltip'
import { PATHS } from '@consts/paths'
import {
  getAtomDescription,
  getAtomImage,
  getAtomIpfsLink,
  getAtomLabel,
  getAtomLink,
} from '@lib/utils/misc'
import { Link } from '@remix-run/react'
import { VaultDetailsType } from 'app/types'
import { TransactionStateType } from 'app/types/transaction'

interface StakeReviewProps {
  val: string
  mode: string | undefined
  state: TransactionStateType
  isError?: boolean
  modalType: 'identity' | 'claim' | null | undefined
  identity?: IdentityPresenter
  claim?: ClaimPresenter
  vaultDetails?: VaultDetailsType
}

const calculateDepositFees = (
  val: string,
  isClaim: boolean,
  vaultDetails?: VaultDetailsType,
) => {
  const protocolFee = vaultDetails?.formatted_protocol_fee || 0
  const entryFee = vaultDetails?.formatted_entry_fee || 0
  const atomFractionOnDeposit =
    vaultDetails?.formatted_atom_deposit_fraction_for_triple || 0

  // Protocol Fee
  const protocolFeeAmount = +val * +protocolFee
  const valAfterProtocolFee = +val - protocolFeeAmount

  // Atom Deposit Flow
  const atomDepositAmount = isClaim
    ? valAfterProtocolFee * +atomFractionOnDeposit
    : valAfterProtocolFee
  const atomEntryFeeAmount = atomDepositAmount * +entryFee
  const atomPositionAmount = atomDepositAmount - atomEntryFeeAmount

  // Triple Deposit Flow
  const tripleDepositAmount = valAfterProtocolFee - atomDepositAmount
  const tripleEntryFeeAmount = tripleDepositAmount * +entryFee
  const triplePositionAmount = tripleDepositAmount - tripleEntryFeeAmount

  // Total Fees
  const totalFees =
    protocolFeeAmount + atomEntryFeeAmount + tripleEntryFeeAmount

  const totalPosition = atomPositionAmount + triplePositionAmount

  return {
    totalFees,
    atomDepositAmount,
    protocolFeeAmount,
    atomEntryFeeAmount: atomEntryFeeAmount / 3,
    totalAtomEntryFeeAmount: atomEntryFeeAmount,
    tripleEntryFeeAmount,
    atomPositionAmount: atomPositionAmount / 3,
    totalAtomPositionAmount: atomPositionAmount,
    triplePositionAmount,
    totalPosition,
  }
}

const calculateRedeemFees = (val: string, vaultDetails?: VaultDetailsType) => {
  const protocolFee = vaultDetails?.formatted_protocol_fee || 0
  const exitFee = vaultDetails?.formatted_exit_fee || 0

  // Protocol Fee
  const protocolFeeAmount = +val * +protocolFee
  const valAfterProtocolFee = +val - protocolFeeAmount

  // Triple Redeem Flow
  const redeemAmount = valAfterProtocolFee
  const exitFeeAmount = redeemAmount * +exitFee

  // Total Redeem
  const totalRedeem = redeemAmount - exitFeeAmount

  // Total Fees
  const totalFees = protocolFeeAmount + exitFeeAmount

  return {
    totalFees,
    protocolFeeAmount,
    redeemAmount,
    exitFeeAmount,
    totalRedeem,
  }
}

interface Fees {
  totalFees: number
  protocolFeeAmount: number
  // Deposit-specific properties
  atomDepositAmount?: number
  atomEntryFeeAmount?: number
  totalAtomEntryFeeAmount?: number
  tripleEntryFeeAmount?: number
  atomPositionAmount?: number
  totalAtomPositionAmount?: number
  triplePositionAmount?: number
  totalPosition?: number
  // Redeem-specific properties
  redeemAmount?: number
  exitFeeAmount?: number
  totalRedeem?: number
}

export default function StakeReview({
  val,
  mode = 'identity',
  state,
  isError,
  identity,
  claim,
  vaultDetails,
}: StakeReviewProps) {
  const [statusText, setStatusText] = useState<string>('')

  useEffect(() => {
    const newText = isError
      ? 'Transaction failed'
      : state.status === 'transaction-pending' || state.status === 'confirm'
        ? 'Attestation in progress'
        : state.status === 'transaction-confirmed' ||
            state.status === 'complete'
          ? mode === 'deposit'
            ? 'Deposited successfully'
            : 'Redeemed successfully'
          : state.status === 'error'
            ? 'Transaction failed'
            : mode === 'deposit'
              ? 'Deposit'
              : 'Redeem'
    if (newText !== statusText) {
      setStatusText(newText)
    }
  }, [isError, state.status, mode, statusText])

  const fees: Fees =
    mode === 'deposit'
      ? calculateDepositFees(val, !!claim, vaultDetails)
      : calculateRedeemFees(val, vaultDetails)

  return (
    <ScrollArea className="h-[600px] w-full">
      <div className="flex flex-col px-10">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5 items-center justify-center">
            <Icon name="await-action" className="h-12 w-12 text-muted" />
            <Text variant={TextVariant.headline} weight={TextWeight.medium}>
              Review
            </Text>
          </div>
          <ActivePositionCard label="Total Cost" value={Number(val)} />
          <div className="gap-10 flex flex-col w-full">
            <div className="flex flex-col gap-2.5 w-full">
              <div className="flex flex-row gap-1">
                <Text
                  variant={TextVariant.bodyLarge}
                  weight={TextWeight.medium}
                >
                  {mode === 'deposit'
                    ? `Deposit ETH on ${claim ? 'Claim' : 'Identity'}`
                    : `Redeem ETH from ${claim ? 'Claim' : 'Identity'}`}
                </Text>
              </div>
              <Table className="border-transparent">
                <TableBody className="border-border/20 border-t border-b">
                  <TableRow className="hover:bg-transparent">
                    <TableCell>
                      {claim ? (
                        <Claim
                          size="default"
                          subject={{
                            variant: claim?.subject?.is_user
                              ? Identity.user
                              : Identity.nonUser,
                            label: getAtomLabel(
                              claim?.subject as IdentityPresenter,
                            ),
                            imgSrc: getAtomImage(
                              claim?.subject as IdentityPresenter,
                            ),
                            id: claim?.subject?.identity_id,
                            description: getAtomDescription(
                              claim?.subject as IdentityPresenter,
                            ),
                            ipfsLink: getAtomIpfsLink(
                              claim?.subject as IdentityPresenter,
                            ),
                            link: getAtomLink(
                              claim?.subject as IdentityPresenter,
                            ),
                          }}
                          predicate={{
                            variant: claim?.predicate?.is_user
                              ? Identity.user
                              : Identity.nonUser,
                            label: getAtomLabel(
                              claim?.predicate as IdentityPresenter,
                            ),
                            imgSrc: getAtomImage(
                              claim?.predicate as IdentityPresenter,
                            ),
                            id: claim?.predicate?.identity_id,
                            description: getAtomDescription(
                              claim?.predicate as IdentityPresenter,
                            ),
                            ipfsLink: getAtomIpfsLink(
                              claim?.predicate as IdentityPresenter,
                            ),
                            link: getAtomLink(
                              claim?.predicate as IdentityPresenter,
                            ),
                          }}
                          object={{
                            variant: claim?.object?.is_user
                              ? Identity.user
                              : Identity.nonUser,
                            label: getAtomLabel(
                              claim?.object as IdentityPresenter,
                            ),
                            imgSrc: getAtomImage(
                              claim?.object as IdentityPresenter,
                            ),
                            id: claim?.object?.identity_id,
                            description: getAtomDescription(
                              claim?.object as IdentityPresenter,
                            ),
                            ipfsLink: getAtomIpfsLink(
                              claim?.object as IdentityPresenter,
                            ),
                            link: getAtomLink(
                              claim?.object as IdentityPresenter,
                            ),
                          }}
                          orientation="vertical"
                        />
                      ) : (
                        <IdentityTag
                          imgSrc={identity?.user?.image ?? identity?.image}
                          variant={
                            identity?.user ? Identity.user : Identity.nonUser
                          }
                        >
                          {identity?.user?.display_name ??
                            identity?.display_name ??
                            'Identity'}
                        </IdentityTag>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Text
                        variant={TextVariant.body}
                        weight={TextWeight.medium}
                        className="text-secondary-foreground/70"
                      >
                        {mode === 'deposit'
                          ? claim
                            ? fees.triplePositionAmount
                            : fees.totalAtomPositionAmount?.toFixed(6)
                          : fees.totalRedeem?.toFixed(6)}{' '}
                        ETH
                      </Text>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {mode === 'deposit' && claim && (
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-row gap-1">
                  <Text
                    variant={TextVariant.bodyLarge}
                    weight={TextWeight.medium}
                  >
                    ETH to Individual Identities
                  </Text>
                  <InfoTooltip
                    title="ETH to Individual Identities"
                    icon={IconName.circleInfo}
                    content={
                      <div className="flex flex-col gap-2 w-full">
                        <Text variant="base">
                          When staking on a Claim, a portion of the deposit
                          amount is automatically allocated to each underlying
                          Identity, as there is an indirect signaling of support
                          of these Identities.
                        </Text>
                      </div>
                    }
                  />
                </div>
                <Table className="border-transparent">
                  <TableBody className="border-border/20 border-t border-b">
                    <TableRow className="hover:bg-transparent">
                      <TableCell>
                        <IdentityTag
                          size="default"
                          variant={
                            claim?.subject?.is_user
                              ? Identity.user
                              : Identity.nonUser
                          }
                          imgSrc={getAtomImage(
                            claim?.subject as IdentityPresenter,
                          )}
                          id={claim?.subject?.identity_id}
                        >
                          {getAtomLabel(claim?.subject as IdentityPresenter)}
                        </IdentityTag>
                      </TableCell>
                      <TableCell className="text-right">
                        <Text
                          variant={TextVariant.body}
                          weight={TextWeight.medium}
                          className="text-secondary-foreground/70"
                        >
                          {fees.atomDepositAmount?.toFixed(6)} ETH
                        </Text>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell>
                        <IdentityTag
                          size="default"
                          variant={
                            claim?.predicate?.is_user
                              ? Identity.user
                              : Identity.nonUser
                          }
                          imgSrc={getAtomImage(
                            claim?.predicate as IdentityPresenter,
                          )}
                          id={claim?.predicate?.identity_id}
                        >
                          {getAtomLabel(claim?.predicate as IdentityPresenter)}
                        </IdentityTag>
                      </TableCell>
                      <TableCell className="text-right">
                        <Text
                          variant={TextVariant.body}
                          weight={TextWeight.medium}
                          className="text-secondary-foreground/70"
                        >
                          {fees.atomDepositAmount?.toFixed(6)} ETH
                        </Text>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell>
                        <IdentityTag
                          size="default"
                          variant={
                            claim?.object?.is_user
                              ? Identity.user
                              : Identity.nonUser
                          }
                          imgSrc={getAtomImage(
                            claim?.object as IdentityPresenter,
                          )}
                          id={claim?.object?.identity_id}
                        >
                          {getAtomLabel(claim?.object as IdentityPresenter)}
                        </IdentityTag>
                      </TableCell>
                      <TableCell className="text-right">
                        <Text
                          variant={TextVariant.body}
                          weight={TextWeight.medium}
                          className="text-secondary-foreground/70"
                        >
                          {fees.atomDepositAmount?.toFixed(6)} ETH
                        </Text>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-row gap-1">
                <Text
                  variant={TextVariant.bodyLarge}
                  weight={TextWeight.medium}
                >
                  Estimated Fees
                </Text>
                <InfoTooltip
                  title="Estimated Fees"
                  icon={IconName.circleInfo}
                  content={
                    <div className="flex flex-col gap-2 w-full">
                      <Text variant="base">
                        Standard fees apply to this transaction. See{' '}
                        <Link
                          to={PATHS.HELP}
                          target="_blank"
                          prefetch="intent"
                          className="underline"
                        >
                          Help Center
                        </Link>{' '}
                        for details.
                      </Text>
                    </div>
                  }
                />
              </div>
              <Table className="border-transparent">
                <TableBody className="border-border/20 border-t border-b">
                  <TableRow className="hover:bg-transparent">
                    <TableCell className="text-secondary-foreground/70">
                      Protocol Fee
                    </TableCell>
                    <TableCell className="text-right">
                      <Text
                        variant={TextVariant.body}
                        weight={TextWeight.medium}
                        className="text-secondary-foreground/70"
                      >
                        {fees.protocolFeeAmount.toFixed(6)} ETH
                      </Text>
                    </TableCell>
                  </TableRow>
                  {mode === 'deposit' ? (
                    <>
                      <TableRow className="hover:bg-transparent">
                        <TableCell className="text-secondary-foreground/70">
                          Identity Entry Fee
                        </TableCell>
                        <TableCell className="text-right">
                          <Text
                            variant={TextVariant.body}
                            weight={TextWeight.medium}
                            className="text-secondary-foreground/70"
                          >
                            {fees.totalAtomEntryFeeAmount?.toFixed(6)} ETH
                          </Text>
                        </TableCell>
                      </TableRow>
                      {claim && (
                        <TableRow className="hover:bg-transparent">
                          <TableCell className="text-secondary-foreground/70">
                            Claim Entry Fee
                          </TableCell>
                          <TableCell className="text-right">
                            <Text
                              variant={TextVariant.body}
                              weight={TextWeight.medium}
                              className="text-secondary-foreground/70"
                            >
                              {fees.tripleEntryFeeAmount?.toFixed(6)} ETH
                            </Text>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ) : (
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="text-secondary-foreground/70">
                        Exit Fee
                      </TableCell>
                      <TableCell className="text-right">
                        <Text
                          variant={TextVariant.body}
                          weight={TextWeight.medium}
                          className="text-secondary-foreground/70"
                        >
                          {fees.exitFeeAmount?.toFixed(6)} ETH
                        </Text>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
