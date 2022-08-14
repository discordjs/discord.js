import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode, useState } from 'react';
import { VscChevronDown, VscChevronRight } from 'react-icons/vsc';
import { Separator } from './Seperator';

export interface SectionProps {
	children: ReactNode;
	title: string;
	className?: string | undefined;
	defaultClosed?: boolean;
	iconElement?: JSX.Element;
	showSeparator?: boolean;
	margin?: boolean;
}

export function Section({
	title,
	children,
	className,
	defaultClosed,
	iconElement,
	showSeparator = true,
	margin = true,
}: SectionProps) {
	const [collapsed, setCollapsed] = useState(defaultClosed ?? false);

	return (
		<div className={className}>
			<h3
				className="flex gap-2 whitespace-pre-wrap font-semibold dark:text-white cursor-pointer"
				onClick={() => setCollapsed(!collapsed)}
			>
				{collapsed ? <VscChevronRight size={20} /> : <VscChevronDown size={20} />}
				{iconElement ?? null}
				{title}
			</h3>
			<AnimatePresence initial={false} exitBeforeEnter>
				{collapsed ? null : (
					<>
						<motion.div
							transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
							key="content"
							initial="collapsed"
							animate="open"
							exit="collapsed"
							variants={{
								open: {
									opacity: 1,
									height: 'auto',
									paddingLeft: '1.75rem',
									paddingRight: '1.75rem',
									marginBottom: margin ? '1.25rem' : 0,
								},
								collapsed: {
									opacity: 0,
									height: 0,
									paddingLeft: '1.75rem',
									paddingRight: '1.75rem',
									paddingBottom: 0,
									marginBottom: 0,
								},
							}}
						>
							{children}
						</motion.div>
						{showSeparator && <Separator />}
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
