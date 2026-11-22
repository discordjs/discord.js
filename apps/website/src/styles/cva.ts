import { defineConfig } from 'cva';
import { extendTailwindMerge } from 'tailwind-merge';

const twMergeConfig = {
	classGroups: {
		'font-size': [
			'text-base-xs',
			'text-base-sm',
			'text-base-md',
			'text-base-lg',
			'text-base-xl',
			'text-base-label-xs',
			'text-base-label-sm',
			'text-base-label-md',
			'text-base-label-lg',
			'text-base-label-xl',
			'text-base-heading-xs',
			'text-base-heading-sm',
			'text-base-heading-md',
			'text-base-heading-lg',
			'text-base-heading-xl',
		],
	},
};

const twMerge = extendTailwindMerge({
	extend: twMergeConfig,
});

export const { cva, cx, compose } = defineConfig({
	hooks: {
		onComplete: (className) => twMerge(className),
	},
});
