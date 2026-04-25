import { DiscordSnowflake } from '@sapphire/snowflake';
import {
	type GatewayActivity,
	type GatewayActivityTimestamps,
	type GatewayActivityAssets,
	type GatewayActivityButton,
	type GatewayActivityEmoji,
	type GatewayActivityParty,
	type GatewayActivitySecrets,
	type GatewayPresenceUpdateData,
	type GatewayPresenceClientStatus as GatewayPresenceClientStatusTypedef,
	ActivityType,
	StatusDisplayType,
	ActivityFlags,
	PresenceUpdateStatus,
	ImageFormat,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	GatewayPresenceActivity,
	GatewayPresenceActivityAssets,
	GatewayPresenceActivityButton,
	GatewayPresenceActivityEmoji,
	GatewayPresenceActivityParty,
	GatewayPresenceActivitySecrets,
	GatewayPresenceActivityTimestamps,
	GatewayPresenceClientStatus,
	GatewayPresenceUpdate,
	type Partialize,
} from '../src/index.js';
import { kPatch } from '../src/utils/symbols.js';

const gatewayPresenceActivityTimestampsData: GatewayActivityTimestamps = {
	start: 1_000,
};

const gatewayPresenceActivitySecretsData: GatewayActivitySecrets = {
	join: 'djs://join',
	match: 'djs://match',
};

const gatewayPresenceActivityPartyData: GatewayActivityParty = {
	id: '1',
	size: [1, null as unknown as number],
};

const gatewayPresenceActivityEmojiData: GatewayActivityEmoji = {
	name: 'djs://emoji-name',
	animated: false,
};

const gatewayPresenceActivityButtonData: GatewayActivityButton = {
	label: 'djs://label',
	url: '/gatewayPresenceActivityButtonUrl',
};

const gatewayPresenceActivityAssetsData: GatewayActivityAssets = {
	large_image: 'djs://some-real-big-image-init',
	large_text: 'djs://large-text',
	large_url: 'activity-asset/large-url/',
	small_image: 'djs://small-image',
	small_text: 'djs://activity-asset/smallText',
};

const gatewayPresenceActivityData: Partialize<GatewayActivity, 'id'> = {
	name: 'djs://activity-name',
	type: ActivityType.Playing,
	url: 'djs://activity-url',
	created_at: 1,
	timestamps: gatewayPresenceActivityTimestampsData,
	application_id: 'djs://application-id',
	status_display_type: StatusDisplayType.Details,
	details: 'djs://activity-details',
	details_url: 'djs://activity-details-url',
	state: 'djs://activity-state',
	state_url: 'djs://activity-state-url',
	emoji: gatewayPresenceActivityEmojiData,
	party: gatewayPresenceActivityPartyData,
	assets: gatewayPresenceActivityAssetsData,
	secrets: gatewayPresenceActivitySecretsData,
	instance: true,
	flags: ActivityFlags.Instance,
	buttons: [gatewayPresenceActivityButtonData],
};

const gatewayPresenceUpdateData: GatewayPresenceUpdateData = {
	since: 1,
	activities: [gatewayPresenceActivityData],
	status: PresenceUpdateStatus.DoNotDisturb,
	afk: false,
};

const gatewayPresenceClientStatusData: GatewayPresenceClientStatusTypedef = {
	desktop: PresenceUpdateStatus.DoNotDisturb,
	mobile: PresenceUpdateStatus.Online,
};

