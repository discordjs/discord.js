import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode, useState } from 'react';
import { VscChevronDown, VscChevronRight } from 'react-icons/vsc';
import { Separator } from './Seperator';

export interface SectionProps {
	children: ReactNode;
	title: string;
	className?: string | undefined;
	defaultClosed?: boolean;
}

export function Section({ title, children, className, defaultClosed }: SectionProps) {
	const [collapsed, setCollapsed] = useState(defaultClosed ?? false);

	return (
		<div className={className}>
			<AnimatePresence initial={false}>
				<h3 className="-ml-4 flex whitespace-pre-wrap pl-4 font-semibold dark:text-white">
					<div onClick={() => setCollapsed(!collapsed)}>
						{collapsed ? <VscChevronRight className="mr-2" size={20} /> : <VscChevronDown className="mr-2" size={20} />}
					</div>

					{title}
				</h3>
				{!collapsed && (
					<motion.div
						transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
						key="content"
						initial="collapsed"
						animate="open"
						exit="collapsed"
						variants={{
							open: { opacity: 1, height: 'auto' },
							collapsed: { opacity: 0, height: 0 },
						}}
					>
						<div className="pb-5">{children}</div>
					</motion.div>
				)}
				<Separator />
			</AnimatePresence>
		</div>
	);
}
