import React from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Icon } from '..'
import { Button, ButtonSize, ButtonVariant } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Displays a button or a component that looks like a button.',
      },
    },
    controls: {
      exclude: ['className', 'style', 'asChild'],
    },
  },
  argTypes: {
    children: {
      description: 'Button label',
      table: {
        type: { summary: 'string' },
      },
      control: 'text',
    },
    variant: {
      description: 'Variant of button',
      options: Object.values(ButtonVariant),
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
      control: 'select',
    },
    size: {
      description: 'Size of button',
      options: Object.values(ButtonSize),
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
      control: 'select',
    },
    isLoading: {
      description: 'Variant of button',
      table: {
        type: { summary: 'boolean' },
      },
      control: 'boolean',
    },
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const BasicUsage: Story = {
  args: {
    children: 'I am a button',
  },
  render: (props) => <Button {...props} />,
}

export const Primary: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button {...props}>Default</Button>
      <Button size="md" {...props}>
        Medium
      </Button>
      <Button size="lg" {...props}>
        Large
      </Button>
      <Button size="xl" {...props}>
        Extra Large
      </Button>
      <Button {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button isLoading {...props}>
        Loading...
      </Button>
      <Button disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const Secondary: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="secondary" {...props}>
        Default
      </Button>
      <Button variant="secondary" size="md" {...props}>
        Medium
      </Button>
      <Button variant="secondary" size="lg" {...props}>
        Large
      </Button>
      <Button variant="secondary" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="secondary" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="secondary" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="secondary" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const Ghost: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="ghost" {...props}>
        Default
      </Button>
      <Button variant="ghost" size="md" {...props}>
        Medium
      </Button>
      <Button variant="ghost" size="lg" {...props}>
        Large
      </Button>
      <Button variant="ghost" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="ghost" aria-selected {...props}>
        Selected
      </Button>
      <Button variant="ghost" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="ghost" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="ghost" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const Text: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="text" {...props}>
        Default
      </Button>
      <Button variant="text" size="md" {...props}>
        Medium
      </Button>
      <Button variant="text" size="lg" {...props}>
        Large
      </Button>
      <Button variant="text" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="text" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="text" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="text" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const Accent: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="accent" {...props}>
        Default
      </Button>
      <Button variant="accent" size="md" {...props}>
        Medium
      </Button>
      <Button variant="accent" size="lg" {...props}>
        Large
      </Button>
      <Button variant="accent" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="accent" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="accent" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="accent" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const Warning: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="warning" {...props}>
        Default
      </Button>
      <Button variant="warning" size="md" {...props}>
        Medium
      </Button>
      <Button variant="warning" size="lg" {...props}>
        Large
      </Button>
      <Button variant="warning" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="warning" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="warning" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="warning" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const Success: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="success" {...props}>
        Default
      </Button>
      <Button variant="success" size="md" {...props}>
        Medium
      </Button>
      <Button variant="success" size="lg" {...props}>
        Large
      </Button>
      <Button variant="success" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="success" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="success" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="success" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const Destructive: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="destructive" {...props}>
        Default
      </Button>
      <Button variant="destructive" size="md" {...props}>
        Medium
      </Button>
      <Button variant="destructive" size="lg" {...props}>
        Large
      </Button>
      <Button variant="destructive" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="destructive" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="destructive" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="destructive" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const For: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="for" {...props}>
        Default
      </Button>
      <Button variant="for" size="md" {...props}>
        Medium
      </Button>
      <Button variant="for" size="lg" {...props}>
        Large
      </Button>
      <Button variant="for" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="for" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="for" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="for" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const Against: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="against" {...props}>
        Default
      </Button>
      <Button variant="against" size="md" {...props}>
        Medium
      </Button>
      <Button variant="against" size="lg" {...props}>
        Large
      </Button>
      <Button variant="against" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="against" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="against" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="against" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const AccentOutline: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="accentOutline" {...props}>
        Default
      </Button>
      <Button variant="accentOutline" size="md" {...props}>
        Medium
      </Button>
      <Button variant="accentOutline" size="lg" {...props}>
        Large
      </Button>
      <Button variant="accentOutline" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="accentOutline" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="accentOutline" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="accentOutline" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const WarningOutline: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="warningOutline" {...props}>
        Default
      </Button>
      <Button variant="warningOutline" size="md" {...props}>
        Medium
      </Button>
      <Button variant="warningOutline" size="lg" {...props}>
        Large
      </Button>
      <Button variant="warningOutline" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="warningOutline" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="warningOutline" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="warningOutline" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const SuccessOutline: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="successOutline" {...props}>
        Default
      </Button>
      <Button variant="successOutline" size="md" {...props}>
        Medium
      </Button>
      <Button variant="successOutline" size="lg" {...props}>
        Large
      </Button>
      <Button variant="successOutline" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="successOutline" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="successOutline" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="successOutline" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const DestructiveOutline: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="destructiveOutline" {...props}>
        Default
      </Button>
      <Button variant="destructiveOutline" size="md" {...props}>
        Medium
      </Button>
      <Button variant="destructiveOutline" size="lg" {...props}>
        Large
      </Button>
      <Button variant="destructiveOutline" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="destructiveOutline" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="destructiveOutline" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="destructiveOutline" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const Navigation: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button variant="navigation" {...props}>
        Default
      </Button>
      <Button variant="navigation" size="md" {...props}>
        Medium
      </Button>
      <Button variant="navigation" size="lg" {...props}>
        Large
      </Button>
      <Button variant="navigation" size="xl" {...props}>
        Extra Large
      </Button>
      <Button variant="navigation" aria-selected {...props}>
        Selected
      </Button>
      <Button variant="navigation" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="navigation" isLoading {...props}>
        Loading...
      </Button>
      <Button variant="navigation" disabled {...props}>
        Disabled
      </Button>
    </div>
  ),
}

export const IconSizes: Story = {
  parameters: {
    controls: {
      disable: true,
    },
  },
  render: (props) => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Button size="icon" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="secondary" size="iconMd" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="ghost" size="iconLg" {...props}>
        <Icon name="crystal-ball" />
      </Button>
      <Button variant="accent" size="iconXl" {...props}>
        <Icon name="crystal-ball" />
      </Button>
    </div>
  ),
}
