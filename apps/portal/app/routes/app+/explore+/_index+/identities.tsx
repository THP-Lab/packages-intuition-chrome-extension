import { IconName } from '@0xintuition/1ui'
import {
  IdentitiesService,
  IdentityPresenter,
  SortColumn,
} from '@0xintuition/api'

import { ErrorPage } from '@components/error-page'
import ExploreHeader from '@components/explore/ExploreHeader'
import { ExploreSearch } from '@components/explore/ExploreSearch'
import { IdentitiesList } from '@components/list/identities'
import { useLiveLoader } from '@lib/hooks/useLiveLoader'
import { calculateTotalPages, invariant } from '@lib/utils/misc'
import { getStandardPageParams } from '@lib/utils/params'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { fetchWrapper } from '@server/api'
import { requireUserWallet } from '@server/auth'
import { HEADER_BANNER_IDENTITIES, NO_WALLET_ERROR } from 'app/consts'

export async function loader({ request }: LoaderFunctionArgs) {
  const wallet = await requireUserWallet(request)
  invariant(wallet, NO_WALLET_ERROR)

  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  const { page, limit, sortBy, direction } = getStandardPageParams({
    searchParams,
  })
  const displayName = searchParams.get('identity') || null
  const hasTag = searchParams.get('tagIds') || null
  const isUser = searchParams.get('isUser')

  const identities = await fetchWrapper(request, {
    method: IdentitiesService.searchIdentity,
    args: {
      page,
      limit,
      sortBy: sortBy as SortColumn,
      direction,
      displayName,
      hasTag,
      isUser: isUser === 'true' ? true : isUser === 'false' ? false : undefined,
    },
  })

  const totalPages = calculateTotalPages(identities?.total ?? 0, limit)

  return json({
    identities: identities?.data as IdentityPresenter[],
    sortBy,
    direction,
    pagination: {
      currentPage: page,
      limit,
      totalEntries: identities?.total ?? 0,
      totalPages,
    },
  })
}

export default function ExploreIdentities() {
  const { identities, pagination } = useLiveLoader<typeof loader>([
    'create',
    'attest',
  ])

  return (
    <>
      <ExploreHeader
        title="Identities"
        content="Decentralized identities for anything and everything - not just people."
        icon={IconName.fingerprint}
        bgImage={HEADER_BANNER_IDENTITIES}
      />
      <ExploreSearch variant="identity" />
      <IdentitiesList
        variant="explore"
        identities={identities}
        pagination={pagination}
        enableSearch={false}
        enableSort={true}
      />
    </>
  )
}

export function ErrorBoundary() {
  return <ErrorPage routeName="explore/identities" />
}
