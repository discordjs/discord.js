/* eslint-disable @typescript-eslint/no-throw-literal */
import { json } from '@remix-run/node';
import { Outlet, Params, useLoaderData, useParams } from '@remix-run/react';
import { ItemSidebar } from '~/components/ItemSidebar';
import { createApiModel } from '~/util/api-model.server';
import { findPackage, getMembers } from '~/util/parse.server';

export async function loader({ params }: { params: Params }) {
	const UnknownResponse = new Response('Not Found', {
		status: 404,
	});

	const res = await fetch(
		`https://raw.githubusercontent.com/discordjs/docs/main/${params.packageName!}/${params.branchName!}.api.json`,
	);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const data = await res.json().catch(() => {
		throw UnknownResponse;
	});

	const model = createApiModel(data);
	const pkg = findPackage(model, params.packageName!);

	if (!pkg) {
		throw UnknownResponse;
	}

	return json({
		members: getMembers(pkg),
	});
}

interface LoaderData {
	members: ReturnType<typeof getMembers>;
}

export default function Package() {
	const data = useLoaderData<LoaderData>();
	const { packageName } = useParams();

	return (
		<div className="flex flex-row overflow-none max-w-full h-full">
			<div className="w-full sm:min-w-1/4 sm:max-w-1/4">
				<ItemSidebar packageName={packageName!} data={data} />
			</div>
			<div className="hidden sm:block">
				<Outlet />
			</div>
		</div>
	);
}
