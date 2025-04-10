'use client';

import { Copy, CopyCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

export function InstallButton({ className = '' }: { readonly className?: string }) {
	const [interacted, setInteracted] = useState(false);
	const [copiedText, copyToClipboard] = useCopyToClipboard();

	useEffect(() => {
		const timer = setTimeout(() => setInteracted(false), 2_000);
		return () => clearTimeout(timer);
	}, [interacted]);

	return (
		<button
			className={`cursor-copy rounded-sm border border-neutral-300 bg-white px-4 py-2 font-mono hover:bg-neutral-200 dark:border-neutral-700 dark:bg-transparent dark:hover:bg-neutral-800 ${className}`}
			onClick={async () => {
				setInteracted(true);
				await copyToClipboard('npm install discord.js');
			}}
			type="button"
		>
			<span className="text-base-blurple-400 font-semibold">{'>'}</span> npm install discord.js{' '}
			{copiedText && interacted ? (
				<CopyCheck aria-hidden className="ml-1 inline-block text-green-500" size={20} />
			) : (
				<Copy aria-hidden className="ml-1 inline-block" size={20} />
			)}
		</button>
	);
}
