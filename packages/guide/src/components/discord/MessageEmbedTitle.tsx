export interface IDiscordMessageEmbedTitle {
	title: string;
}

export function DiscordMessageEmbedTitle({ title }: IDiscordMessageEmbedTitle) {
	return <div className="mt-2 font-medium">{title}</div>;
}
