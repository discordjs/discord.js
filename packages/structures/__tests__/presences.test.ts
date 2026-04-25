import {
	type APIUser,
	type GatewayActivity,
	type GatewayActivityTimestamps,
	type GatewayActivityAssets,
	type GatewayActivityButton,
	type GatewayActivityParty,
	type GatewayActivitySecrets,
	type GatewayActivityEmoji,
	type GatewayGuildMembersChunkPresence,
	type GatewayPresenceClientStatus as GatewayPresenceClientStatusTypedef,
	ActivityType,
	StatusDisplayType,
	ActivityFlags,
	PresenceUpdateStatus,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	Activity,
	ActivityAssets,
	ActivityButton,
	ActivityParty,
	ActivitySecrets,
	ActivityTimestamps,
	ClientStatus,
	Presence,
} from '../src/index.js';
import { kPatch } from '../src/utils/symbols.js';

const user: APIUser = {
	username: 'username',
	avatar:
		'https://images-ext-1.discordapp.net/external/sdfjkhsdf/%3Fsize%3D4096/https/cdn.discordapp.com/guilds/1/users/1/avatars/54a38112404a550eab14e01fb7f77c9c.png?format=webp&quality=lossless&width=1356&height=1356',
	global_name: 'User',
	discriminator: '0000',
	id: '3',
};

const gatewayPresenceActivityTimestampsData: GatewayActivityTimestamps = {
	start: 1_771_670_132,
};

const gatewayPresenceActivitySecretsData: GatewayActivitySecrets = {
	join: 'djs://join',
	match: 'djs://match',
};

const gatewayPresenceActivityPartyData: GatewayActivityParty = {
	id: '1',
	size: [11, null as unknown as number],
};

const gatewayPresenceActivityEmojiData: GatewayActivityEmoji = {
	name: 'emoji_name',
	animated: false,
};

const gatewayPresenceActivityButtonData: GatewayActivityButton = {
	label: 'label',
	url: 'https://github.com//discordjs/discord.js',
};

const gatewayPresenceActivityAssetsData: GatewayActivityAssets = {
	large_image: 'djs://some-real-big-image-init',
	large_text: 'djs://large-text',
	large_url: 'activity-asset/large-url/',
	small_image: 'djs://small-image',
	small_text: 'djs://activity-asset/smallText',
	invite_cover_image: 'djs://activity-asset/invite-cover-image',
};

const gatewayPresenceActivityData: GatewayActivity = {
	id: '1',
	name: 'activity-name',
	type: ActivityType.Playing,
	url: 'https://github.com//discordjs/discord.js',
	created_at: 1_540_381_143_572,
	timestamps: gatewayPresenceActivityTimestampsData,
	application_id: '121212',
	status_display_type: StatusDisplayType.Details,
	details: 'activity-details',
	details_url: 'activity-details-url',
	state: 'activity-state',
	state_url: 'activity-state-url',
	emoji: gatewayPresenceActivityEmojiData,
	party: gatewayPresenceActivityPartyData,
	assets: gatewayPresenceActivityAssetsData,
	secrets: gatewayPresenceActivitySecretsData,
	instance: true,
	flags: ActivityFlags.Instance,
	buttons: [gatewayPresenceActivityButtonData],
};

const gatewayPresenceUpdateData: GatewayGuildMembersChunkPresence = {
	user,
	activities: [gatewayPresenceActivityData],
	status: PresenceUpdateStatus.DoNotDisturb,
};

const gatewayPresenceClientStatusData: GatewayPresenceClientStatusTypedef = {
	desktop: PresenceUpdateStatus.DoNotDisturb,
	mobile: PresenceUpdateStatus.Online,
};

