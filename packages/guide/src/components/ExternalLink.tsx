import { FiExternalLink } from 'react-icons/fi';

export function ExternalLink({ href, title }: { href: string; title: string }) {
	return (
		<a
			className="color-blurple flex flex flex content-center items-center justify-center space-x-2 font-semibold"
			href={href}
		>
			<p>{title}</p>
			<FiExternalLink size={22} />
		</a>
	);
}
