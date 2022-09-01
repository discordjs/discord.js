import {
	Container,
	UnstyledButton,
	createStyles,
	Group,
	ThemeIcon,
	Text,
	Stack,
	Box,
	Title,
	useMantineColorScheme,
	Affix,
} from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import { VscArrowLeft, VscArrowRight, VscVersions } from 'react-icons/vsc';
import { PACKAGES } from '~/util/packages';

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
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

const useStyles = createStyles((theme) => ({
	outer: {
		display: 'flex',
		height: '100%',
		alignItems: 'center',
	},

	control: {
		padding: theme.spacing.xs,
		color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.black,
		borderRadius: theme.radius.xs,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark![6] : theme.colors.gray![0],
			color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		},
	},
}));

export default function VersionsRoute(props: Partial<VersionProps> & { error?: string }) {
	const router = useRouter();
	const { classes } = useStyles();
	const { colorScheme } = useMantineColorScheme();

	return props.error ? (
		<Box sx={{ display: 'flex', maxWidth: '100%', height: '100%' }}>{props.error}</Box>
	) : (
		<Container className={classes.outer} size="xs">
			<Stack sx={{ flexGrow: 1 }}>
				<Title order={2} ml="xs">
					Select a version:
				</Title>
				{props.data?.versions.map((version) => (
					<Link key={version} href={`/docs/packages/${props.packageName!}/${version}`} passHref prefetch={false}>
						<UnstyledButton className={classes.control} component="a">
							<Group position="apart">
								<Group>
									<ThemeIcon variant={colorScheme === 'dark' ? 'filled' : 'outline'} radius="sm" size={30}>
										<VscVersions size={20} />
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
			<Affix position={{ top: 20, left: 20 }}>
				<UnstyledButton onClick={() => void router.push('/docs/packages')}>
					<VscArrowLeft size={25} />
				</UnstyledButton>
			</Affix>
		</Container>
	);
}
