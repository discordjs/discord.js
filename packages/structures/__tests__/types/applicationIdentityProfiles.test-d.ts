import {
	ApplicationIdentityProfileDynamicFieldType,
	type APIApplicationIdentity,
	type APIApplicationIdentityProfile,
	type APIApplicationIdentityProfileData,
	type APIApplicationIdentityProfileDynamicField,
	type APIApplicationIdentityProfileMediaDynamicField,
	type APIApplicationIdentityProfileNumberDynamicField,
	type APIApplicationIdentityProfileStringDynamicField,
	type APIApplicationIdentityProfileMedia,
	type APIApplicationIdentityProfilePrimaryData,
	type APIUserApplicationIdentity,
} from 'discord-api-types/v10';
import { expectTypeOf } from 'vitest';
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
} from '../../src/applicationIdentityProfiles/index.js';
import { kClone, kData, kPatch } from '../../src/utils/symbols.js';

const identity = new ApplicationIdentity({ provider_type: 'NONE', provider_issued_user_id: 'external-account' });
expectTypeOf(identity.providerType).toEqualTypeOf<string>();
expectTypeOf(identity.providerId).toEqualTypeOf<string | undefined>();
expectTypeOf(identity.providerIssuedUserId).toEqualTypeOf<string>();
expectTypeOf(identity.toJSON()).toEqualTypeOf<APIApplicationIdentity>();

const userIdentity = new UserApplicationIdentity({
	user_id: '222078108977594368',
	provider_type: 'NONE',
	provider_issued_user_id: 'external-account',
});
expectTypeOf(userIdentity.userId).toEqualTypeOf<string>();
expectTypeOf(userIdentity.providerType).toEqualTypeOf<string>();
expectTypeOf(userIdentity.providerId).toEqualTypeOf<string | undefined>();
expectTypeOf(userIdentity.providerIssuedUserId).toEqualTypeOf<string>();
expectTypeOf(userIdentity.toJSON()).toEqualTypeOf<APIUserApplicationIdentity>();
expectTypeOf(
	new UserApplicationIdentity<'user_id'>({ provider_type: 'NONE', provider_issued_user_id: 'account' }).userId,
).toBeUnknown();
// @ts-expect-error User application identities require their Discord user ID unless omitted.
new UserApplicationIdentity({ provider_type: 'NONE', provider_issued_user_id: 'account' });

const profile = new ApplicationIdentityProfile({ username: null, metadata: null, data: null });
expectTypeOf(profile.username).toEqualTypeOf<string | null>();
expectTypeOf(profile.toJSON()).toEqualTypeOf<APIApplicationIdentityProfile>();
expectTypeOf(profile[kPatch]({ username: 'player' })).toEqualTypeOf<ApplicationIdentityProfile>();
expectTypeOf(profile[kClone]({ data: null })).toEqualTypeOf<ApplicationIdentityProfile>();
// @ts-expect-error Required nullable fields must be supplied unless omitted.
new ApplicationIdentityProfile({ username: 'player' });
// @ts-expect-error API profile fields are nullable rather than optional.
new ApplicationIdentityProfile({ username: undefined, metadata: null, data: null });
expectTypeOf(profile).not.toHaveProperty('data');
expectTypeOf(profile).not.toHaveProperty('metadata');

const data = new ApplicationIdentityProfileData({});
expectTypeOf(data.toJSON()).toEqualTypeOf<APIApplicationIdentityProfileData>();
expectTypeOf(data).not.toHaveProperty('primary');
expectTypeOf(data).not.toHaveProperty('dynamic');
// @ts-expect-error Optional primary data is not nullable.
new ApplicationIdentityProfileData({ primary: null });
// @ts-expect-error Optional fields cannot be explicitly undefined in API data.
new ApplicationIdentityProfileData({ dynamic: undefined });

