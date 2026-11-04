import {
	ApplicationRoleConnectionMetadataType,
	Locale,
	type APIApplicationRoleConnectionMetadata,
} from 'discord-api-types/v10';
import { beforeEach, describe, expect, test } from 'vitest';
import { ApplicationRoleConnectionMetadata } from '../src/applicationRoleConnections/index.js';
import { kClone, kData, kPatch } from '../src/utils/symbols.js';

const data: APIApplicationRoleConnectionMetadata = {
	type: ApplicationRoleConnectionMetadataType.IntegerGreaterThanOrEqual,
	key: 'total_wins',
	name: 'Total wins',
	name_localizations: { [Locale.German]: 'Siege insgesamt', [Locale.French]: null },
	description: 'The total number of wins',
	description_localizations: { [Locale.German]: 'Die Gesamtzahl der Siege', [Locale.French]: null },
};

class LocalizedMetadata extends ApplicationRoleConnectionMetadata {
	public get germanName() {
		return this[kData].name_localizations?.[Locale.German] ?? this.name;
	}
}

class CompactMetadata extends ApplicationRoleConnectionMetadata<'description' | 'description_localizations'> {
	public static override readonly DataTemplate: Partial<APIApplicationRoleConnectionMetadata> = {
		set description(_value: APIApplicationRoleConnectionMetadata['description']) {},
		set description_localizations(
			_value: NonNullable<APIApplicationRoleConnectionMetadata['description_localizations']>,
		) {},
	};
}

describe('ApplicationRoleConnectionMetadata structure', () => {
	let instance: ApplicationRoleConnectionMetadata;

	beforeEach(() => {
		instance = new ApplicationRoleConnectionMetadata(data);
	});

	test('exposes all scalar fields and raw localization dictionaries', () => {
		expect(instance.type).toBe(data.type);
		expect(instance.key).toBe(data.key);
		expect(instance.name).toBe(data.name);
		expect(instance.nameLocalizations).toEqual(data.name_localizations);
		expect(instance.description).toBe(data.description);
		expect(instance.descriptionLocalizations).toEqual(data.description_localizations);
	});

	test('serializes API field names and preserves nullable localization entries', () => {
		expect(instance.toJSON()).toStrictEqual(data);
		expect(JSON.parse(JSON.stringify(instance))).toStrictEqual(data);
	});

	test('serialization deep clones both localization dictionaries', () => {
		const json = instance.toJSON();
		expect(json).not.toBe(data);
		expect(json.name_localizations).not.toBe(instance.nameLocalizations);
		expect(json.description_localizations).not.toBe(instance.descriptionLocalizations);

		json.name_localizations![Locale.German] = 'Changed';
		json.description_localizations![Locale.German] = null;
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('preserves missing optional fields without introducing defaults', () => {
		const minimalData: APIApplicationRoleConnectionMetadata = {
			type: ApplicationRoleConnectionMetadataType.BooleanEqual,
			key: 'verified',
			name: 'Verified',
			description: 'Whether the account is verified',
		};
		const minimal = new ApplicationRoleConnectionMetadata(minimalData);
		expect(minimal.nameLocalizations).toBeUndefined();
		expect(minimal.descriptionLocalizations).toBeUndefined();
		expect(minimal.toJSON()).toStrictEqual(minimalData);
		expect(minimal.toJSON()).not.toHaveProperty('name_localizations');
		expect(minimal.toJSON()).not.toHaveProperty('description_localizations');
		expect(minimal[kClone]().toJSON()).toStrictEqual(minimalData);
	});

	test('preserves empty dictionaries and explicitly null locale values', () => {
		const localizedData = { ...data, name_localizations: {}, description_localizations: { [Locale.German]: null } };
		const localized = new ApplicationRoleConnectionMetadata(localizedData);
		expect(localized.nameLocalizations).toStrictEqual({});
		expect(localized.descriptionLocalizations?.[Locale.German]).toBeNull();
		expect(localized.toJSON()).toStrictEqual(localizedData);
	});

	test('patches scalars and replaces localization dictionaries in place', () => {
		const patch: Partial<APIApplicationRoleConnectionMetadata> = {
			type: ApplicationRoleConnectionMetadataType.IntegerEqual,
			name: 'Wins',
			name_localizations: { [Locale.French]: 'Victoires' },
			description_localizations: {},
		};
		expect(instance[kPatch](patch)).toBe(instance);
		expect(instance.type).toBe(patch.type);
		expect(instance.name).toBe(patch.name);
		expect(instance.nameLocalizations).toEqual(patch.name_localizations);
		expect(instance.nameLocalizations).not.toHaveProperty(Locale.German);
		expect(instance.descriptionLocalizations).toStrictEqual({});
		expect(instance.toJSON()).toStrictEqual({ ...data, ...patch });
	});

	test('retains untouched localization data when patching another field', () => {
		instance[kPatch]({ key: 'wins' });
		expect(instance.key).toBe('wins');
		expect(instance.toJSON()).toStrictEqual({ ...data, key: 'wins' });
	});

	test('clones and applies patches without changing the original instance', () => {
		const clone = instance[kClone]();
		expect(clone).toBeInstanceOf(ApplicationRoleConnectionMetadata);
		expect(clone).not.toBe(instance);
		expect(clone.toJSON()).toStrictEqual(data);
		expect(clone.nameLocalizations).not.toBe(instance.nameLocalizations);
		expect(clone.descriptionLocalizations).not.toBe(instance.descriptionLocalizations);

		clone.nameLocalizations![Locale.German] = 'Changed';
		clone.descriptionLocalizations![Locale.French] = 'Changed';
		const patchedClone = instance[kClone]({ description: 'Updated description' });
		expect(patchedClone.description).toBe('Updated description');
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('applies DataTemplate omissions during construction, patches, and clones', () => {
		const compact = new CompactMetadata(data);
		const { description: _description, description_localizations: _descriptionLocalizations, ...expected } = data;

		expect(compact.description).toBeUndefined();
		expect(compact.descriptionLocalizations).toBeUndefined();
		expect(compact.toJSON()).toStrictEqual(expected);
		compact[kPatch]({ description: 'Discarded', description_localizations: { [Locale.German]: 'Discarded' } });
		expect(compact.toJSON()).toStrictEqual(expected);
		const clone = compact[kClone]({ description: 'Also discarded' });
		expect(clone).toBeInstanceOf(CompactMetadata);
		expect(clone.toJSON()).toStrictEqual(expected);
		expect(new CompactMetadata(expected).toJSON()).toStrictEqual(expected);
	});

	test('allows subclasses to use raw localization fields through patch and clone', () => {
		const localized = new LocalizedMetadata(data);
		expect(localized.germanName).toBe('Siege insgesamt');
		localized[kPatch]({ name_localizations: { [Locale.German]: null } });
		expect(localized.germanName).toBe(data.name);

		const clone = localized[kClone]({ name_localizations: { [Locale.German]: 'Siege' } });
		expect(clone).toBeInstanceOf(LocalizedMetadata);
		expect(clone.germanName).toBe('Siege');
		expect(clone.toJSON()).toStrictEqual({ ...data, name_localizations: { [Locale.German]: 'Siege' } });
		expect(localized.germanName).toBe(data.name);
	});
});
