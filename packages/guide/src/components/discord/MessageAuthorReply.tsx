export function DiscordMessageAuthorReply({
	avatar,
	bot,
	username,
}: {
	avatar: string;
	bot?: boolean;
	username: string;
}) {
	return (
		<>
			<img className="mr-1 h-4 w-4 select-none rounded-full" src={avatar} />
			{bot ? (
				<div id="bot" className="bg-blurple vertical-top mr-1 rounded px-1 text-xs">
					BOT
				</div>
			) : null}
			<span className="mr-1 cursor-pointer select-none text-sm font-medium leading-snug hover:underline">
				{username}
			</span>
		</>
	);
}
