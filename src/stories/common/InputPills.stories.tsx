import { type Meta, type StoryObj } from '@storybook/react';

import InputPills from '~v5/common/Fields/Input/partials/InputPills.tsx';

const meta: Meta<typeof InputPills> = {
  title: 'Common/Pills/Input pills',
  component: InputPills,
  argTypes: {
    status: {
      name: 'status',
      options: ['success', 'error', 'warn'],
      control: {
        type: 'select',
      },
    },
    message: {
      name: 'message',
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputPills>;

export const Success: Story = {
  args: {
    status: 'success',
    message: 'Response received successfully',
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    message: 'Response failed. Check details and try again',
  },
};

export const Warning: Story = {
  args: {
    status: 'warn',
    message: 'Response timed out',
  },
};
