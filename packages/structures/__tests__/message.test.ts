import { DiscordSnowflake } from '@sapphire/snowflake';
import type {
	APIActionRowComponent,
	APIAttachment,
	APIButtonComponent,
	APIChannelSelectComponent,
	APIContainerComponent,
	APIFileComponent,
	APIMediaGalleryComponent,
	APIMentionableSelectComponent,
	APIMessage,
	APIRoleSelectComponent,
	APISectionComponent,
	APISeparatorComponent,
	APIStringSelectComponent,
	APIUser,
	APIUserSelectComponent,
} from 'discord-api-types/v10';
import {
	MessageReferenceType,
	MessageType,
	MessageFlags,
	ComponentType,
	ButtonStyle,
	SeparatorSpacingSize,
	ChannelType,
	SelectMenuDefaultValueType,
	AttachmentFlags,
} from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { Attachment } from '../src/messages/Attachment.js';
import { Message } from '../src/messages/Message.js';
import { User } from '../src/users/User.js';
import { dateToDiscordISOTimestamp } from '../src/utils/optimization.js';
import { kPatch } from '../src/utils/symbols.js';

const user: APIUser = {
	username: 'user',
	avatar: 'abcd123',
	global_name: 'User',
	discriminator: '0',
	id: '3',
};

describe('message with embeds and attachments', () => {
	const timestamp = '2025-10-09T17:48:20.192000+00:00';
	const data: APIMessage = {
		id: DiscordSnowflake.generate({ timestamp: Date.parse(timestamp) }).toString(),
		type: MessageType.Default,
		position: 10,
		channel_id: '2',
		author: user,
		attachments: [
			{
				filename: 'file.txt',
				description: 'describe attachment',
				id: '0',
				proxy_url: 'https://media.example.com/attachment/123.txt',
				size: 5,
				url: 'https://example.com/attachment/123.txt',
			},
		],
		content: 'something <&5> <&6>',
		edited_timestamp: '2025-10-09T17:50:20.292000+00:00',
		embeds: [
			{
				author: {
					name: 'embed author',
					icon_url: 'https://discord.js.org/static/logo.svg',
				},
				color: 255,
				description: 'describe me',
				fields: [
					{
						name: 'field name',
						value: 'field value',
						inline: false,
					},
				],
				footer: {
					text: 'footer',
				},
				image: {
					url: 'https://discord.js.org/static/logo.svg',
				},
				thumbnail: {
					url: 'https://discord.js.org/static/logo.svg',
				},
				title: 'Title',
				timestamp: '2025-10-19T21:39:40.193000+00:00',
			},
		],
		mention_everyone: false,
		mention_roles: ['5', '6'],
		mentions: [user],
		pinned: false,
		timestamp,
		tts: false,
		flags: MessageFlags.SuppressNotifications,
	};

	test('Message has all properties', () => {
		const instance = new Message(data);
		expect(instance.id).toBe(data.id);
		expect(instance.channelId).toBe(data.channel_id);
		expect(instance.position).toBe(data.position);
		expect(instance.content).toBe(data.content);
		expect(instance.createdTimestamp).toBe(Date.parse(data.timestamp));
		expect(dateToDiscordISOTimestamp(instance.createdAt!)).toBe(data.timestamp);
		expect(instance.flags?.toJSON()).toBe(data.flags);
		expect(instance.editedTimestamp).toBe(Date.parse(data.edited_timestamp!));
		expect(dateToDiscordISOTimestamp(instance.editedAt!)).toBe(data.edited_timestamp);
		expect(instance.nonce).toBe(data.nonce);
		expect(instance.pinned).toBe(data.pinned);
		expect(instance.tts).toBe(data.tts);
		expect(instance.webhookId).toBe(data.webhook_id);
		expect(instance.type).toBe(MessageType.Default);
		expect(instance.toJSON()).toEqual(data);
	});

	test('Attachment sub-structure', () => {
		const instances = data.attachments?.map((attachment) => new Attachment(attachment));
		expect(instances?.map((attachment) => attachment.toJSON())).toEqual(data.attachments);
		expect(instances?.[0]?.description).toBe(data.attachments?.[0]?.description);
		expect(instances?.[0]?.filename).toBe(data.attachments?.[0]?.filename);
		expect(instances?.[0]?.id).toBe(data.attachments?.[0]?.id);
		expect(instances?.[0]?.size).toBe(data.attachments?.[0]?.size);
		expect(instances?.[0]?.url).toBe(data.attachments?.[0]?.url);
		expect(instances?.[0]?.proxyURL).toBe(data.attachments?.[0]?.proxy_url);
	});

	test('User sub-structure', () => {
		const instance = new User(data.author);
		const instances = data.mentions.map((user) => new User(user));
		expect(instance.toJSON()).toEqual(data.author);
		expect(instances.map((user) => user.toJSON())).toEqual(data.mentions);
		expect(instance.avatar).toBe(data.author.avatar);
		expect(instance.discriminator).toBe(data.author.discriminator);
		expect(instance.displayName).toBe(data.author.global_name);
		expect(instance.globalName).toBe(data.author.global_name);
		expect(instance.id).toBe(data.author.id);
		expect(instance.username).toBe(data.author.username);
	});
});

