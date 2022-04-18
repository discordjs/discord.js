import { nameValidator, descriptionValidator, validateRequiredAttachmentParameters } from './Assertions';
import type { Stream } from 'node:stream';
import { UnsafeAttachmentBuilder } from './UnsafeAttachment';
import type { BufferResolvable } from './UnsafeAttachment';

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
		validateRequiredAttachmentParameters(this.data.description, this.data.filename);
		return super.toJSON();
	}
}
