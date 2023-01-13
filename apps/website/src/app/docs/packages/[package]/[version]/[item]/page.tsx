/* eslint-disable no-case-declarations */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
// eslint-disable-next-line n/prefer-global/process
import process, { cwd } from 'node:process';
import { createApiModel } from '@discordjs/scripts';
import type {
	ApiClass,
	ApiEnum,
	ApiInterface,
	ApiItem,
	ApiTypeAlias,
	ApiVariable,
} from '@microsoft/api-extractor-model';
import { ApiFunction } from '@microsoft/api-extractor-model';
import { notFound } from 'next/navigation';
import { fetchModelJSON } from '~/app/docAPI';
import { Class } from '~/components/model/Class';
import { Interface } from '~/components/model/Interface';
import { TypeAlias } from '~/components/model/TypeAlias';
import { Variable } from '~/components/model/Variable';
import { Enum } from '~/components/model/enum/Enum';
import { Function } from '~/components/model/function/Function';
import { OVERLOAD_SEPARATOR, PACKAGES } from '~/util/constants';
import { findMember, findMemberByKey } from '~/util/model.server';

export interface ItemRouteParams {
	item: string;
	package: string;
	version: string;
}

export async function generateStaticParams({ params: { package: packageName, version } }: { params: ItemRouteParams }) {
	const modelJSON = await fetchModelJSON(packageName, version);
	const model = createApiModel(modelJSON);

	const pkg = model.tryGetPackageByName(packageName);
	const entry = pkg?.entryPoints[0];

	if (!entry) {
		return notFound();
	}

	return entry.members.map((member) => ({
		item: member.displayName,
	}));
}

async function fetchMember({ package: packageName, version: branchName = 'main', item }: ItemRouteParams) {
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

	const [memberName, overloadIndex] = decodeURIComponent(item).split(OVERLOAD_SEPARATOR);
	const model = createApiModel(data);

	// eslint-disable-next-line prefer-const
	let { containerKey, displayName: name } = findMember(model, packageName, memberName) ?? {};
	if (name && overloadIndex && !Number.isNaN(Number.parseInt(overloadIndex, 10))) {
		containerKey = ApiFunction.getContainerKey(name, Number.parseInt(overloadIndex, 10));
	}

	return memberName && containerKey ? findMemberByKey(model, packageName, containerKey) ?? null : null;
}

function Member({ member }: { member?: ApiItem }) {
	switch (member?.kind) {
		case 'Class':
			return <Class clazz={member as ApiClass} />;
		case 'Function':
			return <Function item={member as ApiFunction} key={member.containerKey} />;
		case 'Interface':
			return <Interface item={member as ApiInterface} />;
		case 'TypeAlias':
			return <TypeAlias item={member as ApiTypeAlias} />;
		case 'Variable':
			return <Variable item={member as ApiVariable} />;
		case 'Enum':
			return <Enum item={member as ApiEnum} />;
		default:
			return <div>Cannot render that item type</div>;
	}
}

export default async function Page({ params }: { params: ItemRouteParams }) {
	const member = await fetchMember(params);

	return (
		<main
			className={
				(member?.kind === 'Class' || member?.kind === 'Interface') && (member as ApiClass | ApiInterface).members.length
					? 'xl:pr-64'
					: ''
			}
		>
			<article className="dark:bg-dark-600 bg-light-600">
				<div className="dark:bg-dark-800  bg-white p-6 pb-20 shadow">{member ? <Member member={member} /> : null}</div>
			</article>
		</main>
	);
}