describe('message with components', () => {
	const timestamp = '2025-10-10T15:48:20.192000+00:00';
	const buttonRow: APIActionRowComponent<APIButtonComponent> = {
		type: ComponentType.ActionRow,
		id: 5,
		components: [
			{
				type: ComponentType.Button,
				style: ButtonStyle.Danger,
				custom_id: 'danger',
				disabled: false,
				emoji: {
					animated: false,
					id: '12345',
					name: 'emoji',
				},
				id: 6,
				label: 'Danger button',
			},
			{
				type: ComponentType.Button,
				style: ButtonStyle.Link,
				url: 'https://discord.js.org/',
				disabled: false,
				id: 7,
				label: 'DJS',
			},
			{
				type: ComponentType.Button,
				style: ButtonStyle.Premium,
				sku_id: '9876',
				disabled: false,
				id: 8,
			},
		],
	};
	const file: APIFileComponent = {
		type: ComponentType.File,
		file: {
			url: 'attachment://file.txt',
			attachment_id: '0',
			content_type: 'text/plain',
			flags: 0,
		},
		id: 9,
		spoiler: true,
	};
	const mediaGallery: APIMediaGalleryComponent = {
		type: ComponentType.MediaGallery,
		items: [
			{
				media: {
					url: 'https://discord.js.org/static/logo.svg',
					content_type: 'image/svg+xml',
					height: 50,
					width: 50,
				},
				description: 'Logo',
				spoiler: false,
			},
		],
		id: 10,
	};
	const section: APISectionComponent = {
		type: ComponentType.Section,
		accessory: {
			type: ComponentType.Thumbnail,
			media: {
				url: 'https://discord.js.org/static/logo.svg',
			},
			description: 'Logo thumbnail',
			id: 13,
			spoiler: false,
		},
		components: [
			{
				type: ComponentType.TextDisplay,
				content: 'Text',
				id: 14,
			},
		],
		id: 12,
	};
	const separator: APISeparatorComponent = {
		type: ComponentType.Separator,
		divider: true,
		id: 15,
		spacing: SeparatorSpacingSize.Large,
	};
	const channelRow: APIActionRowComponent<APIChannelSelectComponent> = {
		type: ComponentType.ActionRow,
		id: 16,
		components: [
			{
				type: ComponentType.ChannelSelect,
				custom_id: 'channel',
				channel_types: [ChannelType.GuildCategory, ChannelType.GuildText],
				default_values: [
					{
						id: '123456789012345678',
						type: SelectMenuDefaultValueType.Channel,
					},
					{
						id: '123456789012345679',
						type: SelectMenuDefaultValueType.Channel,
					},
				],
				disabled: false,
				id: 17,
				max_values: 2,
				min_values: 0,
				placeholder: '(none)',
				required: false,
			},
		],
	};
	const mentionRow: APIActionRowComponent<APIMentionableSelectComponent> = {
		type: ComponentType.ActionRow,
		id: 18,
		components: [
			{
				type: ComponentType.MentionableSelect,
				custom_id: 'mention',
				default_values: [
					{
						id: '123456789012345678',
						type: SelectMenuDefaultValueType.User,
					},
					{
						id: '123456789012345679',
						type: SelectMenuDefaultValueType.Role,
					},
				],
				disabled: false,
				id: 19,
				max_values: 2,
				min_values: 0,
				placeholder: '(none)',
				required: false,
			},
		],
	};
	const roleRow: APIActionRowComponent<APIRoleSelectComponent> = {
		type: ComponentType.ActionRow,
		id: 20,
		components: [
			{
				type: ComponentType.RoleSelect,
				custom_id: 'role',
				default_values: [
					{
						id: '123456789012345678',
						type: SelectMenuDefaultValueType.Role,
					},
					{
						id: '123456789012345679',
						type: SelectMenuDefaultValueType.Role,
					},
				],
				disabled: false,
				id: 21,
				max_values: 2,
				min_values: 0,
				placeholder: '(none)',
				required: false,
			},
		],
	};
	const userRow: APIActionRowComponent<APIUserSelectComponent> = {
		type: ComponentType.ActionRow,
		id: 22,
		components: [
			{
				type: ComponentType.UserSelect,
				custom_id: 'user',
				default_values: [
					{
						id: '123456789012345678',
						type: SelectMenuDefaultValueType.User,
					},
					{
						id: '123456789012345679',
						type: SelectMenuDefaultValueType.User,
					},
				],
				disabled: false,
				id: 23,
				max_values: 2,
				min_values: 0,
				placeholder: '(none)',
				required: false,
			},
		],
	};
	const stringRow: APIActionRowComponent<APIStringSelectComponent> = {
		type: ComponentType.ActionRow,
		id: 24,
		components: [
			{
				type: ComponentType.StringSelect,
				custom_id: 'string',
				options: [
					{
						label: 'one',
						value: '1',
						default: true,
					},
					{
						label: 'two',
						value: '2',
						default: false,
					},
					{
						label: 'three',
						value: '3',
						description: 'third',
						emoji: {
							id: '3333333333333333333',
							name: '3',
							animated: false,
						},
					},
				],
				disabled: false,
				id: 25,
				max_values: 2,
				min_values: 0,
				placeholder: '(none)',
				required: false,
			},
		],
	};
	const container: APIContainerComponent = {
		type: ComponentType.Container,
		accent_color: 255,
		id: 4,
		components: [
			buttonRow,
			file,
			mediaGallery,
			section,
			separator,
			channelRow,
			mentionRow,
			roleRow,
			userRow,
			stringRow,
		],
		spoiler: true,
	};
	const data: APIMessage = {
		id: DiscordSnowflake.generate({ timestamp: Date.parse(timestamp) }).toString(),
		type: MessageType.Reply,
		position: 15,
		channel_id: '2',
		author: user,
		attachments: [
			{
				filename: 'file.txt',
				description: 'describe attachment',
				id: '0',
				proxy_url: 'https://media.example.com/attachment/123.txt',
				size: 5,
				url: 'https://example.com/attachment/123.txt',
			},
		],
		content: '',
		edited_timestamp: '2025-10-10T15:50:20.292000+00:00',
		embeds: [],
		components: [container],
		message_reference: {
			channel_id: '505050505050505050',
			message_id: '606060606060606060',
			guild_id: '707070707070707070',
			type: MessageReferenceType.Default,
		},
		mention_everyone: false,
		mention_roles: ['5', '6'],
		mentions: [user],
		pinned: false,
		timestamp,
		tts: false,
		flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
	};

	test('Message has all properties', () => {
		const instance = new Message(data);
		expect(instance.id).toBe(data.id);
		expect(instance.channelId).toBe(data.channel_id);
		expect(instance.position).toBe(data.position);
		expect(instance.content).toBe(data.content);
		expect(instance.createdTimestamp).toBe(Date.parse(data.timestamp));
		expect(dateToDiscordISOTimestamp(instance.createdAt!)).toBe(data.timestamp);
		expect(instance.flags?.toJSON()).toBe(data.flags);
		expect(instance.editedTimestamp).toBe(Date.parse(data.edited_timestamp!));
		expect(dateToDiscordISOTimestamp(instance.editedAt!)).toBe(data.edited_timestamp);
		expect(instance.nonce).toBe(data.nonce);
		expect(instance.pinned).toBe(data.pinned);
		expect(instance.tts).toBe(data.tts);
		expect(instance.webhookId).toBe(data.webhook_id);
		expect(instance.type).toBe(MessageType.Reply);
		expect(instance.toJSON()).toEqual(data);
	});

	describe('attachment sub-structure', () => {
		const data: APIAttachment = {
			id: '1230',
			filename: 'the name of a file, it is',
			title: 'title',
			description: 'a very big attachment',
			content_type: 'content/type',
			size: 123,
			url: 'https://discord.com/',
			proxy_url: 'https://printer.discord.com/',
			height: 10,
			width: 10,
			ephemeral: true,
			duration_secs: 98,
			waveform: 'ofjrjpfprenfo2npj3f034fpn43jf43;3ff5g2597y480f8u4jndoduie3f&====',
		};

		const attachmentWithFlagsData = {
			...data,
			flags: AttachmentFlags.IsRemix,
		};

		const instance = new Attachment(data);
		const attachmentWithFlags = new Attachment(attachmentWithFlagsData);

		test('has expected values for all getters', () => {
			expect(instance.description).toBe(data.description);
			expect(instance.filename).toBe(data.filename);
			expect(instance.id).toBe(data.id);
			expect(instance.size).toBe(data.size);
			expect(instance.url).toBe(data.url);
			expect(instance.proxyURL).toBe(data.proxy_url);
			expect(instance.height).toBe(data.height);
			expect(instance.width).toBe(data.width);
			expect(instance.contentType).toBe(data.content_type);
			expect(instance.ephemeral).toBe(data.ephemeral);
			expect(instance.title).toBe(data.title);
			expect(instance.durationSecs).toBe(data.duration_secs);
			expect(instance.waveform).toBe(data.waveform);
			expect(attachmentWithFlags.flags?.valueOf()).toBe(BigInt(attachmentWithFlagsData.flags));
			expect(instance.flags).toBeNull();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('Patching the Entitlement works in place', () => {
			const filename = 'new filename';
			const size = 1_000_000;

			const patched = instance[kPatch]({
				filename,
				size,
			});

			expect(patched.filename).toEqual(filename);
			expect(patched.size).toEqual(size);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});
});
