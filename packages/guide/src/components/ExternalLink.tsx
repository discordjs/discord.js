import { FiExternalLink } from 'react-icons/fi';

export function ExternalLink({ href, title }: { href: string; title: string }) {
	return (
		<a className="color-blurple flex content-center items-center justify-center  font-semibold" href={href}>
			<div className="flex space-x-2">
				<p>{title}</p>
				<FiExternalLink size={22} />
			</div>
		</a>
	);
}
