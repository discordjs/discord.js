import { FiExternalLink } from '@react-icons/all-files/fi/FiExternalLink';

export function ExternalLink({ href, title }: { href: string; title: string }) {
	return (
		<a className="inline-flex place-items-center gap-2 text-sm font-semibold text-blurple" href={href}>
			<p>{title}</p>
			<FiExternalLink size={18} />
		</a>
	);
}
