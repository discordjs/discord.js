import type { ReactNode } from 'react';
import { DiscordMessageBaseReply } from './MessageBaseReply';

export function DiscordMessageInteraction({ author, command }: { author: ReactNode; command: string }) {
	return (
		<DiscordMessageBaseReply author={author}>
			<span className="mr-1 select-none text-sm leading-snug">used</span>
			<div className="text-blurple cursor-pointer text-sm leading-snug hover:underline">{command}</div>
		</DiscordMessageBaseReply>
	);
}
