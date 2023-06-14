export interface IDiscordMessageEmbedAuthor {
	avatar: string;
	url?: string;
	username: string;
}

export function DiscordMessageEmbedAuthor({ avatar, url, username }: IDiscordMessageEmbedAuthor) {
	return (
		<div className="mt-2 flex place-items-center">
			<img alt={`${username}'s avatar`} className="mr-2 h-6 w-6 select-none rounded-full" src={avatar} />
			{url ? (
				<a
					className="text-sm font-medium hover:underline"
					href={url}
					rel="noreferrer noopener external"
					target="_blank"
				>
					{username}
				</a>
			) : (
				<span className="text-sm font-medium">{username}</span>
			)}
		</div>
	);
}
