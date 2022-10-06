export interface IDiscordMessageEmbedAuthor {
	avatar: string;
	username: string;
}

export function DiscordMessageEmbedAuthor({ avatar, username }: IDiscordMessageEmbedAuthor) {
	return (
		<div className="mt-2 flex place-items-center">
			<img alt={`${username}'s avatar`} className="mr-2 h-6 w-6 select-none rounded-full" src={avatar} />
			<span className="text-sm font-medium hover:underline">{username}</span>
		</div>
	);
}
