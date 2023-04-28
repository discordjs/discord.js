import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert.jsx';

export default {
	title: 'Alert',
	component: Alert,
	tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

type Story = StoryObj<typeof Alert>;

export const Default = {
	render: ({ children, ...args }) => <Alert {...args}>{children}</Alert>,
	args: {
		type: 'info',
		title: 'Test',
		children: 'Test Content',
	},
} satisfies Story;
