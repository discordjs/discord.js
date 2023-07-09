import type { PropsWithChildren, ReactNode } from 'react';
import { DiscordMessageAuthor, type IDiscordMessageAuthor } from './MessageAuthor.js';
import { DiscordMessageInteraction, type IDiscordMessageInteraction } from './MessageInteraction.js';
import { DiscordMessageReply, type IDiscordMessageReply } from './MessageReply.js';

export interface IDiscordMessage {
	author?: IDiscordMessageAuthor | undefined;
	authorNode?: ReactNode | undefined;
	followUp?: boolean;
	interaction?: IDiscordMessageInteraction | undefined;
	interactionNode?: ReactNode | undefined;
	reply?: IDiscordMessageReply | undefined;
	replyNode?: ReactNode | undefined;
	time?: string | undefined;
}

export function DiscordMessage({
	reply,
	replyNode,
	interaction,
	interactionNode,
	author,
	authorNode,
	followUp,
	time,
	children,
}: PropsWithChildren<IDiscordMessage>) {
	return (
		<div className="relative" id="outer-message-wrapper">
			<div
				className={`pl-18 hover:bg-[rgb(4_4_5)]/7 group py-0.5 pr-12 leading-snug ${followUp ? '' : 'mt-4'}`}
				id="message-wrapper"
			>
				{(reply || replyNode) && !followUp ? reply ? <DiscordMessageReply {...reply} /> : replyNode ?? null : null}
				{(interaction || interactionNode) && !(reply || replyNode) && !followUp ? (
					interaction ? (
						<DiscordMessageInteraction {...interaction} />
					) : (
						interactionNode ?? null
					)
				) : null}
				<div className="static" id="content-wrapper">
					{followUp ? (
						<span
							className="absolute left-0 mr-1 hidden h-5.5 w-[56px] cursor-default select-none text-right text-xs leading-loose text-[rgb(163_166_170)] group-hover:inline-block"
							id="time"
						>
							{time}
						</span>
					) : author ? (
						<DiscordMessageAuthor {...author} />
					) : (
						authorNode
					)}
					<div className="text-white [&>p]:m-0 [&>p]:leading-snug" id="message-content">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
