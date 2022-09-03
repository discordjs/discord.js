import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MouseEvent } from 'react';
import { VscArrowRight, VscPackage } from 'react-icons/vsc';
import { styled } from '../../../../stitches.config';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { SelectionButton } from '~/components/SelectionButton';
import { SplitContainer } from '~/components/SplitContainer';
import { PACKAGES } from '~/util/constants';

const Heading = styled('h1', {
	fontSize: 28,
	margin: 0,
	marginLeft: 8,
});

const Title = styled('span', {
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
		<Container xs css={{ height: '100%', flexDirection: 'unset', padding: '0 32px' }}>
			<SplitContainer vertical grow center css={{ placeItems: 'unset' }}>
				<Heading>Select a package:</Heading>
				{PACKAGES.map((pkg) => (
					<SelectionButton
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
									<Button as="a" dense onClick={(ev: MouseEvent<HTMLAnchorElement>) => ev.stopPropagation()}>
										Select version
									</Button>
								</Link>
							</SplitContainer>
							<VscArrowRight size={20} />
						</SplitContainer>
					</SelectionButton>
				))}
			</SplitContainer>
		</Container>
	);
}
