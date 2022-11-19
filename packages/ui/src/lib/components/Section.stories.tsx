import type { Story } from '@ladle/react';
import type { PropsWithChildren } from 'react';
import { Section, type SectionOptions } from './Section.jsx';

export const Default = () => <Section title="Test">Test 1234</Section>;

export const Padded = () => (
	<Section padded title="Test">
		Test 1234
	</Section>
);

export const Background = () => (
	<Section background title="Test">
		Test 1234
	</Section>
);

export const Dense = () => (
	<Section dense title="Test">
		Test 1234
	</Section>
);

export const Gutter = () => (
	<Section gutter title="Test">
		Test 1234
	</Section>
);

export const Playground: Story<PropsWithChildren<SectionOptions>> = ({
	title,
	background,
	defaultClosed,
	dense,
	gutter,
	padded,
}: PropsWithChildren<SectionOptions>) => (
	<Section
		background={background}
		defaultClosed={defaultClosed}
		dense={dense}
		gutter={gutter}
		padded={padded}
		title={title}
	>
		Test 1234
	</Section>
);

Playground.args = {
	title: 'Test',
	background: true,
	defaultClosed: false,
	dense: false,
	gutter: true,
	padded: true,
};
