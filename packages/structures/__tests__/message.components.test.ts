import {
	type APIComponentInMessageActionRow,
	type APIActionRowComponent,
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
	type APIButtonComponentWithSKUId,
	type APIRoleSelectComponent,
	type APISectionComponent,
	type APISelectMenuDefaultValue,
	type APISeparatorComponent,
	type APIStringSelectComponent,
	type APISelectMenuOption,
	type APITextDisplayComponent,
	type APITextInputComponent,
	type APIThumbnailComponent,
	type APIUnfurledMediaItem,
	type APIUserSelectComponent,
	ButtonStyle,
	ComponentType,
	ChannelType,
	SelectMenuDefaultValueType,
	SeparatorSpacingSize,
	TextInputStyle,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	ActionRowComponent,
	ChannelSelectMenuComponent,
	ComponentEmoji,
	ContainerComponent,
	FileComponent,
	FileUploadComponent,
	InteractiveButtonComponent,
	LabelComponent,
	LinkButtonComponent,
	MediaGalleryComponent,
	MediaGalleryItem,
	MentionableSelectMenuComponent,
	PremiumButtonComponent,
	RoleSelectMenuComponent,
	SelectMenuDefaultValue,
	SeparatorComponent,
	StringSelectMenuComponent,
	StringSelectMenuOption,
	TextDisplayComponent,
	TextInputComponent,
	ThumbnailComponent,
	UnfurledMediaItem,
	UserSelectMenuComponent,
	SectionComponent,
} from '../src/index.js';
import { kPatch } from '../src/utils/symbols';

const textDisplayComponent: APITextDisplayComponent = {
	content: 'djs://text-display-component-content',
	type: ComponentType.TextDisplay,
};

const fileUploadComponent: APIFileUploadComponent = {
	custom_id: 'djs://file-upload-component-custom-id',
	id: 100,
	max_values: 1_000_000,
	type: ComponentType.FileUpload,
	required: true,
};

const labelComponent: APILabelComponent = {
	label: 'djs://label-button-component-label',
	type: ComponentType.Label,
	component: fileUploadComponent,
};

const buttonComponentWithURL: APIButtonComponentWithURL = {
	id: 1,
	url: 'button-component-with-url',
	style: ButtonStyle.Link,
	type: ComponentType.Button,
};

const actionRowComponent: APIActionRowComponent<APIComponentInMessageActionRow> = {
	type: ComponentType.ActionRow,
	components: [buttonComponentWithURL],
};

const channelSelectComponent: APIChannelSelectComponent = {
	custom_id: 'djs://channel-select-component-custom-id',
	type: ComponentType.ChannelSelect,
	channel_types: [ChannelType.GuildForum, ChannelType.DM],
	disabled: false,
	default_values: [],
	max_values: 1_000,
	placeholder: 'djs://channel-select-component-pceholder',
	required: true,
};

/* todo: could this be a partial Emoji instead? */
const emojiComponent: APIMessageComponentEmoji = {
	id: '1',
	name: 'djs://emoji-name',
};

const containerComponent: APIContainerComponent = {
	id: 212,
	accent_color: 0x676767,
	components: [],
	type: ComponentType.Container,
};

const unfurledMediaItem: APIUnfurledMediaItem = {
	url: 'djs://unfurled-media-item-url',
	height: 1,
	width: 2,
	placeholder: 'djs://unfurled-media-item-placeholder',
};

const fileComponent: APIFileComponent = {
	id: 111,
	name: 'file.exe',
	size: 10_000,
	file: unfurledMediaItem,
	type: ComponentType.File,
};

const buttonComponentWithCustomId: APIButtonComponentWithCustomId = {
	custom_id: 'djs://button-component-with-sku-id',
	label: 'djs://button-component-with-custom-id-label',
	id: 10,
	style: ButtonStyle.Primary,
	type: ComponentType.Button,
};

const mediaGalleryItem: APIMediaGalleryItem = {
	description: 'djs://media-gallery-item-descriptor',
	media: unfurledMediaItem,
};

const mediaGalleryComponent: APIMediaGalleryComponent = {
	items: [],
	type: ComponentType.MediaGallery,
};

