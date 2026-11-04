import {
	ApplicationIdentityProfileDynamicFieldType,
	type APIApplicationIdentityProfile,
	type APIApplicationIdentityProfileDynamicField,
	type APIApplicationIdentityProfileMedia,
	type APIApplicationIdentityProfilePrimaryData,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	ApplicationIdentity,
	ApplicationIdentityProfile,
	ApplicationIdentityProfileData,
	ApplicationIdentityProfileMediaDynamicField,
	ApplicationIdentityProfileNumberDynamicField,
	ApplicationIdentityProfileStringDynamicField,
	ApplicationIdentityProfileMedia,
	ApplicationIdentityProfilePrimaryData,
	UserApplicationIdentity,
} from '../src/applicationIdentityProfiles/index.js';
import { kClone, kData, kPatch } from '../src/utils/symbols.js';

const primary: APIApplicationIdentityProfilePrimaryData = {
	season: 'Season 3',
	rank_name: 'Silver',
	rank_image: { url: 'https://example.com/silver.png' },
	highest_rank: 'Platinum',
	highest_rank_image: { url: 'https://example.com/platinum.png' },
	featured_played_character: 'Example character',
	featured_played_character_image: { url: 'https://example.com/character.png' },
	playtime_hours: 69.41,
	total_wins: 57,
	current_period_wins: 8,
	total_games: 100,
	current_period_games: 10,
	total_kills: 253,
	current_period_kills: 35,
	total_assists: 478,
	current_period_assists: 68,
	total_deaths: 561,
	current_period_deaths: 21,
};

const profile: APIApplicationIdentityProfile = {
	username: 'player',
	metadata: { loadout: { items: ['sword'] }, private: true },
	data: {
		primary,
		dynamic: [
			{ type: ApplicationIdentityProfileDynamicFieldType.String, name: 'region', value: 'Europe' },
			{ type: ApplicationIdentityProfileDynamicFieldType.Number, name: 'accuracy', value: 98.75 },
			{
				type: ApplicationIdentityProfileDynamicFieldType.Media,
				name: 'portrait',
				value: { url: 'https://example.com/portrait.png' },
			},
		],
	},
};

