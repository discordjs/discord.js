import type {
	ApiItemJSON,
	DocNodeJSON,
	DocCodeSpanJSON,
	DocPlainTextJSON,
	DocNodeContainerJSON,
} from '@discordjs/api-extractor-utils';

export function tryResolveDescription(member: ApiItemJSON) {
	const { summary } = member!;

	if (!summary) {
		return undefined;
	}

	let retVal = '';

	function recurseNodes(node: DocNodeJSON) {
		switch (node.kind) {
			case 'CodeSpan':
				retVal += (node as DocCodeSpanJSON).code;
				break;
			case 'PlainText':
				retVal += (node as DocPlainTextJSON).text;
				break;
			case 'Section':
			case 'Paragraph':
				for (const currentNode of (node as DocNodeContainerJSON).nodes) {
					recurseNodes(currentNode);
				}

				break;
			default:
				break;
		}
	}

	for (const node of summary.nodes) {
		recurseNodes(node);
	}

	if (retVal === '') {
		return null;
	}

	return retVal;
}
