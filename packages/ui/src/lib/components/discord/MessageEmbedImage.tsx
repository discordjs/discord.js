export interface IDiscordMessageEmbedImage {
	height: number;
	url: string;
	width: number;
}

export function DiscordMessageEmbedImage({ url, height, width }: IDiscordMessageEmbedImage) {
	return <img className="mt-4" height={height} src={url} width={width} />;
}
