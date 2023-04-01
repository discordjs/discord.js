import { FiLink } from '@react-icons/all-files/fi/FiLink';

export function Anchor({ href }: { href: string }) {
	return (
		<a className="focus:ring-width-2 focus:ring-blurple mr-1 inline-block rounded outline-0 focus:ring" href={href}>
			<FiLink size={20} />
		</a>
	);
}
