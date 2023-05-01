import { DiscordMessageEmbedField, type IDiscordMessageEmbedField } from './MessageEmbedField.jsx';

export interface IDiscordMessageEmbedFields {
	fields: IDiscordMessageEmbedField[];
}

export function DiscordMessageEmbedFields({ fields }: IDiscordMessageEmbedFields) {
	return (
		<div className="grid grid-cols-1 mt-2 gap-2 sm:grid-cols-12">
			{fields.map((field, idx) => (
				<DiscordMessageEmbedField key={idx} {...field} />
			))}
		</div>
	);
}
