'use client';

import { ChevronDown, Copy, CopyCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

export function InstallButton({ className = '' }: { readonly className?: string }) {
	const [interacted, setInteracted] = useState(false);
	const [copiedText, copyToClipboard] = useCopyToClipboard();
	const [showDropdown, setShowDropdown] = useState(false);

	const handleCopy = async (command: string) => {
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
				<span className="font-semibold text-blurple">{'>'}</span> npm install discord.js
				<ChevronDown aria-hidden size={20} className="ml-2 inline-block" />
			</button>
			{copiedText && interacted ? (
				<CopyCheck aria-hidden size={20} className="ml-2 inline-block text-green-500" />
			) : (
				<Copy aria-hidden size={20} className="ml-2 inline-block" />
			)}

			{showDropdown && (
				<div className="absolute left-0 mt-2 w-full rounded-md border border-neutral-300 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
					<ul className="py-1">
						<li>
							<button
								type="button"
								className="block w-full px-4 py-2 text-left hover:bg-neutral-200 dark:hover:bg-neutral-700"
								onClick={async () => handleCopy('npm install discord.js')}
							>
								npm
							</button>
						</li>
						<li>
							<button
								type="button"
								className="block w-full px-4 py-2 text-left hover:bg-neutral-200 dark:hover:bg-neutral-700"
								onClick={async () => handleCopy('pnpm install discord.js')}
							>
								pnpm
							</button>
						</li>
						<li>
							<button
								type="button"
								className="block w-full px-4 py-2 text-left hover:bg-neutral-200 dark:hover:bg-neutral-700"
								onClick={async () => handleCopy('yarn add discord.js')}
							>
								yarn
							</button>
						</li>
						<li>
							<button
								type="button"
								className="block w-full px-4 py-2 text-left hover:bg-neutral-200 dark:hover:bg-neutral-700"
								onClick={async () => handleCopy('bun add discord.js')}
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
