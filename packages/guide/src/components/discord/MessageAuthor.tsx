export function DiscordMessageAuthor({
	avatar,
	username,
	bot,
	time,
}: {
	avatar: string;
	bot?: boolean;
	time: string;
	username: string;
}) {
	return (
		<>
			<img className="absolute left-[16px] mt-0.5 h-10 w-10 cursor-pointer select-none rounded-full" src={avatar} />
			<h2 id="user-info" className="text-size-inherit m-0 font-medium leading-snug">
				<span id="username" className="mr-1">
					<span className="cursor-pointer text-base font-medium hover:underline">{username}</span>
					{bot ? (
						<span id="bot" className="bg-blurple vertical-top relative top-1 ml-1 rounded px-1 text-xs">
							BOT
						</span>
					) : null}
				</span>
				<span id="time" className="ml-1 cursor-default text-xs leading-snug text-[rgb(163_166_170)]">
					{time}
				</span>
			</h2>
		</>
	);
}
