import type { ApiItemKind } from '@microsoft/api-extractor-model';
import { Dialog } from 'ariakit/dialog';
import { Command } from 'cmdk';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import {
	VscArrowRight,
	VscSymbolClass,
	VscSymbolEnum,
	VscSymbolField,
	VscSymbolInterface,
	VscSymbolMethod,
	VscSymbolProperty,
	VscSymbolVariable,
} from 'react-icons/vsc';
import { useKey } from 'react-use';
import { useCmdK } from '~/contexts/cmdK';
import { client } from '~/util/search';

function resolveIcon(item: keyof typeof ApiItemKind) {
	switch (item) {
		case 'Class':
			return <VscSymbolClass className="shrink-0" size={25} />;
		case 'Enum':
			return <VscSymbolEnum className="shrink-0" size={25} />;
		case 'Interface':
			return <VscSymbolInterface className="shrink-0" size={25} />;
		case 'Property':
			return <VscSymbolProperty className="shrink-0" size={25} />;
		case 'TypeAlias':
			return <VscSymbolField className="shrink-0" size={25} />;
		case 'Variable':
			return <VscSymbolVariable className="shrink-0" size={25} />;
		default:
			return <VscSymbolMethod className="shrink-0" size={25} />;
	}
}

export function CmdKDialog({
	currentPackageName,
	currentVersion,
}: {
	currentPackageName?: string | undefined;
	currentVersion?: string | undefined;
}) {
	const router = useRouter();
	const dialog = useCmdK();
	const [search, setSearch] = useState('');
	const [searchResults, setSearchResults] = useState<any[]>([]);

	const searchResultItems = useMemo(
		() =>
			searchResults?.map((item) => (
				<Command.Item
					className="dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 [&[aria-selected]]:ring-blurple [&[aria-selected]]:ring-width-4 [&[aria-selected]]:ring my-1 flex transform-gpu cursor-pointer select-none appearance-none flex-row place-content-center rounded bg-transparent px-4 py-2 text-base font-semibold leading-none text-black outline-0 hover:bg-neutral-100 active:translate-y-px active:bg-neutral-200 dark:text-white"
					key={item.id}
					onSelect={() => {
						void router.push(item.path);
						dialog!.setOpen(false);
					}}
				>
					<div className="flex grow flex-row place-content-between place-items-center gap-4">
						<div className="flex flex-row place-items-center gap-4">
							{resolveIcon(item.kind)}
							<div className="w-50 sm:w-100 flex flex-col">
								<h2 className="font-semibold">{item.name}</h2>
								<div className="line-clamp-1 text-sm font-normal">{item.summary}</div>
								<div className="line-clamp-1 hidden text-xs font-light opacity-75 dark:opacity-50 sm:block">
									{item.path}
								</div>
							</div>
						</div>
						<VscArrowRight className="shrink-0" size={20} />
					</div>
				</Command.Item>
			)) ?? [],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[searchResults],
	);

	useKey(
		(event) => {
			if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				return true;
			}

			return false;
		},
		dialog!.toggle,
		{ event: 'keydown', options: {} },
		[],
	);

	useEffect(() => {
		if (!dialog!.open) {
			setSearch('');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dialog!.open]);

	useEffect(() => {
		const searchDoc = async (searchString: string, version: string) => {
			const res = await client.index(`${currentPackageName}-${version}`).search(searchString, { limit: 5 });
			setSearchResults(res.hits);
		};

		if (search && currentPackageName) {
			void searchDoc(search, currentVersion?.replaceAll('.', '-') ?? 'main');
		} else {
			setSearchResults([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	return (
		<Dialog className="fixed top-1/4 left-1/2 z-50 -translate-x-1/2" state={dialog!}>
			<Command
				className="dark:bg-dark-300 min-w-xs sm:min-w-lg max-w-xs rounded bg-white sm:max-w-lg"
				label="Command Menu"
				shouldFilter={false}
			>
				<Command.Input
					className="dark:bg-dark-300 caret-blurple placeholder:text-dark-300/75 focus:ring-width-2 focus:ring-blurple w-full rounded border-0 bg-white p-4 text-lg outline-0 outline-0 focus:ring dark:placeholder:text-white/75"
					onValueChange={setSearch}
					placeholder="Quick search..."
					value={search}
				/>
				<Command.List className="pt-0">
					<Command.Empty className="p-4 text-center">No results found</Command.Empty>
					{search ? searchResultItems : null}
				</Command.List>
			</Command>
		</Dialog>
	);
}
