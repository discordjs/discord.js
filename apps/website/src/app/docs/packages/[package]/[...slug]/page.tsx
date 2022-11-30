/* eslint-disable no-case-declarations */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
// eslint-disable-next-line n/prefer-global/process
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
import { ApiFunction, ApiItemKind, type ApiPackage } from '@microsoft/api-extractor-model';
import Image from 'next/image';
// import Head from 'next/head';
import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeIgnore from 'rehype-ignore';
import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { getHighlighter } from 'shiki';
import shikiLangJavascript from 'shiki/languages/javascript.tmLanguage.json';
import shikiLangTypescript from 'shiki/languages/typescript.tmLanguage.json';
import shikiThemeDarkPlus from 'shiki/themes/dark-plus.json';
import shikiThemeLightPlus from 'shiki/themes/light-plus.json';
import vercelLogo from '../../../../../assets/powered-by-vercel.svg';
import { MDXRemote } from '~/components/MDXRemote';
import { Nav } from '~/components/Nav';
import { Class } from '~/components/model/Class';
import { Enum } from '~/components/model/Enum';
import { Function } from '~/components/model/Function';
import { Interface } from '~/components/model/Interface';
import { TypeAlias } from '~/components/model/TypeAlias';
import { Variable } from '~/components/model/Variable';
import { MemberProvider } from '~/contexts/member';
import { DESCRIPTION, PACKAGES } from '~/util/constants';
import { findMember, findMemberByKey } from '~/util/model.server';
import { tryResolveDescription } from '~/util/summary';

export async function generateStaticParams({ params }: { params: { package: string } }) {
	const packageName = params.package;

	if (!packageName) {
		return [{ slug: [] }];
	}

	try {
		let data: any[] = [];
		let versions: string[] = [];
		if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
			const res = await readFile(join(cwd(), '..', '..', 'packages', packageName, 'docs', 'docs.api.json'), 'utf8');
			data = JSON.parse(res);
		} else {
			const response = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName}`);
			versions = await response.json();
			versions = versions.slice(-2);

			for (const version of versions) {
				const res = await fetch(`https://docs.discordjs.dev/docs/${packageName}/${version}.api.json`);
				data = [...data, await res.json()];
			}
		}

		if (Array.isArray(data)) {
			const models = data.map((innerData) => createApiModel(innerData));
			const pkgs = models.map((model) => findPackage(model, packageName)) as ApiPackage[];

			return [
				...versions.map((version) => ({ slug: ['packages', packageName, version] })),
				...pkgs.flatMap((pkg, idx) =>
					getMembers(pkg, versions[idx] ?? 'main').map((member) => {
						if (member.kind === ApiItemKind.Function && member.overloadIndex && member.overloadIndex > 1) {
							return {
								slug: [
									'packages',
									packageName,
									versions[idx] ?? 'main',
									`${member.name}:${member.overloadIndex}:${member.kind}`,
								],
							};
						}

						return {
							slug: ['packages', packageName, versions[idx] ?? 'main', `${member.name}:${member.kind}`],
						};
					}),
				),
			];
		}

		const model = createApiModel(data);
		const pkg = findPackage(model, packageName)!;

		return [
			{ slug: ['packages', packageName, 'main'] },
			...getMembers(pkg, 'main').map((member) => {
				if (member.kind === ApiItemKind.Function && member.overloadIndex && member.overloadIndex > 1) {
					return {
						slug: ['packages', packageName, 'main', `${member.name}:${member.overloadIndex}:${member.kind}`],
					};
				}

				return { slug: ['packages', packageName, 'main', `${member.name}:${member.kind}`] };
			}),
		];
	} catch {
		return [{ slug: [] }];
	}
}

