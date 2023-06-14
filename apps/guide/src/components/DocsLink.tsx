import { FiExternalLink } from '@react-icons/all-files/fi/FiExternalLink';
import type { PropsWithChildren } from 'react';
import { BASE_URL, BASE_URL_LEGACY, PACKAGES, VERSION } from '~/util/constants';

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
	parent?: string;
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
	type?: string;
}

export function DocsLink({
	package: docs = PACKAGES[0],
	type,
	parent,
	symbol,
	brackets,
	static: staticReference,
	children,
}: PropsWithChildren<DocsLinkOptions>) {
	// In the case of no type and no parent, this will default to the entry point of the respective documentation.
	let url = docs === PACKAGES[0] ? `${BASE_URL_LEGACY}/${VERSION}/general/welcome` : `${BASE_URL}/${docs}/stable`;
	let text = `${docs === PACKAGES[0] ? '' : '@discordjs/'}${docs}`;

	// If there is a type and parent, we need to do some parsing.
	if (type && parent) {
		const bracketText = brackets || type?.toUpperCase() === 'FUNCTION' ? '()' : '';

		// Legacy discord.js documentation parsing.
		if (docs === PACKAGES[0]) {
			url = `${BASE_URL_LEGACY}/${VERSION}/${type}/${parent}`;
			if (symbol) url += `?scrollTo=${symbol}`;

			text = `${parent}${symbol ? (symbol.startsWith('s-') ? '.' : '#') : ''}${
				// eslint-disable-next-line prefer-named-capture-group
				symbol ? `${symbol.replace(/(e|s)-/, '')}` : ''
			}${bracketText}`;
		} else {
			url += `/${parent}:${type}`;
			if (symbol) url += `#${symbol}`;
			text = `${parent}${symbol ? `${staticReference ? '.' : '#'}${symbol}` : ''}${bracketText}`;
		}
	}

	return (
		<a className="inline-flex flex-row place-items-center gap-1" href={url} rel="noopener noreferrer" target="_blank">
			{children ?? text}
			<FiExternalLink size={18} />
		</a>
	);
}
