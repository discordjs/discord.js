import type { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section.jsx';

export default {
	title: 'Section',
	component: Section,
	tags: ['autodocs'],
} satisfies Meta<typeof Section>;

type Story = StoryObj<typeof Section>;

export const Default = {
	render: () => <Section title="Test">Test Content</Section>,
} satisfies Story;
