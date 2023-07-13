export interface IDiscordMessageEmbedThumbnail {
	alt: string;
	image: string;
}

export function DiscordMessageEmbedThumbnail({ alt, image }: IDiscordMessageEmbedThumbnail) {
	return <img alt={alt} className="mr-4 mt-4 aspect-square h-20" height={80} src={image} width={80} />;
}
