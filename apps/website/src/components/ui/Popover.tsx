'use client';

import type { CSSProperties, ReactNode } from 'react';
import type {
	DialogProps as RACDialogProps,
	PopoverProps as RACPopoverProps,
	ModalOverlayProps as RACModalOverlayProps,
	DialogTriggerProps as RACDialogTriggerProps,
} from 'react-aria-components';
import {
	Modal as RACModal,
	ModalOverlay as RACModalOverlay,
	OverlayArrow as RACOverlayArrow,
	PopoverContext as RACPopoverContext,
	DialogTrigger as RACDialogTrigger,
	Popover as RACPopover,
	composeRenderProps,
	useSlottedContext,
} from 'react-aria-components';
import { useMediaQuery } from 'usehooks-ts';
import type { DialogBodyProps, DialogFooterProps, DialogHeaderProps, DialogTitleProps } from '@/components/ui/Dialog';
import { Dialog, DialogBody, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { cva, cx } from '@/styles/cva';

export function Popover(props: RACDialogTriggerProps) {
	return <RACDialogTrigger {...props} />;
}

export function PopoverTitle({ level = 2, ...props }: DialogTitleProps) {
	return <DialogTitle {...props} className={cx('sm:leading-none', level === 2 && 'sm:text-lg', props.className)} />;
}

export function PopoverHeader(props: DialogHeaderProps) {
	return <DialogHeader {...props} className={cx('sm:p-4', props.className)} />;
}

export function PopoverBody(props: DialogBodyProps) {
	return <DialogBody {...props} className={cx('gap-0 sm:px-4 sm:pt-0', props.className)} />;
}

export function PopoverFooter(props: DialogFooterProps) {
	return <DialogFooter {...props} className={cx('sm:p-4', props.className)} />;
}

const contentStyles = cva({
	base: 'peer/popover-content border-base-neutral-200 dark:border-base-neutral-600 shadow-base-sm bg-base-neutral-0 dark:bg-base-neutral-800 text-base-md max-w-xs rounded-sm border bg-clip-padding transition-transform [scrollbar-width:thin] sm:max-w-3xl dark:backdrop-saturate-200 forced-colors:bg-[Canvas]',
	variants: {
		isPicker: {
			true: 'max-h-72 min-w-(--trigger-width) overflow-y-auto',
			false: 'min-w-80',
		},
		isMenu: {
			true: '',
		},
		isEntering: {
			true: 'fade-in animate-in data-[placement=left]:slide-in-from-right-1 data-[placement=right]:slide-in-from-left-1 data-[placement=top]:slide-in-from-bottom-1 data-[placement=bottom]:slide-in-from-top-1 duration-150 ease-out',
		},
		isExiting: {
			true: 'fade-out animate-out data-[placement=left]:slide-out-to-right-1 data-[placement=right]:slide-out-to-left-1 data-[placement=top]:slide-out-to-bottom-1 data-[placement=bottom]:slide-out-to-top-1 duration-100 ease-in',
		},
	},
});

const drawerStyles = cva({
	base: 'fixed top-auto bottom-0 z-50 max-h-full w-full max-w-2xl border border-b-transparent bg-neutral-100 outline-hidden dark:bg-neutral-900',
	variants: {
		isMenu: {
			true: 'p-0 [&_[role=dialog]]:*:not-has-[[data-slot=dialog-body]]:px-1',
			false: '',
		},
		isEntering: {
			true: [
				'[will-change:transform] [transition:transform_0.5s_cubic-bezier(0.32,_0.72,_0,_1)]',
				'fade-in-0 slide-in-from-bottom-56 animate-in duration-200',
				'[transition:translate3d(0,_100%,_0)]',
				'sm:slide-in-from-bottom-auto sm:slide-in-from-top-[20%]',
			],
		},
		isExiting: {
			true: 'slide-out-to-bottom-56 animate-out duration-200 ease-in',
		},
	},
});

export type PopoverContentProps = Omit<RACModalOverlayProps, 'className'> &
	Omit<RACPopoverProps, 'children' | 'className'> &
	Pick<RACDialogProps, 'aria-label' | 'aria-labelledby'> & {
		readonly children: ReactNode;
		readonly className?: string | ((values: { defaultClassName?: string }) => string);
		readonly respectScreen?: boolean;
		readonly showArrow?: boolean;
		readonly style?: CSSProperties;
	};

export function PopoverContent({ respectScreen = true, showArrow = true, ...props }: PopoverContentProps) {
	const isMobile = useMediaQuery('(max-width: 600px)', { initializeWithValue: false });
	const popoverContext = useSlottedContext(RACPopoverContext);
	const isMenuTrigger = popoverContext?.trigger === 'MenuTrigger';
	const isSubmenuTrigger = popoverContext?.trigger === 'SubmenuTrigger';
	const isMenu = isMenuTrigger || isSubmenuTrigger;
	const isComboBoxTrigger = popoverContext?.trigger === 'ComboBox';
	const offset = props.offset ?? (showArrow ? 6 : 4);
	const effectiveOffset = isSubmenuTrigger ? offset - 2 : offset;

	return isMobile && respectScreen ? (
		<RACModalOverlay
			{...props}
			className="fixed top-0 left-0 isolate z-50 h-(--visual-viewport-height) w-full [--visual-viewport-vertical-padding:16px]"
			isDismissable
		>
			<RACModal
				className={composeRenderProps(props.className as string, (className, renderProps) =>
					drawerStyles({ ...renderProps, isMenu, className }),
				)}
			>
				<Dialog aria-label={props['aria-label'] ?? 'List item'} role="dialog">
					{props.children}
				</Dialog>
			</RACModal>
		</RACModalOverlay>
	) : (
		<RACPopover
			{...props}
			className={composeRenderProps(props.className as string, (className, renderProps) =>
				contentStyles({
					...renderProps,
					className,
				}),
			)}
			offset={effectiveOffset}
		>
			{showArrow && (
				<RACOverlayArrow className="group">
					<svg
						className="fill-base-neutral-0 dark:fill-base-neutral-800 stroke-base-neutral-200 dark:stroke-base-neutral-600 block group-data-[placement=bottom]:rotate-180 group-data-[placement=left]:-rotate-90 group-data-[placement=right]:rotate-90 forced-colors:fill-[Canvas] forced-colors:stroke-[ButtonBorder]"
						height={12}
						viewBox="0 0 12 12"
						width={12}
					>
						<path d="M0 0 L6 6 L12 0" />
					</svg>
				</RACOverlayArrow>
			)}
			{isComboBoxTrigger ? (
				props.children
			) : (
				<Dialog aria-label={props['aria-label'] ?? 'List item'} role="dialog">
					{props.children}
				</Dialog>
			)}
		</RACPopover>
	);
}

export {
	DialogTrigger as PopoverTrigger,
	DialogDescription as PopoverDescription,
	DialogClose as PopoverClose,
} from '@/components/ui/Dialog';
