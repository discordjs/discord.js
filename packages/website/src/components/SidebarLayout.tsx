import type { getMembers, ApiItemJSON } from '@discordjs/api-extractor-utils';
import { Title } from '@mantine/core';
import { useScrollLock, useMediaQuery } from '@mantine/hooks';
import Image from 'next/future/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useTheme } from 'next-themes';
import { type PropsWithChildren, useState, useEffect, useMemo, Fragment } from 'react';
import { VscColorMode, VscGithubInverted, VscMenu } from 'react-icons/vsc';
// import useSWR from 'swr';
import { styled } from '../../stitches.config';
import vercelLogo from '../assets/powered-by-vercel.svg';
import { Box } from './Box';
import { Button } from './Button';
import { Container } from './Container';
import { SidebarItems } from './SidebarItems';
// import { PACKAGES } from '~/util/constants';
import type { findMember } from '~/util/model.server';

// const fetcher = async (url: string) => {
// 	const res = await fetch(url);
// 	return res.json();
// };

export interface SidebarLayoutProps {
	branchName: string;
	data: {
		member: ReturnType<typeof findMember>;
		members: ReturnType<typeof getMembers>;
		searchIndex: any[];
		source: MDXRemoteSerializeResult;
	};
	packageName: string;

	selectedMember?: ApiItemJSON | undefined;
}

export type Members = SidebarLayoutProps['data']['members'];

export interface GroupedMembers {
	Classes: Members;
	Enums: Members;
	Functions: Members;
	Interfaces: Members;
	Types: Members;
	Variables: Members;
}

const StickyHeader = styled('header', {
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100%',
	zIndex: 2,
	background: '$gray1',
	boxShadow: '0 0 0 1px $colors$gray6',
});

const Navbar = styled('nav', {
	position: 'fixed',
	top: 71,
	left: 0,
	bottom: 0,
	width: '100%',
	background: '$gray1',
	zIndex: 2,
	height: 'calc(100vh - 71px)',
	borderRight: '1px solid $colors$gray6',

	'@md': {
		width: 300,
		maxWidth: 300,
	},
});

const ArticleContent = styled('div', {
	position: 'relative',
	minHeight: 'calc(100vh - 50px)',
	paddingTop: 24,
	paddingLeft: 24,
	paddingRight: 24,
	paddingBottom: 80,
	zIndex: 1,
	background: '$gray1',
	boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
});

const LinkList = styled('div', {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: 50,
	justifyContent: 'space-between',
	width: '100%',

	'@sm': {
		flexDirection: 'row',
		gap: 0,
	},
});

const Footer = styled('footer', {
	position: 'fixed',
	bottom: 0,
	left: 0,
	right: 0,
	background: '$gray1',
	height: 300,

	'@sm': {
		height: 200,
		paddingLeft: 12,
		paddingRight: 64,
	},

	'@md': {
		paddingLeft: 342,
	},
});

// const packageMenuItems = PACKAGES.map((pkg) => (
// 	<Menu.Item
// 		key={pkg}
// 		component={NextLink}
// 		href={`/docs/packages/${pkg}/main`}
// 		sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.white : theme.black })}
// 	>
// 		{pkg}
// 	</Menu.Item>
// ));

