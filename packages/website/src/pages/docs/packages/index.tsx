import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MouseEvent } from 'react';
import { VscArrowRight, VscPackage } from 'react-icons/vsc';
import { styled } from '../../../../stitches.config';
import { PACKAGES } from '~/util/packages';

const Container = styled('div', {
	display: 'flex',
	placeItems: 'center',
	padding: 32,
	maxWidth: 540,
	margin: 'auto',

	'@md': {
		height: '100%',
		padding: '0 32px',
	},
});

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

const SplitContainer = styled('div', {
	display: 'flex',
	placeContent: 'space-between',
	placeItems: 'center',
	gap: 16,

	variants: {
		vertical: {
			true: {
				flexDirection: 'column',
				placeContent: 'unset',
				placeItems: 'unset',
			},
		},
	},
});

const Title = styled('span', {
	color: '$gray12',
	fontWeight: 600,
});

const AnchorButton = styled('a', {
	display: 'flex',
	placeItems: 'center',
	backgroundColor: '$blue9',
	appearance: 'none',
	textDecoration: 'none',
	userSelect: 'none',
	height: 26,
	padding: '0 8px',
	borderRadius: 4,
	color: 'white',
	lineHeight: 1,
	fontWeight: 600,
	fontSize: 14,

	'&:hover': {
		backgroundColor: '$blue10',
	},

	'&:active': {
		transform: 'translate3d(0, 1px, 0)',
	},
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
		<Container>
			<SplitContainer vertical css={{ flexGrow: 1 }}>
				<Heading>Select a package:</Heading>
				{PACKAGES.map((pkg) => (
					<PackageSelection
						key={pkg}
						role="link"
						onClick={(ev: MouseEvent<HTMLDivElement>) => void handleClick(ev, pkg)}
					>
						<SplitContainer>
							<SplitContainer css={{ flexGrow: 1 }}>
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
