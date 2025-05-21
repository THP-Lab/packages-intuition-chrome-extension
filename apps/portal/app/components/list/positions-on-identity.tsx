import { IconName, Identity } from '@0xintuition/1ui'
import { PositionPresenter, PositionSortColumn } from '@0xintuition/api'
import { GetPositionsQuery } from '@0xintuition/graphql'

import { IdentityPositionRow } from '@components/identity/identity-position-row'
import { ListHeader } from '@components/list/list-header'
import { formatBalance, getProfileUrl } from '@lib/utils/misc'
import { BLOCK_EXPLORER_URL } from 'app/consts'
import { PaginationType } from 'app/types'
import { formatUnits } from 'viem'

import { SortOption } from '../sort-select'
import { List } from './list'

type Position = NonNullable<GetPositionsQuery['positions']>[number]

export function PositionsOnIdentityNew({
  positions,
  pagination,
  readOnly = false,
}: {
  positions: Position[]
  pagination: { aggregate?: { count: number } } | number
  readOnly?: boolean
}) {
  const options: SortOption<PositionSortColumn>[] = [
    { value: 'Total ETH', sortBy: 'Assets' },
    { value: 'Updated At', sortBy: 'UpdatedAt' },
    { value: 'Created At', sortBy: 'CreatedAt' },
  ]

  const paginationCount =
    typeof pagination === 'number'
      ? pagination
      : pagination?.aggregate?.count ?? 0

  return (
    <List<PositionSortColumn>
      pagination={{
        currentPage: 1,
        limit: 10,
        totalEntries: paginationCount,
        totalPages: Math.ceil(paginationCount / 10),
      }}
      paginationLabel="positions"
      options={options}
      paramPrefix="positions"
    >
      <ListHeader
        items={[
          { label: 'User', icon: IconName.cryptoPunk },
          { label: 'Position Amount', icon: IconName.ethereum },
        ]}
      />
      {positions?.map((position) => (
        <div
          key={position.id}
          className={`grow shrink basis-0 self-stretch bg-black first:rounded-t-xl last:rounded-b-xl theme-border flex-col justify-start items-start gap-5 inline-flex`}
        >
          <IdentityPositionRow
            variant={Identity.user}
            avatarSrc={position.account?.image ?? ''}
            name={position.account?.label ?? ''}
            description={position.account?.label ?? ''} // TODO: Fix this when we have the description
            id={position.account?.id ?? ''}
            amount={+formatBalance(BigInt(position.shares || '0'), 18)}
            feesAccrued={Number(
              formatUnits(
                // @ts-ignore // TODO: Fix this when we determine what the value should be
                BigInt(+position.shares - +(position.value ?? position.shares)),
                18,
              ),
            )}
            // updatedAt={position.updated_at} // TODO: Fix this when we have the updated_at
            link={getProfileUrl(position.account?.id, readOnly)}
            ipfsLink={`${BLOCK_EXPLORER_URL}/address/${position.account?.id}`}
          />
        </div>
      ))}
    </List>
  )
}

// LEGACY IMPLEMENTATION -- CAN REMOVE ONCE ALL POSITIONS ARE CONVERTED TO NEW IMPLEMENTATION
export function PositionsOnIdentity({
  positions,
  pagination,
  readOnly = false,
}: {
  positions: PositionPresenter[]
  pagination: PaginationType
  readOnly?: boolean
}) {
  const options: SortOption<PositionSortColumn>[] = [
    { value: 'Total ETH', sortBy: 'Assets' },
    { value: 'Updated At', sortBy: 'UpdatedAt' },
    { value: 'Created At', sortBy: 'CreatedAt' },
  ]

  return (
    <List<PositionSortColumn>
      pagination={pagination}
      paginationLabel="positions"
      options={options}
      paramPrefix="positions"
    >
      <ListHeader
        items={[
          { label: 'User', icon: IconName.cryptoPunk },
          { label: 'Position Amount', icon: IconName.ethereum },
        ]}
      />
      {positions.map((position) => (
        <div
          key={position.id}
          className={`grow shrink basis-0 self-stretch bg-black first:rounded-t-xl last:rounded-b-xl theme-border flex-col justify-start items-start gap-5 inline-flex`}
        >
          <IdentityPositionRow
            variant={Identity.user}
            avatarSrc={position.user?.image ?? ''}
            name={position.user?.display_name ?? ''}
            description={position.user?.description ?? ''}
            id={position.user?.wallet ?? ''}
            amount={+formatBalance(BigInt(position.assets), 18)}
            feesAccrued={Number(
              formatUnits(BigInt(+position.assets - +position.value), 18),
            )}
            updatedAt={position.updated_at}
            link={getProfileUrl(position.user?.wallet, readOnly)}
            ipfsLink={`${BLOCK_EXPLORER_URL}/address/${position.user?.wallet}`}
          />
        </div>
      ))}
    </List>
  )
}
