export interface IDiscordMessageEmbedFooter {
	readonly content?: string;
	readonly icon?: string;
	readonly timestamp?: string;
}

export function DiscordMessageEmbedFooter({ content, icon, timestamp }: IDiscordMessageEmbedFooter) {
	return (
		<div className="mt-2 flex items-center text-xs">
			{icon ? <img alt="Icon" className="mr-2 rounded-full" height="20" src={icon} width="20" /> : null}

			{content}
			{content && timestamp ? <span className="mx-1 font-medium">•</span> : null}
			{timestamp}
		</div>
	);
}
