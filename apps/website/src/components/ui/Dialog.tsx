'use client';

import { XIcon } from 'lucide-react';
import { useEffect, useRef, type ComponentProps, type ComponentPropsWithoutRef, type Ref } from 'react';
import type { HeadingProps as RACHeadingProps } from 'react-aria-components';
import { Dialog as RACDialog, Heading as RACHeading, Text as RACText } from 'react-aria-components';
import { useMediaQuery } from 'usehooks-ts';
import { Button, type ButtonProps } from '@/components/ui/Button';
import { cx } from '@/styles/cva';

export function Dialog(props: ComponentProps<typeof RACDialog>) {
	return (
		<RACDialog
			{...props}
			className={cx(
				'peer/dialog group/dialog relative flex max-h-[inherit] flex-col overflow-hidden outline-hidden [scrollbar-width:thin]',
				props.className,
			)}
			role={props.role!}
		/>
	);
}

export type DialogHeaderProps = ComponentPropsWithoutRef<'div'> & {
	readonly description?: string;
	readonly hasBorder?: boolean;
	readonly title?: string;
};

export function DialogHeader({ hasBorder = false, ...props }: DialogHeaderProps) {
	const headerRef = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		const header = headerRef.current;
		if (!header) {
			return;
		}

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				header.parentElement?.style.setProperty('--dialog-header-height', `${entry.target.clientHeight}px`);
			}
		});

		observer.observe(header);
		return () => observer.unobserve(header);
	}, []);

	return (
		<div
			className={cx(
				'relative flex flex-col gap-1 p-6 pb-4 [&[data-slot=dialog-header]:has(+[data-slot=dialog-footer])]:pb-0',
				hasBorder &&
					'border-base-neutral-100 dark:border-base-neutral-700 border-b [&[data-slot=dialog-header]:has(+[data-slot=dialog-footer])]:border-b',
				props.className,
			)}
			data-slot="dialog-header"
			ref={headerRef}
		>
			{props.title && <DialogTitle>{props.title}</DialogTitle>}
			{props.description && <DialogDescription>{props.description}</DialogDescription>}
			{!props.title && typeof props.children === 'string' ? <DialogTitle {...props} /> : props.children}
		</div>
	);
}

export type DialogTitleProps = RACHeadingProps & {
	readonly ref?: Ref<HTMLHeadingElement>;
};

export function DialogTitle({ level = 2, ...props }: DialogTitleProps) {
	return (
		<RACHeading
			{...props}
			className={cx('text-base-label-md flex flex-1 place-items-center', props.className)}
			level={level}
			slot="title"
		/>
	);
}

export type DialogDescriptionProps = ComponentProps<'div'>;

export function DialogDescription(props: DialogDescriptionProps) {
	return <RACText {...props} className={cx('text-sm', props.className)} slot="description" />;
}

export type DialogBodyProps = ComponentProps<'div'>;

export function DialogBody(props: DialogBodyProps) {
	return (
		<div
			{...props}
			className={cx(
				'isolate flex max-h-[calc(var(--visual-viewport-height)-var(--visual-viewport-vertical-padding)-var(--dialog-header-height,0px)-var(--dialog-footer-height,0px))] flex-1 flex-col gap-6 overflow-auto px-6 py-1',
				props.className,
			)}
			data-slot="dialog-body"
		/>
	);
}

export type DialogFooterProps = ComponentProps<'div'> & {
	readonly hasBorder?: boolean;
};

export function DialogFooter({ hasBorder = false, ...props }: DialogFooterProps) {
	const footerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const footer = footerRef.current;

		if (!footer) {
			return;
		}

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				footer.parentElement?.style.setProperty('--dialog-footer-height', `${entry.target.clientHeight}px`);
			}
		});

		observer.observe(footer);
		return () => {
			observer.unobserve(footer);
		};
	}, []);

	return (
		<div
			{...props}
			className={cx(
				'isolate mt-auto flex flex-col-reverse place-content-between gap-3 p-6 sm:flex-row sm:place-content-end sm:place-items-center',
				hasBorder && 'border-base-neutral-100 dark:border-base-neutral-700 border-t',
				props.className,
			)}
			data-slot="dialog-footer"
			ref={footerRef}
		/>
	);
}

export type DialogCloseProps = ButtonProps;

export function DialogClose(props: DialogCloseProps) {
	return <Button {...props} slot="close" />;
}

export type CloseButtonIndicatorProps = Omit<ButtonProps, 'children'> & {
	readonly className?: string;
	readonly isDismissable?: boolean | undefined;
};

export function DialogCloseIndicator(props: CloseButtonIndicatorProps) {
	const isMobile = useMediaQuery('(max-width: 600px)', { initializeWithValue: false });

	return props.isDismissable ? (
		<Button
			{...props}
			{...(isMobile ? { autoFocus: true } : {})}
			aria-label="Close"
			className={cx(
				'close text-base-neutral-500 hover:text-base-neutral-700 focus-visible:text-base-neutral-700 pressed:text-base-neutral-900 dark:text-base-neutral-400 dark:hover:text-base-neutral-200 dark:focus-visible:text-base-neutral-200 dark:pressed:text-base-neutral-500 disabled:text-base-neutral-300 dark:disabled:text-base-neutral-300 absolute top-3 right-4 z-50 rounded-full',
				props.className,
			)}
			size="icon-xs"
			slot="close"
			variant="unset"
		>
			<XIcon aria-hidden className="size-4.5 stroke-[1.5]" />
		</Button>
	) : null;
}

export { Button as DialogTrigger } from '@/components/ui/Button';