const mentionableSelectComponent: APIMentionableSelectComponent = {
	custom_id: 'djs://mentionable-select-component-custom-id',
	id: 10,
	disabled: false,
	required: true,
	max_values: 10_000,
	placeholder: 'djs://mention-select-component-placeholder',
	type: ComponentType.MentionableSelect,
};

const buttonComponentWithSKUId: APIButtonComponentWithSKUId = {
	disabled: false,
	id: 12,
	sku_id: 'djs://button-component-with-sku-id',
	style: ButtonStyle.Premium,
	type: ComponentType.Button,
};

const roleSelectComponent: APIRoleSelectComponent = {
	custom_id: '',
	disabled: true,
	id: 123,
	max_values: 10_000,
	placeholder: 'djs://role-select-component-placeholder',
	required: false,
	type: ComponentType.RoleSelect,
};

const sectionComponent: APISectionComponent = {
	components: [textDisplayComponent],
	accessory: buttonComponentWithCustomId,
	id: 4_123,
	type: ComponentType.Section,
};

const selectMenuDefaultValue: APISelectMenuDefaultValue<SelectMenuDefaultValueType.User> = {
	id: '1',
	/* todo as the above id is a snowflake, are we missing created[Date/Timestamp] on the getters? */
	type: SelectMenuDefaultValueType.User,
};

const separatorComponent: APISeparatorComponent = {
	divider: true,
	spacing: SeparatorSpacingSize.Small,
	id: 100,
	type: ComponentType.Separator,
};

const stringSelectComponent: APIStringSelectComponent = {
	id: 23,
	options: [],
	custom_id: 'djs://string-select-component-custom-id',
	disabled: false,
	type: ComponentType.StringSelect,
	max_values: 10_000,
	placeholder: 'djs://string-select-menu-component-placeholder',
	required: true,
};

const selectMenuOption: APISelectMenuOption = {
	default: true,
	label: 'djs://select-menu-option-label',
	value: 'djs://select-menu-option-value',
};

const textInputComponent: APITextInputComponent = {
	id: 11,
	style: TextInputStyle.Short,
	custom_id: 'djs://text-input-component-custom-id',
	type: ComponentType.TextInput,
	min_length: 4_000,
	label: 'djs://text-input-component-label',
	required: true,
	value: 'djs://text-input-component-value',
};

const thumbnailComponent: APIThumbnailComponent = {
	id: 10,
	media: unfurledMediaItem,
	type: ComponentType.Thumbnail,
	spoiler: true,
	description: 'djs://thumbnail-component-description',
};

const userSelectComponent: APIUserSelectComponent = {
	id: 1,
	disabled: false,
	max_values: 1_000,
	min_values: 10,
	custom_id: 'djs://user-select-component-custom-id',
	type: ComponentType.UserSelect,
	required: true,
	placeholder: 'djs://user-select-component-placeholder',
};

