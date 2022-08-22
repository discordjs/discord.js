import { Container, UnstyledButton, createStyles, Group, ThemeIcon, Text, Stack, Box, Title } from '@mantine/core';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import { VscArrowRight, VscPackage } from 'react-icons/vsc';

interface VersionProps {
	packageName: string;
	data: {
		versions: string[];
	};
}

export const getStaticPaths: GetStaticPaths = () => {
	const packages = ['builders', 'collection', 'proxy', 'rest', 'voice', 'ws'];

	const versions = packages.map((packageName) => ({ params: { package: packageName } }));

	return {
		paths: versions,
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const packageName = params!.package as string | undefined;

	try {
		const res = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName ?? 'builders'}`);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const data: string[] = await res.json();

		if (!data.length) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				packageName,
				data: {
					versions: data,
				},
				revalidate: 3600,
			},
		};
	} catch {
		return {
			props: {
				notFound: true,
			},
		};
	}
};

const useStyles = createStyles((theme) => ({
	control: {
		padding: theme.spacing.xs,
		color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.black,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark![6] : theme.colors.gray![0],
			color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		},
	},
}));

export default function VersionsRoute(props: Partial<VersionProps> & { error?: string }) {
	const { classes } = useStyles();

	return props.error ? (
		<Box sx={{ display: 'flex', maxWidth: '100%', height: '100%' }}>{props.error}</Box>
	) : (
		<Container pt={96} size="xs">
			<Stack sx={{ flexGrow: 1 }}>
				<Title order={2} ml="xs">
					Select a version:
				</Title>
				{props.data?.versions.map((version) => (
					<Link key={version} href={`/docs/packages/${props.packageName!}/${version}`} passHref>
						<UnstyledButton className={classes.control} component="a">
							<Group position="apart">
								<Group>
									<ThemeIcon size={30}>
										<VscPackage size={20} />
									</ThemeIcon>
									<Text weight={600} size="md">
										{version}
									</Text>
								</Group>
								<VscArrowRight size={20} />
							</Group>
						</UnstyledButton>
					</Link>
				)) ?? null}
			</Stack>
		</Container>
	);
}
