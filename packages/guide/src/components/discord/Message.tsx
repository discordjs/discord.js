import type { PropsWithChildren, ReactNode } from 'react';

export function DiscordMessage({
	reply,
	interaction,
	author,
	followUp,
	time,
	children,
}: PropsWithChildren<{
	author: ReactNode;
	followUp?: boolean;
	interaction?: ReactNode | undefined;
	reply?: ReactNode | undefined;
	time?: string | undefined;
}>) {
	return (
		<div id="outer-message-wrapper" className="relative">
			<div
				id="message-wrapper"
				className={`pl-18 hover:bg-[rgb(4_4_5)]/7 group py-0.5 pr-12 leading-snug ${followUp ? '' : 'mt-4'}`}
			>
				{reply && !followUp ? reply : null}
				{interaction && !reply && !followUp ? interaction : null}
				<div id="content-wrapper" className="static">
					{followUp ? (
						<span
							id="time"
							className="h-5.5 absolute left-0 mr-1 hidden w-[56px] cursor-default select-none text-right text-xs leading-loose group-hover:inline-block"
						>
							{time}
						</span>
					) : (
						author
					)}
					<div id="message-content" className="[&>p]:m-0 [&>p]:leading-snug">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
