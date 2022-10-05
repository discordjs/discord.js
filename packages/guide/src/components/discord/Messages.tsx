import type { PropsWithChildren } from 'react';

export function DiscordMessages({ rounded, children }: PropsWithChildren<{ rounded?: boolean }>) {
	return (
		<div id="messages-wrapper" className={`pt-0.1 bg-[rgb(54_57_63)] pb-4 ${rounded ? 'rounded' : ''}`}>
			{children}
		</div>
	);
}