const primary = new ApplicationIdentityProfilePrimaryData({});
expectTypeOf(primary.season).toEqualTypeOf<string | undefined>();
expectTypeOf(primary.rankName).toEqualTypeOf<string | undefined>();
expectTypeOf(primary.highestRank).toEqualTypeOf<string | undefined>();
expectTypeOf(primary.featuredPlayedCharacter).toEqualTypeOf<string | undefined>();
expectTypeOf(primary.playtimeHours).toEqualTypeOf<number | undefined>();
expectTypeOf(primary.totalWins).toEqualTypeOf<number | undefined>();
expectTypeOf(primary.currentPeriodWins).toEqualTypeOf<number | undefined>();
expectTypeOf(primary.totalGames).toEqualTypeOf<number | undefined>();
expectTypeOf(primary.currentPeriodGames).toEqualTypeOf<number | undefined>();
expectTypeOf(primary.totalKills).toEqualTypeOf<number | undefined>();
expectTypeOf(primary.currentPeriodKills).toEqualTypeOf<number | undefined>();
expectTypeOf(primary.totalAssists).toEqualTypeOf<number | undefined>();
expectTypeOf(primary.currentPeriodAssists).toEqualTypeOf<number | undefined>();
expectTypeOf(primary.totalDeaths).toEqualTypeOf<number | undefined>();
expectTypeOf(primary.currentPeriodDeaths).toEqualTypeOf<number | undefined>();
expectTypeOf(primary.toJSON()).toEqualTypeOf<APIApplicationIdentityProfilePrimaryData>();
expectTypeOf(primary).not.toHaveProperty('rankImage');
expectTypeOf(primary).not.toHaveProperty('highestRankImage');
expectTypeOf(primary).not.toHaveProperty('featuredPlayedCharacterImage');
// @ts-expect-error Optional pre-configured stats are not nullable.
new ApplicationIdentityProfilePrimaryData({ total_wins: null });

const stringField = new ApplicationIdentityProfileStringDynamicField({
	type: ApplicationIdentityProfileDynamicFieldType.String,
	name: 'region',
	value: '',
});
expectTypeOf(stringField.type).toEqualTypeOf<ApplicationIdentityProfileDynamicFieldType.String>();
expectTypeOf(stringField.name).toEqualTypeOf<string>();
expectTypeOf(stringField.value).toEqualTypeOf<string>();
expectTypeOf(stringField.toJSON()).toEqualTypeOf<APIApplicationIdentityProfileStringDynamicField>();
new ApplicationIdentityProfileStringDynamicField({
	// @ts-expect-error String fields have a fixed discriminant.
	type: ApplicationIdentityProfileDynamicFieldType.Number,
	name: 'region',
	value: '',
});
new ApplicationIdentityProfileStringDynamicField({
	type: ApplicationIdentityProfileDynamicFieldType.String,
	name: 'region',
	// @ts-expect-error String fields cannot store numeric values.
	value: 0,
});

const numberField = new ApplicationIdentityProfileNumberDynamicField({
	type: ApplicationIdentityProfileDynamicFieldType.Number,
	name: 'wins',
	value: 0,
});
expectTypeOf(numberField.type).toEqualTypeOf<ApplicationIdentityProfileDynamicFieldType.Number>();
expectTypeOf(numberField.name).toEqualTypeOf<string>();
expectTypeOf(numberField.value).toEqualTypeOf<number>();
expectTypeOf(numberField.toJSON()).toEqualTypeOf<APIApplicationIdentityProfileNumberDynamicField>();
new ApplicationIdentityProfileNumberDynamicField({
	type: ApplicationIdentityProfileDynamicFieldType.Number,
	name: 'wins',
	// @ts-expect-error Number fields cannot store string values.
	value: '0',
});

const mediaField = new ApplicationIdentityProfileMediaDynamicField({
	type: ApplicationIdentityProfileDynamicFieldType.Media,
	name: 'portrait',
	value: { url: 'https://example.com/portrait.png' },
});
expectTypeOf(mediaField.type).toEqualTypeOf<ApplicationIdentityProfileDynamicFieldType.Media>();
expectTypeOf(mediaField.name).toEqualTypeOf<string>();
expectTypeOf(mediaField.toJSON()).toEqualTypeOf<APIApplicationIdentityProfileMediaDynamicField>();
expectTypeOf(mediaField).not.toHaveProperty('value');
new ApplicationIdentityProfileMediaDynamicField({
	type: ApplicationIdentityProfileDynamicFieldType.Media,
	name: 'portrait',
	// @ts-expect-error Media values are objects rather than strings.
	value: 'https://example.com',
});

const media = new ApplicationIdentityProfileMedia({ url: 'https://example.com/portrait.png' });
expectTypeOf(media.url).toEqualTypeOf<string>();
expectTypeOf(media.toJSON()).toEqualTypeOf<APIApplicationIdentityProfileMedia>();
// @ts-expect-error A media URL is required unless omitted.
new ApplicationIdentityProfileMedia({});

