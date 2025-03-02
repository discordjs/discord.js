import { s } from '@sapphire/shapeshift';
import { SeparatorSpacingSize } from 'discord-api-types/v10';
import { colorPredicate } from '../../messages/embed/Assertions';
import { isValidationEnabled } from '../../util/validation';
import { ButtonBuilder } from '../button/Button';
import { ThumbnailBuilder } from './Thumbnail';

export const unfurledMediaItemPredicate = s
	.object({
		url: s
			.string()
			.url(
				{ allowedProtocols: ['http:', 'https:', 'attachment:'] },
				{ message: 'Invalid protocol for media URL. Must be http:, https:, or attachment:' },
			),
	})
	.setValidationEnabled(isValidationEnabled);

export const descriptionPredicate = s
	.string()
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(1_024)
	.nullish()
	.setValidationEnabled(isValidationEnabled);

export const filePredicate = s
	.object({
		url: s
			.string()
			.url({ allowedProtocols: ['attachment:'] }, { message: 'Invalid protocol for file URL. Must be attachment:' }),
	})
	.setValidationEnabled(isValidationEnabled);

export const spoilerPredicate = s.boolean();

export const dividerPredicate = s.boolean();

export const spacingPredicate = s.nativeEnum(SeparatorSpacingSize);

export const containerColorPredicate = colorPredicate.nullish();

export const textDisplayContentPredicate = s
	.string()
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(4_000)
	.setValidationEnabled(isValidationEnabled);

export const accessoryPredicate = s
	.instance(ButtonBuilder)
	.or(s.instance(ThumbnailBuilder))
	.setValidationEnabled(isValidationEnabled);
