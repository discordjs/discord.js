import { VscFileCode } from '@react-icons/all-files/vsc/VscFileCode';

export function SourceLink({
	className,
	sourceURL,
	sourceLine,
}: {
	readonly className?: string | undefined;
	readonly sourceLine?: number | undefined;
	readonly sourceURL?: string | undefined;
}) {
	return (
		<a
			className={` text-blurple ${className}`}
			href={sourceLine ? `${sourceURL}#L${sourceLine}` : sourceURL}
			rel="external noopener noreferrer"
			target="_blank"
		>
			<VscFileCode />
		</a>
	);
}
