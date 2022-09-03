import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MouseEvent } from 'react';
import { VscArrowRight, VscPackage } from 'react-icons/vsc';
import { styled } from '../../../../stitches.config';
import { AnchorButton } from '~/components/AnchorButton';
import { Container } from '~/components/Container';
import { SplitContainer } from '~/components/SplitContainer';
import { PACKAGES } from '~/util/packages';

const Heading = styled('h1', {
	fontSize: 28,
	margin: 0,
	marginLeft: 8,
});

const PackageSelection = styled('div', {
	color: 'white',
	backgroundColor: '$gray3',
	padding: 10,
	borderRadius: 4,

	'&:hover': {
		backgroundColor: '$gray4',
	},

	'&:active': {
		backgroundColor: '$gray5',
		transform: 'translate3d(0, 1px, 0)',
	},
});

const Title = styled('span', {
	color: '$gray12',
	fontWeight: 600,
});

export default function PackagesRoute() {
	const router = useRouter();

	const handleClick = async (ev: MouseEvent<HTMLDivElement>, packageName: string) => {
		ev.stopPropagation();

		const res = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName ?? 'builders'}`);
		const data: string[] = await res.json();

		const latestVersion = data.at(-2);
		void router.push(`/docs/packages/${packageName}/${latestVersion}`);
	};

	return (
		<Container xs>
			<SplitContainer vertical grow center>
				<Heading>Select a package:</Heading>
				{PACKAGES.map((pkg) => (
					<PackageSelection
						key={pkg}
						role="link"
						onClick={(ev: MouseEvent<HTMLDivElement>) => void handleClick(ev, pkg)}
					>
						<SplitContainer>
							<SplitContainer grow>
								<SplitContainer>
									<VscPackage size={25} />
									<Title>{pkg}</Title>
								</SplitContainer>
								<Link href={`/docs/packages/${pkg}`} passHref prefetch={false}>
									<AnchorButton onClick={(ev: MouseEvent<HTMLAnchorElement>) => ev.stopPropagation()}>
										Select version
									</AnchorButton>
								</Link>
							</SplitContainer>
							<VscArrowRight size={20} />
						</SplitContainer>
					</PackageSelection>
				))}
			</SplitContainer>
		</Container>
	);
}
