import { ComponentType } from 'discord-api-types/v10';
import { z } from 'zod';
import { customIdPredicate } from '../../Assertions.js';
import { labelPredicate } from '../../components/label/Assertions.js';
import { textDisplayPredicate } from '../../components/v2/Assertions.js';

const titlePredicate = z.string().min(1).max(45);

export const modalPredicate = z.object({
	title: titlePredicate,
	custom_id: customIdPredicate,
	components: z
		.union([
			z.object({
				type: z.literal(ComponentType.ActionRow),
				components: z
					.object({ type: z.literal(ComponentType.TextInput) })
					.array()
					.length(1),
			}),
			labelPredicate,
			textDisplayPredicate,
		])
		.array()
		.min(1)
		.max(5),
});
