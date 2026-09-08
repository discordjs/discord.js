import { DocNode } from './DocNode';
import { Alert } from './ui/Alert';

export async function UnstableNode({
	unstableBlock,
	version,
}: {
	readonly unstableBlock: any;
	readonly version: string;
}) {
	return (
		<Alert title="Unstable" type="danger">
			<p className="break-words">
				<DocNode node={unstableBlock} version={version} />
			</p>
		</Alert>
	);
}
