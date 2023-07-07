import { FiExternalLink } from '@react-icons/all-files/fi/FiExternalLink';
import type { PropsWithChildren } from 'react';
import {
	BASE_URL_DISCORD_API_TYPES,
	DISCORD_API_TYPES_VERSION,
	DISCORD_API_TYPES_VOICE_VERSION,
} from '~/util/constants';

interface DiscordAPITypesLinkOptions {
	/**
	 * The initial documentation enum, interface, function etc.
	 *
	 * @example `'RESTJSONErrorCodes'`
	 */
	parent?: string;
	/**
	 * The scope of where this link lives.
	 *
	 * @remarks API does not have a scope.
	 */
	scope?: 'gateway' | 'globals' | 'payloads' | 'rest' | 'rpc' | 'utils' | 'voice';
	/**
	 * The symbol belonging to the parent.
	 *
	 * @example '`MaximumNumberOfGuildsReached'`
	 */
	symbol?: string;
	/**
	 * The type of the {@link DiscordAPITypesLinkOptions.parent}.
	 *
	 * @example `'enum'`
	 * @example `'interface'`
	 */
	type?: string;
}

export function DiscordAPITypesLink({
	parent,
	scope,
	symbol,
	type,
	children,
}: PropsWithChildren<DiscordAPITypesLinkOptions>) {
	let url = BASE_URL_DISCORD_API_TYPES;
	let text = 'discord-api-types';

	if (type || parent) {
		url += `/api/discord-api-types`;

		switch (scope) {
			case 'globals':
				url += `-${scope}`;
				break;
			case 'gateway':
			case 'payloads':
			case 'rest':
				url += `-${scope}/common`;
				break;
			case 'rpc':
			case 'utils':
				url += `-${scope}/${DISCORD_API_TYPES_VERSION}`;
				break;
			case 'voice':
				url += `-${scope}/${DISCORD_API_TYPES_VOICE_VERSION}`;
				break;
			default:
				url += `-${DISCORD_API_TYPES_VERSION}`;
		}

		if (type) {
			url += `/${type}/${parent}`;
			if (symbol) url += `#${symbol}`;
		} else {
			url += `#${parent}`;
		}

		text = `${parent}${symbol ? `#${symbol}` : ''}${type?.toUpperCase() === 'FUNCTION' ? '()' : ''}`;
	}

	return (
		<a
			className="inline-flex flex-row place-items-center gap-1"
			href={url}
			rel="external noopener noreferrer"
			target="_blank"
		>
			{children ?? text}
			<FiExternalLink size={18} />
		</a>
	);
}
