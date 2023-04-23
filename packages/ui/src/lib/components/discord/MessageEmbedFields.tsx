import { DiscordMessageEmbedField, type IDiscordMessageEmbedField } from './MessageEmbedField.js';

export interface IDiscordMessageEmbedFields {
	fields: IDiscordMessageEmbedField[];
}

export function DiscordMessageEmbedFields({ fields }: IDiscordMessageEmbedFields) {
	return (
		<div className="grid grid-cols-12 mt-2 gap-2">
			{fields.map((field, idx) => (
				<DiscordMessageEmbedField key={idx} {...field} />
			))}
		</div>
	);
}
