import type { APIModalInteractionResponseCallbackData } from 'discord-api-types/v9';
import { validateRequiredParameters } from './Assertions';
import { UnsafeModal } from './UnsafeModal';

export class Modal extends UnsafeModal {
	public override toJSON(): APIModalInteractionResponseCallbackData {
		validateRequiredParameters(this.data.custom_id, this.data.title, this.components);
		return super.toJSON();
	}
}
