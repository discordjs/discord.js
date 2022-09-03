import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import process, { cwd } from 'node:process';
import {
	findPackage,
	getMembers,
	type ApiItemJSON,
	type ApiClassJSON,
	type ApiFunctionJSON,
	type ApiInterfaceJSON,
	type ApiTypeAliasJSON,
	type ApiVariableJSON,
	type ApiEnumJSON,
} from '@discordjs/api-extractor-utils';
import { createApiModel } from '@discordjs/scripts';
import { ActionIcon, Affix, Box, LoadingOverlay, Transition } from '@mantine/core';
import { useMediaQuery, useWindowScroll } from '@mantine/hooks';
// import { registerSpotlightActions } from '@mantine/spotlight';
import { ApiFunction, ApiItemKind, type ApiPackage } from '@microsoft/api-extractor-model';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
// import { useEffect } from 'react';
import { VscChevronUp } from 'react-icons/vsc';
import rehypeIgnore from 'rehype-ignore';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { SidebarLayout, type SidebarLayoutProps } from '~/components/SidebarLayout';
import { Class } from '~/components/model/Class';
import { Enum } from '~/components/model/Enum';
import { Function } from '~/components/model/Function';
import { Interface } from '~/components/model/Interface';
import { TypeAlias } from '~/components/model/TypeAlias';
import { Variable } from '~/components/model/Variable';
import { MemberProvider } from '~/contexts/member';
import { findMember, findMemberByKey } from '~/util/model.server';
import { PACKAGES } from '~/util/packages';
// import { miniSearch } from '~/util/search';

