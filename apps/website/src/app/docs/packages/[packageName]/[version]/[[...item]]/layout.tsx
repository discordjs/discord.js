import type { Metadata } from 'next';
import { Suspense, type PropsWithChildren } from 'react';
import { CmdK } from './CmdK';

export async function generateMetadata({
	params,
}: {
	readonly params: Promise<{
		readonly item?: string[] | undefined;
		readonly packageName: string;
		readonly version: string;
	}>;
}): Promise<Metadata> {
	const { packageName, version } = await params;

	return {
		title: {
			template: '%s | discord.js',
			default: `${packageName} (${version})`,
		},
	};
}

export default async function Layout({
	params,
	children,
}: PropsWithChildren<{
	readonly params: Promise<{ readonly packageName: string; readonly version: string }>;
}>) {
	return (
		<>
			{children}
			<Suspense>
				<CmdK params={params} />
			</Suspense>
		</>
	);
}
