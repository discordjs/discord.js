export interface IDiscordMessageEmbedImage {
	readonly alt: string;
	readonly height: number;
	readonly url: string;
	readonly width: number;
}

export function DiscordMessageEmbedImage({ alt, height, url, width }: IDiscordMessageEmbedImage) {
	return <img alt={alt} className="mt-4" height={height} src={url} width={width} />;
}
