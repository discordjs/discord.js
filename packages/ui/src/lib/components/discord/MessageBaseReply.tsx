import type { PropsWithChildren, ReactNode } from 'react';
import { DiscordMessageAuthorReply, type IDiscordMessageAuthorReply } from './MessageAuthorReply.jsx';

export function DiscordMessageBaseReply({
	author,
	authorNode,
	children,
}: PropsWithChildren<{ author?: IDiscordMessageAuthorReply | undefined; authorNode?: ReactNode | undefined }>) {
	return (
		<div
			className="before:rounded-tl-1.5 relative mb-1 flex place-items-center before:absolute before:left-[-36px] before:right-full before:top-[50%] before:bottom-0 before:mr-1 before:block before:border-l-2 before:border-t-2 before:border-[rgb(79_84_92)] before:content-none"
			id="reply-wrapper"
		>
			<div className="[&>span]:opacity-60 flex place-items-center">
				{author ? <DiscordMessageAuthorReply {...author} /> : authorNode}
			</div>
			{children}
		</div>
	);
}
