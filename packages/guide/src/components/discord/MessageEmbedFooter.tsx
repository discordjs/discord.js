export interface IDiscordMessageEmbedFooter {
	content: string;
}

export function DiscordMessageEmbedFooter({ content }: IDiscordMessageEmbedFooter) {
	return <div className="mt-2 text-xs">{content}</div>;
}
