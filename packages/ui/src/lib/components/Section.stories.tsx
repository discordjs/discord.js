import type { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section.jsx';

export default {
	title: 'Section',
	component: Section,
	tags: ['autodocs'],
} satisfies Meta<typeof Section>;

type Story = StoryObj<typeof Section>;

export const Default = {
	render: ({ children, ...args }) => <Section {...args}>{children}</Section>,
	args: {
		title: 'Test',
		children: 'Test Content',
	},
} satisfies Story;
