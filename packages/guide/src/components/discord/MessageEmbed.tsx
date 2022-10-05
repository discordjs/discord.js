import type { PropsWithChildren, ReactNode } from 'react';

export function DiscordMessageEmbed({
	author,
	title,
	children,
	footer,
}: PropsWithChildren<{
	author?: ReactNode | undefined;
	footer?: ReactNode | undefined;
	title?: ReactNode | undefined;
}>) {
	return (
		<div id="outer-embed-wrapper" className="py-0.5">
			<div id="embed-wrapper" className="border-l-blurple grid max-w-max rounded border-l-4 bg-[rgb(47_49_54)]">
				<div className="max-w-128">
					<div className="pt-2 pr-4 pb-4 pl-3">
						{author ? author : null}
						{title ? title : null}
						{children ? <div className="mt-2 text-sm">{children}</div> : null}
						{footer ? footer : null}
					</div>
				</div>
			</div>
		</div>
	);
}
