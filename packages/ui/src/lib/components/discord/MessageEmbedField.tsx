export interface IDiscordMessageEmbedField {
	inline?: boolean;
	name: string;
	value: string;
}

export function DiscordMessageEmbedField({ name, value, inline }: IDiscordMessageEmbedField) {
	return (
		<div className={`${inline ? 'col-span-4' : 'col-span-12'} flex flex-col`}>
			<span className="font-medium">{name}</span>
			<span className="text-gray-300">{value}</span>
		</div>
	);
}
