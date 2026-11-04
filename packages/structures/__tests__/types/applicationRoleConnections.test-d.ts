import {
	ApplicationRoleConnectionMetadataType,
	Locale,
	type APIApplicationRoleConnectionMetadata,
	type LocalizationMap,
} from 'discord-api-types/v10';
import { expectTypeOf } from 'vitest';
import { ApplicationRoleConnectionMetadata } from '../../src/applicationRoleConnections/index.js';
import { kClone, kData, kPatch } from '../../src/utils/symbols.js';
import type { Partialize } from '../../src/utils/types.js';

declare const metadata: ApplicationRoleConnectionMetadata;

expectTypeOf(metadata.type).toEqualTypeOf<ApplicationRoleConnectionMetadataType>();
expectTypeOf(metadata.key).toBeString();
expectTypeOf(metadata.name).toBeString();
expectTypeOf(metadata.description).toBeString();
expectTypeOf(metadata.nameLocalizations).toEqualTypeOf<LocalizationMap | undefined>();
expectTypeOf(metadata.descriptionLocalizations).toEqualTypeOf<LocalizationMap | undefined>();
expectTypeOf(metadata.nameLocalizations?.[Locale.German]).toEqualTypeOf<string | null | undefined>();
expectTypeOf(metadata.toJSON()).toEqualTypeOf<APIApplicationRoleConnectionMetadata>();

expectTypeOf<typeof ApplicationRoleConnectionMetadata<''>>().constructorParameters.toEqualTypeOf<
	[data: Partialize<APIApplicationRoleConnectionMetadata, ''>]
>();

declare const omitted: ApplicationRoleConnectionMetadata<'name' | 'description_localizations'>;
expectTypeOf(omitted.name).toBeUnknown();
expectTypeOf(omitted.descriptionLocalizations).toBeUnknown();
expectTypeOf(omitted.key).toBeString();
expectTypeOf(omitted.type).toEqualTypeOf<ApplicationRoleConnectionMetadataType>();
expectTypeOf(omitted.nameLocalizations).toEqualTypeOf<LocalizationMap | undefined>();
expectTypeOf(omitted.description).toBeString();

declare const allOmitted: ApplicationRoleConnectionMetadata<keyof APIApplicationRoleConnectionMetadata>;
expectTypeOf(allOmitted.type).toBeUnknown();
expectTypeOf(allOmitted.key).toBeUnknown();
expectTypeOf(allOmitted.name).toBeUnknown();
expectTypeOf(allOmitted.description).toBeUnknown();
expectTypeOf(allOmitted.nameLocalizations).toBeUnknown();
expectTypeOf(allOmitted.descriptionLocalizations).toBeUnknown();

const minimalData = {
	type: ApplicationRoleConnectionMetadataType.BooleanEqual,
	key: 'verified',
	name: 'Verified',
	description: 'Whether the account is verified',
};

new ApplicationRoleConnectionMetadata(minimalData);
new ApplicationRoleConnectionMetadata({
	...minimalData,
	name_localizations: { [Locale.German]: null },
	description_localizations: { [Locale.German]: 'Beschreibung' },
});

// @ts-expect-error Required API fields cannot be omitted without an Omitted generic
new ApplicationRoleConnectionMetadata({ type: minimalData.type, key: minimalData.key });
new ApplicationRoleConnectionMetadata<'name' | 'description'>({ type: minimalData.type, key: minimalData.key });

// @ts-expect-error The API permits null locale entries, not null localization dictionaries
new ApplicationRoleConnectionMetadata({ ...minimalData, name_localizations: null });
// @ts-expect-error Localization values must match the API's string or null type
new ApplicationRoleConnectionMetadata({ ...minimalData, description_localizations: { [Locale.German]: 123 } });

class LocalizedMetadata extends ApplicationRoleConnectionMetadata {
	public get germanName() {
		return this[kData].name_localizations?.[Locale.German] ?? this.name;
	}

	public patch(data: Partial<APIApplicationRoleConnectionMetadata>) {
		return this[kPatch](data);
	}

	public clone(data?: Partial<APIApplicationRoleConnectionMetadata>) {
		return this[kClone](data);
	}
}

declare const localized: LocalizedMetadata;
expectTypeOf(localized.germanName).toBeString();
expectTypeOf(localized.clone()).toEqualTypeOf<LocalizedMetadata>();
expectTypeOf(localized.patch({ name_localizations: {} })).toEqualTypeOf<LocalizedMetadata>();

// @ts-expect-error Patch data uses the API metadata comparison enum
localized.patch({ type: 0 });
// @ts-expect-error Clone patches must use valid localization values
localized.clone({ name_localizations: { [Locale.German]: 123 } });

class CompactMetadata extends ApplicationRoleConnectionMetadata<'name'> {
	public static override readonly DataTemplate: Partial<APIApplicationRoleConnectionMetadata> = {
		set name(_value: APIApplicationRoleConnectionMetadata['name']) {},
	};

	public override get name() {
		return this.key;
	}
}

expectTypeOf(
	new CompactMetadata({ type: minimalData.type, key: minimalData.key, description: minimalData.description }).name,
).toBeString();
