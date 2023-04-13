const BASE_URL = 'https://discord.js.org/docs/packages' as const;
const BASE_URL_LEGACY = 'https://old.discordjs.dev/#/docs/discord.js' as const;
const VERSION = '14.9.0' as const;

const PACKAGES = [
	'discord.js',
	'brokers',
	'builders',
	'collection',
	'core',
	'formatters',
	'proxy',
	'rest',
	'util',
	'voice',
	'ws',
] as const;

interface DocsLinkOptions {
	/**
	 * Whether to apply brackets to the end of the symbol to denote a method.
	 *
	 * @remarks Functions automatically infer this.
	 */
	brackets?: boolean;
	/**
	 * The package.
	 *
	 * @defaultValue `'discord.js'`
	 */
	package?: (typeof PACKAGES)[number];
	/**
	 * The initial documentation class, function, interface etc.
	 *
	 * @example `'Client'`
	 */
	parent: string;
	/**
	 * Whether to reference a static property.
	 *
	 * @remarks
	 * This should only be used for the https://discord.js.org domain
	 * as static properties are not identified in the URL.
	 */
	static?: boolean;
	/**
	 * The symbol belonging to the parent.
	 *
	 * @example '`login'`
	 */
	symbol?: string;
	/**
	 * The type of the {@link DocsLinkOptions.parent}.
	 *
	 * @example `'class'`
	 * @example `'Function'`
	 */
	type: string;
}

export function DocsLink({
	package: docs = PACKAGES[0],
	type,
	parent,
	symbol,
	brackets,
	static: staticReference,
}: DocsLinkOptions) {
	const bracketText = brackets || type.toUpperCase() === 'FUNCTION' ? '()' : '';
	const trimmedSymbol = symbol;
	let url;
	let text;

	if (docs === PACKAGES[0]) {
		url = `${BASE_URL_LEGACY}/${VERSION}/${type}/${parent}`;
		if (trimmedSymbol) url += `?scrollTo=${trimmedSymbol}`;

		text = `${parent}${trimmedSymbol ? (trimmedSymbol.startsWith('s-') ? '.' : '#') : ''}${
			trimmedSymbol ? `${trimmedSymbol.replace(/(e|s)-/, '')}` : ''
		}${bracketText}`;
	} else {
		url = `${BASE_URL}/${docs}/stable/${parent}:${type}`;
		if (trimmedSymbol) url += `#${trimmedSymbol}`;
		text = `${parent}${trimmedSymbol ? `${staticReference ? '.' : '#'}${trimmedSymbol}` : ''}${bracketText}`;
	}

	return <a href={url}>{text}</a>;
}
