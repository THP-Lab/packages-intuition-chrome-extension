import { json, LoaderFunctionArgs } from '@remix-run/node'
import { getUserWallet } from '@server/auth'
import { getVaultDetails } from '@server/multivault'

export async function loader({ request }: LoaderFunctionArgs) {
  const userWallet = await getUserWallet(request)
  const url = new URL(request.url)
  const contract = url.searchParams.get('contract')
  const vaultId = url.searchParams.get('vaultId')
  const counterVaultId = url.searchParams.get('counterVaultId')

  if (!contract || !vaultId) {
    return json({ error: 'Missing contract or vaultId' }, { status: 400 })
  }

  try {
    const vaultDetails = await getVaultDetails(
      contract,
      vaultId,
      userWallet === null ? undefined : (userWallet as `0x${string}`),
      counterVaultId ?? undefined,
    )
    console.log('[Vault Details] Prefetching data')
    return json(vaultDetails)
  } catch (error) {
    return json({ error: 'Failed to fetch vault details' }, { status: 500 })
  }
}
