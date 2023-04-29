export interface IDiscordMessageAuthorReply {
	avatar: string;
	bot?: boolean;
	color?: string;
	username: string;
	verified?: boolean;
}

export function DiscordMessageAuthorReply({ avatar, bot, verified, color, username }: IDiscordMessageAuthorReply) {
	return (
		<>
			<img alt={`${username}'s avatar`} className="mr-1 h-4 w-4 select-none rounded-full" src={avatar} />
			{bot ? (
				<div className="mr-1 rounded bg-blurple px-1 vertical-top text-xs text-white" id="bot">
					{verified ? '✓ BOT' : 'BOT'}
				</div>
			) : null}
			<span className={`mr-1 cursor-pointer select-none text-sm font-medium leading-snug ${color ?? 'text-white'}`}>
				{username}
			</span>
		</>
	);
}
