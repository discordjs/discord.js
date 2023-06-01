export interface HeadingData {
	level: number;
	slug: string;
	text: string;
}

export interface HeadingNode extends HeadingData {
	children: HeadingNode[];
}

/**
 * Serialize heading data into a hierarchical tree structure where lower level headings are children of higher level headings.
 *
 * @param headings - An array of heading data
 */
export function serializeHeadings(headings: HeadingData[]): HeadingNode[] {
	const tree: HeadingNode[] = [];
	const stack: HeadingNode[] = [];

	for (const heading of headings) {
		const node: HeadingNode = {
			level: heading.level,
			text: heading.text,
			slug: heading.slug,
			children: [],
		};

		while (stack.length > 0 && stack.at(-1)!.level >= node.level) {
			stack.pop();
		}

		if (stack.length === 0) {
			tree.push(node);
		} else {
			stack.at(-1)!.children.push(node);
		}

		stack.push(node);
	}

	return tree;
}
