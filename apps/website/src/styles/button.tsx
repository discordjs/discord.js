import { cva } from 'class-variance-authority';

export const button = cva(
	'h-11 flex flex-row transform-gpu cursor-pointer select-none appearance-none place-items-center rounded px-6 text-base font-semibold leading-none text-white no-underline outline-none active:translate-y-px focus:ring focus:ring-width-2 focus:ring-white gap-2',
	{
		variants: {
			intent: {
				primary: ['bg-blurple', 'text-white', 'border-0'],
				secondary: [
					'bg-white',
					'text-gray-800',
					'border-gray-400',
					'border',
					'border-light-900',
					'text-black',
					'transition',
					'duration-200',
					'active:translate-y-px',
					'dark:border-dark-100',
					'hover:border-black',
					'active:bg-light-300',
					'dark:bg-dark-400',
					'hover:bg-light-200',
					'dark:text-white',
					'focus:ring',
					'focus:ring-width-2',
					'focus:ring-blurple',
					'dark:active:bg-dark-200',
					'dark:hover:bg-dark-300',
				],
			},
		},
		defaultVariants: {
			intent: 'primary',
		},
	},
);