describe('gatewayPresences structures', () => {
	describe('GatewayPresenceClientStatus sub-structure', () => {
		const data = gatewayPresenceClientStatusData;
		const instance = new ClientStatus(data);

		test('correct value for all getters', () => {
			expect(instance.desktop).toBe(data.desktop);
			expect(instance.mobile).toBe(data.mobile);

			expect(instance.web).toBeUndefined();
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const patched = instance[kPatch]({
				web: PresenceUpdateStatus.DoNotDisturb,
				mobile: PresenceUpdateStatus.Idle,
			});

			expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			expect(patched.toJSON()).not.toEqual(data);

			expect(instance.web).toEqual(patched.web);
			expect(instance.mobile).toEqual(instance.mobile);
		});
	});

	describe('GatewayPresenceUpdate sub-structure', () => {
		const data = gatewayPresenceUpdateData;
		const instance = new Presence(data);

		test('correct value for all getters', () => {
			expect(instance.status).toBe(data.status);
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const patched = instance[kPatch]({
				status: PresenceUpdateStatus.Online,
			});

			expect(patched).toBe(instance);
			expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			expect(patched.toJSON()).not.toEqual(data);

			expect(patched.status).toEqual(PresenceUpdateStatus.Online);
		});
	});

	describe('gatewayPresences sub-structures', () => {
		describe('GatewayPresenceActivity sub-structure', () => {
			const data = gatewayPresenceActivityData;
			const instance = new Activity(data);

			test('correct value for all getters and helper method [createdDate]', () => {
				expect(instance.name).toBe(data.name);
				expect(instance.type).toBe(data.type);
				expect(instance.url).toBe(data.url);
				expect(instance.applicationId).toBe(data.application_id);
				expect(instance.statusDisplayType).toBe(data.status_display_type);
				expect(instance.details).toBe(data.details);
				expect(instance.detailsURL).toBe(data.details_url);
				expect(instance.state).toBe(data.state);
				expect(instance.stateURL).toBe(data.state_url);
				expect(instance.instance).toBe(data.instance);
				expect(instance.flags!.bitField).toBe(BigInt(data.flags!));
				expect(instance.createdTimestamp).toBe(data.created_at);
				expect(instance.createdDate!.valueOf()).toEqual(data.created_at);
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const patched = instance[kPatch]({
					status_display_type: StatusDisplayType.Name,
					state: '[PATCHED]-activity-state',
					state_url: null,
					type: ActivityType.Custom,
				});

				expect(patched.statusDisplayType).toEqual(StatusDisplayType.Name);
				expect(patched.state).toEqual('[PATCHED]-activity-state');
				expect(patched.stateURL).toBeNull();
				expect(patched.type).toEqual(ActivityType.Custom);

				expect(patched).toBe(instance);
				expect(patched.toJSON()).not.toEqual(data);
				expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			});
		});

		describe('GatewayPresenceActivityAssets sub-structure', () => {
			const data = gatewayPresenceActivityAssetsData;
			const instance = new ActivityAssets(data);

			test('correct value for all getters', () => {
				expect(instance.largeImage).toBe(data.large_image);
				expect(instance.largeText).toBe(data.large_text);
				expect(instance.largeURL).toBe(data.large_url);
				expect(instance.smallImage).toBe(data.small_image);
				expect(instance.smallText).toBe(data.small_text);
				expect(instance.inviteCoverImage).toBe(data.invite_cover_image);

				expect(instance.smallURL).toBeUndefined();
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const patched = instance[kPatch]({
					large_text: 'djs://PATCHED-LARGE-TEXT',
					small_url: 'djs://small-url',
				});

				expect(patched.largeText).toEqual('djs://PATCHED-LARGE-TEXT');
				expect(patched.smallURL).toEqual('djs://small-url');

				expect(patched).toBe(instance);
				expect(patched.toJSON()).not.toEqual(data);
				expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			});
		});

		describe('GatewayPresenceActivityButton sub-structure', () => {
			const data = gatewayPresenceActivityButtonData;
			const instance = new ActivityButton(data);

			test('correct value for all getters', () => {
				expect(instance.label).toBe(data.label);
				expect(instance.url).toBe(data.url);
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const patched = instance[kPatch]({
					label: '[PATCHED]-button-label',
				});

				expect(patched.label).toEqual('[PATCHED]-button-label');

				expect(patched).toEqual(instance);
				expect(patched.toJSON()).not.toEqual(data);
				expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			});
		});

		describe('GatewayPresenceActivityParty sub-structure', () => {
			const data = gatewayPresenceActivityPartyData;
			const instance = new ActivityParty(data);

			test('correct value for all getters and helper methods [createdTimestamp, createdDate]', () => {
				expect(instance.id).toBe(data.id);
				expect(instance.currentSize).toBe(data.size![0]);

				expect(instance.maximumSize).toBeNull();
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const patched = instance[kPatch]({
					size: [1, 999],
				});

				expect(instance.maximumSize).toBe(999);
				expect(instance.currentSize).toBe(1);

				expect(patched).toBe(instance);
				expect(patched.toJSON()).not.toEqual(data);
				expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			});
		});

		describe('GatewayPresenceActivitySecrets sub-structure', () => {
			const data = gatewayPresenceActivitySecretsData;
			const instance = new ActivitySecrets(data);

			test('correct value for all getters', () => {
				expect(instance.join).toBe(data.join);
				expect(instance.match).toBe(data.match);

				expect(instance.spectate).toBeUndefined();
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const patched = instance[kPatch]({
					match: 'djs://[PATCHED]-activity-party-match',
					spectate: 'djs://[PATCHED-[ADD-PROPERTY]]-spectate',
				});

				expect(patched.match).toEqual('djs://[PATCHED]-activity-party-match');
				expect(patched.spectate).toEqual('djs://[PATCHED-[ADD-PROPERTY]]-spectate');

				expect(patched).toBe(instance);
				expect(patched.toJSON()).not.toEqual(data);
				expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			});
		});

		describe('GatewayPresenceActivityTimestamps sub-structure', () => {
			const data = gatewayPresenceActivityTimestampsData;
			const instance = new ActivityTimestamps(data);

			test('correct value for all getters', () => {
				expect(instance.startTimestamp).toBe(data.start);
				expect(instance.startDate).toStrictEqual(new Date(data.start as number));

				expect(instance.endTimestamp).toBeUndefined();
				expect(instance.endDate).toBeNull();
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const newTimestamp = 1_771_670_132;
				const patched = instance[kPatch]({
					end: newTimestamp,
				});

				expect(patched.endDate?.valueOf()).toStrictEqual(patched.endTimestamp);

				expect(patched).toEqual(instance);
				expect(patched.toJSON()).not.toEqual(data);
				expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			});
		});
	});
});
