import React from 'react'

import { render } from '@testing-library/react'
import { Button } from 'components/Button'

import { ErrorStateCard } from './ErrorStateCard'

describe('EmptyStateCard', () => {
  it('should render appropriate element', () => {
    const { asFragment } = render(
      <ErrorStateCard message="An error occured">
        <Button size="md" onClick={() => console.log('Clicked')}>
          Add Stake
        </Button>
      </ErrorStateCard>,
    )
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="flex flex-col justify-center items-center p-6 theme-border border-destructive/50 rounded-lg min-h-52 w-full gap-4"
        >
          <svg
            class="w-12 h-12 text-destructive"
          >
            <use
              href="/src/components/Icon/Icon.sprites.svg#triangle-exclamation"
            />
          </svg>
          <div
            class="text-sm font-normal text-muted-foreground"
          >
            An error occured
          </div>
          <button
            class="flex justify-center items-center gap-2 text-sm font-medium border disabled:bg-muted aria-disabled:bg-muted disabled:text-muted-foreground aria-disabled:text-muted-foreground disabled:border-muted aria-disabled:border-muted aria-disabled:pointer-events-none bg-primary text-primary-foreground border-primary hover:bg-primary/80 rounded-full shadow-md-subtle px-4 py-1.5"
          >
            Add Stake
          </button>
        </div>
      </DocumentFragment>
    `)
  })
})
