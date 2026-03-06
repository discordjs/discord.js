// import { DiscordSnowflake } from '@sapphire/snowflake';
// import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';
// import { Structure } from '../../Structure.js';
// import { kData } from '../../utils/symbols.js';
// import { isIdSet } from '../../utils/type-guards.js';
// import type { Partialize } from '../../utils/types.js';

// /**
//  * Represents any application command option choice on Discord.
//  *
//  * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
//  * @remarks has substructure `User` which needs to be instantiated and stored by an extending class using it
//  * @remarks intentionally does not export `roles` so that extending classes can resolve `Snowflake[]` to `Role[]`
//  */
// export class ApplicationCommandOptionChoice<Omitted extends keyof ApplicationCommandOptionChoice | '' = ''> extends Structure<ApplicationCommandOptionChoice, Omitted> {
// 	/**
// 	 * The template used for removing data from the raw data stored for each application command option choice
// 	 */
// 	public static override readonly DataTemplate: Partial<ApplicationCommandOptionChoice> = {};

// 	/**
// 	 * @param data - The raw data received from the API for the application command option choice
// 	 */
// 	public constructor(data: Partialize<ApplicationCommandOptionChoice, Omitted>) {
// 		super(data);
// 	}

// 	/**
// 	 * 1-100 character choice name
// 	 */
// 	public get name() {
// 		return this[kData].name
// 	}
// }
console.log();
