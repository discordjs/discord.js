/**
 * Formats debug log messages.
 *
 * @param messages - An array of messages to format
 * @internal
 */
export function formatDebugLog(messages: [string, ...string[]]) {
	return `${messages[0]}${
		messages.length > 1
			? `\n${messages
					.slice(1)
					.map((message) => `	${message}`)
					.join('\n')}`
			: ''
	}`;
}
