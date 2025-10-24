import { s } from '@sapphire/shapeshift';
import { ComponentType } from 'discord-api-types/v10';
import { isValidationEnabled } from '../../util/validation.js';
import { idValidator } from '../Assertions.js';
import { fileUploadPredicate } from '../fileUpload/Assertions.js';
import {
	selectMenuChannelPredicate,
	selectMenuMentionablePredicate,
	selectMenuRolePredicate,
	selectMenuStringPredicate,
	selectMenuUserPredicate,
} from '../selectMenu/Assertions.js';
import { textInputPredicate } from '../textInput/Assertions.js';

export const labelPredicate = s
	.object({
		id: idValidator.optional(),
		type: s.literal(ComponentType.Label),
		label: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(45),
		description: s.string().lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100).optional(),
		component: s.union([
			textInputPredicate,
			selectMenuUserPredicate,
			selectMenuRolePredicate,
			selectMenuMentionablePredicate,
			selectMenuChannelPredicate,
			selectMenuStringPredicate,
			fileUploadPredicate,
		]),
	})
	.setValidationEnabled(isValidationEnabled);
