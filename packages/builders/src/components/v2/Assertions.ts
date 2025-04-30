import { s } from '@sapphire/shapeshift';
import { SeparatorSpacingSize } from 'discord-api-types/v10';
import { colorPredicate } from '../../messages/embed/Assertions';
import { isValidationEnabled } from '../../util/validation';
import { ComponentBuilder } from '../Component';
import { ButtonBuilder } from '../button/Button';
import type { ContainerComponentBuilder } from './Container';
import type { MediaGalleryItemBuilder } from './MediaGalleryItem';
import type { TextDisplayBuilder } from './TextDisplay';
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

export const textDisplayContentPredicate = s
	.string()
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(4_000)
	.setValidationEnabled(isValidationEnabled);

export const accessoryPredicate = s
	.instance(ButtonBuilder)
	.or(s.instance(ThumbnailBuilder))
	.setValidationEnabled(isValidationEnabled);

export const containerColorPredicate = colorPredicate.nullish();

export function assertReturnOfBuilder<ReturnType extends MediaGalleryItemBuilder | TextDisplayBuilder>(
	input: unknown,
	ExpectedInstanceOf: new () => ReturnType,
): asserts input is ReturnType {
	s.instance(ExpectedInstanceOf).setValidationEnabled(isValidationEnabled).parse(input);
}

export function validateComponentArray<
	ReturnType extends ContainerComponentBuilder | MediaGalleryItemBuilder = ContainerComponentBuilder,
>(input: unknown, min: number, max: number, ExpectedInstanceOf?: new () => ReturnType): asserts input is ReturnType[] {
	(ExpectedInstanceOf ? s.instance(ExpectedInstanceOf) : s.instance(ComponentBuilder))
		.array()
		.lengthGreaterThanOrEqual(min)
		.lengthLessThanOrEqual(max)
		.setValidationEnabled(isValidationEnabled)
		.parse(input);
}
