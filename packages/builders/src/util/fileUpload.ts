import { s } from '@sapphire/shapeshift';
import { isValidationEnabled } from './validation.js';

export const fileUploadTypesValidator = s
	.array(
		s.union([
			s.literal('audio'),
			s.literal('image'),
			s.literal('video'),
			s.string().lengthGreaterThanOrEqual(2).regex(/^\./),
		]),
	)
	.lengthLessThanOrEqual(10)
	.setValidationEnabled(isValidationEnabled);
