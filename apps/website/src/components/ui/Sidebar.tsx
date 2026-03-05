'use client';

import { MenuIcon, SidebarIcon, XIcon } from 'lucide-react';
import {
	createContext,
	use,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState,
	type ComponentProps,
} from 'react';
import { chain } from 'react-aria';
import { useMediaQuery } from 'usehooks-ts';
import { Button, type ButtonProps } from '@/components/ui/Button';
import { SheetBody, SheetContent, type SheetContentProps } from '@/components/ui/Sheet';
import { cva, cx } from '@/styles/cva';

const SIDEBAR_COOKIE_NAME = 'sidebar:state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

interface SidebarContextProps {
	isMobile: boolean;
	open: boolean;
	openMobile: boolean;
	setOpen(open: boolean | ((open: boolean) => boolean)): void;
	setOpenMobile(open: boolean | ((open: boolean) => boolean)): void;
	state: 'collapsed' | 'expanded';
}

const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebar() {
	const context = use(SidebarContext);
	if (!context) {
		throw new Error('useSidebar must be used within a Sidebar.');
	}

	return context;
}

export type SidebarProviderProps = ComponentProps<'div'> & {
	readonly defaultOpen?: boolean;
	readonly isOpen?: boolean;
	onOpenChange?(open: boolean): void;
	readonly shortcut?: string;
};

export function SidebarProvider({
	defaultOpen = false,
	isOpen: openProp,
	onOpenChange: setOpenProp,
	shortcut = 'b',
	...props
}: SidebarProviderProps) {
	const isMobile = useMediaQuery('(max-width: 767px)', { initializeWithValue: false });
	const [openMobile, setOpenMobile] = useState(false);

	const [internalOpenState, setInternalOpenState] = useState(defaultOpen);
	const open = openProp ?? internalOpenState;
	const setOpen = useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			const openState = typeof value === 'function' ? value(open) : value;

			if (isMobile) {
				setOpenMobile((open) => !open);
			} else if (setOpenProp) {
				setOpenProp(openState);
			} else {
				setInternalOpenState(openState);
			}

			// eslint-disable-next-line react-compiler/react-compiler
			document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
		},
		[setOpenProp, open, isMobile, setOpenMobile],
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === shortcut && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				setOpen((open) => !open);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [shortcut, setOpen]);

	const state = open ? 'expanded' : 'collapsed';

	const contextValue = useMemo<SidebarContextProps>(
		() => ({
			state,
			open,
			setOpen,
			openMobile,
			setOpenMobile,
			isMobile,
		}),
		[state, open, setOpen, openMobile, setOpenMobile, isMobile],
	);

	return (
		<SidebarContext value={contextValue}>
			<div
				{...props}
				className={cx(
					'@container/sidebar **:data-[slot=icon]:shrink-0',
					'[--sidebar-width-dock:3.25rem] [--sidebar-width-mobile:20rem] [--sidebar-width:20rem]',
					'[--sidebar-border:var(--color-base-neutral-200)]',
					'dark:[--sidebar-border:var(--color-base-neutral-600)]',
					'flex min-h-dvh w-full',
					'group/sidebar-root has-data-[sidebar-intent=inset]:bg-[#f3f3f4] dark:has-data-[sidebar-intent=inset]:bg-[#121214]',
					'[@-moz-document_url-prefix()]:overflow-x-hidden',
					props.className,
				)}
			>
				{props.children}
			</div>
		</SidebarContext>
	);
}

const sidebarGapStyles = cva({
	base: [
		'w-(--sidebar-width) group-data-[sidebar-collapsible=hidden]/sidebar-container:w-0',
		'relative h-dvh bg-transparent transition-[width] duration-100 ease-linear',
		'group-data-[sidebar-side=right]/sidebar-container:rotate-180',
	],
	variants: {
		intent: {
			default: 'group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock)',
			fleet: 'group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock)',
			float:
				'group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var(--sidebar-width-dock)+theme(spacing.4))]',
			inset:
				'group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var(--sidebar-width-dock)+theme(spacing.2))]',
		},
	},
});

