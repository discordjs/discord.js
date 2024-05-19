'use client';

import { Command } from 'cmdk';
import { useAtom, useSetAtom } from 'jotai';
import { ArrowRight } from 'lucide-react';
import MeiliSearch from 'meilisearch';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { isCmdKOpenAtom } from '~/stores/cmdk';
import { isDrawerOpenAtom } from '~/stores/drawer';
import { resolveKind } from '~/util/resolveNodeKind';
import { OverlayScrollbarsComponent } from '../OverlayScrollbars';

const client = new MeiliSearch({
	host: 'https://search.discordjs.dev',
	apiKey: 'b51923c6abb574b1e97be9a03dc6414b6c69fb0c5696d0ef01a82b0f77d223db',
});

export function CmdK({ dependencies }: { readonly dependencies: string[] }) {
	const pathname = usePathname();
	const router = useRouter();
	const [open, setOpen] = useAtom(isCmdKOpenAtom);
	const setDrawerOpen = useSetAtom(isDrawerOpenAtom);
	const [search, setSearch] = useDebounceValue('', 250);
	const [searchResults, setSearchResults] = useState<any[]>([]);

	const packageName = pathname?.split('/').slice(3, 4)[0];
	const branchName = pathname?.split('/').slice(4, 5)[0];

	const searchResultItems =
		searchResults?.map((item, idx) => (
			<Command.Item
				key={`${item.id}-${idx}`}
				className="flex cursor-pointer place-items-center gap-2 rounded-md p-2 data-[selected='true']:bg-neutral-200 dark:data-[selected='true']:bg-neutral-800"
				onSelect={() => {
					router.push(item.path);
					setOpen(false);
				}}
				value={item.id}
			>
				{resolveKind(item.kind)}
				<div className="flex flex-grow flex-col">
					<span className="font-semibold">{item.name}</span>
					<span className="line-clamp-1 text-sm">{item.summary}</span>
					<span className="truncate text-xs">{item.path}</span>
				</div>
				<ArrowRight aria-hidden className="flex-shrink-0" />
			</Command.Item>
		)) ?? [];

	// Toggle the menu when ⌘K is pressed
	useEffect(() => {
		const down = (event: KeyboardEvent) => {
			if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener('keydown', down);
		return () => {
			document.removeEventListener('keydown', down);
		};
	}, [setOpen]);

	useEffect(() => {
		if (open) {
			setDrawerOpen(false);
			setSearch('');
		}

		return () => {
			document.body.style.pointerEvents = 'auto';
		};
	}, [open, setDrawerOpen, setSearch]);

	useEffect(() => {
		// const searchDoc = async (searchString: string, version: string) => {
		// 	console.log(dependencies);
		// 	const res = await client
		// 		.index(`${packageName?.replaceAll('.', '-')}-${version}`)
		// 		.search(searchString, { limit: 25 });
		// 	setSearchResults(res.hits);
		// };

		const searchDoc = async (searchString: string, version: string) => {
			const result = await client.multiSearch({
				queries: [`${packageName?.replaceAll('.', '-')}-${version}`, ...dependencies].map((dep) => ({
					indexUid: dep,
					// eslint-disable-next-line id-length
					q: searchString,
					limit: 25,
					attributesToSearchOn: ['name'],
					sort: ['type:asc'],
				})),
			});
			setSearchResults(result.results.flatMap((res) => res.hits));
		};

		if (search && packageName) {
			void searchDoc(search, branchName?.replaceAll('.', '-') ?? 'main');
		} else {
			setSearchResults([]);
		}
	}, [branchName, dependencies, packageName, search]);

	return (
		<Command.Dialog
			className="w-full rounded-md border border-neutral-300 bg-neutral-100 p-2 shadow-md dark:border-neutral-700 dark:bg-neutral-900"
			open={open}
			onOpenChange={setOpen}
			label="Command Menu"
			shouldFilter={false}
		>
			<Command.Input
				className="mb-4 w-full border-b border-neutral-300 bg-transparent px-2 pb-4 pt-2 outline-none dark:border-neutral-700"
				onValueChange={setSearch}
				placeholder="Quick search..."
			/>
			<OverlayScrollbarsComponent
				className="max-h-96 pr-3"
				defer
				options={{
					overflow: { x: 'hidden' },
					scrollbars: {
						autoHide: 'scroll',
						autoHideDelay: 500,
						autoHideSuspend: true,
						clickScroll: true,
					},
				}}
			>
				<Command.List>
					{search && searchResultItems.length ? (
						searchResultItems
					) : (
						<div role="presentation" className="flex h-12 place-content-center place-items-center text-sm">
							No results found.
						</div>
					)}
				</Command.List>
			</OverlayScrollbarsComponent>
		</Command.Dialog>
	);
}
