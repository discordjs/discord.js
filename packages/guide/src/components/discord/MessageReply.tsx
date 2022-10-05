import type { ReactNode } from 'react';
import { DiscordMessageBaseReply } from './MessageBaseReply';

export function DiscordMessageReply({ author, content }: { author: ReactNode; content: string }) {
	return (
		<DiscordMessageBaseReply author={author}>
			<div className="cursor-pointer select-none text-sm leading-snug text-[rgb(163_166_170)] hover:text-white">
				{content}
			</div>
		</DiscordMessageBaseReply>
	);
}
