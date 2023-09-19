import type { ReactNode } from 'react';
import type { IDiscordMessageAuthorReply } from './MessageAuthorReply.js';
import { DiscordMessageBaseReply } from './MessageBaseReply.js';

export interface IDiscordMessageReply {
	readonly author?: IDiscordMessageAuthorReply | undefined;
	readonly authorNode?: ReactNode | undefined;
	readonly content: string;
}

export function DiscordMessageReply({ author, authorNode, content }: IDiscordMessageReply) {
	return (
		<DiscordMessageBaseReply author={author} authorNode={authorNode}>
			<div className="cursor-pointer select-none text-sm leading-snug text-[rgb(163_166_170)] hover:text-white">
				{content}
			</div>
		</DiscordMessageBaseReply>
	);
}
