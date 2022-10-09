import type { ReactNode } from 'react';
import type { IDiscordMessageAuthorReply } from './MessageAuthorReply.jsx';
import { DiscordMessageBaseReply } from './MessageBaseReply.jsx';

export interface IDiscordMessageInteraction {
	author?: IDiscordMessageAuthorReply | undefined;
	authorNode?: ReactNode | undefined;
	command?: string;
}

export function DiscordMessageInteraction({ author, authorNode, command }: IDiscordMessageInteraction) {
	return (
		<DiscordMessageBaseReply author={author} authorNode={authorNode}>
			<span className="mr-1 select-none text-sm leading-snug text-white">used</span>
			<div className="text-blurple cursor-pointer text-sm leading-snug hover:underline">{command}</div>
		</DiscordMessageBaseReply>
	);
}
