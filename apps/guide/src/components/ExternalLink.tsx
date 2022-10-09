import { FiExternalLink } from 'react-icons/fi';

export function ExternalLink({ href, title }: { href: string; title: string }) {
	return (
		<a className="text-blurple inline-flex place-items-center gap-2 text-sm font-semibold" href={href}>
			<p>{title}</p>
			<FiExternalLink size={18} />
		</a>
	);
}
