/* eslint-disable @typescript-eslint/no-throw-literal */
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next/types';
import type { DocClass } from '~/DocModel/DocClass';
import type { DocEnum } from '~/DocModel/DocEnum';
import type { DocFunction } from '~/DocModel/DocFunction';
import type { DocInterface } from '~/DocModel/DocInterface';
import type { DocTypeAlias } from '~/DocModel/DocTypeAlias';
import type { DocVariable } from '~/DocModel/DocVariable';
import { ItemSidebar } from '~/components/ItemSidebar';
import { Class } from '~/components/model/Class';
import { Enum } from '~/components/model/Enum';
import { Function } from '~/components/model/Function';
import { Interface } from '~/components/model/Interface';
import { TypeAlias } from '~/components/model/TypeAlias';
import { Variable } from '~/components/model/Variable';
import { findMember } from '~/model.server';
import { createApiModel } from '~/util/api-model.server';
import { findPackage, getMembers } from '~/util/parse.server';

export const getStaticPaths: GetStaticPaths = () => {
	const packages = ['builders', 'collection', 'proxy', 'rest', 'voice'];

	return {
		paths: packages.map((pkg) => ({
			params: { slug: [pkg] },
		})),
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const [branchName, , packageName, memberName] = params!.slug as string[];

	const UnknownResponse = new Response('Not Found', {
		status: 404,
	});

	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	const res = await fetch(`https://docs.discordjs.dev/docs/${packageName}/${branchName}.api.json`);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const data = await res.json().catch(() => {
		throw UnknownResponse;
	});

	const model = createApiModel(data);
	const pkg = findPackage(model, packageName!);

	if (!pkg) {
		throw UnknownResponse;
	}

	return {
		props: {
			members: getMembers(pkg),
			member: findMember(model, packageName!, memberName!)!.toJSON(),
		},
	};
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

export default function Slug(props: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<div className="flex flex-col lg:flex-row overflow-hidden max-w-full h-full bg-white dark:bg-dark">
			<div className="w-full lg:min-w-1/4 lg:max-w-1/4">
				<ItemSidebar packageName={props.packageName} data={props} />
			</div>
			<div className="max-h-full grow overflow-auto">{props.member ? member(props.member) : null}</div>
		</div>
	);
}
