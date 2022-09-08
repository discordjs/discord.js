// import { insertBatch, search as searchDb } from '@lyrasearch/lyra';
// import type { ApiItemKind } from '@microsoft/api-extractor-model';
import { Dialog, useDialogState } from 'ariakit/dialog';
import { Command } from 'cmdk';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import {
	VscArrowRight,
	VscPackage,
	// VscSymbolClass,
	// VscSymbolEnum,
	// VscSymbolField,
	// VscSymbolInterface,
	// VscSymbolMethod,
	// VscSymbolProperty,
	// VscSymbolVariable,
	VscVersions,
} from 'react-icons/vsc';
import { useKey } from 'react-use';
import useSWR from 'swr';
import { PACKAGES } from '~/util/constants';
import { fetcher } from '~/util/fetcher';

// function resolveIcon(item: keyof ApiItemKind) {
// 	switch (item) {
// 		case 'Class':
// 			return <VscSymbolClass size={25} />;
// 		case 'Enum':
// 			return <VscSymbolEnum size={25} />;
// 		case 'Interface':
// 			return <VscSymbolInterface size={25} />;
// 		case 'Property':
// 			return <VscSymbolProperty size={25} />;
// 		case 'TypeAlias':
// 			return <VscSymbolField size={25} />;
// 		case 'Variables':
// 			return <VscSymbolVariable size={25} />;
// 		default:
// 			return <VscSymbolMethod size={25} />;
// 	}
// }

// const searchIndex: any[] = [];

