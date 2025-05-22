import { CodegenConfig } from '@graphql-codegen/cli'
import type { Types } from '@graphql-codegen/plugin-helpers'

import { API_URL_PROD } from './src/constants'

const config: CodegenConfig = {
  overwrite: true,
  hooks: { afterAllFileWrite: ['prettier --write'] },
  schema: {
    [API_URL_PROD]: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  },
  ignoreNoDocuments: true,
  documents: ['**/*.graphql'],
  generates: {
    './src/generated/index.ts': {
      documents: [
        'src/graphql/**/*.graphql', // Inclut tout, y compris les subscriptions
      ],
      plugins: [
        'typescript',
        '@graphql-codegen/typescript-operations',
        '@graphql-codegen/typescript-react-query',
        '@graphql-codegen/typescript-react-apollo',
        'typescript-document-nodes',
      ],
      config: {
        reactQueryVersion: 5,
        fetcher: {
          func: '../client#fetcher',
          isReactHook: false,
        },
        exposeDocument: true,
        exposeFetcher: true,
        exposeQueryKeys: true,
        exposeMutationKeys: true,
        addInfiniteQuery: true,
        enumsAsTypes: true,
        dedupeFragments: true,
        documentMode: 'documentNode',
        withHooks: true,
        withHOC: false,
        withComponent: false,
        scalars: {
          Date: 'Date',
          JSON: 'Record<string, any>',
          ID: 'string',
          Void: 'void',
        },
      },
    },

    './schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
  watch: process.env.NODE_ENV === 'development',
}

export default config
