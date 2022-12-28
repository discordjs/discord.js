import type { DocBlockJSON } from '@discordjs/api-extractor-utils';
import { TSDoc } from './TSDoc';

export function SeeBlock({ blocks }: { blocks: DocBlockJSON[] }) {
	return (
		<div className="space-y-xs flex flex-col">
			<h1 className="font-bold">See Also:</h1>
			{blocks.map((seeBlock) => (
				<TSDoc key={seeBlock.tag.tagName} node={seeBlock} />
			))}
		</div>
	);
}
