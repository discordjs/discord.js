import type { APIModalInteractionResponseCallbackData } from 'discord-api-types/v10';
import { titleValidator, validateRequiredParameters } from './Assertions';
import { UnsafeModalBuilder } from './UnsafeModal';
import { customIdValidator } from '../../components/Assertions';

export class ModalBuilder extends UnsafeModalBuilder {
	public override setCustomId(customId: string): this {
		return super.setCustomId(customIdValidator.parse(customId));
	}

	public override setTitle(title: string) {
		return super.setTitle(titleValidator.parse(title));
	}

	public override toJSON(): APIModalInteractionResponseCallbackData {
		validateRequiredParameters(this.data.custom_id, this.data.title, this.components);
		return super.toJSON();
	}
}
