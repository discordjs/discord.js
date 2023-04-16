import { FiLink } from '@react-icons/all-files/fi/FiLink';

export function Anchor({ href }: { href: string }) {
	return (
		<a className="mr-1 inline-block rounded outline-none focus:ring focus:ring-width-2 focus:ring-blurple" href={href}>
			<FiLink size={20} />
		</a>
	);
}
