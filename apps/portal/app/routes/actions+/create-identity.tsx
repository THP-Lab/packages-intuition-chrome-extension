import { ApiError, IdentitiesService } from '@0xintuition/api'

import logger from '@lib/utils/logger'
import { invariant } from '@lib/utils/misc'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { requireUserWallet, setupAPI } from '@server/auth'
import { MULTIVAULT_CONTRACT_ADDRESS, NO_WALLET_ERROR } from 'app/consts'

export async function action({ request }: ActionFunctionArgs) {
  await setupAPI(request)
  const wallet = await requireUserWallet(request)
  invariant(wallet, NO_WALLET_ERROR)

  const formData = await request.formData()
  for (const [key, value] of formData.entries()) {
    logger(`${key}: ${value}`)
  }

  const display_name = formData.get('display_name')
  const image_url = formData.get('image_url')
  const description = formData.get('description')
  const external_reference = formData.get('external_reference')
  const is_contract = formData.get('is_contract')

  try {
    let identity
    try {
      const identityParams: {
        contract: string
        creator: string
        display_name: string
        external_reference: string
        description: string
        image?: string
        is_contract?: boolean
      } = {
        contract: MULTIVAULT_CONTRACT_ADDRESS as string,
        creator: wallet as string,
        display_name: display_name as string,
        external_reference: external_reference as string,
        description: description as string,
      }
      if (image_url) {
        identityParams.image = image_url as string
      }
      if (is_contract) {
        identityParams.is_contract = is_contract === 'true'
      }
      identity = await IdentitiesService.createIdentity({
        requestBody: identityParams,
      })

      if (!identity) {
        throw new Error('Failed to create identity.')
      }

      return json(
        {
          status: 'success',
          identity,
        } as const,
        {
          status: 200,
        },
      )
    } catch (error) {
      if (error instanceof ApiError) {
        identity = undefined
        logger(
          `${error.name} - ${error.status}: ${error.message} - ${JSON.stringify(error.body)}`,
        )
        throw new Error(JSON.stringify(error.body))
      }
    }

    return json(
      {
        status: 'success',
        identity,
      } as const,
      {
        status: 200,
      },
    )
  } catch (error) {
    if (error instanceof ApiError) {
      return json(
        {
          status: 'error',
          error: error.message,
          errorBody: error.body,
          errorStatus: error.status,
        } as const,
        {
          status: error.status || 500,
        },
      )
    }
    if (error instanceof Error) {
      return json(
        {
          status: 'error',
          error: error.message,
        } as const,
        {
          status: 500,
        },
      )
    }
    return json(
      {
        status: 'error',
        error: 'An unknown error occurred',
      } as const,
      {
        status: 500,
      },
    )
  }
}
