import React from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
}

export default meta

type Story = StoryObj<typeof Tabs>

export const BasicUsage: Story = {
  render: () => (
    <div className="w-[500px]">
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one" label="One" totalCount={69} />
          <TabsTrigger value="two" label="Two" totalCount={69} />
          <TabsTrigger disabled value="three" label="Three" totalCount={0} />
        </TabsList>
        <div className="bg-primary/10 p-4 rounded-lg">
          <TabsContent value="one">
            <p>One</p>
          </TabsContent>
          <TabsContent value="two">
            <p>Two</p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  ),
}

export const AlternateUsage: Story = {
  render: () => (
    <div className="w-[500px]">
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger variant="alternate" value="one" label="One" />
          <TabsTrigger variant="alternate" value="two" label="Two" />
          <TabsTrigger
            disabled
            variant="alternate"
            value="three"
            label="Three"
          />
        </TabsList>
        <div className="bg-primary/10 p-4 rounded-lg">
          <TabsContent value="one">
            <p>One</p>
          </TabsContent>
          <TabsContent value="two">
            <p>Two</p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  ),
}
