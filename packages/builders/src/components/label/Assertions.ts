import { ComponentType } from 'discord-api-types/v10';
import { z } from 'zod';
import { idPredicate } from '../../Assertions.js';
import {
	selectMenuChannelPredicate,
	selectMenuMentionablePredicate,
	selectMenuRolePredicate,
	selectMenuStringPredicate,
	selectMenuUserPredicate,
} from '../Assertions.js';
import { fileUploadPredicate } from '../fileUpload/Assertions.js';
import { textInputPredicate } from '../textInput/Assertions.js';

export const labelPredicate = z.object({
	id: idPredicate,
	type: z.literal(ComponentType.Label),
	label: z.string().min(1).max(45),
	description: z.string().min(1).max(100).optional(),
	component: z.union([
		selectMenuStringPredicate,
		textInputPredicate,
		selectMenuUserPredicate,
		selectMenuRolePredicate,
		selectMenuMentionablePredicate,
		selectMenuChannelPredicate,
		fileUploadPredicate,
	]),
});
