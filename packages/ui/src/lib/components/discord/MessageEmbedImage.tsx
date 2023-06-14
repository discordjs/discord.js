export interface IDiscordMessageEmbedImage {
	alt: string;
	height: number;
	url: string;
	width: number;
}

export function DiscordMessageEmbedImage({ alt, height, url, width }: IDiscordMessageEmbedImage) {
	return <img alt={alt} className="mt-4" height={height} src={url} width={width} />;
}
