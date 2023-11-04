import { VscFileCode } from '@react-icons/all-files/vsc/VscFileCode';
import type { PropsWithChildren } from 'react';

export function SourceLink({
	sourceURL,
	sourceLine,
}: PropsWithChildren<{
	readonly sourceLine?: number | undefined;
	readonly sourceURL?: string | undefined;
}>) {
	return (
		<a
			className="text-blurple"
			href={sourceLine ? `${sourceURL}#L${sourceLine}` : sourceURL}
			rel="external noopener noreferrer"
			target="_blank"
		>
			<VscFileCode />
		</a>
	);
}