describe('gatewayPresences structures', () => {
	describe('GatewayPresenceClientStatus sub-structure', () => {
		const data = gatewayPresenceClientStatusData;
		const instance = new GatewayPresenceClientStatus(data);

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

			expect(instance.web).not.toEqual(data.web);
			expect(instance.mobile).not.toEqual(data.mobile);
		});
	});

	describe('GatewayPresenceUpdate sub-structure', () => {
		const data = gatewayPresenceUpdateData;
		const instance = new GatewayPresenceUpdate(data);

		test('correct value for all getters', () => {
			expect(instance.afk).toBe(data.afk);
			expect(instance.sinceTimestamp).toBe(data.since);
			expect(instance.status).toBe(data.status);

			expect(instance.since).toStrictEqual(new Date(data.since as number));
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const patched = instance[kPatch]({
				afk: true,
				status: PresenceUpdateStatus.Online,
			});

			expect(patched.toJSON()).toStrictEqual(instance.toJSON());

			expect(patched.afk).not.toBe(data.afk);
			expect(patched.status).not.toBe(data.status);
		});
	});

	describe('gatewayPresences sub-structures', () => {
		describe('GatewayPresenceActivity sub-structure', () => {
			const data = gatewayPresenceActivityData;
			const instance = new GatewayPresenceActivity(data);

			test('correct value for all getters and helper method [createdAt]', () => {
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

				expect(instance.createdAt).toEqual(new Date(instance.createdTimestamp));
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const patched = instance[kPatch]({
					status_display_type: StatusDisplayType.Name,
					state: 'djs://[PATCHED]-activity-state',
					state_url: null,
					type: ActivityType.Custom,
				});

				expect(patched.toJSON()).not.toEqual(data);
				expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			});
		});

		describe('GatewayPresenceActivityAssets sub-structure', () => {
			const data = gatewayPresenceActivityAssetsData;
			const instance = new GatewayPresenceActivityAssets(data);

			test('correct value for all getters', () => {
				expect(instance.largeImage).toBe(data.large_image);
				expect(instance.largeText).toBe(data.large_text);
				expect(instance.largeURL).toBe(data.large_url);
				expect(instance.smallImage).toBe(data.small_image);
				expect(instance.smallText).toBe(data.small_text);

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

				expect(patched.toJSON()).not.toEqual(data);
				expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			});
		});

		describe('GatewayPresenceActivityButton sub-structure', () => {
			const data = gatewayPresenceActivityButtonData;
			const instance = new GatewayPresenceActivityButton(data);

			test('correct value for all getters', () => {
				expect(instance.label).toBe(data.label);
				expect(instance.url).toBe(data.url);
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const patched = instance[kPatch]({
					label: 'djs://[PATCHED]-button-label',
				});

				expect(patched.toJSON()).not.toEqual(data);
				expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			});
		});

		describe('GatewayPresenceActivityEmoji sub-structure', () => {
			const data = gatewayPresenceActivityEmojiData;
			const instance = new GatewayPresenceActivityEmoji(data);

			test('correct value for all getters and helper method [url]', () => {
				expect(instance.name).toBe(data.name);
				expect(instance.animated).toBe(data.animated);

				expect(instance.id).toBeUndefined();
				expect(instance.createdAt).toBeNull();
				expect(instance.createdTimestamp).toBeNull();
				expect(instance.url()).toBeNull();
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place and helper method [url]', () => {
				const patched = instance[kPatch]({
					id: '1',
					name: 'djs://[PATCHED]-emoji-name',
					animated: true,
				});

				expect(instance.url(ImageFormat.WebP)).toEqual('https://cdn.discordapp.com/emojis/1.webp');

				expect(instance.createdTimestamp).toBe(DiscordSnowflake.timestampFrom(instance.id!));
				expect(instance.createdAt).toEqual(new Date(instance.createdTimestamp!));

				expect(patched.toJSON()).not.toEqual(data);
				expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			});
		});

		describe('GatewayPresenceActivityParty sub-structure', () => {
			const data = gatewayPresenceActivityPartyData;
			const instance = new GatewayPresenceActivityParty(data);

			test('correct value for all getters and helper methods [createdTimestamp, createdAt]', () => {
				expect(instance.id).toBe(data.id);
				expect(instance.size).toBe(data.size);

				expect(instance.createdTimestamp).toBe(DiscordSnowflake.timestampFrom(instance.id!));
				expect(instance.createdAt).toEqual(new Date(instance.createdTimestamp!));
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const patched = instance[kPatch]({
					size: [1, 999],
				});

				expect(instance.size![1]).toBe(999);

				expect(patched.toJSON()).not.toEqual(data);
				expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			});
		});

		describe('GatewayPresenceActivitySecrets sub-structure', () => {
			const data = gatewayPresenceActivitySecretsData;
			const instance = new GatewayPresenceActivitySecrets(data);

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

				expect(patched.toJSON()).not.toEqual(data);
				expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			});
		});

		describe('GatewayPresenceActivityTimestamps sub-structure', () => {
			const data = gatewayPresenceActivityTimestampsData;
			const instance = new GatewayPresenceActivityTimestamps(data);

			test('correct value for all getters', () => {
				expect(instance.start).toBe(data.start);
				expect(instance.startAt).toStrictEqual(new Date(data.start as number));

				expect(instance.end).toBeUndefined();
				expect(instance.endAt).toBeNull();
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const patched = instance[kPatch]({
					end: 10_000_000,
				});

				expect(patched.endAt).toStrictEqual(new Date(patched.end as number));

				expect(patched.toJSON()).not.toEqual(data);
				expect(patched.toJSON()).toStrictEqual(instance.toJSON());
			});
		});
	});
});
