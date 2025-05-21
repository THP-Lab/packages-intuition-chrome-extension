import React from 'react'

import type { Meta, StoryObj } from '@storybook/react'
import { Identity } from 'types'

import { IdentityTag, IdentityTagSize } from '.'

const meta: Meta<typeof IdentityTag> = {
  title: 'Components/Identity/IdentityTag',
  component: IdentityTag,
  argTypes: {
    variant: {
      description: 'Variant of component',
      options: Object.values(Identity),
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'user' },
      },
      control: 'select',
    },
    size: {
      description: 'Size of component',
      options: Object.values(IdentityTagSize),
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
      control: 'select',
    },
  },
}

export default meta

type Story = StoryObj<typeof IdentityTag>

export const BasicUsage: Story = {
  args: {
    variant: 'user',
    imgSrc:
      'https://m.media-amazon.com/images/M/MV5BNDhiMWYzMjgtNTRiYi00ZTA3LThlODctNDRkMDk0NzFkMWI3L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTg0MTkzMzA@._V1_.jpg',
    size: 'default',
    children: 'super dave',
    disabled: false,
  },
  render: (args) => <IdentityTag {...args} />,
}

export const NonUser: Story = {
  render: () => <IdentityTag variant="non-user">identity name</IdentityTag>,
}

export const HoverCard: Story = {
  render: () => (
    <div className="h-[200px]">
      <IdentityTag
        variant="user"
        hoverCardContent={
          <div>
            <p>Some more info...</p>
          </div>
        }
      >
        identity name
      </IdentityTag>
    </div>
  ),
}
