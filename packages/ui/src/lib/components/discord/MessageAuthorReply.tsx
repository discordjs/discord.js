import { FiCheck } from '@react-icons/all-files/fi/FiCheck';

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
			<img alt={`${username}'s avatar`} className="mr-1.5 h-4 w-4 select-none rounded-full" src={avatar} />
			{bot ? (
				<div
					className="mr-1 inline-flex place-items-center rounded bg-blurple px-1 vertical-top text-[0.7rem]/4 font-normal text-white"
					id="bot"
				>
					{verified ? <FiCheck className="mr-0.5 inline-block stroke-3" /> : null} BOT
				</div>
			) : null}
			<span className={`mr-1 cursor-pointer select-none text-sm font-medium leading-snug ${color ?? 'text-white'}`}>
				{username}
			</span>
		</>
	);
}
