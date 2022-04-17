import { UnsafeAttachmentBuilder } from './UnsafeAttachment';
import { nameValidator, descriptionValidator, validateRequiredAttachmentParameters } from './Assertions';
import type { BufferResolvable } from './UnsafeAttachment';
import type { Stream } from 'node:stream';

export class AttachmentBuilder extends UnsafeAttachmentBuilder {
	public override setDescription(description: string) {
		return super.setDescription(descriptionValidator.parse(description));
	}

	public override setFile(attachment: BufferResolvable | Stream, name: string | null) {
		if (name) {
			return super.setFile(attachment, nameValidator.parse(name));
		}
		return super.setFile(attachment, name);
	}

	public override setName(name: string) {
		return super.setName(nameValidator.parse(name));
	}

	public override toJSON() {
		validateRequiredAttachmentParameters(this.data.description, this.data.name);
		return super.toJSON();
	}
}
