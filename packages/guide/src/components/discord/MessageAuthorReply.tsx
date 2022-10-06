export interface IDiscordMessageAuthorReply {
	avatar: string;
	bot?: boolean;
	username: string;
}

export function DiscordMessageAuthorReply({ avatar, bot, username }: IDiscordMessageAuthorReply) {
	return (
		<>
			<img className="mr-1 h-4 w-4 select-none rounded-full" src={avatar} />
			{bot ? (
				<div className="bg-blurple vertical-top mr-1 rounded px-1 text-xs" id="bot">
					BOT
				</div>
			) : null}
			<span className="mr-1 cursor-pointer select-none text-sm font-medium leading-snug text-white hover:underline">
				{username}
			</span>
		</>
	);
}
