import type { PropsWithChildren } from 'react';

export interface IDiscordMessages {
	rounded?: boolean;
}

export function DiscordMessages({ rounded, children }: PropsWithChildren<IDiscordMessages>) {
	return (
		<div
			className={`font-source-sans-pro pt-0.1 bg-[rgb(54_57_63)] pb-4 ${rounded ? 'rounded' : ''}`}
			id="messages-wrapper"
		>
			{children}
		</div>
	);
}
