import type { PropsWithChildren } from 'react';

export function DiscordMessages({ rounded, children }: PropsWithChildren<{ rounded?: boolean }>) {
	return (
		<div
			className={`font-source-sans-pro pt-0.1 bg-[rgb(54_57_63)] pb-4 ${rounded ? 'rounded' : ''}`}
			id="messages-wrapper"
		>
			{children}
		</div>
	);
}
