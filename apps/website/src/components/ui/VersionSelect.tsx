'use client';

import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Key } from 'react-aria-components';
import { useMediaQuery } from 'usehooks-ts';
import { Drawer as Vaul } from 'vaul';
import { Button } from './Button';
import { ListBox, ListBoxItem } from './ListBox';
import { Popover } from './Popover';
import { Select, SelectValue } from './Select';

export function VersionSelect({
	packageName,
	version,
	versions,
}: {
	readonly packageName: string;
	readonly version: string;
	readonly versions: { readonly version: string }[];
}) {
	const [selectedVersion, setSelectedVersion] = useState<Key>(version);
	const [open, setOpen] = useState(false);
	const isMedium = useMediaQuery('(min-width: 768px)');

	useEffect(() => {
		if (isMedium) {
			setOpen(false);
		}
	}, [isMedium, setOpen]);

	return (
		<>
			<Select
				aria-label="Select a version"
				className="hidden md:block"
				onSelectionChange={(selected) => {
					setSelectedVersion(selected);
				}}
				selectedKey={selectedVersion}
			>
				<Button className="flex w-full place-content-between place-items-center rounded-md bg-neutral-200 p-2 dark:bg-neutral-800">
					<SelectValue className="font-medium" />
					<ChevronsUpDown aria-hidden size={20} />
				</Button>
				<Popover className="max-h-60 w-[--trigger-width] overflow-auto rounded-md border border-neutral-300 bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
					<ListBox items={versions} shouldFocusWrap>
						{(item) => (
							<ListBoxItem
								className="flex p-2 outline-none data-[focus-visible]:bg-neutral-300 data-[hovered]:bg-neutral-300 data-[selected]:bg-blurple data-[selected]:data-[focus-visible]:bg-blurple-500 data-[selected]:data-[hovered]:bg-blurple-500 data-[selected]:text-white dark:data-[focus-visible]:bg-neutral-700 dark:data-[hovered]:bg-neutral-700 dark:data-[selected]:data-[focus-visible]:bg-blurple-500 dark:data-[selected]:data-[hovered]:bg-blurple-500"
								href={`/docs/packages/${packageName}/${item.version}`}
								id={item.version}
								textValue={item.version}
							>
								{item.version}
							</ListBoxItem>
						)}
					</ListBox>
				</Popover>
			</Select>

			<Vaul.NestedRoot onOpenChange={setOpen} open={open}>
				<Vaul.Trigger
					aria-label="Open version select"
					className="flex w-full place-content-between place-items-center rounded-md bg-neutral-200 p-2 dark:bg-neutral-800 md:hidden"
				>
					<span className="font-medium">{selectedVersion}</span>
					<ChevronsUpDown aria-hidden size={20} />
				</Vaul.Trigger>
				<Vaul.Portal>
					<Vaul.Overlay className="fixed inset-0 bg-black/40" />
					<Vaul.Content className="fixed bottom-0 left-0 right-0 flex max-h-[80%] flex-col rounded-t-lg bg-neutral-100 p-4 dark:bg-neutral-900">
						<div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-neutral-400" />
						<ListBox
							aria-label="Select a version"
							className="flex flex-col gap-2 overflow-auto"
							items={versions}
							onSelectionChange={(selected) => {
								const [val] = selected;
								setSelectedVersion(val as Key);
							}}
							selectedKeys={[selectedVersion]}
							selectionMode="single"
							shouldFocusWrap
						>
							{(item) => (
								<ListBoxItem
									className="rounded-md p-2 outline-none data-[focus-visible]:bg-neutral-300 data-[hovered]:bg-neutral-300 data-[selected]:bg-blurple data-[selected]:data-[focus-visible]:bg-blurple-500 data-[selected]:data-[hovered]:bg-blurple-500 data-[selected]:text-white dark:data-[focus-visible]:bg-neutral-700 dark:data-[hovered]:bg-neutral-700 dark:data-[selected]:data-[focus-visible]:bg-blurple-500 dark:data-[selected]:data-[hovered]:bg-blurple-500"
									href={`/docs/packages/${packageName}/${item.version}`}
									id={item.version}
									textValue={item.version}
								>
									{item.version}
								</ListBoxItem>
							)}
						</ListBox>
					</Vaul.Content>
				</Vaul.Portal>
			</Vaul.NestedRoot>
		</>
	);
}