export const getStaticPaths: GetStaticPaths = async () => {
	const pkgs = (
		await Promise.all(
			PACKAGES.map(async (packageName) => {
				try {
					let data: any[] = [];
					let versions: string[] = [];
					if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
						const res = await readFile(join(cwd(), '..', packageName, 'docs', 'docs.api.json'), 'utf8');
						data = JSON.parse(res);
					} else {
						const response = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName}`);
						versions = await response.json();

						for (const version of versions.slice(-2)) {
							const res = await fetch(`https://docs.discordjs.dev/docs/${packageName}/${version}.api.json`);
							data = [...data, await res.json()];
						}
					}

					if (Array.isArray(data)) {
						const models = data.map((innerData) => createApiModel(innerData));
						const pkgs = models.map((model) => findPackage(model, packageName)) as ApiPackage[];

						return [
							...versions.map((version) => ({ params: { slug: ['packages', packageName, version] } })),
							...pkgs.flatMap((pkg, idx) =>
								getMembers(pkg, versions[idx]!).map((member) => {
									if (member.kind === ApiItemKind.Function && member.overloadIndex && member.overloadIndex > 1) {
										return {
											params: {
												slug: [
													'packages',
													packageName,
													versions[idx]!,
													`${member.name}:${member.overloadIndex}:${member.kind}`,
												],
											},
										};
									}

									return {
										params: {
											slug: ['packages', packageName, versions[idx]!, `${member.name}:${member.kind}`],
										},
									};
								}),
							),
						];
					}

					const model = createApiModel(data);
					const pkg = findPackage(model, packageName)!;

					return [
						{ params: { slug: ['packages', packageName, 'main'] } },
						...getMembers(pkg, 'main').map((member) => {
							if (member.kind === ApiItemKind.Function && member.overloadIndex && member.overloadIndex > 1) {
								return {
									params: {
										slug: ['packages', packageName, 'main', `${member.name}:${member.overloadIndex}:${member.kind}`],
									},
								};
							}

							return { params: { slug: ['packages', packageName, 'main', `${member.name}:${member.kind}`] } };
						}),
					];
				} catch {
					return { params: { slug: [] } };
				}
			}),
		)
	).flat();

	return {
		paths: pkgs,
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const [, packageName = 'builders', branchName = 'main', member] = params!.slug as string[];

	const [memberName, overloadIndex] = member?.split(':') ?? [];

	try {
		const readme = await readFile(join(cwd(), '..', packageName, 'README.md'), 'utf8');

		const mdxSource = await serialize(readme, {
			mdxOptions: {
				remarkPlugins: [remarkGfm],
				remarkRehypeOptions: { allowDangerousHtml: true },
				rehypePlugins: [rehypeRaw, rehypeIgnore, rehypeSlug, [rehypePrettyCode, { theme: 'dark-plus' }]],
				format: 'md',
			},
		});

		let data;
		let searchIndex = [];
		if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
			const res = await readFile(join(cwd(), '..', packageName, 'docs', 'docs.api.json'), 'utf8');
			data = JSON.parse(res);

			const response = await readFile(
				join(cwd(), '..', 'scripts', 'searchIndex', `${packageName}-main-index.json`),
				'utf8',
			);
			searchIndex = JSON.parse(response);
		} else {
			const res = await fetch(`https://docs.discordjs.dev/docs/${packageName}/${branchName}.api.json`);
			data = await res.json();
		}

		const model = createApiModel(data);
		const pkg = findPackage(model, packageName);

		// eslint-disable-next-line prefer-const
		let { containerKey, name } = findMember(model, packageName, memberName, branchName) ?? {};
		if (name && overloadIndex && !Number.isNaN(Number.parseInt(overloadIndex, 10))) {
			containerKey = ApiFunction.getContainerKey(name, Number.parseInt(overloadIndex, 10));
		}

		return {
			props: {
				packageName,
				branchName,
				data: {
					members: pkg ? getMembers(pkg, branchName) : [],
					member:
						memberName && containerKey ? findMemberByKey(model, packageName, containerKey, branchName) ?? null : null,
					source: mdxSource,
					searchIndex,
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

const member = (props?: ApiItemJSON | undefined) => {
	switch (props?.kind) {
		case 'Class':
			return <Class data={props as ApiClassJSON} />;
		case 'Function':
			return <Function data={props as ApiFunctionJSON} />;
		case 'Interface':
			return <Interface data={props as ApiInterfaceJSON} />;
		case 'TypeAlias':
			return <TypeAlias data={props as ApiTypeAliasJSON} />;
		case 'Variable':
			return <Variable data={props as ApiVariableJSON} />;
		case 'Enum':
			return <Enum data={props as ApiEnumJSON} />;
		default:
			return <Box>Cannot render that item type</Box>;
	}
};

export default function SlugPage(props: Partial<SidebarLayoutProps & { error?: string }>) {
	const router = useRouter();
	const [scroll, scrollTo] = useWindowScroll();
	const matches = useMediaQuery('(max-width: 1200px)');

	// useEffect(() => {
	// 	if (props.data?.searchIndex) {
	// 		const searchIndex = props.data?.searchIndex.map((idx, index) => ({ id: index, ...idx })) ?? [];
	// 		miniSearch.addAll(searchIndex);

	// 		registerSpotlightActions(
	// 			searchIndex.map((idx) => ({
	// 				title: idx.name,
	// 				description: idx.summary ?? '',
	// 				onTrigger: () => void router.push(idx.path),
	// 			})),
	// 		);
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	const name = `discord.js${props.data?.member?.name ? ` | ${props.data.member.name}` : ''}`;
	const ogTitle = `${props.packageName ?? 'discord.js'}${
		props.data?.member?.name ? ` | ${props.data.member.name}` : ''
	}`;

	if (router.isFallback) {
		return (
			<SidebarLayout>
				<LoadingOverlay visible overlayBlur={2} />
			</SidebarLayout>
		);
	}

	// Just in case
	// return <iframe src="https://discord.js.org" style={{ border: 0, height: '100%', width: '100%' }}></iframe>;

	return props.error ? (
		<Box sx={{ display: 'flex', maxWidth: '100%', height: '100%' }}>{props.error}</Box>
	) : (
		<MemberProvider member={props.data?.member}>
			<SidebarLayout {...props}>
				{props.data?.member ? (
					<>
						<Head>
							<title key="title">{name}</title>
							<meta key="og_title" property="og:title" content={ogTitle} />
						</Head>
						{member(props.data.member)}
					</>
				) : props.data?.source ? (
					<Box
						sx={(theme) => ({
							a: {
								backgroundColor: 'transparent',
								color: theme.colors.blurple![0],
								textDecoration: 'none',
							},
							img: {
								borderStyle: 'none',
								maxWidth: '100%',
								boxSizing: 'content-box',
							},
						})}
						px="xl"
					>
						<MDXRemote {...props.data.source} />
					</Box>
				) : null}
				<Affix
					position={{
						bottom: 20,
						right:
							matches || (props.data?.member?.kind !== 'Class' && props.data?.member?.kind !== 'Interface') ? 20 : 268,
					}}
				>
					<Transition transition="slide-up" mounted={scroll.y > 200}>
						{(transitionStyles) => (
							<ActionIcon
								variant="filled"
								color="blurple"
								size={30}
								style={transitionStyles}
								onClick={() => scrollTo({ y: 0 })}
							>
								<VscChevronUp size={20} />
							</ActionIcon>
						)}
					</Transition>
				</Affix>
			</SidebarLayout>
		</MemberProvider>
	);
}

export const config = {
	unstable_includeFiles: [
		'../{builders,collection,proxy,rest,voice,ws}/README.md',
		'node_modules/shiki/themes/dark-plus.json',
	],
};
