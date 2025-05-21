import { render } from '@testing-library/react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPageCounter,
  PaginationPrevious,
  PaginationRowSelection,
  PaginationSummary,
} from './Pagination'

describe('Pagination', () => {
  it('should render appropriate elements for typical setup', () => {
    const { asFragment } = render(
      <Pagination>
        <PaginationSummary totalEntries={100} label="users" />
        <div className="flex">
          <PaginationRowSelection defaultValue={'10'} />
          <PaginationPageCounter currentPage={1} totalPages={10} />
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst href="#" disabled />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious href="#" disabled />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast href="#" />
            </PaginationItem>
          </PaginationContent>
        </div>
      </Pagination>,
    )
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <nav
          aria-label="pagination"
          class="mx-auto flex w-full justify-center"
          role="navigation"
        >
          <div
            class="text-sm font-normal self-center text-foreground/70"
          >
            100 users found
          </div>
          <div
            class="flex"
          >
            <div
              class="self-center px-4 flex gap-4 justify-center items-center"
            >
              <div
                class="text-sm font-normal text-foreground/70"
              >
                Rows per page
              </div>
              <button
                aria-autocomplete="none"
                aria-controls="radix-:r0:"
                aria-expanded="false"
                class="flex items-center justify-between rounded-md theme-border primary-gradient-subtle px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 hover:bg-primary/5 w-max h-8 gap-2"
                data-state="closed"
                dir="ltr"
                role="combobox"
                type="button"
              >
                <span
                  style="pointer-events: none;"
                >
                  10
                </span>
                <svg
                  class="h-4 w-4"
                >
                  <use
                    href="/src/components/Icon/Icon.sprites.svg#chevron-grabber-vertical"
                  />
                </svg>
              </button>
            </div>
            <div
              class="text-sm font-normal self-center px-4 text-foreground/70"
            >
              Page 1 of 10
            </div>
            <ul
              class="flex flex-row items-center gap-2 h-max"
            >
              <li
                class="flex h-8"
              >
                <a
                  aria-label="Go to first page"
                  class="items-center gap-2 text-sm font-medium border disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none bg-gradient-to-b from-transparent to-transparent rounded-lg hover:text-primary hover:border-primary disabled:bg-transparent aria-disabled:bg-transparent aria-selected:primary-gradient-subtle aria-selected:border-primary/10 shadow-md-subtle p-1 min-w-8 flex justify-center hover:cursor-pointer bg-transparent text-muted-foreground border-muted pointer-events-none"
                  href="#"
                >
                  <svg
                    class="h-5 w-5"
                  >
                    <use
                      href="/src/components/Icon/Icon.sprites.svg#chevron-double-left"
                    />
                  </svg>
                </a>
              </li>
              <li
                class="flex h-8"
              >
                <a
                  aria-label="Go to previous page"
                  class="items-center gap-2 text-sm font-medium border disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none bg-gradient-to-b from-transparent to-transparent rounded-lg hover:text-primary hover:border-primary disabled:bg-transparent aria-disabled:bg-transparent aria-selected:primary-gradient-subtle aria-selected:border-primary/10 shadow-md-subtle p-1 min-w-8 flex justify-center hover:cursor-pointer bg-transparent text-muted-foreground border-muted pointer-events-none"
                  href="#"
                >
                  <svg
                    class="h-5 w-5"
                  >
                    <use
                      href="/src/components/Icon/Icon.sprites.svg#chevron-left-small"
                    />
                  </svg>
                </a>
              </li>
              <li
                class="flex h-8"
              >
                <a
                  aria-label="Go to next page"
                  class="items-center gap-2 text-sm font-medium border disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none bg-gradient-to-b from-transparent to-transparent text-primary/70 border-primary/50 rounded-lg hover:text-primary hover:border-primary disabled:bg-transparent aria-disabled:bg-transparent aria-selected:primary-gradient-subtle aria-selected:border-primary/10 shadow-md-subtle p-1 min-w-8 flex justify-center hover:cursor-pointer"
                  href="#"
                >
                  <svg
                    class="h-5 w-5"
                  >
                    <use
                      href="/src/components/Icon/Icon.sprites.svg#chevron-right-small"
                    />
                  </svg>
                </a>
              </li>
              <li
                class="flex h-8"
              >
                <a
                  aria-label="Go to last page"
                  class="items-center gap-2 text-sm font-medium border disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none bg-gradient-to-b from-transparent to-transparent text-primary/70 border-primary/50 rounded-lg hover:text-primary hover:border-primary disabled:bg-transparent aria-disabled:bg-transparent aria-selected:primary-gradient-subtle aria-selected:border-primary/10 shadow-md-subtle p-1 min-w-8 flex justify-center hover:cursor-pointer"
                  href="#"
                >
                  <svg
                    class="h-5 w-5"
                  >
                    <use
                      href="/src/components/Icon/Icon.sprites.svg#chevron-double-right"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </DocumentFragment>
    `)
  })
  it('should render appropriate elements for alternate setup', () => {
    const { asFragment } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" disabled />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    )
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <nav
          aria-label="pagination"
          class="mx-auto flex w-full justify-center"
          role="navigation"
        >
          <ul
            class="flex flex-row items-center gap-2 h-max"
          >
            <li
              class="flex h-8"
            >
              <a
                aria-label="Go to previous page"
                class="items-center gap-2 text-sm font-medium border disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none bg-gradient-to-b from-transparent to-transparent rounded-lg hover:text-primary hover:border-primary disabled:bg-transparent aria-disabled:bg-transparent aria-selected:primary-gradient-subtle aria-selected:border-primary/10 shadow-md-subtle p-1 min-w-8 flex justify-center hover:cursor-pointer bg-transparent text-muted-foreground border-muted pointer-events-none"
                href="#"
              >
                <svg
                  class="h-5 w-5"
                >
                  <use
                    href="/src/components/Icon/Icon.sprites.svg#chevron-left-small"
                  />
                </svg>
              </a>
            </li>
            <li
              class="flex h-8"
            >
              <a
                aria-current="page"
                aria-selected="true"
                class="items-center gap-2 text-sm font-medium border disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none bg-gradient-to-b from-transparent to-transparent text-primary/70 border-primary/50 rounded-lg hover:text-primary hover:border-primary disabled:bg-transparent aria-disabled:bg-transparent aria-selected:primary-gradient-subtle aria-selected:border-primary/10 shadow-md-subtle p-1 min-w-8 flex justify-center hover:cursor-pointer"
                href="#"
              >
                1
              </a>
            </li>
            <li
              class="flex h-8"
            >
              <a
                class="items-center gap-2 text-sm font-medium border disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none bg-gradient-to-b from-transparent to-transparent text-primary/70 border-primary/50 rounded-lg hover:text-primary hover:border-primary disabled:bg-transparent aria-disabled:bg-transparent aria-selected:primary-gradient-subtle aria-selected:border-primary/10 shadow-md-subtle p-1 min-w-8 flex justify-center hover:cursor-pointer"
                href="#"
              >
                2
              </a>
            </li>
            <li
              class="flex h-8"
            >
              <a
                class="items-center gap-2 text-sm font-medium border disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none bg-gradient-to-b from-transparent to-transparent text-primary/70 border-primary/50 rounded-lg hover:text-primary hover:border-primary disabled:bg-transparent aria-disabled:bg-transparent aria-selected:primary-gradient-subtle aria-selected:border-primary/10 shadow-md-subtle p-1 min-w-8 flex justify-center hover:cursor-pointer"
                href="#"
              >
                3
              </a>
            </li>
            <li
              class="flex h-8"
            >
              <span
                aria-hidden="true"
                class="flex w-6 h-5 items-center justify-center"
              >
                <div
                  class="text-primary text-lg font-normal"
                >
                  ...
                </div>
                <span
                  class="sr-only"
                >
                  More pages
                </span>
              </span>
            </li>
            <li
              class="flex h-8"
            >
              <a
                aria-label="Go to next page"
                class="items-center gap-2 text-sm font-medium border disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none bg-gradient-to-b from-transparent to-transparent text-primary/70 border-primary/50 rounded-lg hover:text-primary hover:border-primary disabled:bg-transparent aria-disabled:bg-transparent aria-selected:primary-gradient-subtle aria-selected:border-primary/10 shadow-md-subtle p-1 min-w-8 flex justify-center hover:cursor-pointer"
                href="#"
              >
                <svg
                  class="h-5 w-5"
                >
                  <use
                    href="/src/components/Icon/Icon.sprites.svg#chevron-right-small"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </DocumentFragment>
    `)
  })
})
