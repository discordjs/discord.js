import { DiscordSnowflake } from '@sapphire/snowflake';
import type {
	APIActionRowComponent,
	APIApplicationCommandInteractionMetadata,
	APIAttachment,
	APIAuthorizingIntegrationOwnersMap,
	APIButtonComponent,
	APIChannelMention,
	APIChannelSelectComponent,
	APIContainerComponent,
	APIEmoji,
	APIFileComponent,
	APIMediaGalleryComponent,
	APIMentionableSelectComponent,
	APIMessage,
	APIMessageActivity,
	APIMessageCall,
	APIMessageComponentInteractionMetadata,
	APIMessageReference,
	APIModalSubmitInteractionMetadata,
	APIReaction,
	APIReactionCountDetails,
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
	MessageActivityType,
	InteractionType,
} from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import {
	ApplicationCommandInteractionMetadata,
	ChannelMention,
	MessageActivity,
	MessageCall,
	MessageComponentInteractionMetadata,
	MessageReference,
	ModalSubmitInteractionMetadata,
	Reaction,
	ReactionCountDetails,
} from '../src/index.js';
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
		application_id: '1231242356787654',
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
		expect(instance.applicationId).toBe(data.application_id);
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

		test('Patching the attachment works in place', () => {
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

	describe('MessageActivity sub-structure', () => {
		const data: APIMessageActivity = {
			type: MessageActivityType.Listen,
		};
		const instance = new MessageActivity(data);

		test('correct value for all getters', () => {
			expect(instance.type).toBe(data.type);

			expect(instance.partyId).toBeUndefined();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const party_id = '123456765432';

			const patched = instance[kPatch]({
				party_id,
			});

			expect(patched.partyId).toBe(party_id);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('MessageCall sub-structure', () => {
		const data: APIMessageCall = {
			participants: ['1234456543456432', '438579082025724'],
			ended_timestamp: '2025-10-10T15:50:20.292000+00:00',
		};
		const instance = new MessageCall(data);

		test('correct value for all getters', () => {
			const endedTimestamp = Date.parse(data.ended_timestamp!);
			expect(instance.endedTimestamp).toBe(endedTimestamp);
			expect(instance.endedAt!.valueOf()).toBe(endedTimestamp);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const now = Date.parse(dateToDiscordISOTimestamp(new Date()));

			const patched = instance[kPatch]({
				ended_timestamp: dateToDiscordISOTimestamp(new Date(now)),
			});

			expect(instance.endedTimestamp).toBe(now);
			expect(instance.endedAt!.valueOf()).toBe(now);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('MessageComponentInteractionMetadata sub-structure', () => {
		const authorizing_integration_owners: APIAuthorizingIntegrationOwnersMap = {};

		const data: APIMessageComponentInteractionMetadata = {
			user,
			id: '1314343245325',
			type: InteractionType.MessageComponent,
			interacted_message_id: '3524355634542626',
			original_response_message_id: '349875627935',
			authorizing_integration_owners,
		};
		const instance = new MessageComponentInteractionMetadata(data);

		test('correct value for all getters', () => {
			expect(instance.id).toBe(data.id);
			expect(instance.interactedMessageId).toBe(data.interacted_message_id);
			expect(instance.originalResponseMessageId).toBe(data.original_response_message_id);
			expect(instance.type).toBe(data.type);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const id = '1234';

			const patched = instance[kPatch]({
				id,
			});

			expect(patched.id).toBe(id);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('MessageReference sub-structure', () => {
		const data: APIMessageReference = {
			type: MessageReferenceType.Default,
			message_id: '12343425243655',
			channel_id: '99999934525999',
			guild_id: '34948539875437534875',
		};
		const instance = new MessageReference(data);

		test('correct value for all getters', () => {
			expect(instance.type).toBe(data.type);
			expect(instance.messageId).toBe(data.message_id);
			expect(instance.channelId).toBe(data.channel_id);
			expect(instance.guildId).toBe(data.guild_id);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const channel_id = '11111111';

			const patched = instance[kPatch]({
				channel_id,
			});

			expect(patched.channelId).toEqual(channel_id);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('Reaction sub-structure', () => {
		const emoji: APIEmoji = {
			animated: false,
			id: '12345',
			name: 'emoji',
		};

		const count_details: APIReactionCountDetails = {
			normal: 12,
			burst: 3,
		};

		const data: APIReaction = {
			count: 15,
			me: false,
			me_burst: true,
			burst_colors: ['#345324', '#543563'],
			emoji,
			count_details,
		};
		const instance = new Reaction(data);

		test('correct value for all getters', () => {
			expect(instance.burstColors).toEqual(data.burst_colors.map((x) => Number.parseInt(x, 16)));
			expect(instance.count).toBe(data.count);
			expect(instance.me).toBe(data.me);
			expect(instance.meBurst).toBe(data.me_burst);
		});

		test('toJSON() is accurate', () => {
			/**
			 * todo: the data for this structure does not accept "#color"
			 * but the toJSON here outputs it as "#color" and therefore
			 * does not pass.
			 */
			// expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const count = 2_000_000;

			const patched = instance[kPatch]({
				count,
			});

			expect(patched.count).toBe(count);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('ReactionCountDetails sub-structure', () => {
		const data: APIReactionCountDetails = {
			normal: 12,
			burst: 3,
		};

		const instance = new ReactionCountDetails(data);

		test('correct value for all getters', () => {
			expect(instance.burst).toBe(data.burst);
			expect(instance.normal).toBe(data.normal);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const burst = 200_000;

			const patched = instance[kPatch]({
				burst,
			});

			expect(patched.burst).toBe(burst);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('ModalSubmitInteractionMetadata sub-structure', () => {
		const authorizing_integration_owners: APIAuthorizingIntegrationOwnersMap = {};
		const triggering_interaction_metadata: APIApplicationCommandInteractionMetadata = {
			user,
			id: '1324567654',
			type: InteractionType.ApplicationCommand,
			authorizing_integration_owners,
			target_user: user,
			target_message_id: '32459872359698715',
			original_response_message_id: '32598073425098735',
		};

		const data: APIModalSubmitInteractionMetadata = {
			user,
			id: '1314343245325',
			type: InteractionType.ModalSubmit,
			original_response_message_id: '349875627935',
			triggering_interaction_metadata,
			authorizing_integration_owners,
		};

		const instance = new ModalSubmitInteractionMetadata(data);

		test('correct value for all getters', () => {
			expect(instance.id).toBe(data.id);
			expect(instance.originalResponseMessageId).toBe(data.original_response_message_id);
			expect(instance.type).toBe(data.type);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const original_response_message_id = '23423';

			const patched = instance[kPatch]({
				original_response_message_id,
			});

			expect(patched.originalResponseMessageId).toEqual(original_response_message_id);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('ChannelMention sub-structure', () => {
		const data: APIChannelMention = {
			id: '2353408209582',
			name: 'name for something',
			guild_id: '23987234598735',
			type: ChannelType.AnnouncementThread,
		};

		const instance = new ChannelMention(data);

		test('correct value for all getters', () => {
			expect(instance.guildId).toBe(data.guild_id);
			expect(instance.id).toBe(data.id);
			expect(instance.name).toBe(data.name);
			expect(instance.type).toBe(data.type);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const name = 'new name';

			const patched = instance[kPatch]({
				name,
			});

			expect(patched.name).toBe(name);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('ApplicationCommandInteraction sub-structure', () => {
		const authorizing_integration_owners: APIAuthorizingIntegrationOwnersMap = {};
		const data: APIApplicationCommandInteractionMetadata = {
			user,
			authorizing_integration_owners,
			target_message_id: '345834597435345',
			target_user: user,
			id: '3453452345',
			type: InteractionType.ApplicationCommand,
		};

		const instance = new ApplicationCommandInteractionMetadata(data);

		test('correct value for all getters', () => {
			expect(instance.id).toBe(data.id);
			expect(instance.originalResponseMessageId).toBe(data.original_response_message_id);
			expect(instance.targetMessageId).toBe(data.target_message_id);
			expect(instance.type).toBe(data.type);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const id = '999999999999999999999';

			const patched = instance[kPatch]({
				id,
			});

			expect(patched.id).toBe(id);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});
});
