import { DocNode } from './DocNode';
import { Alert } from './ui/Alert';

export async function DeprecatedNode({
	deprecatedBlock,
	version,
}: {
	readonly deprecatedBlock: any;
	readonly version: string;
}) {
	return (
		<Alert title="Deprecated" type="danger">
			<p className="break-words">
				<DocNode node={deprecatedBlock} version={version} />
			</p>
		</Alert>
	);
}
