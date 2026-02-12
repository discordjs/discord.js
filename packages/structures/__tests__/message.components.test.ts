import {
	type APIActionRowComponent,
	type APIComponentInActionRow,
	type APIButtonComponent,
	type APIChannelSelectComponent,
	type APIMessageComponentEmoji,
	type APIContainerComponent,
	type APIFileComponent,
	type APIFileUploadComponent,
	type APIButtonComponentWithCustomId,
	type APILabelComponent,
	type APIButtonComponentWithURL,
	type APIMediaGalleryComponent,
	type APIMediaGalleryItem,
	type APIMentionableSelectComponent,
	type APIButtonComponentWithSKUId /* PremiumButtonComponent */,
	type APIRoleSelectComponent,
	type APISectionComponent,
	type APISelectMenuComponent,
	type APISelectMenuDefaultValue /* this and next line are required for same component */,
	type SelectMenuDefaultValueType, // enum
	type APISeparatorComponent,
	type APIStringSelectComponent,
	type APISelectMenuOption /* need [string] select menus */,
	type APITextDisplayComponent,
	type APITextInputComponent,
	type APIThumbnailComponent,
	type APIUnfurledMediaItem,
	type APIUserSelectComponent,
	ButtonStyle,
	ComponentType,
	TextInputStyle,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	ButtonDataType,
	ActionRowComponent,
	ButtonComponent,
	ChannelSelectMenuComponent,
	Component,
	ComponentEmoji,
	ContainerComponent,
	FileComponent,
	FileUploadComponent,
	InteractiveButtonComponent,
	LabeledButtonComponent,
	LinkButtonComponent,
	MediaGalleryComponent,
	MediaGalleryItem,
	MentionableSelectMenuComponent,
	PremiumButtonComponent,
	RoleSelectMenuComponent,
	SelectMenuComponent,
	SelectMenuDefaultValue,
	SeparatorComponent,
	StringSelectMenuComponent,
	StringSelectMenuOption,
	TextDisplayComponent,
	TextInputComponent,
	ThumbnailComponent,
	UnfurledMediaItem,
	UserSelectMenuComponent,
} from '../src/index.js';
import { kPatch } from '../src/utils/symbols';

const actionRowComponent: APIActionRowComponent<APIComponentInActionRow> = {};

const buttonComponent: APIButtonComponent = {};

const channelSelectComponent: APIChannelSelectComponent = {
	custom_id: '',
	type: ComponentType.ChannelSelect,
};

const emojiComponent: APIMessageComponentEmoji = {};

const containerComponent: APIContainerComponent = {
	components: [],
	type: ComponentType.Container,
};

const unfurledMediaItem: APIUnfurledMediaItem = {
	url: '',
};

const fileComponent: APIFileComponent = {
	file: unfurledMediaItem,
	type: ComponentType.File,
};

const fileUploadComponent: APIFileUploadComponent = {
	custom_id: '',
	type: ComponentType.FileUpload,
};

const buttonComponentWithCustomId: APIButtonComponentWithCustomId = {
	custom_id: '1',
	style: ButtonStyle.Primary,
	type: ComponentType.Button,
};

const labelComponent: APILabelComponent = {
	label: '',
	component: undefined,
	type: ComponentType.Label,
};

const buttonComponentWithURL: APIButtonComponentWithURL = {
	url: '',
	style: ButtonStyle.Link,
	type: ComponentType.Button,
};

const mediaGalleryItem: APIMediaGalleryItem = {
	media: unfurledMediaItem,
};

const mediaGalleryComponent: APIMediaGalleryComponent = {
	items: [],
	type: ComponentType.MediaGallery,
};

const mentionableSelectComponent: APIMentionableSelectComponent = {
	custom_id: '',
	type: ComponentType.MentionableSelect,
};

const buttonComponentWithSKUId: APIButtonComponentWithSKUId = {
	sku_id: '',
	style: ButtonStyle.Premium,
	type: ComponentType.Button,
};

const roleSelectComponent: APIRoleSelectComponent = {
	custom_id: '',
	type: ComponentType.RoleSelect,
};

const sectionComponent: APISectionComponent = {
	components: [],
	accessory: undefined,
	type: ComponentType.Section,
};

const selectMenuComponent: APISelectMenuComponent = {};

const selectMenuDefaultValue: APISelectMenuDefaultValue<SelectMenuDefaultValueType.User> = {};

const separatorComponent: APISeparatorComponent = {
	type: ComponentType.Separator,
};

const stringSelectComponent: APIStringSelectComponent = {
	options: [],
	custom_id: '',
	type: ComponentType.StringSelect,
};

const selectMenuOption: APISelectMenuOption = {
	label: '',
	value: '',
};

const textDisplayComponent: APITextDisplayComponent = {
	content: '',
	type: ComponentType.TextDisplay,
};

const textInputComponent: APITextInputComponent = {
	style: TextInputStyle.Short,
	custom_id: '',
	type: ComponentType.TextInput,
};

const thumbnailComponent: APIThumbnailComponent = {
	media: unfurledMediaItem,
	type: ComponentType.Thumbnail,
};

const userSelectComponent: APIUserSelectComponent = {
	custom_id: '',
	type: ComponentType.UserSelect,
};

describe('Message components', () => {
	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe(' Structure', () => {
		const data = {} as any;
		const instance = {} as any;

		test('Emoji has all properties', () => {});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Emoji works in place', () => {
			const patched = instance[kPatch]({});

			expect(patched.available).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});
});
