import React from 'react'

import { render } from '@testing-library/react'
import { Claim } from 'components'

import { ListHeaderCard } from './ListHeaderCard'

describe('ListHeaderCard', () => {
  it('should render appropriate element', () => {
    const { asFragment } = render(
      <ListHeaderCard label="Identities" value={35}>
        <Claim
          subject={{
            variant: 'non-user',
            label: '0xintuition',
          }}
          predicate={{
            variant: 'non-user',
            label: 'is really',
          }}
          object={{
            variant: 'non-user',
            label: 'cool',
          }}
        />
      </ListHeaderCard>,
    )
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="flex items-center justify-between w-full p-6 theme-border rounded-xl"
        >
          <div
            class="flex flex-col"
          >
            <div
              class="text-sm font-normal text-muted-foreground mb-0.5"
            >
              Identities
            </div>
            <div
              class="text-primary text-lg font-medium"
            >
              35
            </div>
          </div>
          <div
            class="flex items-center"
          >
            <div
              class="flex items-center w-full max-w-max relative max-sm:flex-col max-sm:m-auto transition-colors duration-200 flex-row"
            >
              <div>
                <button
                  class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-md text-base [&>span]:h-6 [&>span]:w-6 relative z-10 identity-tag transition-colors duration-200 border-theme"
                  data-state="closed"
                >
                  <span
                    class="relative flex h-10 w-10 shrink-0 overflow-hidden aspect-square bg-background theme-border rounded"
                  >
                    <span
                      class="flex h-full w-full items-center justify-center bg-inherit"
                    >
                      <svg
                        class="text-primary/30 w-[80%] h-[80%]"
                      >
                        <use
                          href="/src/components/Icon/Icon.sprites.svg#fingerprint"
                        />
                      </svg>
                    </span>
                  </span>
                  <div
                    class="text-base font-normal relative z-10 identity-tag transition-colors duration-200 text-secondary/70"
                  >
                    0xintuition
                  </div>
                </button>
              </div>
              <div
                class="shrink-0 bg-border/20 h-[1px] transition-colors duration-200 w-4 max-sm:w-px max-sm:h-2"
                data-orientation="horizontal"
                role="none"
              />
              <div>
                <button
                  class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-md text-base [&>span]:h-6 [&>span]:w-6 relative z-10 identity-tag transition-colors duration-200 border-theme"
                  data-state="closed"
                >
                  <span
                    class="relative flex h-10 w-10 shrink-0 overflow-hidden aspect-square bg-background theme-border rounded"
                  >
                    <span
                      class="flex h-full w-full items-center justify-center bg-inherit"
                    >
                      <svg
                        class="text-primary/30 w-[80%] h-[80%]"
                      >
                        <use
                          href="/src/components/Icon/Icon.sprites.svg#fingerprint"
                        />
                      </svg>
                    </span>
                  </span>
                  <div
                    class="text-base font-normal relative z-10 identity-tag transition-colors duration-200 text-secondary/70"
                  >
                    is really
                  </div>
                </button>
              </div>
              <div
                class="shrink-0 bg-border/20 h-[1px] transition-colors duration-200 w-4 max-sm:w-px max-sm:h-2"
                data-orientation="horizontal"
                role="none"
              />
              <div>
                <button
                  class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-md text-base [&>span]:h-6 [&>span]:w-6 relative z-10 identity-tag transition-colors duration-200 border-theme"
                  data-state="closed"
                >
                  <span
                    class="relative flex h-10 w-10 shrink-0 overflow-hidden aspect-square bg-background theme-border rounded"
                  >
                    <span
                      class="flex h-full w-full items-center justify-center bg-inherit"
                    >
                      <svg
                        class="text-primary/30 w-[80%] h-[80%]"
                      >
                        <use
                          href="/src/components/Icon/Icon.sprites.svg#fingerprint"
                        />
                      </svg>
                    </span>
                  </span>
                  <div
                    class="text-base font-normal relative z-10 identity-tag transition-colors duration-200 text-secondary/70"
                  >
                    cool
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DocumentFragment>
    `)
  })
})
