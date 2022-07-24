/* eslint-disable @typescript-eslint/no-throw-literal */
import type { GetStaticPaths, GetStaticProps } from 'next/types';
import type { DocClass } from '~/DocModel/DocClass';
import type { DocEnum } from '~/DocModel/DocEnum';
import type { DocFunction } from '~/DocModel/DocFunction';
import type { DocInterface } from '~/DocModel/DocInterface';
import type { DocTypeAlias } from '~/DocModel/DocTypeAlias';
import type { DocVariable } from '~/DocModel/DocVariable';
import type { ItemListProps } from '~/components/ItemSidebar';
import { SidebarLayout } from '~/components/SidebarLayout';
import { Class } from '~/components/model/Class';
import { Enum } from '~/components/model/Enum';
import { Function } from '~/components/model/Function';
import { Interface } from '~/components/model/Interface';
import { TypeAlias } from '~/components/model/TypeAlias';
import { Variable } from '~/components/model/Variable';
import { findMember } from '~/model.server';
import { createApiModel } from '~/util/api-model.server';
import { findPackage, getMembers } from '~/util/parse.server';

export const getStaticPaths: GetStaticPaths = async () => {
	const packages = ['builders', 'collection', 'proxy', 'rest', 'voice'];

	const pkgs = (
		await Promise.all(
			packages.map(async (packageName) => {
				if (packageName === 'rest') {
					return { params: { slug: ['main', 'packages', packageName] } };
				}

				try {
					const res = await fetch(`https://docs.discordjs.dev/docs/${packageName}/main.api.json`);
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const data = await res.json();

					const model = createApiModel(data);
					const pkg = findPackage(model, packageName);

					return [
						{ params: { slug: ['main', 'packages', packageName] } },
						...getMembers(pkg!).map((member) => ({ params: { slug: ['main', 'packages', packageName, member.name] } })),
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
	const [branchName = 'main', , packageName = 'builders', memberName] = params!.slug as string[];

	try {
		const res = await fetch(`https://docs.discordjs.dev/docs/${packageName}/${branchName}.api.json`);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const data = await res.json();

		const model = createApiModel(data);
		const pkg = findPackage(model, packageName);

		return {
			props: {
				packageName,
				data: {
					members: pkg ? getMembers(pkg) : [],
					member: memberName ? findMember(model, packageName, memberName)?.toJSON() ?? null : null,
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
			return <div>Cannot render that item type</div>;
	}
};

export default function Slug(
	props: Partial<ItemListProps & { error?: string; data: { member: ReturnType<typeof findMember> } }>,
) {
	return props.error ? (
		<div className="flex max-w-full h-full bg-white dark:bg-dark">{props.error}</div>
	) : (
		<SidebarLayout {...props}>{props.data?.member ? member(props.data.member) : null}</SidebarLayout>
	);
}
