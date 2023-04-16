'use client';

import { FiCheck } from '@react-icons/all-files/fi/FiCheck';
import { FiCopy } from '@react-icons/all-files/fi/FiCopy';
import { useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

export function InstallButton() {
	const [interacted, setInteracted] = useState(false);
	const [state, copyToClipboard] = useCopyToClipboard();

	useEffect(() => {
		const timer = setTimeout(() => setInteracted(false), 2_000);
		return () => clearTimeout(timer);
	}, [interacted]);

	return (
		<button
			className="cursor-copy select-none bg-transparent px-4 py-2 text-sm text-dark-50"
			onClick={() => {
				setInteracted(true);
				copyToClipboard('npm install discord.js');
			}}
			type="button"
		>
			<span className="font-semibold text-blurple">{'>'}</span> npm install discord.js{' '}
			{state.value && interacted ? (
				<FiCheck className="ml-1 inline-block text-green-500" />
			) : (
				<FiCopy className="ml-1 inline-block" />
			)}
		</button>
	);
}
