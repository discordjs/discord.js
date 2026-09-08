import { CmdKNoSRR } from '@/components/CmdK';
import { fetchDependencies } from '@/util/fetchDependencies';

export async function CmdK({
	params,
}: {
	readonly params: Promise<{ readonly packageName: string; readonly version: string }>;
}) {
	const { packageName, version } = await params;

	const dependencies = await fetchDependencies({ packageName, version });

	return <CmdKNoSRR dependencies={dependencies} />;
}
