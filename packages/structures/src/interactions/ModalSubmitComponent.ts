import type {
	APIModalSubmissionComponent,
	ModalSubmitComponent as APIModalSubmitFieldComponent,
} from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { ReplaceOmittedWithUnknown } from '../utils/types.js';
import type { PartializeInteraction } from './types.js';

/**
 * A received modal component response, including containers and submitted fields.
 */
export type ModalSubmitComponentAPIData = APIModalSubmissionComponent | APIModalSubmitFieldComponent;

/**
 * The raw response for a particular submitted component type.
 */
export type ModalSubmitComponentDataType<Type extends ModalSubmitComponentAPIData['type']> = {
	[Kind in ModalSubmitComponentAPIData['type']]: Extract<ModalSubmitComponentAPIData, { type: Kind }>;
}[Type];

/**
 * A received modal component response, distinct from an outbound component definition.
 *
 * @typeParam Type - The submitted component type
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw `components` array on action rows contains `ModalSubmitValueField` text input responses.
 * The raw `component` on labels contains a `ModalSubmitValueField` or `ModalSubmitValuesField`.
 * An extending class must construct and store these substructures.
 */
export class ModalSubmitComponent<
	Type extends ModalSubmitComponentAPIData['type'] = ModalSubmitComponentAPIData['type'],
	Omitted extends keyof ModalSubmitComponentDataType<Type> | '' = '',
> extends Structure<ModalSubmitComponentDataType<Type>, Omitted> {
	public static override readonly DataTemplate: Partial<ModalSubmitComponentAPIData> = {};

	/**
	 * @param data - The raw received modal component response
	 */
	public constructor(data: PartializeInteraction<ModalSubmitComponentDataType<Type>, Omitted>) {
		super(data);
	}

	/**
	 * The optional numeric component identifier
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The submitted component's type
	 */
	public get type() {
		return this[kData].type;
	}
}

/**
 * A submitted modal field with a developer-defined identifier.
 *
 * @typeParam Type - The submitted field's type
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 */
export class ModalSubmitField<
	Type extends APIModalSubmitFieldComponent['type'] = APIModalSubmitFieldComponent['type'],
	Omitted extends keyof ModalSubmitComponentDataType<Type> | '' = '',
> extends ModalSubmitComponent<Type, Omitted> {
	public static override readonly DataTemplate: Partial<APIModalSubmitFieldComponent> = {};

	/**
	 * @param data - The raw received modal field
	 */
	public constructor(data: PartializeInteraction<ModalSubmitComponentDataType<Type>, Omitted>) {
		super(data);
	}

	/**
	 * The developer-defined identifier of the submitted field
	 */
	public get customId() {
		return this[kData].custom_id;
	}
}

/**
 * A modal field type carrying one string, boolean, or null value.
 */
export type ModalSubmitValueFieldType = Extract<APIModalSubmitFieldComponent, { value: unknown }>['type'];

/**
 * A submitted text input, radio group, or checkbox value.
 *
 * @typeParam Type - The submitted field's type
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 */
export class ModalSubmitValueField<
	Type extends ModalSubmitValueFieldType = ModalSubmitValueFieldType,
	Omitted extends keyof ModalSubmitComponentDataType<Type> | '' = '',
> extends ModalSubmitField<Type, Omitted> {
	public static override readonly DataTemplate: Partial<ModalSubmitComponentDataType<ModalSubmitValueFieldType>> = {};

	/**
	 * @param data - The raw received scalar field
	 */
	public constructor(data: PartializeInteraction<ModalSubmitComponentDataType<Type>, Omitted>) {
		super(data);
	}

	/**
	 * The submitted scalar value, including null when no radio option was selected
	 */
	public get value(): ReplaceOmittedWithUnknown<Omitted, ModalSubmitComponentDataType<Type>>['value'] {
		return this[kData].value;
	}
}

/**
 * A modal field type carrying an array of selected values.
 */
export type ModalSubmitValuesFieldType = Extract<APIModalSubmitFieldComponent, { values: unknown }>['type'];

/**
 * A submitted select menu, file upload, or checkbox group selection.
 *
 * @typeParam Type - The submitted field's type
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 */
export class ModalSubmitValuesField<
	Type extends ModalSubmitValuesFieldType = ModalSubmitValuesFieldType,
	Omitted extends keyof ModalSubmitComponentDataType<Type> | '' = '',
> extends ModalSubmitField<Type, Omitted> {
	public static override readonly DataTemplate: Partial<ModalSubmitComponentDataType<ModalSubmitValuesFieldType>> = {};

	/**
	 * @param data - The raw received selection field
	 */
	public constructor(data: PartializeInteraction<ModalSubmitComponentDataType<Type>, Omitted>) {
		super(data);
	}

	/**
	 * A copy of the submitted strings or entity ids
	 */
	public get values() {
		const values = this[kData].values;
		return (Array.isArray(values) ? [...values] : undefined) as Omitted extends 'values' ? unknown : readonly string[];
	}
}
