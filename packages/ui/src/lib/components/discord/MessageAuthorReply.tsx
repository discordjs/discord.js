export interface IDiscordMessageAuthorReply {
	avatar: string;
	bot?: boolean;
	username: string;
}

export function DiscordMessageAuthorReply({ avatar, bot, username }: IDiscordMessageAuthorReply) {
	return (
		<>
			<img alt={`${username}'s avatar`} className="mr-1 h-4 w-4 select-none rounded-full" src={avatar} />
			{bot ? (
				<div className="mr-1 rounded bg-blurple px-1 vertical-top text-xs" id="bot">
					BOT
				</div>
			) : null}
			<span className="mr-1 cursor-pointer select-none text-sm font-medium leading-snug text-white hover:underline">
				{username}
			</span>
		</>
	);
}