async function getData(packageName: string, slug: string[]) {
	const [branchName = 'main', member] = slug;

	if (!PACKAGES.includes(packageName)) {
		notFound();
	}

	let data;
	try {
		if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
			const res = await readFile(join(cwd(), '..', '..', 'packages', packageName, 'docs', 'docs.api.json'), 'utf8');
			data = JSON.parse(res);
		} else {
			const res = await fetch(`https://docs.discordjs.dev/docs/${packageName}/${branchName}.api.json`, {
				next: { revalidate: 3_600 },
			});
			data = await res.json();
		}
	} catch {
		notFound();
	}

	const [memberName, overloadIndex] = member?.split('%3A') ?? [];

	const readme = await readFile(join(cwd(), 'src', 'assets', 'readme', packageName, 'home-README.md'), 'utf8');

	const mdxSource = await serialize(readme, {
		mdxOptions: {
			remarkPlugins: [remarkGfm],
			remarkRehypeOptions: { allowDangerousHtml: true },
			rehypePlugins: [
				rehypeRaw,
				rehypeIgnore,
				rehypeSlug,
				[
					rehypePrettyCode,
					{
						theme: {
							dark: shikiThemeDarkPlus,
							light: shikiThemeLightPlus,
						},
						getHighlighter: async (options?: Partial<Options>) =>
							getHighlighter({
								...options,
								langs: [
									// @ts-expect-error: Working as intended
									{ id: 'javascript', aliases: ['js'], scopeName: 'source.js', grammar: shikiLangJavascript },
									// @ts-expect-error: Working as intended
									{ id: 'typescript', aliases: ['ts'], scopeName: 'source.ts', grammar: shikiLangTypescript },
								],
							}),
					},
				],
			],
			format: 'md',
		},
	});

	const model = createApiModel(data);
	const pkg = findPackage(model, packageName);

	// eslint-disable-next-line prefer-const
	let { containerKey, name } = findMember(model, packageName, memberName, branchName) ?? {};
	if (name && overloadIndex && !Number.isNaN(Number.parseInt(overloadIndex, 10))) {
		containerKey = ApiFunction.getContainerKey(name, Number.parseInt(overloadIndex, 10));
	}

	const members = pkg
		? getMembers(pkg, branchName).filter((item) => item.overloadIndex === null || item.overloadIndex <= 1)
		: [];
	const foundMember =
		memberName && containerKey ? findMemberByKey(model, packageName, containerKey, branchName) ?? null : null;
	const description = foundMember ? tryResolveDescription(foundMember) ?? DESCRIPTION : DESCRIPTION;

	return {
		packageName,
		branchName,
		data: {
			members,
			member: foundMember,
			description,
			source: mdxSource,
		},
	};
}

// function resolveMember(packageName?: string | undefined, member?: SidebarLayoutProps['data']['member']) {
// 	switch (member?.kind) {
// 		case 'Class': {
// 			const typedMember = member as ApiClassJSON;
// 			return `?pkg=${packageName}&kind=${typedMember.kind}&name=${typedMember.name}&methods=${typedMember.methods.length}&props=${typedMember.properties.length}`;
// 		}

// 		case 'Function': {
// 			const typedMember = member as ApiFunctionJSON;
// 			return `?pkg=${packageName}&kind=${typedMember.kind}&name=${typedMember.name}`;
// 		}

// 		case 'Interface': {
// 			const typedMember = member as ApiInterfaceJSON;
// 			return `?pkg=${packageName}&kind=${typedMember.kind}&name=${typedMember.name}&methods=${typedMember.methods.length}&props=${typedMember.properties.length}`;
// 		}

// 		case 'TypeAlias': {
// 			const typedMember = member as ApiTypeAliasJSON;
// 			return `?pkg=${packageName}&kind=${typedMember.kind}&name=${typedMember.name}`;
// 		}

// 		case 'Variable': {
// 			const typedMember = member as ApiVariableJSON;
// 			return `?pkg=${packageName}&kind=${typedMember.kind}&name=${typedMember.name}`;
// 		}

// 		case 'Enum': {
// 			const typedMember = member as ApiEnumJSON;
// 			return `?pkg=${packageName}&kind=${typedMember.kind}&name=${typedMember.name}&members=${typedMember.members.length}`;
// 		}

// 		default: {
// 			return `?pkg=${packageName}&kind=${member?.kind}&name=${member?.name}`;
// 		}
// 	}
// }

function member(props?: ApiItemJSON | undefined) {
	switch (props?.kind) {
		case 'Class':
			return <Class data={props as ApiClassJSON} />;
		case 'Function':
			return <Function data={props as ApiFunctionJSON} key={props.containerKey} />;
		case 'Interface':
			return <Interface data={props as ApiInterfaceJSON} />;
		case 'TypeAlias':
			return <TypeAlias data={props as ApiTypeAliasJSON} />;
		case 'Variable':
			return <Variable data={props as ApiVariableJSON} />;
		case 'Enum':
			return <Enum data={props as ApiEnumJSON} />;
		default:
			return <div>Cannot render that item type</div>;
	}
}