describe('Application identity profile structures', () => {
	test('user identity preserves its Discord user ID and external account fields', () => {
		const data = {
			user_id: '222078108977594368',
			provider_type: 'NONE',
			provider_issued_user_id: 'external-account',
		};
		const instance = new UserApplicationIdentity(data);
		expect(instance.userId).toBe(data.user_id);
		expect(instance.providerType).toBe(data.provider_type);
		expect(instance.providerIssuedUserId).toBe(data.provider_issued_user_id);
		expect(instance.providerId).toBeUndefined();
		expect(instance.toJSON()).toStrictEqual(data);
		expect(instance[kPatch]({ provider_id: 'provider' })).toBe(instance);
		expect(instance.providerId).toBe('provider');
		const clone = instance[kClone]({ user_id: '222086648706498562' });
		expect(clone.userId).toBe('222086648706498562');
		expect(instance.userId).toBe(data.user_id);
		expect(clone.toJSON()).toStrictEqual({ ...data, provider_id: 'provider', user_id: '222086648706498562' });
	});

	test('external identity getters preserve provider strings and optional identifiers', () => {
		const identity = new ApplicationIdentity({ provider_type: 'NONE', provider_issued_user_id: 'external-account' });
		expect(identity.providerType).toBe('NONE');
		expect(identity.providerIssuedUserId).toBe('external-account');
		expect(identity.providerId).toBeUndefined();
		expect(identity.toJSON()).not.toHaveProperty('provider_id');

		expect(identity[kPatch]({ provider_id: 'provider', provider_type: 'EXTERNAL' })).toBe(identity);
		expect(identity.providerId).toBe('provider');
		expect(identity.providerType).toBe('EXTERNAL');
		expect(identity[kClone]().toJSON()).toStrictEqual(identity.toJSON());
	});

	test('profile exposes the username and leaves nested data to subclasses', () => {
		const instance = new ApplicationIdentityProfile(profile);
		expect(instance.username).toBe('player');
		expect(instance).not.toHaveProperty('data');
		expect(instance).not.toHaveProperty('metadata');
		expect(instance.toJSON()).toStrictEqual(profile);
		expect(JSON.parse(JSON.stringify(instance))).toStrictEqual(profile);
	});

	test('toJSON deeply copies profile data and arbitrary metadata', () => {
		const instance = new ApplicationIdentityProfile(profile);
		const json = instance.toJSON();
		expect(json.data).not.toBe(profile.data);
		expect(json.metadata).not.toBe(profile.metadata);
		json.data!.primary!.rank_image!.url = 'https://example.com/changed.png';
		json.data!.dynamic!.push({
			type: ApplicationIdentityProfileDynamicFieldType.String,
			name: 'extra',
			value: 'extra',
		});
		(json.metadata!.loadout as { items: string[] }).items.push('shield');
		expect(instance.toJSON()).toStrictEqual(profile);
	});

	test('patching replaces supplied nested data and retains absent fields', () => {
		const instance = new ApplicationIdentityProfile(profile);
		const previous = instance.toJSON();
		expect(instance[kPatch]({ data: { dynamic: [] } })).toBe(instance);
		expect(instance.toJSON()).toStrictEqual({ ...profile, data: { dynamic: [] } });
		expect(previous).toStrictEqual(profile);
		expect(instance[kPatch]({ username: '' }).username).toBe('');
		expect(instance.toJSON().data).toStrictEqual({ dynamic: [] });
	});

	test('nullable profile fields roundtrip and can be cleared by a patch', () => {
		const empty = { username: null, metadata: null, data: null };
		const instance = new ApplicationIdentityProfile(empty);
		expect(instance.username).toBeNull();
		expect(instance.toJSON()).toStrictEqual(empty);
		instance[kPatch](profile);
		expect(instance.username).toBe(profile.username);
		instance[kPatch]({ username: null, metadata: null, data: null });
		expect(instance[kClone]().toJSON()).toStrictEqual(empty);
	});

	test('cloning deep copies nested data and permits an independent patch', () => {
		const instance = new ApplicationIdentityProfile(profile);
		const clone = instance[kClone]();
		expect(clone).not.toBe(instance);
		expect(clone.toJSON()).toStrictEqual(profile);
		expect(clone[kData].data).not.toBe(instance[kData].data);
		expect(clone[kData].metadata).not.toBe(instance[kData].metadata);
		clone[kPatch]({ username: 'clone', data: null });
		expect(instance.toJSON()).toStrictEqual(profile);
		expect(instance[kClone]({ username: null }).toJSON()).toStrictEqual({ ...profile, username: null });
	});

	test('profile data preserves optional substructures without exposing getters', () => {
		const instance = new ApplicationIdentityProfileData(profile.data!);
		expect(instance).not.toHaveProperty('primary');
		expect(instance).not.toHaveProperty('dynamic');
		expect(instance.toJSON()).toStrictEqual(profile.data);
		expect(instance[kPatch]({ primary: {} })).toBe(instance);
		expect(instance[kClone]().toJSON()).toStrictEqual({ ...profile.data, primary: {} });
		expect(new ApplicationIdentityProfileData({}).toJSON()).toStrictEqual({});
	});

	test('all primary scalar getters preserve API values', () => {
		const instance = new ApplicationIdentityProfilePrimaryData(primary);
		expect(instance.season).toBe(primary.season);
		expect(instance.rankName).toBe(primary.rank_name);
		expect(instance.highestRank).toBe(primary.highest_rank);
		expect(instance.featuredPlayedCharacter).toBe(primary.featured_played_character);
		expect(instance.playtimeHours).toBe(primary.playtime_hours);
		expect(instance.totalWins).toBe(primary.total_wins);
		expect(instance.currentPeriodWins).toBe(primary.current_period_wins);
		expect(instance.totalGames).toBe(primary.total_games);
		expect(instance.currentPeriodGames).toBe(primary.current_period_games);
		expect(instance.totalKills).toBe(primary.total_kills);
		expect(instance.currentPeriodKills).toBe(primary.current_period_kills);
		expect(instance.totalAssists).toBe(primary.total_assists);
		expect(instance.currentPeriodAssists).toBe(primary.current_period_assists);
		expect(instance.totalDeaths).toBe(primary.total_deaths);
		expect(instance.currentPeriodDeaths).toBe(primary.current_period_deaths);
		expect(instance.toJSON()).toStrictEqual(primary);
		for (const field of ['rankImage', 'highestRankImage', 'featuredPlayedCharacterImage']) {
			expect(instance).not.toHaveProperty(field);
		}
	});

	test('optional primary stats remain absent and zero and empty strings are retained', () => {
		const instance = new ApplicationIdentityProfilePrimaryData({});
		expect(instance.rankName).toBeUndefined();
		expect(instance.playtimeHours).toBeUndefined();
		expect(instance.currentPeriodDeaths).toBeUndefined();
		expect(instance.toJSON()).toStrictEqual({});
		expect(instance[kPatch]({ season: '', total_wins: 0, playtime_hours: 0 })).toBe(instance);
		expect(instance.season).toBe('');
		expect(instance.totalWins).toBe(0);
		expect(instance.playtimeHours).toBe(0);
		expect(instance[kClone]({ playtime_hours: 0.25 }).toJSON()).toStrictEqual({
			season: '',
			total_wins: 0,
			playtime_hours: 0.25,
		});
	});

	test('dynamic string field exposes its scalar value and supports patching and cloning', () => {
		const data = { type: ApplicationIdentityProfileDynamicFieldType.String, name: 'region', value: 'Europe' } as const;
		const instance = new ApplicationIdentityProfileStringDynamicField(data);
		expect(instance.type).toBe(1);
		expect(instance.name).toBe('region');
		expect(instance.value).toBe('Europe');
		expect(instance.toJSON()).toStrictEqual(data);
		expect(instance[kPatch]({ value: '' })).toBe(instance);
		expect(instance.value).toBe('');
		expect(instance[kClone]({ name: 'new-region' }).toJSON()).toStrictEqual({
			...data,
			name: 'new-region',
			value: '',
		});
	});

	test('dynamic number field preserves fractional values and zero', () => {
		const data = { type: ApplicationIdentityProfileDynamicFieldType.Number, name: 'accuracy', value: 98.75 } as const;
		const instance = new ApplicationIdentityProfileNumberDynamicField(data);
		expect(instance.type).toBe(2);
		expect(instance.name).toBe('accuracy');
		expect(instance.value).toBe(98.75);
		expect(instance.toJSON()).toStrictEqual(data);
		expect(instance[kPatch]({ value: 0 })).toBe(instance);
		expect(instance.value).toBe(0);
		expect(instance[kClone]().toJSON()).toStrictEqual({ ...data, value: 0 });
	});

	test('dynamic media field keeps its value raw without exposing a getter', () => {
		const data = {
			type: ApplicationIdentityProfileDynamicFieldType.Media,
			name: 'portrait',
			value: { url: 'https://example.com/portrait.png' },
		} as const;
		const instance = new ApplicationIdentityProfileMediaDynamicField(data);
		expect(instance.type).toBe(3);
		expect(instance.name).toBe('portrait');
		expect(instance).not.toHaveProperty('value');
		expect(instance.toJSON()).toStrictEqual(data);
		const json = instance.toJSON();
		json.value.url = 'https://example.com/changed.png';
		expect(instance.toJSON()).toStrictEqual(data);
		expect(instance[kPatch]({ value: { url: 'https://example.com/new.png' } })).toBe(instance);
		expect(instance[kClone]().toJSON().value.url).toBe('https://example.com/new.png');
	});

	test('media exposes its URL and supports patching and cloning', () => {
		const instance = new ApplicationIdentityProfileMedia({ url: 'https://example.com/portrait.png' });
		expect(instance.url).toBe('https://example.com/portrait.png');
		expect(instance[kPatch]({ url: 'https://example.com/new.png' })).toBe(instance);
		expect(instance.url).toBe('https://example.com/new.png');
		expect(instance[kClone]({ url: 'https://example.com/clone.png' }).toJSON()).toStrictEqual({
			url: 'https://example.com/clone.png',
		});
	});

	test('templates omit scalar and nested profile fields through patches and clones', () => {
		class MinimalProfile extends ApplicationIdentityProfile<'username' | 'metadata' | 'data'> {
			public static override readonly DataTemplate = {
				set username(_: string | null) {},
				set metadata(_: Record<string, unknown> | null) {},
				set data(_: APIApplicationIdentityProfile['data']) {},
			};
		}
		const instance = new MinimalProfile(profile);
		expect(instance.username).toBeUndefined();
		expect(instance.toJSON()).toStrictEqual({});
		instance[kPatch](profile);
		expect(instance.toJSON()).toStrictEqual({});
		expect(instance[kClone](profile)).toBeInstanceOf(MinimalProfile);
		expect(instance[kClone](profile).toJSON()).toStrictEqual({});
		expect(new MinimalProfile({}).toJSON()).toStrictEqual({});
	});

	test('templates can omit game stat substructures and primary images', () => {
		class MinimalData extends ApplicationIdentityProfileData<'primary' | 'dynamic'> {
			public static override readonly DataTemplate = {
				set primary(_: APIApplicationIdentityProfilePrimaryData) {},
				set dynamic(_: APIApplicationIdentityProfileDynamicField[]) {},
			};
		}
		class MinimalPrimary extends ApplicationIdentityProfilePrimaryData<'rank_name' | 'rank_image'> {
			public static override readonly DataTemplate = {
				set rank_name(_: string) {},
				set rank_image(_: APIApplicationIdentityProfileMedia) {},
			};
		}
		const data = new MinimalData(profile.data!);
		expect(data.toJSON()).toStrictEqual({});
		data[kPatch](profile.data!);
		expect(data[kClone]().toJSON()).toStrictEqual({});
		const instance = new MinimalPrimary(primary);
		const { rank_name: _rankName, rank_image: _rankImage, ...retained } = primary;
		expect(instance.rankName).toBeUndefined();
		expect(instance.toJSON()).toStrictEqual(retained);
		instance[kPatch]({ rank_name: 'Gold', rank_image: { url: 'https://example.com/gold.png' }, total_wins: 0 });
		expect(instance[kClone]().toJSON()).toStrictEqual({ ...retained, total_wins: 0 });
	});

	test('identity, dynamic field and media templates remove their selected properties', () => {
		class MinimalUserIdentity extends UserApplicationIdentity<'user_id'> {
			public static override readonly DataTemplate = { set user_id(_: string) {} };
		}
		class MinimalIdentity extends ApplicationIdentity<'provider_type'> {
			public static override readonly DataTemplate = { set provider_type(_: string) {} };
		}
		class MinimalString extends ApplicationIdentityProfileStringDynamicField<'value'> {
			public static override readonly DataTemplate = { set value(_: string) {} };
		}
		class MinimalNumber extends ApplicationIdentityProfileNumberDynamicField<'value'> {
			public static override readonly DataTemplate = { set value(_: number) {} };
		}
		class MinimalMediaField extends ApplicationIdentityProfileMediaDynamicField<'value'> {
			public static override readonly DataTemplate = { set value(_: APIApplicationIdentityProfileMedia) {} };
		}
		class MinimalMedia extends ApplicationIdentityProfileMedia<'url'> {
			public static override readonly DataTemplate = { set url(_: string) {} };
		}
		const userIdentity = new MinimalUserIdentity({
			user_id: '222078108977594368',
			provider_type: 'NONE',
			provider_issued_user_id: 'account',
		});
		expect(userIdentity.userId).toBeUndefined();
		expect(userIdentity[kPatch]({ user_id: '222086648706498562' })[kClone]().toJSON()).toStrictEqual({
			provider_type: 'NONE',
			provider_issued_user_id: 'account',
		});
		const identity = new MinimalIdentity({ provider_type: 'NONE', provider_issued_user_id: 'account' });
		expect(identity.providerType).toBeUndefined();
		expect(identity[kPatch]({ provider_type: 'OTHER' })[kClone]().toJSON()).toStrictEqual({
			provider_issued_user_id: 'account',
		});
		const string = new MinimalString({
			type: ApplicationIdentityProfileDynamicFieldType.String,
			name: 'region',
			value: 'Europe',
		});
		expect(string.value).toBeUndefined();
		expect(string[kPatch]({ value: 'Asia' })[kClone]().toJSON()).toStrictEqual({
			type: ApplicationIdentityProfileDynamicFieldType.String,
			name: 'region',
		});
		const number = new MinimalNumber({
			type: ApplicationIdentityProfileDynamicFieldType.Number,
			name: 'accuracy',
			value: 10,
		});
		expect(number.value).toBeUndefined();
		expect(number[kPatch]({ value: 0 })[kClone]().toJSON()).toStrictEqual({
			type: ApplicationIdentityProfileDynamicFieldType.Number,
			name: 'accuracy',
		});
		const mediaField = new MinimalMediaField({
			type: ApplicationIdentityProfileDynamicFieldType.Media,
			name: 'portrait',
			value: { url: 'https://example.com' },
		});
		expect(
			mediaField[kPatch]({ value: { url: 'https://example.com/new' } })
				[kClone]()
				.toJSON(),
		).toStrictEqual({
			type: ApplicationIdentityProfileDynamicFieldType.Media,
			name: 'portrait',
		});
		const media = new MinimalMedia({ url: 'https://example.com' });
		expect(media.url).toBeUndefined();
		expect(media[kPatch]({ url: 'https://example.com/new' })[kClone]().toJSON()).toStrictEqual({});
	});

	test('subclasses can expose constructed substructures and preserve their behavior through clones', () => {
		class CachedMediaField extends ApplicationIdentityProfileMediaDynamicField {
			public get value() {
				return new ApplicationIdentityProfileMedia(this[kData].value);
			}
		}
		class CachedPrimary extends ApplicationIdentityProfilePrimaryData {
			public get rankImage() {
				const image = this[kData].rank_image;
				return image ? new ApplicationIdentityProfileMedia(image) : undefined;
			}
		}
		class CachedData extends ApplicationIdentityProfileData {
			public get primary() {
				const data = this[kData].primary;
				return data ? new CachedPrimary(data) : undefined;
			}

			public get dynamic() {
				return this[kData].dynamic?.map((field) => {
					switch (field.type) {
						case ApplicationIdentityProfileDynamicFieldType.String:
							return new ApplicationIdentityProfileStringDynamicField(field);
						case ApplicationIdentityProfileDynamicFieldType.Number:
							return new ApplicationIdentityProfileNumberDynamicField(field);
						case ApplicationIdentityProfileDynamicFieldType.Media:
							return new CachedMediaField(field);
						default:
							throw new Error('Unknown dynamic field type');
					}
				});
			}
		}
		class CachedProfile extends ApplicationIdentityProfile {
			public get data() {
				const data = this[kData].data;
				return data === null ? null : new CachedData(data);
			}

			public get metadata() {
				return this[kData].metadata;
			}
		}
		const instance = new CachedProfile(profile);
		expect(instance.data).toBeInstanceOf(CachedData);
		expect(instance.data?.primary?.rankImage?.url).toBe(primary.rank_image!.url);
		expect(instance.data?.dynamic?.[0]).toBeInstanceOf(ApplicationIdentityProfileStringDynamicField);
		expect(instance.data?.dynamic?.[1]).toBeInstanceOf(ApplicationIdentityProfileNumberDynamicField);
		const mediaField = instance.data?.dynamic?.[2];
		expect(mediaField).toBeInstanceOf(CachedMediaField);
		expect((mediaField as CachedMediaField).value.url).toBe('https://example.com/portrait.png');
		expect(instance.metadata).toStrictEqual(profile.metadata);
		expect(instance.toJSON()).toStrictEqual(profile);
		const clone = instance[kClone]();
		expect(clone).toBeInstanceOf(CachedProfile);
		expect(clone.data?.primary?.rankImage).toBeInstanceOf(ApplicationIdentityProfileMedia);
		expect(clone.toJSON()).toStrictEqual(profile);
		expect(clone[kPatch]({ data: null }).data).toBeNull();
		expect(instance.data).toBeInstanceOf(CachedData);
	});
});
