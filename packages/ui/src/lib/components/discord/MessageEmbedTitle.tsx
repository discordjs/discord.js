export interface IDiscordMessageEmbedTitle {
	title: string;
	url?: string;
}

export function DiscordMessageEmbedTitle({ title, url }: IDiscordMessageEmbedTitle) {
	return url ? (
		<a
			className="mt-2 font-medium text-blue-500 hover:underline"
			href={url}
			rel="noreferrer noopener external"
			target="_blank"
		>
			{title}
		</a>
	) : (
		<div className="mt-2 font-medium">{title}</div>
	);
}
