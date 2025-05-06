'use client';

import { VscChevronDown } from '@react-icons/all-files/vsc/VscChevronDown';
import { Disclosure, DisclosureContent, useDisclosureState } from 'ariakit/disclosure';
import type { JSX, PropsWithChildren } from 'react';

export interface SectionOptions {
	readonly background?: boolean | undefined;
	readonly buttonClassName?: string;
	readonly className?: string;
	readonly defaultClosed?: boolean | undefined;
	readonly gutter?: boolean | undefined;
	readonly icon?: JSX.Element | undefined;
	readonly padded?: boolean | undefined;
	readonly title: string;
}

export function Section({
	title,
	icon,
	padded = false,
	defaultClosed = false,
	background = false,
	gutter = false,
	children,
	className = '',
	buttonClassName = '',
}: PropsWithChildren<SectionOptions>) {
	const disclosure = useDisclosureState({ defaultOpen: !defaultClosed });

	return (
		<div className={`flex flex-col ${className}`}>
			<Disclosure
				className={
					buttonClassName
						? buttonClassName
						: 'hover:bg-light-800 active:bg-light-900 dark:bg-dark-400 dark:hover:bg-dark-300 dark:active:bg-dark-200 focus:ring-width-2 focus:ring-blurple rounded bg-white p-3 outline-none focus:ring'
				}
				state={disclosure}
			>
				<div className="flex flex-row place-content-between place-items-center">
					<div className="flex flex-row place-items-center gap-3">
						{icon ?? null}
						<span className="font-semibold">{title}</span>
					</div>
					<VscChevronDown
						className={`transform transition duration-150 ease-in-out ${disclosure.open ? 'rotate-180' : 'rotate-0'}`}
						size={20}
					/>
				</div>
			</Disclosure>
			<DisclosureContent
				className={`${background ? 'bg-light-700 dark:bg-dark-500 rounded' : ''} ${gutter ? 'mt-2' : ''}`}
				state={disclosure}
			>
				{padded ? <div className="mx-2 px-0 py-5 md:mx-6.5 md:px-4.5">{children}</div> : children}
			</DisclosureContent>
		</div>
	);
}
