import { FiLink } from '@react-icons/all-files/fi/FiLink';

export function Anchor({ href }: { href: string }) {
	return (
		<a
			className="focus:ring-width-2 focus:ring-blurple hidden rounded outline-0 focus:ring md:inline-block"
			href={href}
		>
			<FiLink size={20} />
		</a>
	);
}
