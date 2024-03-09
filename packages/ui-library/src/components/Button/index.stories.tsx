import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '.'

const meta = {
  title: 'Button/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
}