const sidebarStyles = cva({
	base: [
		'fixed inset-y-0 z-10 hidden h-dvh w-(--sidebar-width) transition-[left,right,width] duration-100 ease-linear md:flex',
		'min-h-dvh bg-[#f3f3f4] dark:bg-[#121214]',
		'**:data-[slot=disclosure]:border-0 **:data-[slot=disclosure]:px-2.5',
		'has-data-[sidebar-intent=default]:shadow-base-md',
		'[@-moz-document_url-prefix()]:h-full [@-moz-document_url-prefix()]:min-h-full',
	],
	variants: {
		side: {
			left: 'left-0 group-data-[sidebar-collapsible=hidden]/sidebar-container:left-[calc(var(--sidebar-width)*-1)]',
			right: 'right-0 group-data-[sidebar-collapsible=hidden]/sidebar-container:right-[calc(var(--sidebar-width)*-1)]',
		},
		intent: {
			default: [
				'group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock) group-data-[sidebar-side=left]/sidebar-container:border-(--sidebar-border) group-data-[sidebar-side=right]/sidebar-container:border-(--sidebar-border)',
				'group-data-[sidebar-side=left]/sidebar-container:border-r group-data-[sidebar-side=right]/sidebar-container:border-l',
			],
			fleet: [
				'group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock)',
				'**:data-sidebar-disclosure:gap-y-0 **:data-sidebar-disclosure:px-0 **:data-sidebar-section:gap-y-0 **:data-sidebar-section:px-0',
				'group-data-[sidebar-side=left]/sidebar-container:border-r group-data-[sidebar-side=right]/sidebar-container:border-l',
			],
			float: 'bg-bg p-2 group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var+theme(spacing.4)+2px)]',
			inset: [
				'p-2 group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var(--sidebar-width-dock)+theme(spacing.2)+2px)]',
			],
		},
	},
});

export type SidebarProps = ComponentProps<'div'> &
	SheetContentProps & {
		readonly closeButton?: boolean;
		readonly collapsible?: 'dock' | 'hidden' | 'none';
		readonly intent?: 'default' | 'fleet' | 'float' | 'inset';
		readonly side?: 'left' | 'right';
	};

export function Sidebar({
	closeButton = true,
	collapsible = 'hidden',
	side = 'left',
	intent = 'default',
	...props
}: SidebarProps) {
	const { isMobile, state, open, openMobile, setOpenMobile } = useSidebar();
	const [needsScrollbarGutter, setNeedsScrollbarGutter] = useState(false);

	useLayoutEffect(() => {
		if (collapsible === 'none' || isMobile || side !== 'right') {
			return;
		}

		const scrollbarVisible = (element: HTMLElement) => element.scrollHeight > element.clientHeight;

		const observer = new MutationObserver((mutations) => {
			if (mutations[0]?.type === 'attributes' && scrollbarVisible(document.documentElement) && open) {
				if (getComputedStyle(document.documentElement).paddingRight === '0px') {
					setNeedsScrollbarGutter(false);
				} else {
					setNeedsScrollbarGutter(true);
				}
			} else {
				setNeedsScrollbarGutter(false);
			}
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['style'],
		});

		return () => {
			observer.disconnect();
		};
	}, [collapsible, isMobile, open, side]);

	if (collapsible === 'none') {
		return (
			<div
				{...props}
				className={cx('flex h-full w-(--sidebar-width) flex-col border-r border-(--sidebar-border)', props.className)}
				data-sidebar-collapsible="none"
				data-sidebar-intent={intent}
			/>
		);
	}

	if (isMobile) {
		return (
			<SheetContent
				{...props}
				aria-label="Sidebar"
				closeButton={closeButton}
				data-sidebar-intent="default"
				isFloat={intent === 'float'}
				isOpen={openMobile}
				onOpenChange={setOpenMobile}
				side={side}
			>
				<SheetBody className="gap-0 p-0">{props.children}</SheetBody>
			</SheetContent>
		);
	}

	return (
		<div
			{...props}
			className="group/sidebar-container peer hidden md:block"
			data-sidebar-collapsible={state === 'collapsed' ? collapsible : ''}
			data-sidebar-intent={intent}
			data-sidebar-side={side}
			data-sidebar-state={state}
		>
			<div aria-hidden className={sidebarGapStyles({ intent })} />
			<div
				{...props}
				className={sidebarStyles({
					side,
					intent,
					className: cx(props.className, needsScrollbarGutter && 'right-[11px]', 'transition-[left,width]'),
				})}
			>
				<div
					className={cx(
						'flex h-full w-full flex-col',
						'group-data-[sidebar-intent=inset]/sidebar-container:bg-sidebar dark:group-data-[sidebar-intent=inset]/sidebar-container:bg-bg',
						'group-data-[sidebar-intent=float]/sidebar-container:bg-sidebar group-data-[sidebar-intent=float]/sidebar-container:shadow-base-md group-data-[sidebar-intent=float]/sidebar-container:rounded-lg group-data-[sidebar-intent=float]/sidebar-container:border group-data-[sidebar-intent=float]/sidebar-container:border-(--sidebar-border)',
					)}
					data-sidebar="default"
				>
					{props.children}
				</div>
			</div>
		</div>
	);
}

