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
	ImageFormat,
	RouteBases,
	CDNRoutes,
} from 'discord-api-types/v10';
import { describe, test, expect, beforeEach } from 'vitest';
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
	avatar: '54a38112404a550eab14e01fb7f77c9c',
	global_name: 'User',
	discriminator: '0000',
	id: '1091287989151342622',
};

const gatewayPresenceActivityTimestampsData: GatewayActivityTimestamps = {
	start: 1_771_670_132,
};

const gatewayPresenceActivitySecretsData: GatewayActivitySecrets = {
	join: '025ed05c71f639de8bfaa0d679d7c94b2fdce12f',
	match: '4b2fdce12f639de8bfa7e3591b71a0d679d7c93f',
};

const gatewayPresenceActivityPartyData: GatewayActivityParty = {
	id: '676544578976545764',
	size: [11, 40],
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
	large_image: '123456789012345678',
	large_text: 'large-text',
	large_url: 'https://discord.js.org',
	small_image: '123456789012345678',
	small_text: 'activity-asset/smallText',
	invite_cover_image: '123456789012345670',
};

const gatewayPresenceActivityData: GatewayActivity = {
	id: '1006883369382064179',
	name: 'activity-name',
	type: ActivityType.Playing,
	url: 'https://github.com/discordjs/discord.js',
	created_at: 1_540_381_143_572,
	timestamps: gatewayPresenceActivityTimestampsData,
	application_id: '222078108977594368',
	status_display_type: StatusDisplayType.Details,
	details: 'activity-details',
	details_url: 'https://github.com/discordjs/discord.js',
	state: 'activity-state',
	state_url: 'https://github.com/discordjs/discord.js',
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

describe('Presences structures', () => {
	describe('PresenceClientStatus sub-structure', () => {
		const data = gatewayPresenceClientStatusData;
		let instance: ClientStatus;

		beforeEach(() => {
			instance = new ClientStatus(data);
		});

		test('correct value for all getters', () => {
			expect(instance.desktop).toBe(data.desktop);
			expect(instance.mobile).toBe(data.mobile);

			expect(instance.web).toBeUndefined();
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const web = PresenceUpdateStatus.DoNotDisturb;
			const mobile = PresenceUpdateStatus.Idle;

			const patched = instance[kPatch]({
				web,
				mobile,
			});

			expect(instance.web).toEqual(web);
			expect(instance.mobile).toEqual(mobile);

			expect(patched.toJSON()).toEqual({
				...data,
				web,
				mobile,
			});

			expect(patched).toBe(instance);
		});
	});

	describe('PresenceUpdate sub-structure', () => {
		const data = gatewayPresenceUpdateData;
		let instance: Presence;

		beforeEach(() => {
			instance = new Presence(data);
		});

		test('correct value for all getters', () => {
			expect(instance.status).toBe(data.status);
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const status = PresenceUpdateStatus.Online;

			const patched = instance[kPatch]({
				status,
			});

			expect(patched.status).toEqual(PresenceUpdateStatus.Online);

			expect(patched.toJSON()).toEqual({
				...data,
				status,
			});

			expect(patched).toBe(instance);
		});
	});

	describe('Presences sub-structures', () => {
		describe('PresenceActivity sub-structure', () => {
			const data = gatewayPresenceActivityData;
			let instance: Activity;

			beforeEach(() => {
				instance = new Activity(data);
			});

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
				const status_display_type = StatusDisplayType.Name;
				const state = '[PATCHED]-activity-state';
				const state_url = null;
				const type = ActivityType.Custom;

				const patched = instance[kPatch]({
					status_display_type,
					state,
					state_url,
					type,
				});

				expect(patched.toJSON()).toEqual({
					...data,
					status_display_type,
					state,
					state_url,
					type,
				});

				expect(patched).toBe(instance);
			});
		});

		describe('PresenceActivityAssets sub-structure', () => {
			const data = gatewayPresenceActivityAssetsData;
			const applicationId = '23498573429574598';
			let instance: ActivityAssets;

			beforeEach(() => {
				instance = new ActivityAssets(data);
			});

			test('correct value for all getters and helper methods [largeImageURL, smallImageURL]', () => {
				expect(instance.largeImage).toBe(data.large_image);
				expect(instance.largeText).toBe(data.large_text);
				expect(instance.largeURL).toBe(data.large_url);
				expect(instance.smallImage).toBe(data.small_image);
				expect(instance.smallText).toBe(data.small_text);
				expect(instance.inviteCoverImage).toBe(data.invite_cover_image);

				expect(instance.largeImageURL(applicationId, ImageFormat.JPEG)).toEqual(
					`${RouteBases.cdn}${CDNRoutes.applicationAsset(applicationId, data.large_image!, ImageFormat.JPEG)}`,
				);
				expect(instance.smallImageURL(applicationId, ImageFormat.JPEG)).toEqual(
					`${RouteBases.cdn}${CDNRoutes.applicationAsset(applicationId, data.small_image!, ImageFormat.JPEG)}`,
				);

				expect(instance.smallURL).toBeUndefined();
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const large_text = 'large_text_patched_str';
				const small_url = 'https://discord.js.org/docs/packages/structures/main';

				const patched = instance[kPatch]({
					large_text,
					small_url,
				});

				expect(patched.largeText).toEqual(large_text);
				expect(patched.smallURL).toEqual(small_url);

				expect(patched).toBe(instance);
				expect(patched.toJSON()).toEqual({
					...data,
					large_text,
					small_url,
				});
			});
		});

		describe('PresenceActivityButton sub-structure', () => {
			const data = gatewayPresenceActivityButtonData;
			let instance: ActivityButton;

			beforeEach(() => {
				instance = new ActivityButton(data);
			});

			test('correct value for all getters', () => {
				expect(instance.label).toBe(data.label);
				expect(instance.url).toBe(data.url);
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const label = '[PATCHED]-button-label';

				const patched = instance[kPatch]({
					label,
				});

				expect(patched.label).toEqual(label);

				expect(patched).toEqual(instance);

				expect(patched.toJSON()).toEqual({
					...data,
					label,
				});
			});
		});

		describe('PresenceActivityParty sub-structure', () => {
			const data = gatewayPresenceActivityPartyData;
			let instance: ActivityParty;

			beforeEach(() => {
				instance = new ActivityParty(data);
			});

			test('correct value for all getters and helper methods [createdTimestamp, createdDate]', () => {
				expect(instance.id).toBe(data.id);
				expect(instance.currentSize).toBe(data.size![0]);
				expect(instance.maximumSize).toEqual(data.size![1]);
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const size: [current_size: number, max_size: number] = [1, 999];

				const patched = instance[kPatch]({
					size,
				});

				expect(instance.currentSize).toBe(size[0]);
				expect(instance.maximumSize).toBe(size[1]);

				expect(patched).toBe(instance);

				expect(patched.toJSON()).toEqual({
					...data,
					size,
				});
			});
		});

		describe('PresenceActivitySecrets sub-structure', () => {
			const data = gatewayPresenceActivitySecretsData;
			let instance: ActivitySecrets;

			beforeEach(() => {
				instance = new ActivitySecrets(data);
			});

			test('correct value for all getters', () => {
				expect(instance.join).toBe(data.join);
				expect(instance.match).toBe(data.match);

				expect(instance.spectate).toBeUndefined();
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const spectate = 'e7eb30d2ee025ed05c71ea495f770b76454ee4e0';
				const match = '025ed05c71f639de8bfaa0d679d7c94b2fdce12f-new-match';

				const patched = instance[kPatch]({
					match,
					spectate,
				});

				expect(patched.match).toEqual(match);
				expect(patched.spectate).toEqual(spectate);

				expect(patched).toBe(instance);
				expect(patched.toJSON()).toEqual({
					...data,
					match,
					spectate,
				});
			});
		});

		describe('PresenceActivityTimestamps sub-structure', () => {
			const data = gatewayPresenceActivityTimestampsData;
			let instance: ActivityTimestamps;

			beforeEach(() => {
				instance = new ActivityTimestamps(data);
			});

			test('correct value for all getters', () => {
				expect(instance.startTimestamp).toBe(data.start);
				expect(instance.startDate?.valueOf()).toStrictEqual(data.start);

				expect(instance.endTimestamp).toBeUndefined();
				expect(instance.endDate).toBeNull();
			});

			test('toJSON() returns expected values', () => {
				expect(instance.toJSON()).toStrictEqual(data);
			});

			test('patching the structure works in-place', () => {
				const end = 1_771_670_132;
				const patched = instance[kPatch]({
					end,
				});

				expect(patched.endDate?.valueOf()).toStrictEqual(end);

				expect(patched).toEqual(instance);

				expect(patched.toJSON()).toEqual({
					...data,
					end,
				});
			});
		});
	});
});
