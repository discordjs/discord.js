import { z } from 'zod';
import { refineURLPredicate } from '../../Assertions.js';
import { embedLength } from '../../util/componentUtil.js';

const namePredicate = z.string().min(1).max(256);

const iconURLPredicate = z
	.string()
	.url()
	.refine(refineURLPredicate(['http:', 'https:', 'attachment:']), {
		message: 'Invalid protocol for icon URL. Must be http:, https:, or attachment:',
	});

const URLPredicate = z
	.string()
	.url()
	.refine(refineURLPredicate(['http:', 'https:']), { message: 'Invalid protocol for URL. Must be http: or https:' });

export const embedFieldPredicate = z.object({
	name: namePredicate,
	value: z.string().min(1).max(1_024),
	inline: z.boolean().optional(),
});

export const embedAuthorPredicate = z.object({
	name: namePredicate,
	icon_url: iconURLPredicate.optional(),
	url: URLPredicate.optional(),
});

export const embedFooterPredicate = z.object({
	text: z.string().min(1).max(2_048),
	icon_url: iconURLPredicate.optional(),
});

export const embedPredicate = z
	.object({
		title: namePredicate.optional(),
		description: z.string().min(1).max(4_096).optional(),
		url: URLPredicate.optional(),
		timestamp: z.string().optional(),
		color: z.number().int().min(0).max(0xffffff).optional(),
		footer: embedFooterPredicate.optional(),
		image: z.object({ url: URLPredicate }).optional(),
		thumbnail: z.object({ url: URLPredicate }).optional(),
		author: embedAuthorPredicate.optional(),
		fields: z.array(embedFieldPredicate).max(25).optional(),
	})
	.refine(
		(embed) => {
			return (
				embed.title !== undefined ||
				embed.description !== undefined ||
				(embed.fields !== undefined && embed.fields.length > 0) ||
				embed.footer !== undefined ||
				embed.author !== undefined ||
				embed.image !== undefined ||
				embed.thumbnail !== undefined
			);
		},
		{
			message: 'Embed must have at least a title, description, a field, a footer, an author, an image, OR a thumbnail.',
		},
	)
	.refine(
		(embed) => {
			return embedLength(embed) <= 6_000;
		},
		{ message: 'Embeds must not exceed 6000 characters in total.' },
	);
