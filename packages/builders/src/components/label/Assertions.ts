import { ComponentType } from 'discord-api-types/v10';
import { z } from 'zod';
import { idPredicate } from '../../Assertions';
import {
	selectMenuChannelPredicate,
	selectMenuMentionablePredicate,
	selectMenuRolePredicate,
	selectMenuStringPredicate,
	selectMenuUserPredicate,
} from '../Assertions';
import { textInputPredicate } from '../textInput/Assertions';

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
	]),
});
