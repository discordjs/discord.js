import { z } from 'zod';
import { refineURLPredicate } from '../../Assertions.js';
import { embedLength } from '../../util/componentUtil.js';

const namePredicate = z.string().max(256);

const URLPredicate = z
	.string()
	.url()
	.refine(refineURLPredicate(['http:', 'https:']), { message: 'Invalid protocol for URL. Must be http: or https:' });

const URLWithAttachmentProtocolPredicate = z
	.string()
	.url()
	.refine(refineURLPredicate(['http:', 'https:', 'attachment:']), {
		message: 'Invalid protocol for URL. Must be http:, https:, or attachment:',
	});

export const embedFieldPredicate = z.object({
	name: namePredicate,
	value: z.string().max(1_024),
	inline: z.boolean().optional(),
});

export const embedAuthorPredicate = z.object({
	name: namePredicate.min(1),
	icon_url: URLWithAttachmentProtocolPredicate.optional(),
	url: URLPredicate.optional(),
});

export const embedFooterPredicate = z.object({
	text: z.string().min(1).max(2_048),
	icon_url: URLWithAttachmentProtocolPredicate.optional(),
});

export const embedPredicate = z
	.object({
		title: namePredicate.min(1).optional(),
		description: z.string().min(1).max(4_096).optional(),
		url: URLPredicate.optional(),
		timestamp: z.string().optional(),
		color: z.int().min(0).max(0xffffff).optional(),
		footer: embedFooterPredicate.optional(),
		image: z.object({ url: URLWithAttachmentProtocolPredicate }).optional(),
		thumbnail: z.object({ url: URLWithAttachmentProtocolPredicate }).optional(),
		author: embedAuthorPredicate.optional(),
		fields: z.array(embedFieldPredicate).max(25).optional(),
	})
	.refine(
		(embed) =>
			embed.title !== undefined ||
			embed.description !== undefined ||
			(embed.fields !== undefined && embed.fields.length > 0) ||
			embed.footer !== undefined ||
			embed.author !== undefined ||
			embed.image !== undefined ||
			embed.thumbnail !== undefined,
		{
			message: 'Embed must have at least a title, description, a field, a footer, an author, an image, OR a thumbnail.',
		},
	)
	.refine((embed) => embedLength(embed) <= 6_000, { message: 'Embeds must not exceed 6000 characters in total.' });
