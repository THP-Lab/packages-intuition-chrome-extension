import React from 'react'

import type { Meta, StoryObj } from '@storybook/react'
import { Transaction, TransactionStatus } from 'types'

import { TransactionStatusIndicator } from './TransactionStatusIndicator'

const meta: Meta<typeof TransactionStatusIndicator> = {
  title: 'Components/TransactionStatus/TransactionStatusIndicator',
  component: TransactionStatusIndicator,
  argTypes: {
    status: {
      description: 'Status of transaction',
      options: Object.values(TransactionStatus),
      table: {
        type: { summary: 'string' },
      },
      control: 'select',
    },
    type: {
      description: 'Type of transaction',
      options: Object.values(Transaction),
      table: {
        type: { summary: 'string' },
      },
      control: 'select',
    },
  },
}

export default meta

type Story = StoryObj<typeof TransactionStatusIndicator>

export const BasicUsage: Story = {
  args: {
    status: TransactionStatus.awaiting,
    type: Transaction.identity,
  },
  render: (args) => <TransactionStatusIndicator {...args} />,
}
