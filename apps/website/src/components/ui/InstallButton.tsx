'use client';

import { Copy, CopyCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

const getCommand = (manager: string) => {
	switch (manager) {
		case 'pnpm':
			return 'pnpm install discord.js';
		case 'yarn':
			return 'yarn add discord.js';
		case 'bun':
			return 'bun add discord.js';
		default:
			return 'npm install discord.js';
	}
};

export function InstallButton({ className = '' }: { readonly className?: string }) {
	const [interacted, setInteracted] = useState(false);
	const [copiedText, copyToClipboard] = useCopyToClipboard();
	const [showDropdown, setShowDropdown] = useState(false);
	const [selectedPackageManager, setSelectedPackageManager] = useState('npm');

	const handleCopy = async (manager: string) => {
		const command = getCommand(manager);
		setInteracted(true);
		await copyToClipboard(command);
		setShowDropdown(false);
	};

	useEffect(() => {
		const timer = setTimeout(() => setInteracted(false), 2_000);
		return () => clearTimeout(timer);
	}, [interacted]);

	return (
		<div className={`relative inline-block ${className}`}>
			<button
				className="cursor-pointer rounded-md border border-neutral-300 bg-white px-4 py-2 font-mono hover:bg-neutral-200 dark:border-neutral-700 dark:bg-transparent dark:hover:bg-neutral-800"
				onClick={() => setShowDropdown(!showDropdown)}
				type="button"
			>
				<span className="font-semibold text-blurple">{'>'}</span> {getCommand(selectedPackageManager)}
				{copiedText && interacted ? (
					<CopyCheck aria-hidden size={20} className="ml-2 inline-block text-green-500" />
				) : (
					<Copy aria-hidden size={20} className="ml-2 inline-block" />
				)}
			</button>

			{showDropdown && (
				<div className="absolute left-0 mt-2 w-full rounded-md border border-neutral-300 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
					<ul className="py-1">
						<li>
							<button
								className="block w-full px-4 py-2 text-left hover:bg-neutral-200 dark:hover:bg-neutral-700"
								onClick={async () => {
									setSelectedPackageManager('npm');
									await handleCopy('npm');
								}}
								role="button"
								type="button"
							>
								npm
							</button>
						</li>
						<li>
							<button
								className="block w-full px-4 py-2 text-left hover:bg-neutral-200 dark:hover:bg-neutral-700"
								onClick={async () => {
									setSelectedPackageManager('pnpm');
									await handleCopy('pnpm');
								}}
								role="button"
								type="button"
							>
								pnpm
							</button>
						</li>
						<li>
							<button
								className="block w-full px-4 py-2 text-left hover:bg-neutral-200 dark:hover:bg-neutral-700"
								onClick={async () => {
									setSelectedPackageManager('yarn');
									await handleCopy('yarn');
								}}
								role="button"
								type="button"
							>
								yarn
							</button>
						</li>
						<li>
							<button
								className="block w-full px-4 py-2 text-left hover:bg-neutral-200 dark:hover:bg-neutral-700"
								onClick={async () => {
									setSelectedPackageManager('bun');
									await handleCopy('bun');
								}}
								role="button"
								type="button"
							>
								bun
							</button>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}
