export interface IDiscordMessageEmbedTitle {
	readonly title: string;
	readonly url?: string;
}

export function DiscordMessageEmbedTitle({ title, url }: IDiscordMessageEmbedTitle) {
	return url ? (
		<a
			className="mt-2 text-blue-500 font-medium hover:underline"
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
