import { render } from '@testing-library/react'

import { TagsListInput } from './TagsListInput'

describe('TagsListInput', () => {
  const tags = [
    { name: 'Tag Name 1', id: '1' },
    { name: 'Tag Name 2', id: '2' },
    { name: 'Tag Name 3', id: '3' },
  ]

  it('should render appropriate element for tags variant', () => {
    const { asFragment } = render(
      <TagsListInput
        variant="tag"
        tags={tags}
        maxTags={5}
        onAddTag={() => {}}
        onRemoveTag={() => {}}
      />,
    )
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="w-full"
        >
          <div
            class="flex flex-wrap gap-2.5 items-center"
          >
            <button
              class="gap-1 rounded-full px-2 py-0.5 border disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground bg-primary/10 text-primary/90 border-primary/20 hover:bg-primary/20 hover:text-primary hover:border-primary/40 text-base font-normal flex items-center cursor-default pl-2"
            >
              <div
                class="flex flex-row gap-1.5 items-center"
              >
                <div
                  class="text-primary text-base font-normal px-0.5"
                >
                  Tag Name 1
                </div>
              </div>
            </button>
            <button
              aria-label="Remove tag"
              class="ml-1 cursor-pointer"
            >
              <svg
                class="h-3 w-3"
              >
                <use
                  href="/src/components/Icon/Icon.sprites.svg#cross-large"
                />
              </svg>
            </button>
          </div>
          <button
            class="gap-1 rounded-full px-2 py-0.5 border disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground bg-primary/10 text-primary/90 border-primary/20 hover:bg-primary/20 hover:text-primary hover:border-primary/40 text-base font-normal flex items-center cursor-default pl-2"
          >
            <div
              class="flex flex-row gap-1.5 items-center"
            >
              <div
                class="text-primary text-base font-normal px-0.5"
              >
                Tag Name 2
              </div>
            </div>
          </button>
          <button
            aria-label="Remove tag"
            class="ml-1 cursor-pointer"
          >
            <svg
              class="h-3 w-3"
            >
              <use
                href="/src/components/Icon/Icon.sprites.svg#cross-large"
              />
            </svg>
          </button>
        </div>
        <button
          class="gap-1 rounded-full px-2 py-0.5 border disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground bg-primary/10 text-primary/90 border-primary/20 hover:bg-primary/20 hover:text-primary hover:border-primary/40 text-base font-normal flex items-center cursor-default pl-2"
        >
          <div
            class="flex flex-row gap-1.5 items-center"
          >
            <div
              class="text-primary text-base font-normal px-0.5"
            >
              Tag Name 3
            </div>
          </div>
        </button>
        <button
          aria-label="Remove tag"
          class="ml-1 cursor-pointer"
        >
          <svg
            class="h-3 w-3"
          >
            <use
              href="/src/components/Icon/Icon.sprites.svg#cross-large"
            />
          </svg>
        </button>
        <div
          class="flex items-center gap-2"
        >
          <button
            class="flex justify-center items-center gap-2 text-sm font-medium border disabled:bg-muted aria-disabled:bg-muted disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none primary-gradient-subtle text-primary/60 border-primary/10 hover:text-primary disabled:from-muted aria-disabled:from-muted disabled:to-muted aria-disabled:to-muted shadow-md-subtle rounded-full px-2 mr-1"
          >
            <svg
              class="h-6 w-6"
            >
              <use
                href="/src/components/Icon/Icon.sprites.svg#plus-small"
              />
            </svg>
          </button>
          <div
            class="text-sm font-normal text-secondary-foreground"
          >
            2 tags left
          </div>
        </div>
      </DocumentFragment>
    `)
  })

  it('should render appropriate element for empty state', () => {
    const { asFragment } = render(
      <TagsListInput
        variant="tag"
        tags={[]}
        maxTags={5}
        onAddTag={() => {}}
        onRemoveTag={() => {}}
      />,
    )
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="w-full"
        >
          <div
            class="flex flex-wrap gap-2.5 items-center"
          >
            <div
              class="flex items-center gap-2"
            >
              <button
                class="flex justify-center items-center gap-2 text-sm font-medium border disabled:bg-muted aria-disabled:bg-muted disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none primary-gradient-subtle text-primary/60 border-primary/10 hover:text-primary disabled:from-muted aria-disabled:from-muted disabled:to-muted aria-disabled:to-muted shadow-md-subtle rounded-full px-2 mr-1"
              >
                <svg
                  class="h-6 w-6"
                >
                  <use
                    href="/src/components/Icon/Icon.sprites.svg#plus-small"
                  />
                </svg>
              </button>
              <div
                class="text-sm font-normal text-secondary-foreground"
              >
                Filter by up to 5 tags
              </div>
            </div>
          </div>
        </div>
      </DocumentFragment>
    `)
  })

  it('should render appropriate element for trustCircles variant', () => {
    const { asFragment } = render(
      <TagsListInput
        variant="trustCircle"
        tags={tags}
        maxTags={3}
        onAddTag={() => {}}
        onRemoveTag={() => {}}
      />,
    )
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="w-full"
        >
          <div
            class="flex flex-wrap gap-2.5 items-center"
          >
            <button
              class="gap-1 rounded-full px-2 py-0.5 border disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground bg-social/10 text-social/90 border-social/40 hover:bg-social/30 hover:text-social hover:border-social/60 text-base font-normal flex items-center cursor-default pl-2"
            >
              <div
                class="flex flex-row gap-1.5 items-center"
              >
                <div
                  class="text-primary text-base font-normal px-0.5"
                >
                  Tag Name 1
                </div>
              </div>
            </button>
            <button
              aria-label="Remove tag"
              class="ml-1 cursor-pointer"
            >
              <svg
                class="h-3 w-3"
              >
                <use
                  href="/src/components/Icon/Icon.sprites.svg#cross-large"
                />
              </svg>
            </button>
          </div>
          <button
            class="gap-1 rounded-full px-2 py-0.5 border disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground bg-social/10 text-social/90 border-social/40 hover:bg-social/30 hover:text-social hover:border-social/60 text-base font-normal flex items-center cursor-default pl-2"
          >
            <div
              class="flex flex-row gap-1.5 items-center"
            >
              <div
                class="text-primary text-base font-normal px-0.5"
              >
                Tag Name 2
              </div>
            </div>
          </button>
          <button
            aria-label="Remove tag"
            class="ml-1 cursor-pointer"
          >
            <svg
              class="h-3 w-3"
            >
              <use
                href="/src/components/Icon/Icon.sprites.svg#cross-large"
              />
            </svg>
          </button>
        </div>
        <button
          class="gap-1 rounded-full px-2 py-0.5 border disabled:bg-muted disabled:text-muted-foreground disabled:border-muted-foreground bg-social/10 text-social/90 border-social/40 hover:bg-social/30 hover:text-social hover:border-social/60 text-base font-normal flex items-center cursor-default pl-2"
        >
          <div
            class="flex flex-row gap-1.5 items-center"
          >
            <div
              class="text-primary text-base font-normal px-0.5"
            >
              Tag Name 3
            </div>
          </div>
        </button>
        <button
          aria-label="Remove tag"
          class="ml-1 cursor-pointer"
        >
          <svg
            class="h-3 w-3"
          >
            <use
              href="/src/components/Icon/Icon.sprites.svg#cross-large"
            />
          </svg>
        </button>
        <div
          class="flex items-center gap-2"
        >
          <button
            class="flex justify-center items-center gap-2 text-sm font-medium border disabled:bg-muted aria-disabled:bg-muted disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none primary-gradient-subtle text-primary/60 border-primary/10 hover:text-primary disabled:from-muted aria-disabled:from-muted disabled:to-muted aria-disabled:to-muted shadow-md-subtle rounded-full px-2 mr-1"
          >
            <svg
              class="h-6 w-6"
            >
              <use
                href="/src/components/Icon/Icon.sprites.svg#plus-small"
              />
            </svg>
          </button>
          <div
            class="text-sm font-normal text-secondary-foreground"
          >
            0 trust circles left
          </div>
        </div>
      </DocumentFragment>
    `)
  })

  it('should render appropriate element for empty state in trustCircles variant', () => {
    const { asFragment } = render(
      <TagsListInput
        variant="trustCircle"
        tags={[]}
        maxTags={3}
        onAddTag={() => {}}
        onRemoveTag={() => {}}
      />,
    )
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="w-full"
        >
          <div
            class="flex flex-wrap gap-2.5 items-center"
          >
            <div
              class="flex items-center gap-2"
            >
              <button
                class="flex justify-center items-center gap-2 text-sm font-medium border disabled:bg-muted aria-disabled:bg-muted disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none primary-gradient-subtle text-primary/60 border-primary/10 hover:text-primary disabled:from-muted aria-disabled:from-muted disabled:to-muted aria-disabled:to-muted shadow-md-subtle rounded-full px-2 mr-1"
              >
                <svg
                  class="h-6 w-6"
                >
                  <use
                    href="/src/components/Icon/Icon.sprites.svg#plus-small"
                  />
                </svg>
              </button>
              <div
                class="text-sm font-normal text-secondary-foreground"
              >
                Filter by up to 3 trust circles
              </div>
            </div>
          </div>
        </div>
      </DocumentFragment>
    `)
  })
})