export function CmdkDialog() {
	const router = useRouter();
	const dialog = useDialogState();
	const [search, setSearch] = useState('');
	const [page, setPage] = useState('');
	const [packageName, setPackageName] = useState('');
	// const [searchResults, setSearchResults] = useState<any[]>([]);

	const { data: versions, isValidating } = useSWR<string[]>(
		packageName ? `https://docs.discordjs.dev/api/info?package=${packageName}` : null,
		fetcher,
	);

	// const { data: searchIndex } = useSWR<any[]>(
	// 	packageName ? `http://localhost:3000/searchIndex/${packageName}-main-index.json` : null,
	// 	fetcher,
	// );

	const packageCommandItems = useMemo(
		() =>
			PACKAGES.map((pkg) => (
				<Command.Item
					key={pkg}
					className="dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 [&[aria-selected]]:ring-blurple [&[aria-selected]]:ring-offset-0 [&[aria-selected]]:ring-width-4 [&[aria-selected]]:ring flex flex h-11 w-full transform-gpu cursor-pointer select-none appearance-none flex-col place-content-center rounded bg-transparent p-4 text-base font-semibold leading-none text-black outline-0 hover:bg-neutral-100 active:translate-y-px active:bg-neutral-200 dark:text-white"
					onSelect={() => {
						setPackageName(pkg);
						setPage('version');
						setSearch('');
					}}
				>
					<div className="flex w-full grow flex-row place-content-between place-items-center gap-4">
						<div className="flex grow flex-row place-content-between place-items-center gap-4">
							<div className="flex flex-row place-content-between place-items-center gap-4">
								<VscPackage size={25} />
								<h2 className="font-semibold">{pkg}</h2>
							</div>
						</div>
						<VscArrowRight size={20} />
					</div>
				</Command.Item>
			)),
		[],
	);

	const versionCommandItems = useMemo(
		() =>
			versions
				?.map((version) => (
					<Command.Item
						key={version}
						className="dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 [&[aria-selected]]:ring-blurple [&[aria-selected]]:ring-offset-0 [&[aria-selected]]:ring-width-4 [&[aria-selected]]:ring flex flex h-11 w-full transform-gpu cursor-pointer select-none appearance-none flex-col place-content-center rounded bg-transparent p-4 text-base font-semibold leading-none text-black outline-0 hover:bg-neutral-100 active:translate-y-px active:bg-neutral-200 dark:text-white"
						onSelect={() => {
							void router.push(`/docs/packages/${packageName}/${version}`);
							dialog.setOpen(false);
						}}
					>
						<div className="flex w-full grow flex-row place-content-between place-items-center gap-4">
							<div className="flex grow flex-row place-content-between place-items-center gap-4">
								<div className="flex flex-row place-content-between place-items-center gap-4">
									<VscVersions size={25} />
									<h2 className="font-semibold">{version}</h2>
								</div>
							</div>
							<VscArrowRight size={20} />
						</div>
					</Command.Item>
				))
				.reverse() ?? [],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[packageName],
	);

	// const searchResultItems = useMemo(
	// 	() =>
	// 		searchResults?.map((item) => (
	// 			<Command.Item
	// 				key={item.id}
	// 				className="dark:border-dark-100 dark:hover:bg-dark-300 dark:active:bg-dark-200 [&[aria-selected]]:ring-blurple [&[aria-selected]]:ring-offset-0 [&[aria-selected]]:ring-width-4 [&[aria-selected]]:ring flex flex h-11 w-full transform-gpu cursor-pointer select-none appearance-none flex-col place-content-center rounded bg-transparent p-4 text-base font-semibold leading-none text-black outline-0 hover:bg-neutral-100 active:translate-y-px active:bg-neutral-200 dark:text-white"
	// 				onSelect={() => {
	// 					void router.push(item.path);
	// 					dialog.setOpen(false);
	// 				}}
	// 			>
	// 				<div className="flex w-full grow flex-row place-content-between place-items-center gap-4">
	// 					<div className="flex grow flex-row place-content-between place-items-center gap-4">
	// 						<div className="flex flex-row place-content-between place-items-center gap-4">
	// 							{resolveIcon(item.kind)}
	// 							<div className="flex flex-col">
	// 								<h2 className="font-semibold">{item.name}</h2>
	// 								<span className="text-sm font-normal">{item.summary}</span>
	// 							</div>
	// 						</div>
	// 					</div>
	// 					<VscArrowRight size={20} />
	// 				</div>
	// 			</Command.Item>
	// 		)) ?? [],
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// 	[searchResults],
	// );

	useKey((event) => event.key === 'k' && event.metaKey, dialog.toggle, { event: 'keydown' }, []);
	useKey(
		(event) => event.key === 'Backspace' && !search,
		() => setPage(''),
		{ event: 'keydown' },
		[],
	);

	useEffect(() => {
		if (!dialog.open) {
			setSearch('');
			setPage('');
		}
	}, [dialog.open]);

	// useEffect(() => {
	// 	if (searchIndex?.length) {
	// 		void insertBatch(db, searchIndex);
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [searchIndex]);

	// useEffect(() => {
	// 	if (search) {
	// 		const results = searchDb(db, {
	// 			term: search,
	// 			properties: ['name', 'kind', 'summary'],
	// 		});
	// 		setSearchResults(results.hits);
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [search]);

	return (
		<Dialog className="fixed top-1/4 left-1/2 z-50 -translate-x-1/2" state={dialog}>
			<Command label="Command Menu" className="bg-dark-300 w-lg rounded">
				<Command.Input
					className="bg-dark-300 caret-blurple mt-4 w-full border-0 p-4 pt-0 text-lg outline-0"
					placeholder="Type to search..."
					value={search}
					onValueChange={setSearch}
				/>
				<Command.List className="pt-0">
					<Command.Empty className="p-4 text-center">No results found</Command.Empty>

					{isValidating ? (
						<Command.Loading>
							<div className="p-4 text-center" role="status">
								<span className="animate-fade-in animate-delay-1000 animate-fill-forwards opacity-0" aria-hidden="true">
									<svg
										className="fill-blurple inline h-8 w-8 animate-spin text-white dark:text-white"
										viewBox="0 0 100 101"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
											fill="currentColor"
										/>
										<path
											d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
											fill="currentFill"
										/>
									</svg>
								</span>
								<span className="sr-only">Loading...</span>
							</div>
						</Command.Loading>
					) : null}

					{page /* || search */ ? null : packageCommandItems}

					{page === 'version' /* && !search */ ? versionCommandItems : null}

					{/* {search && !page ? searchResultItems : null} */}
				</Command.List>
			</Command>
		</Dialog>
	);
}