export default async function Page({ params }: { params: { package: string; slug: string[] } }) {
	const data = await getData(params.package, params.slug);

	// const name = useMemo(
	// 	() => `discord.js${params.data?.member?.name ? ` | ${params.data.member.name}` : ''}`,
	// 	[params.data?.member?.name],
	// );
	// const ogTitle = useMemo(
	// 	() => `${params.packageName ?? 'discord.js'}${params.data?.member?.name ? ` | ${params.data.member.name}` : ''}`,
	// 	[params.packageName, params.data?.member?.name],
	// );
	// const ogImage = useMemo(
	// 	() => resolveMember(params.packageName, params.data?.member),
	// 	[params.packageName, params.data?.member],
	// );

	// Just in case
	// return <iframe src="https://discord.js.org" style={{ border: 0, height: '100%', width: '100%' }}></iframe>;

	return (
		<MemberProvider member={data.data?.member}>
			<Nav members={data.data.members} />
			<>
				{/* <Head>
								<title key="title">{name}</title>
								<meta content={params.data.description} key="description" name="description" />
								<meta content={ogTitle} key="og_title" property="og:title" />
								<meta content={params.data.description} key="og_description" property="og:description" />
								<meta content={`https://discordjs.dev/api/og_model${ogImage}`} key="og_image" property="og:image" />
							</Head> */}
				<main
					className={`pt-18 lg:pl-76 ${
						(data?.data.member?.kind === 'Class' || data?.data.member?.kind === 'Interface') &&
						((data.data.member as ApiClassJSON | ApiInterfaceJSON).methods?.length ||
							(data.data.member as ApiClassJSON | ApiInterfaceJSON).properties?.length)
							? 'xl:pr-64'
							: ''
					}`}
				>
					<article className="dark:bg-dark-600 bg-light-600">
						<div className="dark:bg-dark-800 relative z-10 min-h-[calc(100vh_-_70px)] bg-white p-6 pb-20 shadow">
							{data.data?.member ? (
								member(data.data.member)
							) : data.data?.source ? (
								<div className="prose max-w-none">
									<MDXRemote {...data.data?.source} />
								</div>
							) : null}
						</div>
						<div className="h-76 md:h-52" />
						<footer
							className={`dark:bg-dark-600 h-76 lg:pl-84 bg-light-600 fixed bottom-0 left-0 right-0 md:h-52 md:pl-4 md:pr-16 ${
								(data?.data.member?.kind === 'Class' || data?.data.member?.kind === 'Interface') &&
								((data.data.member as ApiClassJSON | ApiInterfaceJSON).methods?.length ||
									(data.data.member as ApiClassJSON | ApiInterfaceJSON).properties?.length)
									? 'xl:pr-76'
									: 'xl:pr-16'
							}`}
						>
							<div className="mx-auto flex max-w-6xl flex-col place-items-center gap-12 pt-12 lg:place-content-center">
								<div className="flex w-full flex-col place-content-between place-items-center gap-12 md:flex-row md:gap-0">
									<a
										className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
										href="https://vercel.com/?utm_source=discordjs&utm_campaign=oss"
										rel="noopener noreferrer"
										target="_blank"
										title="Vercel"
									>
										<Image alt="Vercel" src={vercelLogo} />
									</a>
									<div className="flex flex-row gap-6 md:gap-12">
										<div className="flex flex-col gap-2">
											<div className="text-lg font-semibold">Community</div>
											<div className="flex flex-col gap-1">
												<a
													className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
													href="https://discord.gg/djs"
													rel="noopener noreferrer"
													target="_blank"
												>
													Discord
												</a>
												<a
													className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
													href="https://github.com/discordjs/discord.js/discussions"
													rel="noopener noreferrer"
													target="_blank"
												>
													GitHub discussions
												</a>
											</div>
										</div>
										<div className="flex flex-col gap-2">
											<div className="text-lg font-semibold">Project</div>
											<div className="flex flex-col gap-1">
												<a
													className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
													href="https://github.com/discordjs/discord.js"
													rel="noopener noreferrer"
													target="_blank"
												>
													discord.js
												</a>
												<a
													className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
													href="https://discordjs.guide"
													rel="noopener noreferrer"
													target="_blank"
												>
													discord.js guide
												</a>
												<a
													className="focus:ring-width-2 focus:ring-blurple rounded outline-0 focus:ring"
													href="https://discord-api-types.dev"
													rel="noopener noreferrer"
													target="_blank"
												>
													discord-api-types
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</footer>
					</article>
				</main>
			</>
		</MemberProvider>
	);
}
