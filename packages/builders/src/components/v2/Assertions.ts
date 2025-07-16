import { ComponentType, SeparatorSpacingSize } from 'discord-api-types/v10';
import { z } from 'zod';
import { actionRowPredicate } from '../Assertions.js';

const unfurledMediaItemPredicate = z.object({
	url: z.url({ protocol: /^(?:https?|attachment)$/ }),
});

export const thumbnailPredicate = z.object({
	media: unfurledMediaItemPredicate,
	description: z.string().min(1).max(1_024).nullish(),
	spoiler: z.boolean().optional(),
});

const unfurledMediaItemAttachmentOnlyPredicate = z.object({
	url: z.url({ protocol: /^attachment$/ }),
});

export const filePredicate = z.object({
	file: unfurledMediaItemAttachmentOnlyPredicate,
	spoiler: z.boolean().optional(),
});

export const separatorPredicate = z.object({
	divider: z.boolean().optional(),
	spacing: z.enum(SeparatorSpacingSize).optional(),
});

export const textDisplayPredicate = z.object({
	content: z.string().min(1).max(4_000),
});

export const mediaGalleryItemPredicate = z.object({
	media: unfurledMediaItemPredicate,
	description: z.string().min(1).max(1_024).nullish(),
	spoiler: z.boolean().optional(),
});

export const mediaGalleryPredicate = z.object({
	items: z.array(mediaGalleryItemPredicate).min(1).max(10),
});

export const sectionPredicate = z.object({
	components: z.array(textDisplayPredicate).min(1).max(3),
	accessory: z.union([
		z.object({ type: z.literal(ComponentType.Button) }),
		z.object({ type: z.literal(ComponentType.Thumbnail) }),
	]),
});

export const containerPredicate = z.object({
	components: z
		.array(
			z.union([
				actionRowPredicate,
				filePredicate,
				mediaGalleryPredicate,
				sectionPredicate,
				separatorPredicate,
				textDisplayPredicate,
			]),
		)
		.min(1),
	spoiler: z.boolean().optional(),
	accent_color: z.int().min(0).max(0xffffff).nullish(),
});