export function SidebarLayout({ data, children }: PropsWithChildren<Partial<SidebarLayoutProps>>) {
	const router = useRouter();
	const [asPathWithoutQueryAndAnchor, setAsPathWithoutQueryAndAnchor] = useState('');
	// const { data: versions } = useSWR<string[]>(
	// 	`https://docs.discordjs.dev/api/info?package=${packageName ?? 'builders'}`,
	// 	fetcher,
	// );
	const { resolvedTheme, setTheme } = useTheme();
	const toggleTheme = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
	const [, setScrollLocked] = useScrollLock();
	const matches = useMediaQuery('(min-width: 992px)', true, { getInitialValueInEffect: false });
	const [opened, setOpened] = useState(false);
	// const [openedLibPicker, setOpenedLibPicker] = useState(false);
	// const [openedVersionPicker, setOpenedVersionPicker] = useState(false);

	useEffect(() => {
		if (matches) {
			setOpened(false);
		}

		return () => setOpened(false);
	}, [matches]);

	useEffect(() => {
		if (opened) {
			setScrollLocked(true);
		} else {
			setScrollLocked(false);
		}

		return () => setScrollLocked(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [opened]);

	useEffect(() => {
		setOpened(false);
		// setOpenedLibPicker(false);
		// setOpenedVersionPicker(false);

		return () => setOpened(false);
	}, []);

	useEffect(() => {
		setAsPathWithoutQueryAndAnchor(router.asPath.split('?')[0]?.split('#')[0]?.split(':')[0] ?? '');
	}, [router.asPath]);

	// const versionMenuItems = useMemo(
	// 	() =>
	// 		versions?.map((item) => (
	// 			<Menu.Item
	// 				key={item}
	// 				component={NextLink}
	// 				href={`/docs/packages/${packageName ?? 'builders'}/${item}`}
	// 				sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.white : theme.black })}
	// 			>
	// 				{item}
	// 			</Menu.Item>
	// 		)) ?? [],
	// 	[versions, packageName],
	// );

	const pathElements = useMemo(
		() =>
			asPathWithoutQueryAndAnchor.split('/').map((path, idx, original) => (
				<Link key={idx} href={original.slice(0, idx + 1).join('/')} passHref prefetch={false}>
					<Box as="a" css={{ color: '$gray12', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
						{path}
					</Box>
				</Link>
			)),
		[asPathWithoutQueryAndAnchor],
	);

	const breadcrumbs = useMemo(
		() =>
			pathElements.flatMap((el, idx, array) => {
				if (idx !== array.length - 1) {
					return (
						<Fragment key={idx}>
							{el}
							<Box css={{ marginLeft: 10, marginRight: 10 }}>/</Box>
						</Fragment>
					);
				}

				return <Fragment key={idx}>{el}</Fragment>;
			}),
		[pathElements],
	);

	return (
		<>
			<StickyHeader>
				<Box css={{ height: '70px', padding: '0 24px' }}>
					<Box css={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
						<Button
							css={{ '@md': { display: 'none' } }}
							icon="sm"
							transparent
							onClick={() => setOpened((open) => !open)}
						>
							<VscMenu size={24} />
						</Button>
						<Box css={{ display: 'none', '@md': { display: 'flex' } }}>{breadcrumbs}</Box>
						<Box css={{ display: 'flex', gap: 20 }}>
							<Button
								as="a"
								href="https://github.com/discordjs/discord.js"
								target="_blank"
								rel="noopener noreferrer"
								icon="sm"
								transparent
							>
								<VscGithubInverted size={24} />
							</Button>
							<Button onClick={() => toggleTheme()} icon="sm" transparent>
								{<VscColorMode size={24} />}
							</Button>
						</Box>
					</Box>
				</Box>
			</StickyHeader>
			<Navbar
				css={{
					overflowY: 'auto',
					display: opened ? 'block' : 'none',
					'@md': { display: 'block' },
				}}
			>
				<SidebarItems members={data?.members ?? []} setOpened={setOpened} />
			</Navbar>
			<Box
				as="main"
				css={{
					paddingTop: '70px',
					'@md': { paddingLeft: 300 },
					'@lg': { paddingRight: data?.member?.kind === 'Class' || data?.member?.kind === 'Interface' ? 250 : 0 },
				}}
			>
				<article>
					<ArticleContent>{children}</ArticleContent>
					<Box css={{ height: 300, '@sm': { height: 200 } }} />
					<Footer
						css={{
							'@lg': {
								paddingRight: data?.member?.kind === 'Class' || data?.member?.kind === 'Interface' ? 300 : 64,
							},
						}}
					>
						<Container css={{ height: 'unset', padding: 0, paddingTop: 50 }}>
							<LinkList>
								<a
									href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"
									target="_blank"
									rel="noopener noreferrer"
									title="Vercel"
								>
									<Image src={vercelLogo} alt="Vercel" />
								</a>
								<Box css={{ display: 'flex', gap: 24, '@sm': { gap: 50 } }}>
									<Box css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
										<Title order={4}>Community</Title>
										<Box
											css={{
												display: 'flex',
												flexDirection: 'column',
												gap: 4,
												a: { color: '$gray12', textDecoration: 'none' },
											}}
										>
											<a href="https://discord.gg/djs" target="_blank" rel="noopener noreferrer">
												Discord
											</a>
											<a
												href="https://github.com/discordjs/discord.js/discussions"
												target="_blank"
												rel="noopener noreferrer"
											>
												GitHub discussions
											</a>
										</Box>
									</Box>
									<Box css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
										<Title order={4}>Project</Title>
										<Box
											css={{
												display: 'flex',
												flexDirection: 'column',
												gap: 4,
												a: { color: '$gray12', textDecoration: 'none' },
											}}
										>
											<a href="https://github.com/discordjs/discord.js" target="_blank" rel="noopener noreferrer">
												discord.js
											</a>
											<a href="https://discordjs.guide" target="_blank" rel="noopener noreferrer">
												discord.js guide
											</a>
											<a href="https://discord-api-types.dev" target="_blank" rel="noopener noreferrer">
												discord-api-types
											</a>
										</Box>
									</Box>
								</Box>
							</LinkList>
						</Container>
					</Footer>
				</article>
			</Box>
		</>
	);
}
