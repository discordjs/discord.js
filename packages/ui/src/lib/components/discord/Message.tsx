import type { PropsWithChildren, ReactNode } from 'react';
import { DiscordMessageAuthor, type IDiscordMessageAuthor } from './MessageAuthor.js';
import { DiscordMessageInteraction, type IDiscordMessageInteraction } from './MessageInteraction.js';
import { DiscordMessageReply, type IDiscordMessageReply } from './MessageReply.js';

export interface IDiscordMessage {
	readonly author?: IDiscordMessageAuthor | undefined;
	readonly authorNode?: ReactNode | undefined;
	readonly followUp?: boolean;
	readonly interaction?: IDiscordMessageInteraction | undefined;
	readonly interactionNode?: ReactNode | undefined;
	readonly reply?: IDiscordMessageReply | undefined;
	readonly replyNode?: ReactNode | undefined;
	readonly time?: string | undefined;
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
				className={`group py-0.5 pl-18 pr-12 leading-snug hover:bg-[rgb(4_4_5)]/7 ${followUp ? '' : 'mt-4'}`}
				id="message-wrapper"
			>
				{(reply || replyNode) && !followUp ? reply ? <DiscordMessageReply {...reply} /> : (replyNode ?? null) : null}
				{(interaction || interactionNode) && !(reply || replyNode) && !followUp ? (
					interaction ? (
						<DiscordMessageInteraction {...interaction} />
					) : (
						(interactionNode ?? null)
					)
				) : null}
				<div className="static" id="content-wrapper">
					{followUp ? (
						<span
							className="absolute left-0 mr-1 hidden h-5.5 w-[56px] cursor-default select-none text-right text-xs text-[rgb(163_166_170)] leading-loose group-hover:inline-block"
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
