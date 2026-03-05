'use client';

import { AlertCircleIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type {
	LabelProps as RACLabelProps,
	TextProps as RACTextProps,
	FieldErrorProps as RACFieldErrorProps,
	GroupProps as RACGroupProps,
	InputProps as RACInputProps,
} from 'react-aria-components';
import {
	Label as RACLabel,
	Text as RACText,
	FieldError as RACFieldError,
	Group as RACGroup,
	Input as RACInput,
	composeRenderProps,
} from 'react-aria-components';
import { compose, cva, cx } from '@/styles/cva';
import { focusRing } from '@/styles/ui/focusRing';
import { composeTailwindRenderProps } from '@/styles/util';

export function Label(props: RACLabelProps) {
	return (
		<RACLabel
			{...props}
			className={cx(
				'text-base-neutral-800 dark:text-base-neutral-100 group-invalid:text-base-sunset-500 group-disabled:text-base-neutral-900 dark:group-disabled:text-base-neutral-40 text-base-label-md w-fit group-disabled:opacity-38',
				props.className,
			)}
		/>
	);
}

export function Description(props: RACTextProps) {
	return (
		<RACText
			{...props}
			className={cx('text-base-neutral-600 dark:text-base-neutral-300 text-base-sm text-pretty', props.className)}
			slot="description"
		/>
	);
}

export function FieldError(props: RACFieldErrorProps) {
	return (
		<RACFieldError
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				'text-base-sunset-500 text-base-sm flex place-items-center gap-1.5 forced-colors:text-[Mark]',
			)}
		>
			<AlertCircleIcon aria-hidden className="shrink-0" data-slot="icon" size={18} strokeWidth={1.5} />
			{props.children as ReactNode}
		</RACFieldError>
	);
}

export const fieldGroupStyles = compose(
	focusRing,
	cva({
		base: [
			'group relative flex h-10 place-items-center overflow-hidden rounded-sm border transition duration-200 ease-out forced-colors:outline-[Highlight]',
			'bg-base-neutral-0 border-base-neutral-300 dark:bg-base-neutral-800 dark:border-base-neutral-500',
			'hover:border-base-neutral-200 dark:hover:border-base-neutral-600',
			'focus-within:border-base-neutral-200 dark:focus-within:border-base-neutral-600',
			'disabled:opacity-38 forced-colors:disabled:border forced-colors:disabled:border-[GrayText]',
			'group-invalid:border-base-sunset-500 forced-colors:group-invalid:border-[Mark]',
			'group-invalid:hover:border-base-sunset-200 dark:group-invalid:hover:border-base-sunset-700',
			'group-invalid:focus-within:border-base-sunset-200 dark:group-invalid:focus-within:border-base-sunset-700',
			'[&>[role=progressbar]:first-child]:ml-2 [&>[role=progressbar]:last-child]:mr-2',
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
		variants: {
			isFocusWithin: {
				true: 'outline-2',
				false: 'outline-0',
			},
		},
	}),
);

export function FieldGroup(props: RACGroupProps) {
	return (
		<RACGroup
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				fieldGroupStyles({
					...renderProps,
					className,
				}),
			)}
		/>
	);
}

export function Input(props: RACInputProps) {
	return (
		<RACInput
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				'text-base-neutral-900 placeholder:text-base-neutral-400 dark:placeholder:text-base-neutral-500 dark:text-base-neutral-40 text-base-lg sm:text-base-md w-full min-w-0 bg-transparent px-3 py-2.5 outline-hidden focus:outline-hidden [&::-ms-reveal]:hidden [&::-webkit-search-cancel-button]:hidden',
			)}
		/>
	);
}
