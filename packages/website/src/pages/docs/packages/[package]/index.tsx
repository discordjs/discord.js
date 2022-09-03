import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import { VscArrowRight, VscVersions } from 'react-icons/vsc';
import { styled } from '../../../../../stitches.config';
import { Container } from '~/components/Container';
import { SelectionButton } from '~/components/SelectionButton';
import { SplitContainer } from '~/components/SplitContainer';
import { PACKAGES } from '~/util/constants';

interface VersionProps {
	data: {
		versions: string[];
	};
	packageName: string;
}

export const getStaticPaths: GetStaticPaths = () => {
	const versions = PACKAGES.map((packageName) => ({ params: { package: packageName } }));

	return {
		paths: versions,
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const packageName = params!.package as string | undefined;

	try {
		const res = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName ?? 'builders'}`);
		const data: string[] = await res.json();

		if (!data.length) {
			console.error('No tags');

			return {
				props: {
					error: 'No tags',
				},
				revalidate: 3_600,
			};
		}

		return {
			props: {
				packageName,
				data: {
					versions: data,
				},
			},
			revalidate: 3_600,
		};
	} catch (error_) {
		const error = error_ as Error;
		console.error(error);

		return {
			props: {
				error: error_,
			},
			revalidate: 3_600,
		};
	}
};

const Heading = styled('h1', {
	fontSize: 28,
	margin: 0,
	marginLeft: 8,
});

const Title = styled('span', {
	fontWeight: 600,
});

export default function VersionsRoute(props: Partial<VersionProps> & { error?: string }) {
	return props.error ? (
		<div style={{ display: 'flex', maxWidth: '100%', height: '100%' }}>{props.error}</div>
	) : (
		<Container xs css={{ height: '100%', flexDirection: 'unset', padding: '0 32px' }}>
			<SplitContainer vertical grow center css={{ placeItems: 'unset' }}>
				<Heading>Select a version:</Heading>
				{props.data?.versions.map((version) => (
					<Link key={version} href={`/docs/packages/${props.packageName!}/${version}`} prefetch={false}>
						<SelectionButton>
							<SplitContainer>
								<SplitContainer>
									<VscVersions size={25} />
									<Title>{version}</Title>
								</SplitContainer>
								<VscArrowRight size={20} />
							</SplitContainer>
						</SelectionButton>
					</Link>
				)) ?? null}
			</SplitContainer>
		</Container>
	);
}
