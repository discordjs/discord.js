'use client';

import type { ComponentProps } from 'react';
import { Keyboard as RACKeyboard } from 'react-aria-components';
import { cx } from '@/styles/cva';

type KeyboardProps = ComponentProps<'div'> & {
	readonly classNames?: {
		readonly base?: string;
		readonly kbd?: string;
	};
	readonly keys: string[] | string;
};

export function Keyboard(props: KeyboardProps) {
	return (
		<RACKeyboard
			{...props}
			className={cx(
				'hidden group-disabled:opacity-50 lg:inline-flex forced-colors:group-focus:text-[HighlightText]',
				props.classNames?.base,
			)}
		>
			{(Array.isArray(props.keys) ? props.keys : props.keys.split('')).map((char, idx) => (
				<kbd
					className={cx(
						'inline-grid min-h-5 min-w-[2ch] place-content-center text-center font-sans text-[.75rem] uppercase',
						idx > 0 && char.length > 1 && 'pl-1',
						props.classNames?.kbd,
					)}
					key={idx}
				>
					{char}
				</kbd>
			))}
		</RACKeyboard>
	);
}
