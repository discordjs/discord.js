import type { PropsWithChildren } from 'react';

export interface IDiscordMessages {
	readonly rounded?: boolean;
}

export function DiscordMessages({ rounded, children }: PropsWithChildren<IDiscordMessages>) {
	return (
		<div
			className={`font-source-sans-pro bg-[rgb(54_57_63)] pb-4 pt-0.1 ${rounded ? 'rounded' : ''}`}
			id="messages-wrapper"
		>
			{children}
		</div>
	);
}
