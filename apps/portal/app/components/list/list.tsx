import { ReactNode, useRef } from 'react'

import { Button, ButtonVariant, EmptyStateCard, Icon } from '@0xintuition/1ui'
import {
  ClaimSortColumn,
  PositionSortColumn,
  SortColumn,
} from '@0xintuition/api'

import { Search } from '@components/search'
import { Sort } from '@components/sort'
import { SortOption } from '@components/sort-select'
import { useSearchAndSortParamsHandler } from '@lib/hooks/useSearchAndSortParams'
import {
  globalCreateClaimModalAtom,
  globalCreateIdentityModalAtom,
} from '@lib/state/store'
import { PaginationType } from 'app/types/pagination'
import { useSetAtom } from 'jotai'

import { PaginationComponent } from '../pagination-component'

type SortColumnType = SortColumn | PositionSortColumn | ClaimSortColumn

export function List<T extends SortColumnType>({
  children,
  pagination,
  paginationLabel,
  options,
  paramPrefix,
  enableSearch = true,
  enableSort = true,
}: {
  children: ReactNode
  pagination?: PaginationType
  paginationLabel: string
  options?: SortOption<T>[]
  paramPrefix?: string
  enableSearch?: boolean
  enableSort?: boolean
}) {
  const { handleSortChange, handleSearchChange, onPageChange, onLimitChange } =
    useSearchAndSortParamsHandler<T>(paramPrefix)

  const listContainerRef = useRef<HTMLDivElement>(null)

  const setCreateIdentityModalActive = useSetAtom(globalCreateIdentityModalAtom)
  const setCreateClaimModalActive = useSetAtom(globalCreateClaimModalAtom)

  return (
    <div className="flex flex-col w-full gap-6" ref={listContainerRef}>
      {(enableSearch || enableSort) && (
        <div
          className={`flex w-full max-lg:flex-col max-lg:gap-4 ${enableSearch ? 'justify-between' : 'justify-end'}`}
        >
          {enableSearch && <Search handleSearchChange={handleSearchChange} />}
          {enableSort && options && (
            <Sort options={options} handleSortChange={handleSortChange} />
          )}
        </div>
      )}
      {pagination && pagination.totalEntries === 0 ? (
        <EmptyStateCard message={`No ${paginationLabel} found.`}>
          {paginationLabel.includes('identities') ? (
            <Button
              variant={ButtonVariant.primary}
              onClick={() => {
                setCreateIdentityModalActive(true)
              }}
            >
              <Icon name="fingerprint" className="h-4 w-4" /> Create an Identity
            </Button>
          ) : paginationLabel.includes('claims') ? (
            <Button
              variant={ButtonVariant.primary}
              onClick={() => {
                setCreateClaimModalActive(true)
              }}
            >
              <Icon name="claim" className="h-4 w-4" /> Make a Claim
            </Button>
          ) : null}
        </EmptyStateCard>
      ) : (
        <div className="flex flex-col w-full">{children}</div>
      )}
      {pagination && (
        <PaginationComponent
          totalEntries={pagination.totalEntries ?? 0}
          currentPage={pagination.currentPage ?? 0}
          totalPages={pagination.totalPages ?? 0}
          limit={pagination.limit ?? 0}
          onPageChange={(newOffset) => {
            onPageChange(newOffset)
          }}
          onLimitChange={onLimitChange}
          label={paginationLabel}
          listContainerRef={listContainerRef}
        />
      )}
    </div>
  )
}
