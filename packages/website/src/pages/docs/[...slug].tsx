/* eslint-disable @typescript-eslint/no-throw-literal */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Box } from '@mantine/core';
import { ApiFunction } from '@microsoft/api-extractor-model';
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import type { DocClass } from '~/DocModel/DocClass';
import type { DocEnum } from '~/DocModel/DocEnum';
import type { DocFunction } from '~/DocModel/DocFunction';
import type { DocInterface } from '~/DocModel/DocInterface';
import type { DocTypeAlias } from '~/DocModel/DocTypeAlias';
import type { DocVariable } from '~/DocModel/DocVariable';
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
						{ params: { slug: ['main', 'packages', packageName] } },
						...getMembers(pkg!)
							// Filtering out enum `RESTEvents` because of interface with similar name `RestEvents`
							// causing next.js export to error
							.filter((member) => member.name !== 'RESTEvents')
							.map((member) => {
								if (member.kind === 'Function' && member.overloadIndex && member.overloadIndex > 1) {
									return {
										params: {
											slug: ['main', 'packages', packageName, `${member.name}:${member.overloadIndex}`],
										},
									};
								}

								return { params: { slug: ['main', 'packages', packageName, member.name] } };
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
	const [branchName = 'main', , packageName = 'builders', member = 'ActionRowBuilder'] = params!.slug as string[];

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
					member:
						memberName && containerKey ? findMemberByKey(model, packageName, containerKey)?.toJSON() ?? null : null,
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
			return <Class data={props as ReturnType<DocClass['toJSON']>} />;
		case 'Function':
			return <Function data={props as ReturnType<DocFunction['toJSON']>} />;
		case 'Interface':
			return <Interface data={props as ReturnType<DocInterface['toJSON']>} />;
		case 'TypeAlias':
			return <TypeAlias data={props as ReturnType<DocTypeAlias['toJSON']>} />;
		case 'Variable':
			return <Variable data={props as ReturnType<DocVariable['toJSON']>} />;
		case 'Enum':
			return <Enum data={props as ReturnType<DocEnum['toJSON']>} />;
		default:
			return <Box>Cannot render that item type</Box>;
	}
};

export default function Slug(props: Partial<SidebarLayoutProps & { error?: string }>) {
	return props.error ? (
		<div className="flex max-w-full h-full bg-white dark:bg-dark">{props.error}</div>
	) : (
		<MemberProvider member={props.data?.member}>
			<SidebarLayout {...props}>{props.data?.member ? member(props.data.member) : null}</SidebarLayout>
		</MemberProvider>
	);
}
