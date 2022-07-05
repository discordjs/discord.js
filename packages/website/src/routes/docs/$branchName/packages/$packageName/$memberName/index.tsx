/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { json } from '@remix-run/node';
import { Params, useLoaderData } from '@remix-run/react';
import type { DocClass } from '~/DocModel/DocClass';
import type { DocEnum } from '~/DocModel/DocEnum';
import type { DocFunction } from '~/DocModel/DocFunction';
import type { DocInterface } from '~/DocModel/DocInterface';
import type { DocTypeAlias } from '~/DocModel/DocTypeAlias';
import type { DocVariable } from '~/DocModel/DocVariable';
import { Class } from '~/components/model/Class';
import { Enum } from '~/components/model/Enum';
import { Function } from '~/components/model/Function';
import { Interface } from '~/components/model/Interface';
import { TypeAlias } from '~/components/model/TypeAlias';
import { Variable } from '~/components/model/Variable';
import { findMember } from '~/model.server';
import { createApiModel } from '~/util/api-model.server';

export async function loader({ params }: { params: Params }) {
	const res = await fetch(
		`https://raw.githubusercontent.com/discordjs/docs/main/${params.packageName!}/${params.branchName!}.api.json`,
	);
	const data = await res.json();
	const model = createApiModel(data);

	return json(findMember(model, params.packageName!, params.memberName!)?.toJSON());
}

export default function Member() {
	const data = useLoaderData();

	switch (data.kind) {
		case 'Class':
			return <Class data={data as ReturnType<DocClass['toJSON']>} />;
		case 'Function':
			return <Function data={data as ReturnType<DocFunction['toJSON']>} />;
		case 'Interface':
			return <Interface data={data as ReturnType<DocInterface['toJSON']>} />;
		case 'TypeAlias':
			return <TypeAlias data={data as ReturnType<DocTypeAlias['toJSON']>} />;
		case 'Variable':
			return <Variable data={data as ReturnType<DocVariable['toJSON']>} />;
		case 'Enum':
			return <Enum data={data as ReturnType<DocEnum['toJSON']>} />;
		default:
			return <div>Cannot render that item type</div>;
	}
}
