import type {
	ApiItemJSON,
	DocNodeJSON,
	DocCodeSpanJSON,
	DocPlainTextJSON,
	DocNodeContainerJSON,
	DocLinkTagJSON,
} from '@discordjs/api-extractor-utils';

export function tryResolveDescription(member: ApiItemJSON) {
	const { summary } = member!;

	if (!summary) {
		return null;
	}

	let retVal = '';

	function recurseNodes(node: DocNodeJSON, emitMarkdownLinks = false) {
		switch (node.kind) {
			case 'CodeSpan':
				retVal += (node as DocCodeSpanJSON).code;
				break;
			case 'LinkTag': {
				const { text, urlDestination } = node as DocLinkTagJSON;

				if (text && urlDestination && emitMarkdownLinks) {
					retVal += `[${text}](${urlDestination})`;
				} else {
					retVal += text ?? urlDestination ?? '';
				}

				break;
			}

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
