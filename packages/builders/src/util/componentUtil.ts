import type { APIEmbed } from 'discord-api-types/v10';

export function embedLength(data: APIEmbed) {
	return (
		(data.title?.length ?? 0) +
		(data.description?.length ?? 0) +
		(data.fields?.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0) ?? 0) +
		(data.footer?.text.length ?? 0) +
		(data.author?.name.length ?? 0)
	);
}
