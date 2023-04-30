import type { PropsWithChildren, ReactNode } from 'react';
import { DiscordMessageEmbedAuthor, type IDiscordMessageEmbedAuthor } from './MessageEmbedAuthor.jsx';
import type { IDiscordMessageEmbedField } from './MessageEmbedField.jsx';
import { DiscordMessageEmbedFields } from './MessageEmbedFields.jsx';
import { DiscordMessageEmbedFooter, type IDiscordMessageEmbedFooter } from './MessageEmbedFooter.jsx';
import { DiscordMessageEmbedImage, type IDiscordMessageEmbedImage } from './MessageEmbedImage.jsx';
import { DiscordMessageEmbedThumbnail, type IDiscordMessageEmbedThumbnail } from './MessageEmbedThumbnail.jsx';
import { DiscordMessageEmbedTitle, type IDiscordMessageEmbedTitle } from './MessageEmbedTitle.jsx';

export interface IDiscordMessageEmbed {
	author?: IDiscordMessageEmbedAuthor | undefined;
	authorNode?: ReactNode | undefined;
	fields?: IDiscordMessageEmbedField[];
	footer?: IDiscordMessageEmbedFooter | undefined;
	footerNode?: ReactNode | undefined;
	image?: IDiscordMessageEmbedImage;
	thumbnail?: IDiscordMessageEmbedThumbnail;
	title?: IDiscordMessageEmbedTitle | undefined;
	titleNode?: ReactNode | undefined;
}

export function DiscordMessageEmbed({
	author,
	authorNode,
	fields,
	title,
	titleNode,
	image,
	children,
	thumbnail,
	footer,
	footerNode,
}: PropsWithChildren<IDiscordMessageEmbed>) {
	return (
		<div className="py-0.5" id="outer-embed-wrapper">
			<div className="grid max-w-max border-l-4 border-l-blurple rounded bg-[rgb(47_49_54)]" id="embed-wrapper">
				<div className="max-w-128 flex">
					<div className="pb-4 pl-3 pr-4 pt-2">
						{author ? <DiscordMessageEmbedAuthor {...author} /> : authorNode ?? null}
						{title ? <DiscordMessageEmbedTitle {...title} /> : titleNode ?? null}
						{children ? <div className="mt-2 text-sm">{children}</div> : null}
						{fields ? <DiscordMessageEmbedFields fields={fields} /> : null}
						{image ? <DiscordMessageEmbedImage {...image} /> : null}
						{footer ? <DiscordMessageEmbedFooter {...footer} /> : footerNode ?? null}
					</div>

					{thumbnail ? <DiscordMessageEmbedThumbnail {...thumbnail} /> : null}
				</div>
			</div>
		</div>
	);
}
