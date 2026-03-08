import type { APIApplicationCommandAttachmentOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { Partialize } from '../../utils/types';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase';

/**
 * Represents an attachment option type for an application command.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ApplicationCommandOptionAttachment<
	Omitted extends keyof APIApplicationCommandAttachmentOption,
> extends ApplicationCommandOptionBase<ApplicationCommandOptionType.Attachment, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each application attachment option type.
	 */
	public static override readonly DataTemplate: Partial<APIApplicationCommandAttachmentOption> = {};

	/**
	 * @param data - The raw data received from the API for the application command option
	 */
	public constructor(data: Partialize<APIApplicationCommandAttachmentOption, Omitted>) {
		super(data);
	}
}
