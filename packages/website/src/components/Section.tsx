import type { ReactNode } from 'react';
import { Separator } from './Seperator';

export interface SectionProps {
	children: ReactNode;
	title: string;
	className?: string | undefined;
}

export function Section({ title, children, className }: SectionProps) {
	return (
		<div className={className}>
			<h2>{title}</h2>
			{children}
			<Separator />
		</div>
	);
}