describe('Message components structures', () => {
	describe('UserSelectComponet Structure', () => {
		const data = userSelectComponent;
		const instance = new UserSelectMenuComponent(data);

		test('UserSelectComponet has all properties', () => {
			expect(instance.customId).toBe(data.custom_id);
			expect(instance.id).toBe(data.id);
			expect(instance.disabled).toBe(data.disabled);
			expect(instance.maxValues).toBe(data.max_values);
			expect(instance.minValues).toBe(data.min_values);
			expect(instance.placeholder).toBe(data.placeholder);
			expect(instance.required).toBe(data.required);
			expect(instance.type).toBe(data.type);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the UserSelectComponet works in place', () => {
			const patched = instance[kPatch]({
				required: false,
				placeholder: 'djs://[PATCHED]-user-select-component-placeholder',
			});

			expect(patched.required).toEqual(false);
			expect(patched.placeholder).toEqual('djs://[PATCHED]-user-select-component-placeholder');

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('ThumbnailComponent Structure', () => {
		const data = thumbnailComponent;
		const instance = new ThumbnailComponent(data);

		test('ThumbnailComponent has all properties', () => {
			expect(instance.description).toBe(data.description);
			expect(instance.id).toBe(data.id);
			expect(instance.spoiler).toBe(data.spoiler);
			expect(instance.type).toBe(data.type);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the ThumbnailCompoonent works in place', () => {
			const patched = instance[kPatch]({
				spoiler: false,
				description: 'djs://[PATCHED]-thumbnail-component-description',
			});

			expect(patched.spoiler).toEqual(false);
			expect(patched.description).toEqual('djs://[PATCHED]-thumbnail-component-description');

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('TextInputComponent Structure', () => {
		const data = textInputComponent;
		const instance = new TextInputComponent(data);

		test('TextInputComponent has all properties', () => {
			expect(instance.customId).toBe(data.custom_id);
			expect(instance.id).toBe(data.id);
			expect(instance.label).toBe(data.label);
			expect(instance.minLength).toBe(data.min_length);
			expect(instance.placeholder).toBe(data.placeholder);
			expect(instance.required).toBe(data.required);
			expect(instance.style).toBe(data.style);
			expect(instance.type).toBe(data.type);
			expect(instance.value).toBe(data.value);

			expect(instance.maxLength).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the TextInputComponent works in place', () => {
			const patched = instance[kPatch]({
				label: 'djs://[PATCHED]-text-input-component-label',
				placeholder: 'djs://[PATCHED]-text-input-component-placeholder',
				max_length: 10_000,
			});

			expect(patched.label).toEqual('djs://[PATCHED]-text-input-component-label');
			expect(patched.placeholder).toEqual('djs://[PATCHED]-text-input-component-placeholder');
			expect(patched.maxLength).toBe(10_000);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('TextDisplayComponent Structure', () => {
		const data = textDisplayComponent;
		const instance = new TextDisplayComponent(data);

		test('TextDisplayComponent has all properties', () => {
			expect(instance.id).toBe(data.id);
			expect(instance.content).toBe(data.content);
			expect(instance.type).toBe(data.type);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the TextDisplayComponent works in place', () => {
			const patched = instance[kPatch]({
				content: 'djs://[PATCHED]-text-display-component-new-context',
			});

			expect(patched.content).toEqual('djs://[PATCHED]-text-display-component-new-context');

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('StringSelectMenuOption Structure (dapi-types reference: APISelectMenuOption)', () => {
		const data = selectMenuOption;
		const instance = new StringSelectMenuOption(data);

		test('StringSelectMenuOption has all properties', () => {
			expect(instance.default).toBe(data.default);
			expect(instance.label).toBe(data.label);
			expect(instance.value).toBe(data.value);

			expect(instance.description).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the StringSelectMenuOption works in place', () => {
			const patched = instance[kPatch]({
				description: 'djs://[PATCHED]-string-select-menu-option-new-description',
			});

			expect(patched.description).toEqual('djs://[PATCHED]-string-select-menu-option-new-description');

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('StringSelectMenuComponent Structure (dapi-types reference: APIStringSelectComponent)', () => {
		const data = stringSelectComponent;
		const instance = new StringSelectMenuComponent(data);

		test('StringSelectMenuComponent has all properties', () => {
			expect(instance.customId).toBe(data.custom_id);
			expect(instance.disabled).toBe(data.disabled);
			expect(instance.id).toBe(data.id);
			expect(instance.maxValues).toBe(data.max_values);
			expect(instance.placeholder).toBe(data.placeholder);
			expect(instance.required).toBe(data.required);
			expect(instance.type).toBe(data.type);

			expect(instance.minValues).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the StringSelectMenuComponent works in place', () => {
			const patched = instance[kPatch]({
				min_values: 10_000,
			});

			expect(patched.minValues).toEqual(10_000);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('SeparatorComponent Structure', () => {
		const data = separatorComponent;
		const instance = new SeparatorComponent(data);

		test('SeparatorComponent has all properties', () => {
			expect(instance.divider).toBe(data.divider);
			expect(instance.id).toBe(data.id);
			expect(instance.spacing).toBe(data.spacing);
			expect(instance.type).toBe(data.type);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the SeparatorComponent works in place', () => {
			const patched = instance[kPatch]({
				divider: false,
				spacing: SeparatorSpacingSize.Large,
			});

			expect(patched.divider).toEqual(false);
			expect(patched.spacing).toEqual(SeparatorSpacingSize.Large);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('SelectMenuDefaultValue Structure', () => {
		const data = selectMenuDefaultValue;
		const instance = new SelectMenuDefaultValue(data);

		test('SelectMenuDefaultValue has all properties', () => {
			expect(instance.id).toBe(data.id);
			expect(instance.type).toBe(data.type);
			/* Todo: as instance.id is a snowflake and there are no created[Date/Timestamp] getters exposed
				on the clss, is this something that we are missing? 
			 */
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the SelectMenuDefaultValue works in place', () => {
			const patched = instance[kPatch]({
				type: SelectMenuDefaultValueType.Channel,
			});

			expect(patched.type).toEqual(SelectMenuDefaultValueType.Channel);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('SectionComponent Structure', () => {
		const data = sectionComponent;
		const instance = new SectionComponent(data);

		test('SectionComponent has all properties', () => {
			expect(instance.id).toBe(data.id);
			expect(instance.type).toBe(data.type);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the SectionComponent works in place', () => {
			const patched = instance[kPatch]({
				id: 10_001,
			});

			expect(patched.id).toBe(10_001);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('RoleSelectMenuComponent Structure (dapi-types reference: APIRoleSelectComponent)', () => {
		const data = roleSelectComponent;
		const instance = new RoleSelectMenuComponent(data);

		test('RoleSelectMenuComponent has all properties', () => {
			expect(instance.customId).toBe(data.custom_id);
			expect(instance.disabled).toBe(data.disabled);
			expect(instance.id).toBe(data.id);
			expect(instance.maxValues).toBe(data.max_values);
			expect(instance.placeholder).toBe(data.placeholder);
			expect(instance.required).toBe(data.required);
			expect(instance.type).toBe(data.type);

			expect(instance.minValues).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the RoleSelectMenuComponent works in place', () => {
			const patched = instance[kPatch]({
				min_values: 100,
				placeholder: 'djs://[PATCHED]-role-select-menu-component-new-placeholder',
			});

			expect(patched.minValues).toEqual(100);
			expect(patched.placeholder).toEqual('djs://[PATCHED]-role-select-menu-component-new-placeholder');

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('PremiumButtonComponent Structure (dapi-types reference: APIButtonComponentWithSKUId)', () => {
		const data = buttonComponentWithSKUId;
		const instance = new PremiumButtonComponent(data);

		test('PremiumButtonComponent has all properties', () => {
			expect(instance.disabled).toBe(data.disabled);
			expect(instance.id).toBe(data.id);
			expect(instance.skuId).toBe(data.sku_id);
			expect(instance.style).toBe(data.style);
			expect(instance.type).toBe(data.type);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the PremiumButtonComponent works in place', () => {
			const patched = instance[kPatch]({
				disabled: true,
				id: 100,
			});

			expect(patched.disabled).toEqual(true);
			expect(patched.id).toEqual(100);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('MentionableSelectMenuComponent Structure (dapi-types reference: APIMentionableSelectComponent)', () => {
		const data = mentionableSelectComponent;
		const instance = new MentionableSelectMenuComponent(data);

		test('MentionableSelectMenuComponent has all properties', () => {
			expect(instance.customId).toBe(data.custom_id);
			expect(instance.disabled).toBe(data.disabled);
			expect(instance.id).toBe(data.id);
			expect(instance.maxValues).toBe(data.max_values);
			expect(instance.placeholder).toBe(data.placeholder);
			expect(instance.required).toBe(data.required);
			expect(instance.type).toBe(data.type);

			expect(instance.minValues).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the MentionableSelectMenuComponent works in place', () => {
			const patched = instance[kPatch]({
				min_values: 100,
				required: false,
			});

			expect(patched.minValues).toEqual(100);
			expect(patched.required).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('MediaGalleryComponent Structure', () => {
		const data = mediaGalleryComponent;
		const instance = new MediaGalleryComponent(data);

		test('MediaGalleryComponent has all properties', () => {
			expect(instance.id).toBe(data.id);
			expect(instance.type).toBe(data.type);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the MediaGalleryComponent works in place', () => {
			const patched = instance[kPatch]({
				id: 1_000_000,
			});

			expect(patched.id).toEqual(1_000_000);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('MediaGalleryItem Structure', () => {
		const data = mediaGalleryItem;
		const instance = new MediaGalleryItem(data);

		test('MediaGalleryItem has all properties', () => {
			expect(instance.description).toBe(data.description);

			expect(instance.spoiler).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the MediaGalleryItem works in place', () => {
			const patched = instance[kPatch]({
				description: 'djs://[PATCHED]-media-gallery-item-new-descriptor',
				spoiler: true,
			});

			expect(patched.description).toEqual('djs://[PATCHED]-media-gallery-item-new-descriptor');
			expect(patched.spoiler).toEqual(true);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('LinkButtonComponent Structure (dapi-tyes reference: ButtonComponentWithURL)', () => {
		const data = buttonComponentWithURL;
		const instance = new LinkButtonComponent(data);

		test('LinkButtonComponent has all properties', () => {
			expect(instance.id).toBe(data.id);
			expect(instance.label).toBe(data.label);
			expect(instance.style).toBe(data.style);
			expect(instance.type).toBe(data.type);
			expect(instance.url).toBe(data.url);

			expect(instance.disabled).toBeNull();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the LinkButtonComponent works in place', () => {
			const patched = instance[kPatch]({
				disabled: true,
				url: '[PATCHED]-link-button-component-new-url',
			});

			expect(patched.disabled).toEqual(true);
			expect(patched.url).toEqual('[PATCHED]-link-button-component-new-url');

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('InteractiveButtonComponent Structure (dapi-types reference: APIButtonComponentWithCustomId)', () => {
		const data = buttonComponentWithCustomId;
		const instance = new InteractiveButtonComponent(data);

		test('InteractiveButtonComponent has all properties', () => {
			expect(instance.customId).toBe(data.custom_id);
			expect(instance.id).toBe(data.id);
			expect(instance.label).toBe(data.label);
			expect(instance.style).toBe(data.style);
			expect(instance.type).toBe(data.type);

			expect(instance.disabled).toBeNull();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the InteractiveButtonComponent works in place', () => {
			const patched = instance[kPatch]({
				disabled: true,
				custom_id: 'djs://[PATCHED]-button-component-with-new-custom-id',
			});

			expect(patched.disabled).toEqual(true);
			expect(patched.customId).toEqual('djs://[PATCHED]-button-component-with-new-custom-id');

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('FileComponent Structure', () => {
		const data = fileComponent;
		const instance = new FileComponent(data);

		test('FileComponent has all properties', () => {
			expect(instance.id).toBe(data.id);
			expect(instance.name).toBe(data.name);
			expect(instance.size).toBe(data.size);
			expect(instance.type).toBe(data.type);

			expect(instance.spoiler).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the FileComponent works in place', () => {
			const patched = instance[kPatch]({
				spoiler: true,
				size: 1,
			});

			expect(patched.spoiler).toEqual(true);
			expect(patched.size).toEqual(1);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('fileUploadComponent Structure', () => {
		const data = fileUploadComponent;
		const instance = new FileUploadComponent(data);

		test('fileUploadComponent has all properties', () => {
			expect(instance.customId).toBe(data.custom_id);
			expect(instance.id).toBe(data.id);
			expect(instance.maxValues).toBe(data.max_values);
			expect(instance.required).toBe(data.required);
			expect(instance.type).toBe(data.type);

			expect(instance.minValues).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the fileUploadComponent works in place', () => {
			const patched = instance[kPatch]({
				min_values: 10_000,
				required: false,
			});

			expect(patched.minValues).toEqual(10_000);
			expect(patched.required).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('UnfurledMediaItem Structure', () => {
		const data = unfurledMediaItem;
		const instance = new UnfurledMediaItem(data);

		test('UnfurledMediaItem has all properties', () => {
			expect(instance.attachmentId).toBe(data.attachment_id);
			expect(instance.contentType).toBe(data.content_type);
			expect(instance.height).toBe(data.height);
			expect(instance.width).toBe(data.width);
			expect(instance.url).toBe(data.url);

			expect(instance.proxyURL).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the UnfurledMediaItem works in place', () => {
			const patched = instance[kPatch]({
				proxy_url: 'djs://proxy-url',
				width: 222,
			});

			expect(patched.proxyURL).toEqual('djs://proxy-url');
			expect(patched.width).toEqual(222);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('ContainerComponent Structure', () => {
		const data = containerComponent;
		const instance = new ContainerComponent(data);

		test('correct value for all getters and helper method [hexAccentColor]', () => {
			expect(instance.accentColor).toBe(data.accent_color);
			expect(instance.id).toBe(data.id);
			expect(instance.type).toBe(data.type);

			expect(instance.hexAccentColor).toEqual(`#${data.accent_color!.toString(16)}`);

			expect(instance.spoiler).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the ContainerComponent works in place', () => {
			const patched = instance[kPatch]({
				spoiler: true,
				id: 2_000_000,
			});

			expect(patched.spoiler).toEqual(true);
			expect(patched.id).toEqual(2_000_000);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('ComponentEmoji Structure', () => {
		const data = emojiComponent;
		const instance = new ComponentEmoji(data);

		test('ComponentEmoji has all properties', () => {
			expect(instance.name).toBe(data.name);
			expect(instance.id).toBe(data.id);

			expect(instance.animated).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the ComponentEmoji works in place', () => {
			const patched = instance[kPatch]({
				animated: true,
				id: '1234',
			});

			expect(patched.animated).toEqual(true);
			expect(patched.id).toEqual('1234');

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('ChannelSelectMenuComponent Structure', () => {
		const data = channelSelectComponent;
		const instance = new ChannelSelectMenuComponent(data);

		test('ChannelSelectMenuComponent has all properties', () => {
			expect(instance.channelTypes).toBe(data.channel_types);
			expect(instance.customId).toBe(data.custom_id);
			expect(instance.disabled).toBe(data.disabled);
			expect(instance.id).toBe(data.id);
			expect(instance.maxValues).toBe(data.max_values);
			expect(instance.placeholder).toBe(data.placeholder);
			expect(instance.type).toBe(data.type);

			expect(instance.minValues).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the ChannelSelectMenuComponent works in place', () => {
			const patched = instance[kPatch]({
				min_values: 10,
				disabled: true,
			});

			expect(patched.minValues).toEqual(10);
			expect(patched.disabled).toEqual(true);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('ActionRowComponent Structure', () => {
		const data = actionRowComponent;
		const instance = new ActionRowComponent(data);

		test('ActionRowComponent has all properties', () => {
			expect(instance.type).toBe(data.type);

			expect(instance.id).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the ActionRowComponent works in place', () => {
			const patched = instance[kPatch]({
				id: 1_234,
			});

			expect(patched.id).toEqual(1_234);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('TextDisplayComponent Structure', () => {
		const data = textDisplayComponent;
		const instance = new TextDisplayComponent(data);

		test('TextDisplayComponent has all properties', () => {
			expect(instance.content).toBe(data.content);
			expect(instance.type).toBe(data.type);

			expect(instance.id).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the TextDisplayComponent works in place', () => {
			const patched = instance[kPatch]({
				id: 4_123,
				content: 'djs://[PATCHED]-text-display-component-new-content',
			});

			expect(patched.content).toEqual('djs://[PATCHED]-text-display-component-new-content');
			expect(patched.id).toEqual(4_123);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('LabelComponent Structure', () => {
		const data = labelComponent;
		const instance = new LabelComponent(data);

		test('LabelComponent has all properties', () => {
			expect(instance.id).toBe(data.id);
			expect(instance.label).toBe(data.label);
			expect(instance.type).toBe(data.type);

			expect(instance.description).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the LabelComponent works in place', () => {
			const patched = instance[kPatch]({
				description: 'djs://[PATCHED]-label-component-description',
				label: 'djs://[PATCHED]-label-component-new-label',
			});

			expect(patched.description).toEqual('djs://[PATCHED]-label-component-description');
			expect(patched.label).toEqual('djs://[PATCHED]-label-component-new-label');

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});
});
