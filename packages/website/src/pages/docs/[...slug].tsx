import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Box } from '@mantine/core';
import { ApiFunction } from '@microsoft/api-extractor-model';
import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import type {
	ApiClassJSON,
	ApiEnumJSON,
	ApiFunctionJSON,
	ApiInterfaceJSON,
	ApiTypeAliasJSON,
	ApiVariableJSON,
} from '~/DocModel/ApiNodeJSONEncoder';
import { SidebarLayout, type SidebarLayoutProps } from '~/components/SidebarLayout';
import { Class } from '~/components/model/Class';
import { Enum } from '~/components/model/Enum';
import { Function } from '~/components/model/Function';
import { Interface } from '~/components/model/Interface';
import { TypeAlias } from '~/components/model/TypeAlias';
import { Variable } from '~/components/model/Variable';
import { MemberProvider } from '~/contexts/member';
import { createApiModel } from '~/util/api-model.server';
import { findMember, findMemberByKey } from '~/util/model.server';
import { findPackage, getMembers } from '~/util/parse.server';

export const getStaticPaths: GetStaticPaths = async () => {
	const packages = ['builders', 'collection', 'proxy', 'rest', 'voice', 'ws'];

	const pkgs = (
		await Promise.all(
			packages.map(async (packageName) => {
				try {
					let data;
					if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
						const res = await readFile(
							join(__dirname, '..', '..', '..', '..', '..', packageName, 'docs', 'docs.api.json'),
							'utf-8',
						);
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						data = JSON.parse(res);
					} else {
						const res = await fetch(`https://docs.discordjs.dev/docs/${packageName}/main.api.json`);
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						data = await res.json();
					}

					const model = createApiModel(data);
					const pkg = findPackage(model, packageName);

					return [
						{ params: { slug: ['packages', packageName, 'main'] } },
						...getMembers(pkg!)
							// Filtering out enum `RESTEvents` because of interface with similar name `RestEvents`
							// causing next.js export to error
							.filter((member) => member.name !== 'RESTEvents')
							.map((member) => {
								if (member.kind === 'Function' && member.overloadIndex && member.overloadIndex > 1) {
									return {
										params: {
											slug: ['packages', packageName, 'main', `${member.name}:${member.overloadIndex}`],
										},
									};
								}

								return { params: { slug: ['packages', packageName, 'main', member.name] } };
							}),
					];
				} catch {
					return { params: { slug: ['', '', '', ''] } };
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
	const [, packageName = 'builders', branchName = 'main', member = 'ActionRowBuilder'] = params!.slug as string[];

	const [memberName, overloadIndex] = member.split(':') as [string, string | undefined];

	try {
		let data;
		if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
			const res = await readFile(
				join(__dirname, '..', '..', '..', '..', '..', packageName, 'docs', 'docs.api.json'),
				'utf-8',
			);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			data = JSON.parse(res);
		} else {
			const res = await fetch(`https://docs.discordjs.dev/docs/${packageName}/${branchName}.api.json`);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			data = await res.json();
		}

		const model = createApiModel(data);
		const pkg = findPackage(model, packageName);

		let { containerKey, name } = findMember(model, packageName, memberName) ?? {};
		if (name && overloadIndex) {
			containerKey = ApiFunction.getContainerKey(name, parseInt(overloadIndex, 10));
		}

		return {
			props: {
				packageName,
				data: {
					members: pkg ? getMembers(pkg) : [],
					member: memberName && containerKey ? findMemberByKey(model, packageName, containerKey) ?? null : null,
				},
			},
		};
	} catch {
		return {
			props: {
				error: 'FetchError',
			},
		};
	}
};

const member = (props: any) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	switch (props.kind) {
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

export default function Slug(props: Partial<SidebarLayoutProps & { error?: string }>) {
	return props.error ? (
		<Box sx={{ display: 'flex', maxWidth: '100%', height: '100%' }}>{props.error}</Box>
	) : (
		<MemberProvider member={props.data?.member}>
			<SidebarLayout {...props}>
				{props.data?.member ? (
					<>
						<Head>
							<title key="title">discord.js | {props.data.member.name}</title>
						</Head>
						{member(props.data.member)}
					</>
				) : null}
			</SidebarLayout>
		</MemberProvider>
	);
}
