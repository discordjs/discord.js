import type { ReactNode } from 'react';
import type { IDiscordMessageAuthorReply } from './MessageAuthorReply.js';
import { DiscordMessageBaseReply } from './MessageBaseReply.js';

export interface IDiscordMessageReply {
	author?: IDiscordMessageAuthorReply | undefined;
	authorNode?: ReactNode | undefined;
	content: string;
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
