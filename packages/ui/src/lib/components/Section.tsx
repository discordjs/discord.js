import { Disclosure, DisclosureContent, useDisclosureState } from 'ariakit/disclosure';
import type { PropsWithChildren } from 'react';
import { VscChevronDown } from 'react-icons/vsc';

export interface SectionOptions {
	background?: boolean | undefined;
	defaultClosed?: boolean | undefined;
	dense?: boolean | undefined;
	gutter?: boolean | undefined;
	icon?: JSX.Element | undefined;
	padded?: boolean | undefined;
	title: string;
}

export function Section({
	title,
	icon,
	padded = false,
	dense = false,
	defaultClosed = false,
	background = false,
	gutter = false,
	children,
}: PropsWithChildren<SectionOptions>) {
	const disclosure = useDisclosureState({ defaultOpen: !defaultClosed });

	return (
		<div className="flex flex-col">
			<Disclosure
				className="bg-light-600 hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple rounded p-3 outline-0 focus:ring"
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
				{padded ? <div className={`py-5 ${dense ? 'mx-2 px-0' : 'px-4.5 mx-6.5'}`}>{children}</div> : children}
			</DisclosureContent>
		</div>
	);
}
