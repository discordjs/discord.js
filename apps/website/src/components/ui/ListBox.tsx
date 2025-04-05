'use client';

import { CheckIcon, MenuIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import type { ListBoxItemProps as RACListBoxItemProps, ListBoxProps as RACListBoxProps } from 'react-aria-components';
import { ListBoxItem as RACListBoxItem, ListBox as RACListBox, composeRenderProps } from 'react-aria-components';
import { DropdownLabel, DropdownSection, dropdownItemStyles } from '@/components/ui/Dropdown';
import { cx } from '@/styles/cva';

export function ListBox<Type extends object>(props: RACListBoxProps<Type>) {
	return (
		<RACListBox
			{...props}
			className={composeRenderProps(props.className, (className) =>
				cx(
					[
						'border-base-neutral-200 dark:border-base-neutral-600 shadow-base-sm flex max-h-96 w-full min-w-40 flex-col gap-x-1 overflow-y-auto rounded-sm border p-2 outline-hidden [scrollbar-width:thin]',
						"grid grid-cols-[1fr_auto] overflow-auto *:[[role='group']+[role=group]]:mt-4 *:[[role='group']+[role=separator]]:mt-1",
					],
					className,
				),
			)}
		/>
	);
}

export type ListBoxItemProps<Type extends object> = RACListBoxItemProps<Type> & {
	readonly className?: string;
};

export function ListBoxItem<Type extends object>(props: ListBoxItemProps<Type>) {
	const textValue = props.textValue ?? (typeof props.children === 'string' ? props.children : undefined);

	return (
		<RACListBoxItem
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				dropdownItemStyles({
					...renderProps,
					className,
				}),
			)}
			textValue={textValue!}
		>
			{({ allowsDragging, isSelected, isFocused, isDragging }) => (
				<>
					{allowsDragging && (
						<MenuIcon
							className={cx('size-4 shrink-0 transition', isFocused && '', isDragging && '', isSelected && '')}
							size={16}
						/>
					)}
					{isSelected && <CheckIcon className="-mx-0.5 mr-2" data-slot="checked-icon" size={16} />}
					{typeof props.children === 'string' ? <DropdownLabel>{props.children}</DropdownLabel> : props.children}
				</>
			)}
		</RACListBoxItem>
	);
}

export type ListBoxSectionProps = ComponentProps<typeof DropdownSection>;

export function ListBoxSection(props: ListBoxSectionProps) {
	return <DropdownSection {...props} className={cx(props.className, 'gap-1')} />;
}

export { DropdownItemDetails as ListBoxItemDetails } from '@/components/ui/Dropdown';
