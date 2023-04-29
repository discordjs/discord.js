export interface IDiscordMessageEmbedThumbnail {
	image: string;
}

export function DiscordMessageEmbedThumbnail({ image }: IDiscordMessageEmbedThumbnail) {
	return <img className="mr-4 mt-4 aspect-square h-20" height={80} src={image} width={80} />;
}
