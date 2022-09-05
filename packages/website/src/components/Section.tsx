import { Disclosure, DisclosureContent, useDisclosureState } from 'ariakit/disclosure';
import type { PropsWithChildren } from 'react';
import { VscChevronDown } from 'react-icons/vsc';

export function Section({
	title,
	icon,
	padded = false,
	dense = false,
	defaultClosed = false,
	children,
}: PropsWithChildren<{
	defaultClosed?: boolean;
	dense?: boolean;
	icon?: JSX.Element;
	padded?: boolean;
	title: string;
}>) {
	const disclosure = useDisclosureState({ defaultOpen: !defaultClosed });

	return (
		<div>
			<Disclosure
				className="bg-light-600 hover:bg-light-700 active:bg-light-800 dark:bg-dark-600 dark:hover:bg-dark-500 dark:active:bg-dark-400 rounded p-3"
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
			<DisclosureContent state={disclosure}>
				{padded ? <div className={`py-5 ${dense ? 'mx-2 px-0' : 'px-4.5 mx-6.5'}`}>{children}</div> : children}
			</DisclosureContent>
		</div>
	);
}
