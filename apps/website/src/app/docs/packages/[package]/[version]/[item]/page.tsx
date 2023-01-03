/* eslint-disable no-case-declarations */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
// eslint-disable-next-line n/prefer-global/process
import process, { cwd } from 'node:process';
import { findPackage } from '@discordjs/api-extractor-utils';
import { createApiModel } from '@discordjs/scripts';
import type {
	ApiClass,
	ApiEnum,
	ApiInterface,
	ApiItem,
	ApiTypeAlias,
	ApiVariable,
} from '@microsoft/api-extractor-model';
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
import vercelLogo from '../../../../../../assets/powered-by-vercel.svg';
import { fetchModelJSON } from '~/app/docAPI';
import { MDXRemote } from '~/components/MDXRemote';
import { Class } from '~/components/model/Class';
import { Interface } from '~/components/model/Interface';
import { TypeAlias } from '~/components/model/TypeAlias';
import { Variable } from '~/components/model/Variable';
import { Enum } from '~/components/model/enum/Enum';
import { Function } from '~/components/model/function/Function';
import { DESCRIPTION, PACKAGES } from '~/util/constants';
import { findMember, findMemberByKey } from '~/util/model.server';
// import { tryResolveDescription } from '~/util/summary';

export async function generateStaticParams({ params }: { params?: { package: string; version: string } }) {
	const packageName = params?.package ?? 'builders';
	const version = params?.version ?? 'main';

	const modelJSON = await fetchModelJSON(packageName, version);
	const model = createApiModel(modelJSON);

	const pkg = model.tryGetPackageByName(packageName);

	if (!pkg) {
		return notFound();
	}

	const entry = pkg.entryPoints[0];

	if (!entry) {
		return notFound();
	}

	const { members } = entry;

	return members.map((member) => ({
		item: member.displayName,
	}));

	// try {
	// 	let data: any[] = [];
	// 	let versions: string[] = [];
	// 	if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
	// 		const res = await readFile(join(cwd(), '..', '..', 'packages', packageName, 'docs', 'docs.api.json'), 'utf8');
	// 		data = JSON.parse(res);
	// 	} else {
	// 		const response = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName}`, {
	// 			next: { revalidate: 3_600 },
	// 		});
	// 		versions = await response.json();
	// 		versions = versions.slice(-2);

	// 		for (const version of versions) {
	// 			const res = await fetch(`https://docs.discordjs.dev/docs/${packageName}/${version}.api.json`);
	// 			data = [...data, await res.json()];
	// 		}
	// 	}

	// 	if (Array.isArray(data)) {
	// 		const models = data.map((innerData) => createApiModel(innerData));
	// 		const pkgs = models.map((model) => findPackage(model, packageName)) as ApiPackage[];

	// 		return [
	// 			...versions.map((version) => ({ slug: [version] })),
	// 			...pkgs.flatMap((pkg, idx) =>
	// 				getMembers(pkg, versions[idx] ?? 'main').map((member) => {
	// 					if (member.kind === ApiItemKind.Function && member.overloadIndex && member.overloadIndex > 1) {
	// 						return {
	// 							slug: [versions[idx] ?? 'main', `${member.name}:${member.overloadIndex}:${member.kind}`],
	// 						};
	// 					}

	// 					return {
	// 						slug: [versions[idx] ?? 'main', `${member.name}:${member.kind}`],
	// 					};
	// 				}),
	// 			),
	// 		];
	// 	}

	// 	const model = createApiModel(data);
	// 	const pkg = findPackage(model, packageName)!;

	// 	return [
	// 		{ slug: ['main'] },
	// 		...getMembers(pkg, 'main').map((member) => {
	// 			if (member.kind === ApiItemKind.Function && member.overloadIndex && member.overloadIndex > 1) {
	// 				return {
	// 					slug: ['main', `${member.name}:${member.overloadIndex}:${member.kind}`],
	// 				};
	// 			}

	// 			return { slug: ['main', `${member.name}:${member.kind}`] };
	// 		}),
	// 	];
	// } catch {
	// 	return [{ slug: ['main'] }];
	// }
}

