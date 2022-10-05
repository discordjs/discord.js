import type { PropsWithChildren, ReactNode } from 'react';

export function DiscordMessageBaseReply({ author, children }: PropsWithChildren<{ author: ReactNode }>) {
	return (
		<div
			id="reply-wrapper"
			className="before:rounded-tl-1.5 relative mb-1 flex place-items-center before:absolute before:left-[-36px] before:right-full before:top-[50%] before:bottom-0 before:mr-1 before:block before:border-l-2 before:border-t-2 before:border-[rgb(79_84_92)] before:content-none"
		>
			<div className="[&>span]:opacity-60 flex place-items-center">{author}</div>
			{children}
		</div>
	);
}
