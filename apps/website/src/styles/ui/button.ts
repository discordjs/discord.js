import { compose, cva } from '@/styles/cva';
import { focusRing } from '@/styles/ui/focusRing';

export const buttonStyles = compose(
	focusRing,
	cva({
		base: [
			'text-base-label-md relative inline-flex place-content-center place-items-center gap-2 border border-transparent',
			'*:data-[slot=icon]:size-4.5 *:data-[slot=icon]:shrink-0 print:hidden',
		],
		variants: {
			variant: {
				unset: null,
				outline: [
					'h-10 rounded-sm px-4 py-2.5',
					'border-base-neutral-300 text-base-neutral-800 bg-base-neutral-0 dark:bg-base-neutral-800 dark:border-base-neutral-500 dark:text-base-neutral-100',
					'hover:bg-base-neutral-700 hover:text-base-neutral-40 dark:hover:bg-base-neutral-100 dark:hover:text-base-neutral-900 hover:border-transparent',
					'focus-visible:bg-base-neutral-700 focus-visible:text-base-neutral-40 dark:focus-visible:bg-base-neutral-100 dark:focus-visible:text-base-neutral-900 focus-visible:border-transparent',
					'pressed:bg-base-neutral-800 pressed:text-base-neutral-40 pressed:border-transparent dark:pressed:bg-base-neutral-60 dark:pressed:text-base-neutral-900',
					'disabled:bg-base-neutral-40 disabled:text-base-neutral-900 disabled:border-base-neutral-300 dark:disabled:bg-base-neutral-800 dark:disabled:text-base-neutral-40',
				],
				discreet: [
					'h-10 rounded-sm px-4 py-2.5',
					'text-base-neutral-800 dark:text-base-neutral-100 bg-transparent',
					'hover:bg-base-neutral-100 dark:hover:bg-base-neutral-700',
					'focus-visible:bg-base-neutral-100 dark:focus-visible:bg-base-neutral-700',
					'pressed:bg-base-neutral-200 dark:pressed:bg-base-neutral-600',
					'disabled:text-base-neutral-900 dark:disabled:text-base-neutral-40',
				],
				filled: [
					'h-10 rounded-sm px-4 py-2.5',
					'bg-base-neutral-700 text-base-neutral-40 dark:bg-base-neutral-100 dark:text-base-neutral-900',
					'hover:bg-base-neutral-500 dark:hover:bg-base-neutral-300',
					'focus-visible:bg-base-neutral-500 dark:focus-visible:bg-base-neutral-300',
					'pressed:bg-base-neutral-400 pressed:text-base-neutral-800 dark:pressed:bg-base-neutral-400',
					'disabled:bg-base-neutral-200 disabled:text-base-neutral-900 dark:disabled:bg-base-neutral-400 dark:disabled:text-base-neutral-40',
				],
				tonal: [
					'h-10 rounded-sm px-4 py-2.5',
					'bg-base-neutral-500 text-base-neutral-40 dark:bg-base-neutral-400 dark:text-base-neutral-900',
					'hover:bg-base-neutral-700 dark:hover:bg-base-neutral-200',
					'focus-visible:bg-base-neutral-700 dark:focus-visible:bg-base-neutral-200',
					'pressed:bg-base-neutral-800 dark:pressed:bg-base-neutral-100',
					'disabled:bg-base-neutral-200 disabled:text-base-neutral-900 dark:disabled:bg-base-neutral-700 dark:disabled:text-base-neutral-40',
				],
				'secondary-outline': [
					'h-10 rounded-sm px-4 py-2.5',
					'border-base-blurple-200 text-base-neutral-800 bg-base-neutral-0 dark:bg-base-neutral-800 dark:border-base-blurple-500 dark:text-base-neutral-40',
					'hover:bg-base-blurple-400 hover:text-base-neutral-900 hover:border-transparent',
					'focus-visible:bg-base-blurple-400 focus-visible:text-base-neutral-900 focus-visible:border-transparent',
					'pressed:bg-base-blurple-500 pressed:text-base-neutral-40 pressed:border-transparent dark:pressed:bg-base-blurple-300 dark:pressed:text-base-neutral-900',
					'disabled:bg-base-neutral-0 disabled:text-base-neutral-900 disabled:border-base-neutral-200 dark:text-base-neutral-40 dark:disabled:bg-base-neutral-800 dark:disabled:border-base-neutral-700',
				],
				'secondary-discreet': [
					'h-10 rounded-sm px-4 py-2.5',
					'text-base-blurple-500 dark:text-base-blurple-300 bg-transparent',
					'hover:bg-base-blurple-50 hover:text-base-blurple-600 dark:hover:bg-base-blurple-700 dark:hover:text-base-blurple-200',
					'focus-visible:bg-base-blurple-50 focus-visible:text-base-blurple-600 dark:focus-visible:bg-base-blurple-700 dark:focus-visible:text-base-blurple-200',
					'pressed:bg-base-blurple-100 pressed:text-base-blurple-700 dark:pressed:bg-base-blurple-600 dark:pressed:text-base-blurple-50',
					'disabled:text-base-neutral-900 dark:disabled:text-base-neutral-40',
				],
				'secondary-filled': [
					'h-10 rounded-sm px-4 py-2.5',
					'bg-base-blurple-400 text-base-neutral-900',
					'hover:bg-base-blurple-200 dark:hover:bg-base-blurple-600 dark:hover:text-base-neutral-200',
					'focus-visible:bg-base-blurple-200 dark:focus-visible:bg-base-blurple-600 dark:focus-visible:text-base-neutral-200',
					'pressed:bg-base-blurple-100 dark:pressed:bg-base-blurple-700 dark:pressed:text-base-neutral-100',
					'disabled:bg-base-neutral-200 disabled:text-base-neutral-900 dark:disabled:bg-base-neutral-700 dark:disabled:text-base-neutral-40',
				],
				'secondary-tonal': [
					'h-10 rounded-sm px-4 py-2.5',
					'bg-base-blurple-200 text-base-neutral-900 dark:bg-base-blurple-600 dark:text-base-neutral-40',
					'hover:bg-base-blurple-400 dark:hover:text-base-neutral-900',
					'focus-visible:bg-base-blurple-400 dark:focus-visible:text-base-neutral-900',
					'pressed:bg-base-blurple-500 pressed:text-base-neutral-40 dark:pressed:bg-base-blurple-300 dark:pressed:text-base-neutral-900',
					'disabled:bg-base-neutral-200 disabled:text-base-neutral-900 dark:disabled:bg-base-neutral-700 dark:disabled:text-base-neutral-40',
				],
				'crystal-tonal': [
					'h-10 rounded-sm px-4 py-2.5',
					'bg-base-crystal-300 text-base-neutral-900 dark:bg-base-crystal-700 dark:text-base-neutral-40',
					'hover:bg-base-crystal-500 dark:hover:text-base-neutral-900',
					'focus-visible:bg-base-crystal-500 dark:focus-visible:text-base-neutral-900',
					'pressed:bg-base-crystal-600 pressed:text-base-neutral-40 dark:pressed:bg-base-crystal-400 dark:pressed:text-base-neutral-900',
					'disabled:bg-base-neutral-200 disabled:text-base-neutral-900 dark:disabled:bg-base-neutral-700 dark:disabled:text-base-neutral-40',
				],
				tooltip: [
					'size-6 shrink-0 rounded-full p-0.5',
					'text-base-neutral-800 dark:text-base-neutral-100',
					'hover:text-base-crystal-500 dark:hover:text-base-crystal-300',
					'focus-visible:text-base-crystal-500 dark:focus-visible:text-base-crystal-300',
					'disabled:text-base-neutral-900 dark:disabled:text-base-neutral-40',
				],
			},
			size: {
				default: null,
				icon: null,
				sm: null,
				xs: null,
				'icon-sm': null,
				'icon-xs': null,
			},
			isDestructive: {
				true: null,
			},
			isDark: {
				true: null,
			},
			isDisabled: {
				true: 'cursor-default opacity-38 forced-colors:text-[GrayText] forced-colors:group-disabled:text-[GrayText] forced-colors:disabled:text-[GrayText]',
				false: 'cursor-pointer',
			},
			isPending: {
				true: 'cursor-default',
			},
		},
		compoundVariants: [
			{
				variant: 'discreet',
				isDestructive: true,
				className: [
					'text-base-sunset-600 dark:text-base-sunset-400',
					'hover:bg-base-sunset-100 hover:text-base-sunset-700 dark:hover:bg-base-sunset-800 dark:hover:text-base-sunset-300',
					'focus-visible:bg-base-sunset-100 focus-visible:text-base-sunset-700 dark:focus-visible:bg-base-sunset-700 dark:focus-visible:text-base-sunset-300',
					'pressed:bg-base-sunset-200 pressed:text-base-sunset-800 dark:pressed:bg-base-sunset-700 dark:pressed:text-base-sunset-100',
				],
			},
			{
				variant: [
					'filled',
					'outline',
					'discreet',
					'tonal',
					'secondary-filled',
					'secondary-outline',
					'secondary-discreet',
					'secondary-tonal',
					'crystal-tonal',
					'unset',
				],
				size: 'icon',
				className: 'size-10 shrink-0 rounded-full p-2.5',
			},
			{
				variant: ['filled', 'outline'],
				size: 'sm',
				className: 'h-8 px-3 py-1.5',
			},
			{
				variant: 'filled',
				size: 'sm',
				isDark: true,
				className: [
					'h-8 px-3 py-1.5',
					'bg-base-neutral-900 dark:bg-base-neutral-40',
					'hover:bg-base-neutral-700 dark:hover:bg-base-neutral-200',
					'focus-visible:bg-base-neutral-700 dark:focus-visible:bg-base-neutral-200',
					'pressed:bg-base-neutral-600 pressed:text-base-neutral-40 dark:pressed:bg-base-neutral-300 dark:pressed:text-base-neutral-900',
				],
			},
			{
				variant: 'filled',
				size: 'xs',
				isDark: true,
				className: [
					'h-6 gap-1 px-2 py-1',
					'bg-base-neutral-900 dark:bg-base-neutral-40',
					'hover:bg-base-neutral-700 dark:hover:bg-base-neutral-200',
					'focus-visible:bg-base-neutral-700 dark:focus-visible:bg-base-neutral-200',
					'pressed:bg-base-neutral-600 pressed:text-base-neutral-40 dark:pressed:bg-base-neutral-300 dark:pressed:text-base-neutral-900',
				],
			},
			{
				variant: ['filled', 'discreet', 'secondary-tonal', 'crystal-tonal', 'unset'],
				size: 'icon-sm',
				className: 'size-8 shrink-0 rounded-full p-1.5',
			},
			{
				variant: 'outline',
				size: 'icon-sm',
				className: 'size-8 shrink-0 rounded-sm p-1.5',
			},
			{
				variant: ['discreet', 'unset'],
				size: 'icon-xs',
				className: 'size-6 shrink-0 rounded-full p-0.5',
			},
		],
		defaultVariants: {
			variant: 'outline',
			size: 'default',
		},
	}),
);