async function getData(params: { item: string; package: string; version: string }) {
	const { package: packageName, version: branchName = 'main', item } = params;

	if (!PACKAGES.includes(packageName)) {
		notFound();
	}

	let data;
	try {
		if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
			const res = await readFile(join(cwd(), '..', '..', 'packages', packageName, 'docs', 'docs.api.json'), 'utf8');
			data = JSON.parse(res);
		} else {
			const res = await fetch(`https://docs.discordjs.dev/docs/${packageName}/${branchName}.api.json`);
			data = await res.json();
		}
	} catch {
		notFound();
	}

	const [memberName, overloadIndex] = item?.split('%3A') ?? [];

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
	let { containerKey, displayName: name } = findMember(model, packageName, memberName, branchName) ?? {};
	if (name && overloadIndex && !Number.isNaN(Number.parseInt(overloadIndex, 10))) {
		containerKey = ApiFunction.getContainerKey(name, Number.parseInt(overloadIndex, 10));
	}

	const foundMember =
		memberName && containerKey ? findMemberByKey(model, packageName, containerKey, branchName) ?? null : null;
	// const description = foundMember ? tryResolveDescription(foundMember) ?? DESCRIPTION : DESCRIPTION;

	return {
		packageName,
		branchName,
		source: mdxSource,
		member: foundMember,
		members:
			model
				.tryGetPackageByName(packageName)
				?.members?.[0]?.members.filter(
					(member) => !(member.kind === ApiItemKind.Function && (member as ApiFunction).overloadIndex > 1),
				) ?? [],
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

function member(version: string, props?: ApiItem) {
	switch (props?.kind) {
		case 'Class':
			return <Class clazz={props as ApiClass} version={version} />;
		case 'Function':
			return <Function item={props as ApiFunction} key={props.containerKey} />;
		case 'Interface':
			return <Interface item={props as ApiInterface} version={version} />;
		case 'TypeAlias':
			return <TypeAlias item={props as ApiTypeAlias} />;
		case 'Variable':
			return <Variable item={props as ApiVariable} />;
		case 'Enum':
			return <Enum item={props as ApiEnum} version={version} />;
		default:
			return <div>Cannot render that item type</div>;
	}
}

export default async function Page({ params }: { params: { item: string; package: string; version: string } }) {
	const data = await getData(params);
	const { version } = params;
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
		<div>
			{/* <Head>
				<title key="title">{name}</title>
				<meta content={params.data.description} key="description" name="description" />
				<meta content={ogTitle} key="og_title" property="og:title" />
				<meta content={params.data.description} key="og_description" property="og:description" />
				<meta content={`https://discordjs.dev/api/og_model${ogImage}`} key="og_image" property="og:image" />
			</Head> */}
			<main
				className={`pt-18 lg:pl-76 ${
					(data?.member?.kind === 'Class' || data?.member?.kind === 'Interface') &&
					(data.member as ApiClass | ApiInterface).members.length
						? 'xl:pr-64'
						: ''
				}`}
			>
				<article className="dark:bg-dark-600 bg-light-600">
					<div className="dark:bg-dark-800 relative z-10 min-h-[calc(100vh_-_70px)] bg-white p-6 pb-20 shadow">
						{data?.member ? (
							member(version, data.member)
						) : data?.source ? (
							<div className="prose max-w-none">
								<MDXRemote {...data?.source} />
							</div>
						) : null}
					</div>
					<div className="h-76 md:h-52" />
					<footer
						className={`dark:bg-dark-600 h-76 lg:pl-84 bg-light-600 fixed bottom-0 left-0 right-0 md:h-52 md:pl-4 md:pr-16 ${
							(data?.member?.kind === 'Class' || data?.member?.kind === 'Interface') &&
							(data.member as ApiClass | ApiInterface).members.length
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
		</div>
	);
}
