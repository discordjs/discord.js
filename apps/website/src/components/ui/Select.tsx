'use client';

import { ChevronDownIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import type {
	ListBoxProps as RACListBoxProps,
	SelectProps as RACSelectProps,
	ValidationResult as RACValidationResult,
} from 'react-aria-components';
import {
	Button as RACButton,
	Select as RACSelect,
	SelectValue as RACSelectValue,
	composeRenderProps,
} from 'react-aria-components';
import type { Button } from '@/components/ui/Button';
import { Description, FieldError, Label } from '@/components/ui/Field';
import { ListBox } from '@/components/ui/ListBox';
import { PopoverContent, type PopoverContentProps } from '@/components/ui/Popover';
import { compose, cva, cx } from '@/styles/cva';
import { focusRing } from '@/styles/ui/focusRing';
import { composeTailwindRenderProps } from '@/styles/util';

const selectTriggerStyles = compose(
	focusRing,
	cva({
		base: [
			'relative flex h-10 w-full place-items-center overflow-hidden rounded-sm border transition duration-200 ease-out forced-colors:outline-[Highlight]',
			'bg-base-neutral-0 border-base-neutral-300 dark:bg-base-neutral-800 dark:border-base-neutral-500',
			'hover:border-base-neutral-200 dark:hover:border-base-neutral-600',
			'focus-visible:border-base-neutral-200 dark:focus-visible:border-base-neutral-600',
			'group-open:border-base-neutral-200 dark:group-open:border-base-neutral-600 group-open:outline-2',
			'group-disabled:bg-base-neutral-100 group-disabled:border-base-neutral-100 dark:group-disabled:border-base-neutral-400 dark:group-disabled:bg-base-neutral-400 group-disabled:opacity-38 group-disabled:forced-colors:border group-disabled:forced-colors:border-[GrayText]',
			'group-invalid:border-base-sunset-500 forced-colors:group-invalid:border-[Mark]',
			'group-invalid:hover:border-base-sunset-200 dark:group-invalid:hover:border-base-sunset-700',
			'group-invalid:focus-visible:border-base-sunset-200 dark:group-invalid:focus-visible:border-base-sunset-700',
			'**:data-[slot=icon]:size-6 **:data-[slot=icon]:shrink-0 **:[button]:shrink-0',
			'[&>button:has([data-slot=icon])]:absolute [&>button:has([data-slot=icon]):first-child]:left-0 [&>button:has([data-slot=icon]):last-child]:right-0',
			'*:data-[slot=icon]:text-base-neutral-800 dark:*:data-[slot=icon]:text-base-neutral-100 *:data-[slot=icon]:pointer-events-none *:data-[slot=icon]:absolute *:data-[slot=icon]:top-[calc(var(--spacing)_*_1.7)] *:data-[slot=icon]:z-10 *:data-[slot=icon]:size-6',
			'[&>[data-slot=icon]:first-child]:left-2 [&>[data-slot=icon]:last-child]:right-2',
			'[&:has([data-slot=icon]+input)]:pl-7.5 [&:has(input+[data-slot=icon])]:pr-7.5',
			'[&:has([data-slot=icon]+[role=group])]:pl-7.5 [&:has([role=group]+[data-slot=icon])]:pr-7.5',
			'has-[[data-slot=icon]:last-child]:[&_input]:pr-7.5',
			'*:[button]:size-6 *:[button]:p-0',
			'[&>button:first-child]:ml-2 [&>button:last-child]:mr-2',
		],
	}),
);

export type SelectProps<Type extends object> = RACSelectProps<Type> & {
	readonly className?: string;
	readonly description?: string;
	readonly errorMessage?: string | ((validation: RACValidationResult) => string) | undefined;
	readonly items?: Iterable<Type>;
	readonly label?: ReactNode | string;
};

export function Select<Type extends object>(props: SelectProps<Type>) {
	return (
		<RACSelect {...props} className={composeTailwindRenderProps(props.className, 'group flex w-full flex-col gap-1.5')}>
			{(values) => (
				<>
					{props.label && <Label>{props.label}</Label>}
					{typeof props.children === 'function' ? props.children(values) : props.children}
					{props.description && <Description>{props.description}</Description>}
					<FieldError>{props.errorMessage}</FieldError>
				</>
			)}
		</RACSelect>
	);
}

export type SelectListProps<Type extends object> = Pick<PopoverContentProps, 'placement'> &
	RACListBoxProps<Type> & {
		readonly classNames?: {
			readonly popover?: PopoverContentProps['className'];
		};
		readonly items?: Iterable<Type>;
	};

export function SelectList<Type extends object>(props: SelectListProps<Type>) {
	return (
		<PopoverContent
			className={cx('w-(--trigger-width)', props.classNames?.popover)}
			placement={props.placement!}
			respectScreen={false}
			showArrow={false}
		>
			<ListBox {...props} className={cx('border-0', props.classNames?.popover)} items={props.items!}>
				{props.children}
			</ListBox>
		</PopoverContent>
	);
}

export type SelectTriggerProps = ComponentProps<typeof Button> & {
	readonly className?: string;
	readonly prefix?: ReactNode;
	readonly suffix?: ReactNode;
};

export function SelectTrigger(props: SelectTriggerProps) {
	return (
		<RACButton
			className={composeRenderProps(props.className, (className, renderProps) =>
				selectTriggerStyles({
					...renderProps,
					className,
				}),
			)}
		>
			{props.prefix && <span className="-mr-1 ml-2 *:data-[slot=icon]:size-5.5">{props.prefix}</span>}
			<RACSelectValue
				className="text-base-neutral-900 group-disabled:data-placeholder:text-base-neutral-900 dark:group-disabled:data-placeholder:text-base-neutral-40 dark:data-placeholder:text-base-neutral-500 dark:text-base-neutral-40 data-placeholder:text-base-neutral-400 text-base-lg sm:text-base-md grid flex-1 grid-cols-[auto_1fr] place-items-start items-center px-3 py-2.5 *:data-[slot=avatar]:*:-mx-0.5 *:data-[slot=avatar]:-mx-0.5 *:data-[slot=avatar]:*:mr-2 *:data-[slot=avatar]:mr-2 *:data-[slot=icon]:-mx-0.5 *:data-[slot=icon]:mr-1 *:data-[slot=icon]:size-5.5 [&_[slot=description]]:hidden *:[span]:col-start-2"
				data-slot="select-value"
			/>
			{props.suffix && <span className="mr-10 ml-2 *:data-[slot=icon]:size-5.5">{props.suffix}</span>}
			<ChevronDownIcon
				aria-hidden
				className="size-6 shrink-0 duration-200 group-open:rotate-180 forced-colors:text-[ButtonText] forced-colors:group-disabled:text-[GrayText]"
				data-slot="icon"
				size={24}
				strokeWidth={1.5}
			/>
		</RACButton>
	);
}

export {
	DropdownSection as SelectSection,
	DropdownSeparator as SelectSeparator,
	DropdownLabel as SelectLabel,
	DropdownItemDetails as SelectOptionDetails,
	DropdownItem as SelectOption,
} from '@/components/ui/Dropdown';