export function SidebarInsetAnchor({
	collapsible = 'hidden',
	side = 'left',
	intent = 'default',
	...props
}: SidebarProps) {
	const { state } = useSidebar();

	return (
		<div
			{...props}
			className="group/sidebar-container peer hidden"
			data-sidebar-collapsible={state === 'collapsed' ? collapsible : ''}
			data-sidebar-intent={intent}
			data-sidebar-side={side}
			data-sidebar-state={state}
		/>
	);
}

const sidebarHeaderStyles = cva({
	base: 'dark:bg-base-neutral-800 bg-base-neutral-0 flex flex-col **:data-[slot=sidebar-label-mask]:hidden',
	variants: {
		collapsed: {
			true: 'mt-2 p-12 group-data-[sidebar-intent=float]/sidebar-container:mt-2 md:mx-auto md:size-9 md:items-center md:justify-center md:rounded-lg md:p-0 md:hover:bg-(--sidebar-accent)',
			false: 'px-6 pt-8 pb-4',
		},
		hasBorder: {
			true: 'border-base-neutral-100 dark:border-base-neutral-700 border-b',
			false: null,
		},
	},
});

export type SidebarHeaderProps = ComponentProps<'div'> & {
	readonly hasBorder?: boolean;
};

export function SidebarHeader({ hasBorder = false, ...props }: SidebarHeaderProps) {
	const { state } = use(SidebarContext)!;

	return (
		<div
			{...props}
			className={sidebarHeaderStyles({ collapsed: state === 'collapsed', hasBorder, className: props.className })}
			data-sidebar-header="true"
		/>
	);
}

const sidebarFooterStyles = cva({
	base: [
		'flex flex-col p-6',
		'in-data-[sidebar-intent=fleet]:mt-0 in-data-[sidebar-intent=fleet]:p-0',
		'in-data-[sidebar-intent=fleet]:**:data-[slot=menu-trigger]:rounded-none',
		'**:data-[slot=menu-trigger]:relative **:data-[slot=menu-trigger]:overflow-hidden',
		'**:data-[slot=menu-trigger]:rounded-lg',
		'sm:**:data-[slot=menu-trigger]:text-base-md **:data-[slot=menu-trigger]:flex **:data-[slot=menu-trigger]:cursor-default **:data-[slot=menu-trigger]:items-center **:data-[slot=menu-trigger]:p-2 **:data-[slot=menu-trigger]:outline-hidden',
		'**:data-[slot=menu-trigger]:hover:text-fg **:data-[slot=menu-trigger]:hover:bg-(--sidebar-accent)',
	],
	variants: {
		collapsed: {
			true: [
				'**:data-[slot=avatar]:size-6 **:data-[slot=avatar]:*:size-6',
				'**:data-[slot=chevron]:hidden **:data-[slot=menu-label]:hidden',
				'**:data-[slot=menu-trigger]:grid **:data-[slot=menu-trigger]:size-8 **:data-[slot=menu-trigger]:place-content-center',
			],
			false: [
				'**:data-[slot=avatar]:size-8 **:data-[slot=avatar]:*:size-8 **:data-[slot=menu-trigger]:**:data-[slot=avatar]:mr-2',
				'**:data-[slot=menu-trigger]:pressed:**:data-[slot=chevron]:rotate-180 **:data-[slot=menu-trigger]:w-full **:data-[slot=menu-trigger]:**:data-[slot=chevron]:ml-auto **:data-[slot=menu-trigger]:**:data-[slot=chevron]:transition-transform',
			],
		},
		hasBorder: {
			true: 'border-base-neutral-100 dark:border-base-neutral-700 border-t',
			false: null,
		},
	},
});

export type SidebarFooterProps = ComponentProps<'div'> & {
	readonly hasBorder?: boolean;
};

export function SidebarFooter({ hasBorder = false, ...props }: SidebarFooterProps) {
	const { state, isMobile } = useSidebar();
	const collapsed = state === 'collapsed' && !isMobile;

	return (
		<div
			{...props}
			className={sidebarFooterStyles({ collapsed, hasBorder, className: props.className })}
			data-sidebar-footer="true"
		/>
	);
}

export function SidebarContent(props: ComponentProps<'div'>) {
	const { state } = useSidebar();

	return (
		<div
			{...props}
			className={cx(
				'dark:bg-base-neutral-800 bg-base-neutral-0 flex min-h-0 flex-1 scroll-mb-96 flex-col overflow-auto p-6 *:data-sidebar-section:border-l-0',
				state === 'collapsed' && 'place-items-center',
				props.className,
			)}
			data-sidebar-content="true"
		/>
	);
}

