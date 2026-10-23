import type { VariantProps } from 'cva';
import type { ComponentProps } from 'react';
import type {
	DialogProps as RACDialogProps,
	DialogTriggerProps as RACDialogTriggerProps,
	ModalOverlayProps as RACModalOverlayProps,
} from 'react-aria-components';
import {
	DialogTrigger as RACDialogTrigger,
	Modal as RACModal,
	ModalOverlay as RACModalOverlay,
	composeRenderProps,
} from 'react-aria-components';
import { Dialog, DialogCloseIndicator } from '@/components/ui/Dialog';
import { cva } from '@/styles/cva';

const overlayStyles = cva({
	base: 'fixed top-0 left-0 isolate z-50 flex h-(--visual-viewport-height) w-full place-content-center place-items-center bg-neutral-900/15 p-4 dark:bg-neutral-900/40',
	variants: {
		isBlurred: {
			true: 'supports-backdrop-filter:backdrop-blur',
		},
		isEntering: {
			true: 'fade-in animate-in duration-300 ease-out',
		},
		isExiting: {
			true: 'fade-out animate-out duration-200 ease-in',
		},
	},
});

type Sides = 'bottom' | 'left' | 'right' | 'top';
const generateCompoundVariants = (sides: Sides[]) =>
	sides.map((side) => ({
		side,
		isFloat: true,
		className:
			side === 'top'
				? 'top-2 inset-x-2 border-b-0'
				: side === 'bottom'
					? 'bottom-2 inset-x-2 border-t-0'
					: side === 'left'
						? 'left-2 inset-y-2 border-r-0'
						: 'right-2 inset-y-2 border-l-0',
	}));

const contentStyles = cva({
	base: 'shadow-base-md border-base-neutral-200 dark:border-base-neutral-600 fixed z-50 grid gap-4 bg-neutral-100 transition ease-in-out dark:bg-neutral-900',
	variants: {
		isEntering: {
			true: 'animate-in duration-300',
		},
		isExiting: {
			true: 'animate-out duration-200',
		},
		side: {
			top: 'entering:slide-in-from-top exiting:slide-out-to-top inset-x-0 top-0 border-b',
			bottom: 'entering:slide-in-from-bottom exiting:slide-out-to-bottom inset-x-0 bottom-0 border-t',
			left: 'entering:slide-in-from-left exiting:slide-out-to-left inset-y-0 left-0 h-auto w-full max-w-xs overflow-y-auto border-r',
			right:
				'entering:slide-in-from-right exiting:slide-out-to-right inset-y-0 right-0 h-auto w-full max-w-xs overflow-y-auto border-l',
		},
		isFloat: {
			true: '',
			false: '',
		},
	},
	compoundVariants: generateCompoundVariants(['top', 'bottom', 'left', 'right']),
});

export type SheetProps = RACDialogTriggerProps;

export function Sheet(props: SheetProps) {
	return <RACDialogTrigger {...props} />;
}

export type SheetContentProps = Omit<ComponentProps<typeof RACModal>, 'children' | 'className'> &
	Omit<RACModalOverlayProps, 'className'> &
	VariantProps<typeof overlayStyles> & {
		readonly 'aria-label'?: RACDialogProps['aria-label'];
		readonly 'aria-labelledby'?: RACDialogProps['aria-labelledby'];
		readonly classNames?: {
			content?: RACModalOverlayProps['className'];
			overlay?: RACModalOverlayProps['className'];
		};
		readonly closeButton?: boolean;
		readonly isBlurred?: boolean;
		readonly isFloat?: boolean;
		readonly role?: RACDialogProps['role'];
		readonly side?: Sides;
	};

export function SheetContent({
	isBlurred = false,
	isDismissable = true,
	side = 'right',
	role = 'dialog',
	closeButton = true,
	isFloat = true,
	...props
}: SheetContentProps) {
	const _isDismissable = role === 'alertdialog' ? false : isDismissable;

	return (
		<RACModalOverlay
			{...props}
			className={composeRenderProps(props.classNames?.overlay, (className, renderProps) =>
				overlayStyles({
					...renderProps,
					isBlurred,
					className,
				}),
			)}
			isDismissable={_isDismissable}
		>
			<RACModal
				{...props}
				className={composeRenderProps(props.classNames?.content, (className, renderProps) =>
					contentStyles({
						...renderProps,
						side,
						isFloat,
						className,
					}),
				)}
			>
				{(values) => (
					<Dialog aria-label={props['aria-label'] ?? undefined!} className="h-full" role={role}>
						<>
							{typeof props.children === 'function' ? props.children(values) : props.children}
							{closeButton && <DialogCloseIndicator className="top-2.5 right-2.5" isDismissable={_isDismissable} />}
						</>
					</Dialog>
				)}
			</RACModal>
		</RACModalOverlay>
	);
}

export {
	DialogTrigger as SheetTrigger,
	DialogBody as SheetBody,
	DialogClose as SheetClose,
	DialogDescription as SheetDescription,
	DialogFooter as SheetFooter,
	DialogHeader as SheetHeader,
	DialogTitle as SheetTitle,
} from '@/components/ui/Dialog';
