import React from 'react'

import { render } from '@testing-library/react'

import { Claim, ClaimProps } from './Claim'

describe('Claim', () => {
  const defaultProps: ClaimProps = {
    size: 'md',
    subject: {
      label: 'Alice',
      variant: 'user',
      imgSrc:
        'https://m.media-amazon.com/images/M/MV5BNDhiMWYzMjgtNTRiYi00ZTA3LThlODctNDRkMDk0NzFkMWI3L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTg0MTkzMzA@._V1_.jpg',
    },
    predicate: {
      label: 'likes',
      variant: 'non-user',
    },
    object: {
      label: 'pizza',
      variant: 'non-user',
    },
  }

  it('should render with default props', () => {
    const { asFragment } = render(<Claim {...defaultProps} />)
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="flex items-center w-full max-w-max relative max-sm:flex-col max-sm:m-auto transition-colors duration-200 flex-row"
        >
          <div>
            <button
              class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-full [&>span]:rounded-full [&>span]:overflow-hidden text-base [&>span]:h-7 [&>span]:w-7 relative z-10 identity-tag transition-colors duration-200 border-theme"
              data-state="closed"
            >
              <span
                class="relative flex h-10 w-10 shrink-0 overflow-hidden aspect-square bg-background theme-border rounded-full"
              >
                <span
                  class="flex h-full w-full items-center justify-center bg-inherit"
                >
                  <svg
                    class="text-primary/30 w-[80%] h-[80%]"
                  >
                    <use
                      href="/src/components/Icon/Icon.sprites.svg#crypto-punk"
                    />
                  </svg>
                </span>
              </span>
              <div
                class="text-base font-normal relative z-10 identity-tag transition-colors duration-200 text-secondary/70"
              >
                Alice
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
              class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-md text-base [&>span]:h-7 [&>span]:w-7 relative z-10 identity-tag transition-colors duration-200 border-theme"
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
                likes
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
              class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-md text-base [&>span]:h-7 [&>span]:w-7 relative z-10 identity-tag transition-colors duration-200 border-theme"
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
                pizza
              </div>
            </button>
          </div>
        </div>
      </DocumentFragment>
    `)
  })

  it('should render in disabled state', () => {
    const { asFragment } = render(<Claim {...defaultProps} disabled />)
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="flex items-center w-full max-w-max relative max-sm:flex-col max-sm:m-auto transition-colors duration-200 flex-row"
        >
          <div>
            <button
              class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-full [&>span]:rounded-full [&>span]:overflow-hidden text-base [&>span]:h-7 [&>span]:w-7 disabled:opacity-50 cursor-not-allowed relative z-10 identity-tag transition-colors duration-200 border-theme"
              disabled=""
            >
              <span
                class="relative flex h-10 w-10 shrink-0 overflow-hidden aspect-square bg-background theme-border rounded-full"
              >
                <span
                  class="flex h-full w-full items-center justify-center bg-inherit"
                >
                  <svg
                    class="text-primary/30 w-[80%] h-[80%]"
                  >
                    <use
                      href="/src/components/Icon/Icon.sprites.svg#crypto-punk"
                    />
                  </svg>
                </span>
              </span>
              <div
                class="text-base font-normal relative z-10 identity-tag transition-colors duration-200 text-secondary/70"
              >
                Alice
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
              class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-md text-base [&>span]:h-7 [&>span]:w-7 disabled:opacity-50 cursor-not-allowed relative z-10 identity-tag transition-colors duration-200 border-theme"
              disabled=""
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
                likes
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
              class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-md text-base [&>span]:h-7 [&>span]:w-7 disabled:opacity-50 cursor-not-allowed relative z-10 identity-tag transition-colors duration-200 border-theme"
              disabled=""
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
                pizza
              </div>
            </button>
          </div>
        </div>
      </DocumentFragment>
    `)
  })

  it('should render with different sizes', () => {
    const { asFragment: smFragment } = render(
      <Claim {...defaultProps} size="xl" />,
    )
    expect(smFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="flex items-center w-full max-w-max relative max-sm:flex-col max-sm:m-auto transition-colors duration-200 flex-row"
        >
          <div>
            <button
              class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-full [&>span]:rounded-full [&>span]:overflow-hidden text-xl [&>span]:h-11 [&>span]:w-11 relative z-10 identity-tag transition-colors duration-200 border-theme"
              data-state="closed"
            >
              <span
                class="relative flex h-10 w-10 shrink-0 overflow-hidden aspect-square bg-background theme-border rounded-full"
              >
                <span
                  class="flex h-full w-full items-center justify-center bg-inherit"
                >
                  <svg
                    class="text-primary/30 w-[80%] h-[80%]"
                  >
                    <use
                      href="/src/components/Icon/Icon.sprites.svg#crypto-punk"
                    />
                  </svg>
                </span>
              </span>
              <div
                class="text-base font-normal relative z-10 identity-tag transition-colors duration-200 text-secondary/70"
              >
                Alice
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
              class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-md text-xl [&>span]:h-11 [&>span]:w-11 relative z-10 identity-tag transition-colors duration-200 border-theme"
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
                likes
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
              class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-md text-xl [&>span]:h-11 [&>span]:w-11 relative z-10 identity-tag transition-colors duration-200 border-theme"
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
                pizza
              </div>
            </button>
          </div>
        </div>
      </DocumentFragment>
    `)

    const { asFragment: lgFragment } = render(
      <Claim {...defaultProps} size="lg" />,
    )
    expect(lgFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="flex items-center w-full max-w-max relative max-sm:flex-col max-sm:m-auto transition-colors duration-200 flex-row"
        >
          <div>
            <button
              class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-full [&>span]:rounded-full [&>span]:overflow-hidden text-lg [&>span]:h-8 [&>span]:w-8 relative z-10 identity-tag transition-colors duration-200 border-theme"
              data-state="closed"
            >
              <span
                class="relative flex h-10 w-10 shrink-0 overflow-hidden aspect-square bg-background theme-border rounded-full"
              >
                <span
                  class="flex h-full w-full items-center justify-center bg-inherit"
                >
                  <svg
                    class="text-primary/30 w-[80%] h-[80%]"
                  >
                    <use
                      href="/src/components/Icon/Icon.sprites.svg#crypto-punk"
                    />
                  </svg>
                </span>
              </span>
              <div
                class="text-base font-normal relative z-10 identity-tag transition-colors duration-200 text-secondary/70"
              >
                Alice
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
              class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-md text-lg [&>span]:h-8 [&>span]:w-8 relative z-10 identity-tag transition-colors duration-200 border-theme"
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
                likes
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
              class="theme-border font-medium py-0.5 pl-0.5 pr-2 hover:bg-primary/10 disabled:pointer-events-none flex gap-2 items-center text-secondary/70 hover:text-secondary rounded-md text-lg [&>span]:h-8 [&>span]:w-8 relative z-10 identity-tag transition-colors duration-200 border-theme"
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
                pizza
              </div>
            </button>
          </div>
        </div>
      </DocumentFragment>
    `)
  })
})