export function SidebarInset(props: ComponentProps<'main'>) {
	return (
		<main
			{...props}
			className={cx(
				'relative flex min-h-dvh w-full flex-1 flex-col peer-data-[sidebar-intent=inset]:border peer-data-[sidebar-intent=inset]:border-transparent',
				'bg-bg dark:peer-data-[sidebar-intent=inset]:bg-sidebar peer-data-[sidebar-intent=inset]:overflow-hidden',
				'md:peer-data-[sidebar-intent=inset]:shadow-base-md peer-data-[sidebar-intent=inset]:min-h-[calc(100dvh-theme(spacing.4))] md:peer-data-[sidebar-intent=inset]:m-2 md:peer-data-[sidebar-intent=inset]:rounded-xl md:peer-data-[sidebar-intent=inset]:peer-data-[sidebar-side=left]:ml-0 md:peer-data-[sidebar-intent=inset]:peer-data-[sidebar-side=right]:mr-0 md:peer-data-[sidebar-state=collapsed]:peer-data-[sidebar-intent=inset]:peer-data-[sidebar-side=left]:ml-2 md:peer-data-[sidebar-state=collapsed]:peer-data-[sidebar-intent=inset]:peer-data-[sidebar-side=right]:mr-2',
				props.className,
			)}
		/>
	);
}

export function SidebarTrigger({ onPress, children, ...props }: ButtonProps) {
	const { setOpen } = useSidebar();

	return (
		<Button
			{...props}
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			aria-label={props['aria-label'] || 'Toggle Sidebar'}
			data-sidebar-trigger="true"
			onPress={(event) => {
				onPress?.(event);
				setOpen((open) => !open);
			}}
		>
			{children || (
				<>
					<SidebarIcon aria-hidden className="hidden md:inline" data-slot="icon" size={18} />
					<MenuIcon aria-hidden className="inline md:hidden" data-slot="icon" size={18} />
					<span className="sr-only">Toggle Sidebar</span>
				</>
			)}
		</Button>
	);
}

export type CloseButtonIndicatorProps = Omit<ButtonProps, 'children'> & {
	readonly className?: string;
	readonly isDismissable?: boolean | undefined;
};

export function SidebarCloseIndicator({ isDismissable = true, ...props }: CloseButtonIndicatorProps) {
	const { setOpen } = useSidebar();

	return (
		<Button
			{...props}
			aria-label="Close"
			className={cx(
				'close text-base-neutral-500 hover:text-base-neutral-700 focus-visible:text-base-neutral-700 pressed:text-base-neutral-900 dark:text-base-neutral-400 dark:hover:text-base-neutral-200 dark:focus-visible:text-base-neutral-200 dark:pressed:text-base-neutral-500 disabled:text-base-neutral-300 dark:disabled:text-base-neutral-300 z-50 rounded-full',
				props.className,
			)}
			onPress={isDismissable ? chain(() => setOpen((open) => !open), props.onPress) : props.onPress!}
			size="icon-xs"
			slot={props.slot === null ? null : (props.slot ?? 'close')}
			variant="unset"
		>
			<XIcon aria-hidden className="size-4.5 stroke-[1.5]" />
		</Button>
	);
}

export function SidebarRail({ className, ref, ...props }: ComponentProps<'button'>) {
	const { setOpen } = useSidebar();

	return (
		<button
			aria-label="Toggle Sidebar"
			className={cx(
				'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 outline-hidden transition-all ease-linear group-data-[sidebar-side=left]/sidebar-container:-right-4 group-data-[sidebar-side=right]/sidebar-container:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] data-hovered:after:bg-transparent sm:flex',
				'in-data-[sidebar-side=left]:cursor-w-resize in-data-[sidebar-side=right]:cursor-e-resize',
				'[[data-sidebar-side=left][data-sidebar-state=collapsed]_&]:cursor-e-resize [[data-sidebar-side=right][data-sidebar-state=collapsed]_&]:cursor-w-resize',
				'group-data-[sidebar-collapsible=hidden]/sidebar-container:hover:bg-secondary group-data-[sidebar-collapsible=hidden]/sidebar-container:translate-x-0 group-data-[sidebar-collapsible=hidden]/sidebar-container:after:left-full',
				'[[data-sidebar-side=left][data-sidebar-collapsible=hidden]_&]:-right-2 [[data-sidebar-side=right][data-sidebar-collapsible=hidden]_&]:-left-2',
				className,
			)}
			data-sidebar="rail"
			onClick={() => setOpen((open) => !open)}
			ref={ref}
			tabIndex={-1}
			title="Toggle Sidebar"
			type="button"
			{...props}
		/>
	);
}