declare const dynamic: APIApplicationIdentityProfileDynamicField;
if (dynamic.type === ApplicationIdentityProfileDynamicFieldType.String) {
	expectTypeOf(dynamic.value).toEqualTypeOf<string>();
} else if (dynamic.type === ApplicationIdentityProfileDynamicFieldType.Number) {
	expectTypeOf(dynamic.value).toEqualTypeOf<number>();
} else {
	expectTypeOf(dynamic.value).toEqualTypeOf<APIApplicationIdentityProfileMedia>();
}

const omittedProfile = new ApplicationIdentityProfile<'username' | 'metadata'>({ data: null });
expectTypeOf(omittedProfile.username).toBeUnknown();
expectTypeOf(
	new ApplicationIdentity<'provider_type'>({ provider_issued_user_id: 'account' }).providerType,
).toBeUnknown();
expectTypeOf(new ApplicationIdentityProfilePrimaryData<'rank_name'>({}).rankName).toBeUnknown();
expectTypeOf(new ApplicationIdentityProfileMedia<'url'>({}).url).toBeUnknown();
expectTypeOf(
	new ApplicationIdentityProfileStringDynamicField<'value'>({
		type: ApplicationIdentityProfileDynamicFieldType.String,
		name: 'region',
	}).value,
).toBeUnknown();
expectTypeOf(
	new ApplicationIdentityProfileNumberDynamicField<'value'>({
		type: ApplicationIdentityProfileDynamicFieldType.Number,
		name: 'wins',
	}).value,
).toBeUnknown();
new ApplicationIdentityProfileMediaDynamicField<'value'>({
	type: ApplicationIdentityProfileDynamicFieldType.Media,
	name: 'portrait',
});
// @ts-expect-error Only raw API property names are valid omissions.
new ApplicationIdentityProfilePrimaryData<'rankName'>({});

class CachedPrimary extends ApplicationIdentityProfilePrimaryData {
	public get rankImage() {
		const value = this[kData].rank_image;
		return value ? new ApplicationIdentityProfileMedia(value) : undefined;
	}

	public get highestRankImage() {
		const value = this[kData].highest_rank_image;
		return value ? new ApplicationIdentityProfileMedia(value) : undefined;
	}

	public get featuredPlayedCharacterImage() {
		const value = this[kData].featured_played_character_image;
		return value ? new ApplicationIdentityProfileMedia(value) : undefined;
	}
}

class CachedMediaField extends ApplicationIdentityProfileMediaDynamicField {
	public get value() {
		return new ApplicationIdentityProfileMedia(this[kData].value);
	}
}

class CachedData extends ApplicationIdentityProfileData {
	public get primary() {
		const value = this[kData].primary;
		return value ? new CachedPrimary(value) : undefined;
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
		const value = this[kData].data;
		return value === null ? null : new CachedData(value);
	}

	public get metadata() {
		return this[kData].metadata;
	}
}

const cached = new CachedProfile({ username: 'player', metadata: {}, data: {} });
expectTypeOf(cached.data).toEqualTypeOf<CachedData | null>();
expectTypeOf(cached.metadata).toEqualTypeOf<Record<string, unknown> | null>();
expectTypeOf(cached[kClone]()).toEqualTypeOf<CachedProfile>();
expectTypeOf(cached[kPatch]({ data: {} })).toEqualTypeOf<CachedProfile>();
expectTypeOf(cached.data?.primary).toEqualTypeOf<CachedPrimary | undefined>();
expectTypeOf(cached.data?.primary?.rankImage).toEqualTypeOf<ApplicationIdentityProfileMedia | undefined>();
expectTypeOf(cached.data?.primary?.highestRankImage).toEqualTypeOf<ApplicationIdentityProfileMedia | undefined>();
expectTypeOf(cached.data?.primary?.featuredPlayedCharacterImage).toEqualTypeOf<
	ApplicationIdentityProfileMedia | undefined
>();
expectTypeOf(
	new CachedMediaField({
		type: ApplicationIdentityProfileDynamicFieldType.Media,
		name: 'portrait',
		value: { url: 'https://example.com' },
	}).value,
).toEqualTypeOf<ApplicationIdentityProfileMedia>();

class RedactedProfile extends ApplicationIdentityProfile<'username'> {
	public static override readonly DataTemplate = { set username(_: string | null) {} };

	public get rawUsername() {
		return this[kData].username;
	}
}
expectTypeOf(new RedactedProfile({ metadata: null, data: null }).rawUsername).toBeUnknown();
