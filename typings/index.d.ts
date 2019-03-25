declare module 'discord.js' {
	import { EventEmitter } from 'events';
	import { Stream, Readable, Writable } from 'stream';
	import { ChildProcess } from 'child_process';

	export const version: string;
	export type StructureGroup = {
		Client: Client
		GuildEmoji: GuildEmoji
		DMChannel: DMChannel
		TextChannel: TextChannel
		VoiceChannel: VoiceChannel
		CategoryChannel: CategoryChannel
		GuildChannel: GuildChannel
		GuildMember: GuildMember
		Guild: Guild
		Message: Message
		MessageReaction: MessageReaction
		Presence: Presence
		ClientPresence: ClientPresence
		VoiceState: VoiceState
		Role: Role
		User: User
	}
	export type ExtendStructures<N extends Partial<StructureGroup>> = {
		Client: N["Client"] extends Client ? N["Client"] : Client<ExtendStructures<N>>
		GuildEmoji: N["GuildEmoji"] extends GuildEmoji ? N["GuildEmoji"] : GuildEmoji<ExtendStructures<N>>
		DMChannel: N["DMChannel"] extends DMChannel ? N["DMChannel"] : DMChannel<ExtendStructures<N>>
		TextChannel: N["TextChannel"] extends TextChannel ? N["TextChannel"] : TextChannel<ExtendStructures<N>>
		VoiceChannel: N["VoiceChannel"] extends VoiceChannel ? N["VoiceChannel"] : VoiceChannel<ExtendStructures<N>>
		CategoryChannel: N["CategoryChannel"] extends CategoryChannel ? N["CategoryChannel"] : CategoryChannel<ExtendStructures<N>>
		GuildChannel: N["GuildChannel"] extends GuildChannel ? N["GuildChannel"] : GuildChannel<ExtendStructures<N>>
		GuildMember: N["GuildMember"] extends GuildMember ? N["GuildMember"] : GuildMember<ExtendStructures<N>>
		Guild: N["Guild"] extends Guild ? N["Guild"] : Guild<ExtendStructures<N>>
		Message: N["Message"] extends Message ? N["Message"] : Message<ExtendStructures<N>>
		MessageReaction: N["MessageReaction"] extends MessageReaction ? N["MessageReaction"] : MessageReaction<ExtendStructures<N>>
		Presence: N["Presence"] extends Presence ? N["Presence"] : Presence<ExtendStructures<N>>
		ClientPresence: N["ClientPresence"] extends ClientPresence ? N["ClientPresence"] : ClientPresence
		VoiceState: N["VoiceState"] extends VoiceState ? N["VoiceState"] : VoiceState<ExtendStructures<N>>
		Role: N["Role"] extends Role ? N["Role"] : Role<ExtendStructures<N>>
		User: N["User"] extends User ? N["User"] : User<ExtendStructures<N>>
	}
	
//#region Classes
	export class ClientPresence extends Presence {
		public set(presence: ClientPresenceStatus): this
	}
	export class Activity {
		constructor(presence: Presence, data?: object);
		public applicationID: Snowflake;
		public assets: RichPresenceAssets;
		public details: string;
		public name: string;
		public party: {
			id: string;
			size: [number, number];
		};
		public state: string;
		public timestamps: {
			start: Date;
			end: Date;
		};
		public type: ActivityType;
		public url: string;
		public equals(activity: Activity): boolean;
	}

	export class ActivityFlags extends BitField<ActivityFlagsString> {
		public static FLAGS: Record<ActivityFlagsString, number>;
		public static resolve(bit?: BitFieldResolvable<ActivityFlagsString>): number;
	}

	export class APIMessage<S extends StructureGroup = StructureGroup> {
		constructor(target: MessageTarget<S>, options: MessageOptions<S> | WebhookMessageOptions);
		public data?: object;
		public readonly isUser: boolean;
		public readonly isWebhook: boolean;
		public files?: object[];
		public options: MessageOptions<S> | WebhookMessageOptions;
		public target: MessageTarget<S>;

		public static create(
			target: MessageTarget,
			content?: StringResolvable,
			options?: MessageOptions | WebhookMessageOptions | MessageAdditions,
			extra?: MessageOptions | WebhookMessageOptions
		): APIMessage;
		public static partitionMessageAdditions(items: (MessageEmbed | MessageAttachment)[]): [MessageEmbed[], MessageAttachment[]];
		public static resolveFile(fileLike: BufferResolvable | Stream | FileOptions | MessageAttachment): Promise<object>;
		public static transformOptions(
			content: StringResolvable,
			options: MessageOptions | WebhookMessageOptions | MessageAdditions,
			extra?: MessageOptions | WebhookMessageOptions,
			isWebhook?: boolean
		): MessageOptions | WebhookMessageOptions;

		public makeContent(): string | string[] | undefined;
		public resolve(): Promise<this>;
		public resolveData(): this;
		public resolveFiles(): Promise<this>;
		public split(): APIMessage<S>[];
	}

	export class Base<S extends StructureGroup = StructureGroup> {
		constructor(client: S["Client"]);
		public readonly client: S["Client"];
		public toJSON(...props: { [key: string]: boolean | string }[]): object;
		public valueOf(): string;
	}

	export class BaseClient extends EventEmitter {
		constructor(options?: ClientOptions);
		private _timeouts: Set<NodeJS.Timer>;
		private _intervals: Set<NodeJS.Timer>;
		private _immediates: Set<NodeJS.Immediate>;
		private readonly api: object;
		private rest: object;

		public options: ClientOptions;
		public clearInterval(interval: NodeJS.Timer): void;
		public clearTimeout(timeout: NodeJS.Timer): void;
		public clearImmediate(timeout: NodeJS.Immediate): void;
		public destroy(): void;
		public setInterval(fn: Function, delay: number, ...args: any[]): NodeJS.Timer;
		public setTimeout(fn: Function, delay: number, ...args: any[]): NodeJS.Timer;
		public setImmediate(fn: Function, delay: number, ...args: any[]): NodeJS.Immediate;
		public toJSON(...props: { [key: string]: boolean | string }[]): object;
	}

	class BroadcastDispatcher<S extends StructureGroup = StructureGroup> extends StreamDispatcher<VoiceBroadcast<S>> {}

	export class BitField<S extends string> {
		constructor(bits?: BitFieldResolvable<S>);
		public bitfield: number;
		public add(...bits: BitFieldResolvable<S>[]): BitField<S>;
		public equals(bit: BitFieldResolvable<S>): boolean;
		public freeze(): Readonly<BitField<S>>;
		public has(bit: BitFieldResolvable<S>): boolean;
		public missing(bits: BitFieldResolvable<S>, ...hasParams: any[]): S[];
		public remove(...bits: BitFieldResolvable<S>[]): BitField<S>;
		public serialize(...hasParams: BitFieldResolvable<S>[]): Record<S, boolean>;
		public toArray(): S[];
		public toJSON(): number;
		public valueOf(): number;
		public [Symbol.iterator](): Iterator<S>;
		public static FLAGS: object;
		public static resolve(bit?: BitFieldResolvable<any>): number;
	}

	export class CategoryChannel<S extends StructureGroup = StructureGroup> extends GuildChannel<S> {
		public readonly children: Collection<Snowflake, S["GuildChannel"]>;
	}

	export class PartialChannel<S extends StructureGroup = StructureGroup> extends Base<S> {
		constructor(client: S["Client"], data?: object);
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public deleted: boolean;
		public id: Snowflake;
		public type: 'dm' | 'text' | 'voice' | 'category' | 'unknown';
		public delete(reason?: string): Promise<this>;
		public fetch(): Promise<this>;
		public toString(): string;
	}
	export type TextableChannel<S extends StructureGroup = StructureGroup> = S["TextChannel"] | S["DMChannel"];
	type Replace<T, K extends keyof T, V> = { [P in keyof T]: P extends K ? V : T[P]; };
	type ThisGroup<S extends StructureGroup, T extends Client> = Replace<S, "Client", T>
	export class Client<s extends StructureGroup = StructureGroup> extends BaseClient {
		constructor(options?: ClientOptions);
		private actions: object;
		private voice: object;
		private _eval(script: string): any;
		private _validateOptions(options?: ClientOptions): void;

		public broadcasts: VoiceBroadcast<ThisGroup<s, this>>[];
		public channels: ChannelStore<ThisGroup<s, this>>;
		public readonly emojis: GuildEmojiStore<ThisGroup<s, this>>;
		public guilds: GuildStore<ThisGroup<s, this>>;
		public readyAt: Date | null;
		public readonly readyTimestamp: number;
		public shard: ShardClientUtil<ThisGroup<s, this>>;
		public token: string;
		public readonly uptime: number;
		public user: ClientUser<ThisGroup<s, this>> | null;
		public users: UserStore<ThisGroup<s, this>>;
		public readonly voiceConnections: Collection<Snowflake, VoiceConnection<ThisGroup<s, this>>>;
		public ws: WebSocketManager<ThisGroup<s, this>>;
		public createVoiceBroadcast(): VoiceBroadcast<ThisGroup<s, this>>;
		public destroy(): void;
		public fetchApplication(): Promise<ClientApplication<ThisGroup<s, this>>>;
		public fetchInvite(invite: InviteResolvable): Promise<Invite<ThisGroup<s, this>>>;
		public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
		public fetchWebhook(id: Snowflake, token?: string): Promise<Webhook<ThisGroup<s, this>>>;
		public generateInvite(permissions?: PermissionResolvable): Promise<string>;
		public login(token?: string): Promise<string>;
		public sweepMessages(lifetime?: number): number;
		public toJSON(): object;

		public on(event: 'channelCreate' | 'channelDelete', listener: (channel: PartialChannel<ThisGroup<s, this>>) => void): this;
		public on(event: 'channelPinsUpdate', listener: (channel: PartialChannel<ThisGroup<s, this>>, time: Date) => void): this;
		public on(event: 'channelUpdate', listener: (oldChannel: PartialChannel<ThisGroup<s, this>>, newChannel: PartialChannel<ThisGroup<s, this>>) => void): this;
		public on(event: 'debug' | 'warn', listener: (info: string) => void): this;
		public on(event: 'disconnect', listener: (event: any, shardID: number) => void): this;
		public on(event: 'emojiCreate' | 'emojiDelete', listener: (emoji: ThisGroup<s, this>["GuildEmoji"]) => void): this;
		public on(event: 'emojiUpdate', listener: (oldEmoji: ThisGroup<s, this>["GuildEmoji"], newEmoji: ThisGroup<s, this>["GuildEmoji"]) => void): this;
		public on(event: 'error', listener: (error: Error) => void): this;
		public on(event: 'guildBanAdd' | 'guildBanRemove', listener: (guild: ThisGroup<s, this>["Guild"], user: ThisGroup<s, this>["User"]) => void): this;
		public on(event: 'guildCreate' | 'guildDelete' | 'guildUnavailable', listener: (guild: ThisGroup<s, this>["Guild"]) => void): this;
		public on(event: 'guildMemberAdd' | 'guildMemberAvailable' | 'guildMemberRemove', listener: (member: ThisGroup<s, this>["GuildMember"]) => void): this;
		public on(event: 'guildMembersChunk', listener: (members: Collection<Snowflake, ThisGroup<s, this>["GuildMember"]>, guild: ThisGroup<s, this>["Guild"]) => void): this;
		public on(event: 'guildMemberSpeaking', listener: (member: ThisGroup<s, this>["GuildMember"], speaking: Readonly<Speaking>) => void): this;
		public on(event: 'guildMemberUpdate', listener: (oldMember: ThisGroup<s, this>["GuildMember"], newMember: ThisGroup<s, this>["GuildMember"]) => void): this;
		public on(event: 'guildUpdate', listener: (oldGuild: ThisGroup<s, this>["Guild"], newGuild: ThisGroup<s, this>["Guild"]) => void): this;
		public on(event: 'guildIntegrationsUpdate', listener: (guild: ThisGroup<s, this>["Guild"]) => void): this;
		public on(event: 'message' | 'messageDelete' | 'messageReactionRemoveAll', listener: (message: ThisGroup<s, this>["Message"]) => void): this;
		public on(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, ThisGroup<s, this>["Message"]>) => void): this;
		public on(event: 'messageReactionAdd' | 'messageReactionRemove', listener: (messageReaction: ThisGroup<s, this>["MessageReaction"], user: ThisGroup<s, this>["User"]) => void): this;
		public on(event: 'messageUpdate', listener: (oldMessage: ThisGroup<s, this>["Message"], newMessage: ThisGroup<s, this>["Message"]) => void): this;
		public on(event: 'presenceUpdate', listener: (oldPresence: ThisGroup<s, this>["Presence"] | undefined, newPresence: ThisGroup<s, this>["Presence"]) => void): this;
		public on(event: 'rateLimit', listener: (rateLimitData: RateLimitData) => void): this;
		public on(event: 'ready', listener: () => void): this;
		public on(event: 'reconnecting', listener: (shardID: number) => void): this;
		public on(event: 'resumed', listener: (replayed: number, shardID: number) => void): this;
		public on(event: 'roleCreate' | 'roleDelete', listener: (role: ThisGroup<s, this>["Role"]) => void): this;
		public on(event: 'roleUpdate', listener: (oldRole: ThisGroup<s, this>["Role"], newRole: ThisGroup<s, this>["Role"]) => void): this;
		public on(event: 'shardReady', listener: (shardID: number) => void): this;
		public on(event: 'typingStart' | 'typingStop', listener: (channel: PartialChannel<ThisGroup<s, this>>, user: ThisGroup<s, this>["User"]) => void): this;
		public on(event: 'userUpdate', listener: (oldUser: ThisGroup<s, this>["User"], newUser: ThisGroup<s, this>["User"]) => void): this;
		public on(event: 'voiceStateUpdate', listener: (oldState: ThisGroup<s, this>["VoiceState"] | undefined, newState: ThisGroup<s, this>["VoiceState"]) => void): this;
		public on(event: 'webhookUpdate', listener: (channel: ThisGroup<s, this>["TextChannel"]) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'channelCreate' | 'channelDelete', listener: (channel: PartialChannel<ThisGroup<s, this>>) => void): this;
		public once(event: 'channelPinsUpdate', listener: (channel: PartialChannel<ThisGroup<s, this>>, time: Date) => void): this;
		public once(event: 'channelUpdate', listener: (oldChannel: PartialChannel<ThisGroup<s, this>>, newChannel: PartialChannel<ThisGroup<s, this>>) => void): this;
		public once(event: 'debug' | 'warn', listener: (info: string) => void): this;
		public once(event: 'disconnect', listener: (event: any, shardID: number) => void): this;
		public once(event: 'emojiCreate' | 'emojiDelete', listener: (emoji: ThisGroup<s, this>["GuildEmoji"]) => void): this;
		public once(event: 'emojiUpdate', listener: (oldEmoji: ThisGroup<s, this>["GuildEmoji"], newEmoji: ThisGroup<s, this>["GuildEmoji"]) => void): this;
		public once(event: 'error', listener: (error: Error) => void): this;
		public once(event: 'guildBanAdd' | 'guildBanRemove', listener: (guild: ThisGroup<s, this>["Guild"], user: ThisGroup<s, this>["User"]) => void): this;
		public once(event: 'guildCreate' | 'guildDelete' | 'guildUnavailable', listener: (guild: ThisGroup<s, this>["Guild"]) => void): this;
		public once(event: 'guildMemberAdd' | 'guildMemberAvailable' | 'guildMemberRemove', listener: (member: ThisGroup<s, this>["GuildMember"]) => void): this;
		public once(event: 'guildMembersChunk', listener: (members: Collection<Snowflake, ThisGroup<s, this>["GuildMember"]>, guild: ThisGroup<s, this>["Guild"]) => void): this;
		public once(event: 'guildMemberSpeaking', listener: (member: ThisGroup<s, this>["GuildMember"], speaking: Readonly<Speaking>) => void): this;
		public once(event: 'guildMemberUpdate', listener: (oldMember: ThisGroup<s, this>["GuildMember"], newMember: ThisGroup<s, this>["GuildMember"]) => void): this;
		public once(event: 'guildUpdate', listener: (oldGuild: ThisGroup<s, this>["Guild"], newGuild: ThisGroup<s, this>["Guild"]) => void): this;
		public once(event: 'guildIntegrationsUpdate', listener: (guild: ThisGroup<s, this>["Guild"]) => void): this;
		public once(event: 'message' | 'messageDelete' | 'messageReactionRemoveAll', listener: (message: ThisGroup<s, this>["Message"]) => void): this;
		public once(event: 'messageDeleteBulk', listener: (messages: Collection<Snowflake, ThisGroup<s, this>["Message"]>) => void): this;
		public once(event: 'messageReactionAdd' | 'messageReactionRemove', listener: (messageReaction: ThisGroup<s, this>["MessageReaction"], user: ThisGroup<s, this>["User"]) => void): this;
		public once(event: 'messageUpdate', listener: (oldMessage: ThisGroup<s, this>["Message"], newMessage: ThisGroup<s, this>["Message"]) => void): this;
		public once(event: 'presenceUpdate', listener: (oldPresence: ThisGroup<s, this>["Presence"] | undefined, newPresence: ThisGroup<s, this>["Presence"]) => void): this;
		public once(event: 'rateLimit', listener: (rateLimitData: RateLimitData) => void): this;
		public once(event: 'ready', listener: () => void): this;
		public once(event: 'reconnecting', listener: (shardID: number) => void): this;
		public once(event: 'resumed', listener: (replayed: number, shardID: number) => void): this;
		public once(event: 'roleCreate' | 'roleDelete', listener: (role: ThisGroup<s, this>["Role"]) => void): this;
		public once(event: 'roleUpdate', listener: (oldRole: ThisGroup<s, this>["Role"], newRole: ThisGroup<s, this>["Role"]) => void): this;
		public once(event: 'shardReady', listener: (shardID: number) => void): this;
		public once(event: 'typingStart' | 'typingStop', listener: (channel: PartialChannel<ThisGroup<s, this>>, user: ThisGroup<s, this>["User"]) => void): this;
		public once(event: 'userUpdate', listener: (oldUser: ThisGroup<s, this>["User"], newUser: ThisGroup<s, this>["User"]) => void): this;
		public once(event: 'voiceStateUpdate', listener: (oldState: ThisGroup<s, this>["VoiceState"] | undefined, newState: ThisGroup<s, this>["VoiceState"]) => void): this;
		public once(event: 'webhookUpdate', listener: (channel: ThisGroup<s, this>["TextChannel"]) => void): this;
		public once(event: string, listener: Function): this;
	}
	export class ClientApplication<S extends StructureGroup = StructureGroup> extends Base<S> {
		constructor(client: S["Client"], data: object);
		public botPublic?: boolean;
		public botRequireCodeGrant?: boolean;
		public cover?: string;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public description: string;
		public icon: string;
		public id: Snowflake;
		public name: string;
		public owner?: S["User"];
		public rpcOrigins: string[];
		public coverImage(options?: AvatarOptions): string;
		public fetchAssets(): Promise<ClientApplicationAsset>;
		public iconURL(options?: AvatarOptions): string;
		public toJSON(): object;
		public toString(): string;
	}

	export interface ActivityOptions {
		name?: string;
		url?: string;
		type?: ActivityType | number;
		shardID?: number | number[];
	}

	export class ClientUser<S extends StructureGroup = StructureGroup> extends User<S> {
		public mfaEnabled: boolean;
		public verified: boolean;
		public setActivity(options?: ActivityOptions): Promise<S["Presence"]>;
		public setActivity(name: string, options?: ActivityOptions): Promise<S["Presence"]>;
		public setAFK(afk: boolean): Promise<S["Presence"]>;
		public setAvatar(avatar: BufferResolvable | Base64Resolvable): Promise<this>;
		public setPresence(data: PresenceData): Promise<S["Presence"]>;
		public setStatus(status: PresenceStatusData, shardID?: number | number[]): Promise<S["Presence"]>;
		public setUsername(username: string): Promise<this>;
	}

	export class Collection<K, V> extends Map<K, V> {
		private _array: V[];
		private _keyArray: K[];

		public array(): V[];
		public clone(): Collection<K, V>;
		public concat(...collections: Collection<K, V>[]): Collection<K, V>;
		public each(fn: (value: V, key: K, collection: Collection<K, V>) => void, thisArg?: any): Collection<K, V>;
		public equals(collection: Collection<any, any>): boolean;
		public every(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): boolean;
		public filter(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): Collection<K, V>;
		public find(fn: (value: V, key: K, collection: Collection<K, V>) => boolean): V;
		public findKey(fn: (value: V, key: K, collection: Collection<K, V>) => boolean): K;
		public first(): V | undefined;
		public first(count: number): V[];
		public firstKey(): K | undefined;
		public firstKey(count: number): K[];
		public keyArray(): K[];
		public last(): V | undefined;
		public last(count: number): V[];
		public lastKey(): K | undefined;
		public lastKey(count: number): K[];
		public map<T>(fn: (value: V, key: K, collection: Collection<K, V>) => T, thisArg?: any): T[];
		public partition(fn: (value: V, key: K, collection: Collection<K, V>) => boolean): [Collection<K, V>, Collection<K, V>];
		public random(): V | undefined;
		public random(count: number): V[];
		public randomKey(): K | undefined;
		public randomKey(count: number): K[];
		public reduce<T>(fn: (accumulator: any, value: V, key: K, collection: Collection<K, V>) => T, initialValue?: any): T;
		public some(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): boolean;
		public sort(compareFunction?: (a: V, b: V, c?: K, d?: K) => number): Collection<K, V>;
		public sweep(fn: (value: V, key: K, collection: Collection<K, V>) => boolean, thisArg?: any): number;
		public tap(fn: (collection: Collection<K, V>) => void, thisArg?: any): Collection<K, V>;
		public toJSON(): object;
	}

	export abstract class Collector<K, V, S extends StructureGroup = StructureGroup> extends EventEmitter {
		constructor(client: S["Client"], filter: CollectorFilter, options?: CollectorOptions);
		private _timeout: NodeJS.Timer;

		public readonly client: S["Client"];
		public collected: Collection<K, V>;
		public ended: boolean;
		public filter: CollectorFilter;
		public readonly next: Promise<V>;
		public options: CollectorOptions;
		public checkEnd(): void;
		public handleCollect(...args: any[]): void;
		public handleDispose(...args: any[]): void;
		public stop(reason?: string): void;
		public toJSON(): object;

		protected listener: Function;
		public abstract collect(...args: any[]): K;
		public abstract dispose(...args: any[]): K;
		public abstract endReason(): void;

		public on(event: 'collect', listener: (...args: any[]) => void): this;
		public on(event: 'dispose', listener: (...args: any[]) => void): this;
		public on(event: 'end', listener: (collected: Collection<K, V>, reason: string) => void): this;

		public once(event: 'collect', listener: (...args: any[]) => void): this;
		public once(event: 'dispose', listener: (...args: any[]) => void): this;
		public once(event: 'end', listener: (collected: Collection<K, V>, reason: string) => void): this;
	}

	export class DataResolver {
		public static resolveBase64(data: Base64Resolvable): string;
		public static resolveFile(resource: BufferResolvable | Stream): Promise<Buffer>;
		public static resolveImage(resource: BufferResolvable | Base64Resolvable): Promise<string>;
		public static resolveInviteCode(data: InviteResolvable): string;
	}

	export class DiscordAPIError extends Error {
		constructor(path: string, error: object, method: string);
		private static flattenErrors(obj: object, key: string): string[];

		public code: number;
		public method: string;
		public path: string;
	}

	export class DMChannel<S extends StructureGroup = StructureGroup> extends PartialChannel<S> {
		constructor(client: S["Client"], data?: object);
		public messages: MessageStore<S>;
		public recipient: S["User"];
		public readonly partial: boolean;
	}
	interface DMChannel<S extends StructureGroup = StructureGroup> extends TextBasedChannelFields<S> {}

	export class Emoji<S extends StructureGroup = StructureGroup> extends Base<S> {
		constructor(client: S["Client"], emoji: object);
		public animated: boolean;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public readonly deletable: boolean;
		public id: Snowflake;
		public name: string;
		public readonly identifier: string;
		public readonly url: string;
		public toJSON(): object;
		public toString(): string;
	}

	export class Guild<S extends StructureGroup = StructureGroup> extends Base<S> {
		constructor(client: S["Client"], data: object);
		private _sortedRoles(): Collection<Snowflake, S["Role"]>;
		private _sortedChannels(channel: PartialChannel<S>): Collection<Snowflake, S["GuildChannel"]>;
		private _memberSpeakUpdate(user: Snowflake, speaking: boolean): void;

		protected setup(data: any): void;

		public readonly afkChannel: S["VoiceChannel"];
		public afkChannelID: Snowflake;
		public afkTimeout: number;
		public applicationID: Snowflake;
		public available: boolean;
		public channels: GuildChannelStore<S>;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public defaultMessageNotifications: DefaultMessageNotifications | number;
		public readonly defaultRole: S["Role"];
		public deleted: boolean;
		public embedEnabled: boolean;
		public emojis: GuildEmojiStore<S>;
		public explicitContentFilter: number;
		public features: GuildFeatures[];
		public icon: string;
		public id: Snowflake;
		public readonly joinedAt: Date;
		public joinedTimestamp: number;
		public large: boolean;
		public readonly me: S["GuildMember"];
		public memberCount: number;
		public members: GuildMemberStore<S>;
		public mfaLevel: number;
		public name: string;
		public readonly nameAcronym: string;
		public readonly owner: S["GuildMember"];
		public ownerID: Snowflake;
		public presences: PresenceStore<S>;
		public region: string;
		public roles: RoleStore<S>;
		public readonly shard: WebSocketShard<S>;
		public shardID: number;
		public splash: string;
		public readonly systemChannel: S["TextChannel"];
		public systemChannelID: Snowflake;
		public verificationLevel: number;
		public readonly verified: boolean;
		public readonly voiceConnection: VoiceConnection<S>;
		public addMember(user: UserResolvable<S>, options: AddGuildMemberOptions<S>): Promise<S["GuildMember"]>;
		public createIntegration(data: IntegrationData, reason?: string): Promise<this>;
		public delete(): Promise<this>;
		public edit(data: GuildEditData<S>, reason?: string): Promise<this>;
		public equals(guild: this): boolean;
		public fetchAuditLogs(options?: GuildAuditLogsFetchOptions<S>): Promise<GuildAuditLogs<S>>;
		public fetchBans(): Promise<Collection<Snowflake, { user: S["User"], reason: string }>>;
		public fetchIntegrations(): Promise<Collection<string, Integration<S>>>;
		public fetchInvites(): Promise<Collection<string, Invite<S>>>;
		public fetchVanityCode(): Promise<string>;
		public fetchVoiceRegions(): Promise<Collection<string, VoiceRegion>>;
		public fetchWebhooks(): Promise<Collection<Snowflake, Webhook<S>>>;
		public fetchEmbed(): Promise<GuildEmbedData<S>>;
		public iconURL(options?: AvatarOptions): string;
		public leave(): Promise<this>;
		public member(user: UserResolvable<S>): S["GuildMember"];
		public setAFKChannel(afkChannel: ChannelResolvable<S>, reason?: string): Promise<this>;
		public setAFKTimeout(afkTimeout: number, reason?: string): Promise<this>;
		public setChannelPositions(channelPositions: ChannelPosition<S>[]): Promise<this>;
		public setDefaultMessageNotifications(defaultMessageNotifications: DefaultMessageNotifications | number, reason?: string): Promise<this>;
		public setExplicitContentFilter(explicitContentFilter: number, reason?: string): Promise<this>;
		public setIcon(icon: Base64Resolvable, reason?: string): Promise<this>;
		public setName(name: string, reason?: string): Promise<this>;
		public setOwner(owner: GuildMemberResolvable<S>, reason?: string): Promise<this>;
		public setRegion(region: string, reason?: string): Promise<this>;
		public setSplash(splash: Base64Resolvable, reason?: string): Promise<this>;
		public setSystemChannel(systemChannel: ChannelResolvable<S>, reason?: string): Promise<this>;
		public setVerificationLevel(verificationLevel: number, reason?: string): Promise<this>;
		public setEmbed(embed: GuildEmbedData<S>, reason?: string): Promise<this>;
		public splashURL(options?: AvatarOptions): string;
		public toJSON(): object;
		public toString(): string;
	}

	export class GuildAuditLogs<S extends StructureGroup = StructureGroup> {
		constructor(guild: S["Guild"], data: object);
		private webhooks: Collection<Snowflake, Webhook<S>>;

		public entries: Collection<Snowflake, GuildAuditLogsEntry<S>>;

		public static Actions: GuildAuditLogsActions;
		public static Targets: GuildAuditLogsTargets;
		public static Entry: typeof GuildAuditLogsEntry;
		public static actionType(action: number): GuildAuditLogsActionType;
		public static build<S extends StructureGroup>(...args: GuildAuditLogs<S> extends new(...args: infer U) => any ? U : never): Promise<GuildAuditLogs<S>>;
		public static targetType(target: number): GuildAuditLogsTarget;
		public toJSON(): object;
	}

	class GuildAuditLogsEntry<S extends StructureGroup = StructureGroup> {
		constructor(logs: GuildAuditLogs<S>, guild: S["Guild"], data: object);
		public action: GuildAuditLogsAction;
		public actionType: GuildAuditLogsActionType;
		public changes: AuditLogChange[];
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public executor: S["User"];
		public extra: object | S["Role" | "GuildMember"];
		public id: Snowflake;
		public reason: string;
		public target: S["Guild" | "User" | "Role" | "GuildEmoji"] | Invite<S> | Webhook<S>;
		public targetType: GuildAuditLogsTarget;
		public toJSON(): object;
	}

	export class GuildChannel<S extends StructureGroup = StructureGroup> extends PartialChannel<S> {
		constructor(guild: S["Guild"], data?: object);
		private memberPermissions(member: S["GuildMember"]): Readonly<Permissions>;
		private rolePermissions(role: S["Role"]): Readonly<Permissions>;

		public readonly calculatedPosition: number;
		public readonly deletable: boolean;
		public guild: S["Guild"];
		public readonly manageable: boolean;
		public name: string;
		public readonly parent: S["CategoryChannel"];
		public parentID: Snowflake;
		public permissionOverwrites: Collection<Snowflake, PermissionOverwrites<S>>;
		public readonly permissionsLocked: boolean;
		public readonly position: number;
		public rawPosition: number;
		public readonly viewable: boolean;
		public clone(options?: GuildChannelCloneOptions<S>): Promise<this>;
		public createInvite(options?: InviteOptions): Promise<Invite<S>>;
		public createOverwrite(userOrRole: RoleResolvable<S> | UserResolvable<S>, options: PermissionOverwriteOption, reason?: string): Promise<this>;
		public edit(data: ChannelData<S>, reason?: string): Promise<this>;
		public equals(channel: this): boolean;
		public fetchInvites(): Promise<Collection<string, Invite<S>>>;
		public lockPermissions(): Promise<this>;
		public overwritePermissions(options?: { permissionOverwrites?: OverwriteResolvable<S>[] | Collection<Snowflake, OverwriteResolvable<S>>, reason?: string }): Promise<this>;
		public permissionsFor(memberOrRole: GuildMemberResolvable<S> | RoleResolvable<S>): Readonly<Permissions> | null;
		public setName(name: string, reason?: string): Promise<this>;
		public setParent(channel: this | Snowflake, options?: { lockPermissions?: boolean, reason?: string }): Promise<this>;
		public setPosition(position: number, options?: { relative?: boolean, reason?: string }): Promise<this>;
		public setTopic(topic: string, reason?: string): Promise<this>;
		public updateOverwrite(userOrRole: RoleResolvable<S> | UserResolvable<S>, options: PermissionOverwriteOption, reason?: string): Promise<this>;
	}

	export class GuildEmoji<S extends StructureGroup = StructureGroup> extends Emoji<S> {
		constructor(client: S['Client'], data: object, guild: S["Guild"]);
		private _roles: string[];

		public deleted: boolean;
		public guild: S["Guild"];
		public managed: boolean;
		public requiresColons: boolean;
		public roles: GuildEmojiRoleStore<S>;
		public delete(reason?: string): Promise<this>;
		public edit(data: GuildEmojiEditData<S>, reason?: string): Promise<this>;
		public equals(other: this | object): boolean;
		public fetchAuthor(): Promise<S["User"]>;
		public setName(name: string, reason?: string): Promise<this>;
	}

	export class GuildMember<S extends StructureGroup = StructureGroup> extends Base<S> {
		constructor(client: S["Client"], data: object, guild: S["Guild"]);
		public readonly bannable: boolean;
		public deleted: boolean;
		public readonly displayColor: number;
		public readonly displayHexColor: string;
		public readonly displayName: string;
		public guild: S["Guild"];
		public readonly id: Snowflake;
		public readonly joinedAt: Date;
		public joinedTimestamp: number;
		public readonly kickable: boolean;
		public readonly manageable: boolean;
		public nickname: string;
		public readonly partial: boolean;
		public readonly permissions: Readonly<Permissions>;
		public readonly presence: S["Presence"];
		public roles: GuildMemberRoleStore<S>;
		public user: S["User"];
		public readonly voice: S["VoiceState"];
		public ban(options?: BanOptions): Promise<this>;
		public fetch(): Promise<this>;
		public createDM(): Promise<S["DMChannel"]>;
		public deleteDM(): Promise<S["DMChannel"]>;
		public edit(data: GuildMemberEditData<S>, reason?: string): Promise<this>;
		public hasPermission(permission: PermissionResolvable, options?: { checkAdmin?: boolean; checkOwner?: boolean }): boolean;
		public kick(reason?: string): Promise<this>;
		public permissionsIn(channel: ChannelResolvable<S>): Readonly<Permissions>;
		public setDeaf(deaf: boolean, reason?: string): Promise<this>;
		public setMute(mute: boolean, reason?: string): Promise<this>;
		public setNickname(nickname: string, reason?: string): Promise<this>;
		public setVoiceChannel(voiceChannel: ChannelResolvable<S>): Promise<this>;
		public toJSON(): object;
		public toString(): string;
	}
	interface GuildMember<S extends StructureGroup = StructureGroup> extends PartialTextBasedChannelFields<S> {}

	export class Integration<S extends StructureGroup = StructureGroup> extends Base<S> {
		constructor(client: S['Client'], data: object, guild: S["Guild"]);
		public account: IntegrationAccount;
		public enabled: boolean;
		public expireBehavior: number;
		public expireGracePeriod: number;
		public guild: S["Guild"];
		public id: Snowflake;
		public name: string;
		public role: S["Role"];
		public syncedAt: number;
		public syncing: boolean;
		public type: number;
		public user: S["User"];
		public delete(reason?: string): Promise<this>;
		public edit(data: IntegrationEditData, reason?: string): Promise<this>;
		public sync(): Promise<this>;
	}

	export class HTTPError extends Error {
		constructor(message: string, name: string, code: number, method: string, path: string);
		public code: number;
		public method: string;
		public name: string;
		public path: string;
	}

	export class Invite<S extends StructureGroup = StructureGroup> extends Base<S> {
		constructor(client: S["Client"], data: object);
		public channel: S["GuildChannel"];
		public code: string;
		public readonly createdAt: Date;
		public createdTimestamp: number;
		public readonly expiresAt: Date;
		public readonly expiresTimestamp: number;
		public guild: S["Guild"];
		public inviter: S["User"];
		public maxAge: number;
		public maxUses: number;
		public memberCount: number;
		public presenceCount: number;
		public temporary: boolean;
		public readonly url: string;
		public uses: number;
		public delete(reason?: string): Promise<this>;
		public toJSON(): object;
		public toString(): string;
	}
	// Needs to be split into Private/Guild message
	export class Message<S extends StructureGroup = StructureGroup, T extends TextableChannel<S> = TextableChannel<S>> extends Base<S> {
		constructor(client: S['Client'], data: object, channel: T);
		private _edits: this[];
		private patch(data: object): void;

		public activity: GroupActivity;
		public application: ClientApplication<S>;
		public attachments: Collection<Snowflake, MessageAttachment>;
		public author: S["User"];
		public channel: T;
		public readonly cleanContent: string;
		public content: string;
		public readonly createdAt: Date;
		public createdTimestamp: number;
		public readonly deletable: boolean;
		public deleted: boolean;
		public readonly editable: boolean;
		public readonly editedAt: Date;
		public editedTimestamp: number;
		public readonly edits: this[];
		public embeds: MessageEmbed[];
		public readonly guild?: S["Guild"];
		public id: Snowflake;
		public readonly member?: S["GuildMember"];
		public mentions: MessageMentions<S>;
		public nonce: string;
		public readonly partial: boolean;
		public readonly pinnable: boolean;
		public pinned: boolean;
		public reactions: ReactionStore<S>;
		public system: boolean;
		public tts: boolean;
		public type: MessageType;
		public readonly url: string;
		public webhookID: Snowflake;
		public awaitReactions(filter: CollectorFilter, options?: AwaitReactionsOptions): Promise<Collection<Snowflake, S["MessageReaction"]>>;
		public createReactionCollector(filter: CollectorFilter, options?: ReactionCollectorOptions): ReactionCollector<S>;
		public delete(options?: { timeout?: number, reason?: string }): Promise<this>;
		public edit(content: StringResolvable, options?: MessageEditOptions | MessageEmbed): Promise<this>;
		public edit(options: MessageEditOptions | MessageEmbed | APIMessage<S>): Promise<this>;
		public equals(message: this, rawData: object): boolean;
		public fetchWebhook(): Promise<Webhook<S>>;
		public fetch(): Promise<this>;
		public pin(): Promise<this>;
		public react(emoji: EmojiIdentifierResolvable<S>): Promise<S["MessageReaction"]>;
		public reply(content?: StringResolvable, options?: MessageOptions<S> | MessageAdditions): Promise<this | this[]>;
		public reply(options?: MessageOptions<S> | MessageAdditions | APIMessage<S>): Promise<this | this[]>;
		public toJSON(): object;
		public toString(): string;
		public unpin(): Promise<this>;
	}

	export class MessageAttachment {
		constructor(attachment: BufferResolvable | Stream, name?: string, data?: object);

		public attachment: BufferResolvable | Stream;
		public height: number;
		public id: Snowflake;
		public name?: string;
		public proxyURL: string;
		public size: number;
		public url: string;
		public width: number;
		public setFile(attachment: BufferResolvable | Stream, name?: string): this;
		public setName(name: string): this;
		public toJSON(): object;
	}

	export class MessageCollector<S extends StructureGroup = StructureGroup, T extends S["TextChannel"] | S["DMChannel"] = S["TextChannel"] | S["DMChannel"]> extends Collector<Snowflake, S["Message"], S> {
		constructor(channel: T, filter: CollectorFilter, options?: MessageCollectorOptions);
		public channel: T;
		public options: MessageCollectorOptions;
		public received: number;

		public collect(message: S["Message"]): Snowflake;
		public dispose(message: S["Message"]): Snowflake;
		public endReason(): string;
	}

	export class MessageEmbed {
		constructor(data?: MessageEmbed | MessageEmbedOptions);
		private _apiTransform(): MessageEmbedOptions;

		public author: { name?: string; url?: string; iconURL?: string; proxyIconURL?: string };
		public color: number;
		public readonly createdAt: Date;
		public description: string;
		public fields: EmbedField[];
		public files: (MessageAttachment | string | FileOptions)[];
		public footer: { text?: string; iconURL?: string; proxyIconURL?: string };
		public readonly hexColor: string;
		public image: { url: string; proxyURL?: string; height?: number; width?: number; };
		public readonly length: number;
		public provider: { name: string; url: string; };
		public thumbnail: { url: string; proxyURL?: string; height?: number; width?: number; };
		public timestamp: number;
		public title: string;
		public type: string;
		public url: string;
		public readonly video: { url?: string; proxyURL?: string; height?: number; width?: number };
		public addBlankField(inline?: boolean): this;
		public addField(name: StringResolvable, value: StringResolvable, inline?: boolean): this;
		public attachFiles(file: (MessageAttachment | FileOptions | string)[]): this;
		public setAuthor(name: StringResolvable, iconURL?: string, url?: string): this;
		public setColor(color: ColorResolvable): this;
		public setDescription(description: StringResolvable): this;
		public setFooter(text: StringResolvable, iconURL?: string): this;
		public setImage(url: string): this;
		public setThumbnail(url: string): this;
		public setTimestamp(timestamp?: Date | number): this;
		public setTitle(title: StringResolvable): this;
		public setURL(url: string): this;
		public spliceField(index: number, deleteCount: number, name?: StringResolvable, value?: StringResolvable, inline?: boolean): this;
		public toJSON(): object;

		public static checkField(name: StringResolvable, value: StringResolvable, inline?: boolean): Required<EmbedField>;
	}

	// Another class that suffer from lack of proper separation of guilds
	export class MessageMentions<S extends StructureGroup = StructureGroup, M extends S["Message"] = S["Message"], G extends M['guild'] = M['guild']> {
		constructor(message: M, users: object[] | Collection<Snowflake, S["User"]>, roles: Snowflake[] | Collection<Snowflake, S["Role"]>, everyone: boolean);
		private _channels: Collection<Snowflake, S["GuildChannel"]>;
		private readonly _content: M;
		private _members: Collection<Snowflake, S["GuildMember"]>

		public readonly channels: Collection<Snowflake, S["TextChannel"]>;
		public readonly client: S["Client"];
		public everyone: boolean;
		public readonly guild: G;
		public has(data: S["User" | "Role" | "GuildMember" | "GuildChannel"], options?: {
			ignoreDirect?: boolean;
			ignoreRoles?: boolean;
			ignoreEveryone?: boolean;
		}): boolean;
		public readonly members: Collection<Snowflake, S["GuildMember"]>;
		public roles: Collection<Snowflake, S["Role"]>;
		public users: Collection<Snowflake, S["User"]>;
		public toJSON(): object;

		public static CHANNELS_PATTERN: RegExp;
		public static EVERYONE_PATTERN: RegExp;
		public static ROLES_PATTERN: RegExp;
		public static USERS_PATTERN: RegExp;
	}

	export class MessageReaction<S extends StructureGroup = StructureGroup, M extends S["Message"] = S["Message"]> {
		constructor(client: S['Client'], data: object, message: M);
		private _emoji: S["GuildEmoji"] | ReactionEmoji<S>;

		public count: number;
		public readonly emoji: S["GuildEmoji"] | ReactionEmoji<S>;
		public me: boolean;
		public message: M;
		public users: ReactionUserStore<S>;
		public toJSON(): object;
	}

	export class PermissionOverwrites<S extends StructureGroup = StructureGroup> {
		constructor(guildChannel: S["GuildChannel"], data?: object);
		public allow: Readonly<Permissions>;
		public readonly channel: S["GuildChannel"];
		public deny: Readonly<Permissions>;
		public id: Snowflake;
		public type: OverwriteType;
		public update(options: PermissionOverwriteOption, reason?: string): Promise<this>;
		public delete(reason?: string): Promise<this>;
		public toJSON(): object;
		public static resolveOverwriteOptions(options: ResolvedOverwriteOptions, initialPermissions: { allow?: PermissionResolvable, deny?: PermissionResolvable }): ResolvedOverwriteOptions;
		public static resolve<G extends StructureGroup["Guild"]>(overwrite: OverwriteResolvable, guild: G): RawOverwriteData;
	}

	export class Permissions extends BitField<PermissionString> {
		public has(permission: PermissionResolvable, checkAdmin?: boolean): boolean;

		public static ALL: number;
		public static DEFAULT: number;
		public static FLAGS: PermissionFlags;
		public static resolve(permission?: PermissionResolvable): number;
	}

	export class Presence<S extends StructureGroup = StructureGroup> {
		constructor(client: S["Client"], data?: object);
		public activity: Activity;
		public flags: Readonly<ActivityFlags>;
		public status: PresenceStatus;
		public clientStatus: ClientPresenceStatusData;
		public readonly user: S["User"];
		public readonly member?: S["GuildMember"];
		public equals(presence: this): boolean;
	}

	export class ReactionCollector<S extends StructureGroup = StructureGroup, M extends S["Message"] = S["Message"]> extends Collector<Snowflake, S["MessageReaction"], S> {
		constructor(message: M, filter: CollectorFilter, options?: ReactionCollectorOptions);
		public message: M;
		public options: ReactionCollectorOptions;
		public total: number;
		public users: Collection<Snowflake, S["User"]>;

		public static key(reaction: MessageReaction): Snowflake | string;

		public collect(reaction: S["MessageReaction"]): Snowflake | string;
		public dispose(reaction: S["MessageReaction"], user: S["User"]): Snowflake | string;
		public empty(): void;
		public endReason(): string;

		public on(event: 'collect', listener: (reaction: S['MessageReaction'], user: S['User']) => void): this;
		public on(event: 'dispose', listener: (reaction: S['MessageReaction'], user: S['User']) => void): this;
		public on(event: 'end', listener: (collected: Collection<Snowflake, S['MessageReaction']>, reason: string) => void): this;
		public on(event: 'remove', listener: (reaction: S['MessageReaction'], user: S["User"]) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'collect', listener: (reaction: S['MessageReaction'], user: S['User']) => void): this;
		public once(event: 'dispose', listener: (reaction: S['MessageReaction'], user: S['User']) => void): this;
		public once(event: 'end', listener: (collected: Collection<Snowflake, S['MessageReaction']>, reason: string) => void): this;
		public once(event: 'remove', listener: (reaction: S["MessageReaction"], user: S['User']) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class ReactionEmoji<S extends StructureGroup = StructureGroup> extends Emoji<S> {
		constructor(reaction: S["MessageReaction"], emoji: object);
		public reaction: S["MessageReaction"];
		public toJSON(): object;
	}

	export class RichPresenceAssets {
		constructor(activity: Activity, assets: object);
		public largeImage: Snowflake;
		public largeText: string;
		public smallImage: Snowflake;
		public smallText: string;
		public largeImageURL(options: AvatarOptions): string;
		public smallImageURL(options: AvatarOptions): string;
	}

	export class Role<S extends StructureGroup = StructureGroup> extends Base<S> {
		constructor(client: S['Client'], data: object, guild: S["Guild"]);
		public color: number;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public deleted: boolean;
		public readonly editable: boolean;
		public guild: S["Guild"];
		public readonly hexColor: string;
		public hoist: boolean;
		public id: Snowflake;
		public managed: boolean;
		public readonly members: Collection<Snowflake, S["GuildMember"]>;
		public mentionable: boolean;
		public name: string;
		public permissions: Readonly<Permissions>;
		public readonly position: number;
		public rawPosition: number;
		public comparePositionTo(role: this): number;
		public delete(reason?: string): Promise<this>;
		public edit(data: RoleData, reason?: string): Promise<this>;
		public equals(role: this): boolean;
		public permissionsIn(channel: ChannelResolvable<S>): Readonly<Permissions>;
		public setColor(color: ColorResolvable, reason?: string): Promise<this>;
		public setHoist(hoist: boolean, reason?: string): Promise<this>;
		public setMentionable(mentionable: boolean, reason?: string): Promise<this>;
		public setName(name: string, reason?: string): Promise<this>;
		public setPermissions(permissions: PermissionResolvable, reason?: string): Promise<this>;
		public setPosition(position: number, options?: { relative?: boolean; reason?: string }): Promise<this>;
		public toJSON(): object;
		public toString(): string;

		public static comparePositions(role1: Role, role2: Role): number;
	}

	export class Shard<S extends StructureGroup = StructureGroup> extends EventEmitter {
		constructor(manager: ShardingManager<S>, id: number);
		private _evals: Map<string, Promise<any>>;
		private _exitListener: Function;
		private _fetches: Map<string, Promise<any>>;
		private _handleExit(respawn?: boolean): void;
		private _handleMessage(message: any): void;

		public args: string[];
		public execArgv: string[];
		public env: object;
		public id: number;
		public manager: ShardingManager<S>;
		public process: ChildProcess;
		public ready: boolean;
		public worker: any;
		public eval(script: string): Promise<any>;
		public eval<T>(fn: (client: S["Client"]) => T): Promise<T[]>;
		public fetchClientValue(prop: string): Promise<any>;
		public kill(): void;
		public respawn(delay?: number, waitForReady?: boolean): Promise<ChildProcess>;
		public send(message: any): Promise<Shard<S>>;
		public spawn(waitForReady?: boolean): Promise<ChildProcess>;

		public on(event: 'death', listener: (child: ChildProcess) => void): this;
		public on(event: 'disconnect' | 'ready' | 'reconnecting', listener: () => void): this;
		public on(event: 'error', listener: (error: Error) => void): this;
		public on(event: 'message', listener: (message: any) => void): this;
		public on(event: 'spawn', listener: (child: ChildProcess) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'death', listener: (child: ChildProcess) => void): this;
		public once(event: 'disconnect' | 'ready' | 'reconnecting', listener: () => void): this;
		public once(event: 'error', listener: (error: Error) => void): this;
		public once(event: 'message', listener: (message: any) => void): this;
		public once(event: 'spawn', listener: (child: ChildProcess) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class ShardClientUtil<S extends StructureGroup = StructureGroup> {
		constructor(client: S["Client"], mode: ShardingManagerMode);
		private _handleMessage(message: any): void;
		private _respond(type: string, message: any): void;

		public client: S["Client"];
		public readonly count: number;
		public readonly id: number | number[];
		public mode: ShardingManagerMode;
		public parentPort: any;
		public broadcastEval(script: string): Promise<any[]>;
		public broadcastEval<T>(fn: (client: S["Client"]) => T): Promise<T[]>;
		public fetchClientValues(prop: string): Promise<any[]>;
		public respawnAll(shardDelay?: number, respawnDelay?: number, waitForReady?: boolean): Promise<void>;
		public send(message: any): Promise<void>;

		public static singleton<S extends StructureGroup>(client: S["Client"], mode: ShardingManagerMode): ShardClientUtil<S>;
	}

	export class ShardingManager<S extends StructureGroup = StructureGroup> extends EventEmitter {
		constructor(file: string, options?: {
			totalShards?: number | 'auto';
			mode?: ShardingManagerMode;
			respawn?: boolean;
			shardArgs?: string[];
			token?: string;
			execArgv?: string[];
		});

		public file: string;
		public respawn: boolean;
		public shardArgs: string[];
		public shards: Collection<number, Shard<S>>;
		public token: string;
		public totalShards: number | 'auto';
		public broadcast(message: any): Promise<Shard<S>[]>;
		public broadcastEval(script: string): Promise<any[]>;
		public createShard(id: number): Shard<S>;
		public fetchClientValues(prop: string): Promise<any[]>;
		public respawnAll(shardDelay?: number, respawnDelay?: number, waitForReady?: boolean): Promise<Collection<number, Shard<S>>>;
		public spawn(amount?: number | 'auto', delay?: number, waitForReady?: boolean): Promise<Collection<number, Shard<S>>>;

		public on(event: 'shardCreate', listener: (shard: Shard<S>) => void): this;

		public once(event: 'shardCreate', listener: (shard: Shard<S>) => void): this;
	}

	export class SnowflakeUtil {
		public static deconstruct(snowflake: Snowflake): DeconstructedSnowflake;
		public static generate(timestamp?: number | Date): Snowflake;
	}

	const VolumeMixin: <T>(base: Constructable<T>) => Constructable<T & VolumeInterface>;

	class StreamDispatcher<B extends VoiceBroadcast = VoiceBroadcast> extends VolumeMixin(Writable) {
		constructor(player: object, options?: StreamOptions, streams?: { broadcast: B } & object);
		public player: object;
		public pausedSince: number;
		public broadcast: B;
		public readonly paused: boolean;
		public readonly pausedTime: boolean;
		public readonly streamTime: number;
		public readonly totalStreamTime: number;
		public readonly bitrateEditable: boolean;

		public setBitrate(value: number | 'auto'): boolean;
		public setPLP(value: number): boolean;
		public setFEC(enabled: boolean): boolean;
		public pause(silence?: boolean): void;
		public resume(): void;

		public on(event: 'close', listener: () => void): this;
		public on(event: 'debug', listener: (info: string) => void): this;
		public on(event: 'drain', listener: () => void): this;
		public on(event: 'end', listener: () => void): this;
		public on(event: 'error', listener: (err: Error) => void): this;
		public on(event: 'finish', listener: () => void): this;
		public on(event: 'pipe', listener: (src: Readable) => void): this;
		public on(event: 'start', listener: () => void): this;
		public on(event: 'speaking', listener: (speaking: boolean) => void): this;
		public on(event: 'unpipe', listener: (src: Readable) => void): this;
		public on(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'close', listener: () => void): this;
		public once(event: 'debug', listener: (info: string) => void): this;
		public once(event: 'drain', listener: () => void): this;
		public once(event: 'end', listener: () => void): this;
		public once(event: 'error', listener: (err: Error) => void): this;
		public once(event: 'finish', listener: () => void): this;
		public once(event: 'pipe', listener: (src: Readable) => void): this;
		public once(event: 'start', listener: () => void): this;
		public once(event: 'speaking', listener: (speaking: boolean) => void): this;
		public once(event: 'unpipe', listener: (src: Readable) => void): this;
		public on(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class Speaking extends BitField<SpeakingString> {
		public static FLAGS: Record<SpeakingString, number>;
		public static resolve(bit?: BitFieldResolvable<SpeakingString>): number;
	}

	export class Structures {
		static get<K extends keyof Extendable>(structure: K): Extendable[K];
		static get(structure: string): Function;
		static extend<K extends keyof Extendable, T extends Extendable[K]>(structure: K, extender: (baseClass: Extendable[K]) => T): T;
		static extend<T extends Function>(structure: string, extender: (baseClass: typeof Function) => T): T;
	}

	export class TextChannel<S extends StructureGroup = StructureGroup> extends GuildChannel<S> {
		constructor(guild: S["Guild"], data?: object);
		public readonly members: Collection<Snowflake, S["GuildMember"]>;
		public messages: MessageStore<S>;
		public nsfw: boolean;
		public rateLimitPerUser: number;
		public topic: string;
		public createWebhook(name: string, options?: { avatar?: BufferResolvable | Base64Resolvable, reason?: string }): Promise<Webhook<S>>;
		public setNSFW(nsfw: boolean, reason?: string): Promise<this>;
		public setRateLimitPerUser(rateLimitPerUser: number, reason?: string): Promise<this>;
		public fetchWebhooks(): Promise<Collection<Snowflake, Webhook<S>>>;
	}
	interface TextChannel<S extends StructureGroup = StructureGroup> extends TextBasedChannelFields<S> {}

	export class User<S extends StructureGroup = StructureGroup> extends Base<S> {
		constructor(client: S["Client"], data: object);
		public avatar: string;
		public bot: boolean;
		public readonly createdAt: Date;
		public readonly createdTimestamp: number;
		public discriminator: string;
		public readonly defaultAvatarURL: string;
		public readonly dmChannel: S["DMChannel"];
		public id: Snowflake;
		public locale: string;
		public readonly partial: boolean;
		public readonly presence: S["Presence"];
		public readonly tag: string;
		public username: string;
		public avatarURL(options?: AvatarOptions): string;
		public createDM(): Promise<S["DMChannel"]>;
		public deleteDM(): Promise<S["DMChannel"]>;
		public displayAvatarURL(options?: AvatarOptions): string;
		public equals(user: this): boolean;
		public fetch(): Promise<this>;
		public toString(): string;
		public typingDurationIn(channel: ChannelResolvable<S>): number;
		public typingIn(channel: ChannelResolvable<S>): boolean;
		public typingSinceIn(channel: ChannelResolvable<S>): Date;
	}
	interface User<S extends StructureGroup = StructureGroup> extends PartialTextBasedChannelFields<S> {}
	export class Util {
		public static basename(path: string, ext?: string): string;
		public static binaryToID(num: string): Snowflake;
		public static cleanContent(str: string, message: Message): string;
		public static cloneObject(obj: object): object;
		public static convertToBuffer(ab: ArrayBuffer | string): Buffer;
		public static delayFor(ms: number): Promise<void>;
		public static discordSort<K, V extends { rawPosition: number; id: string; }>(collection: Collection<K, V>): Collection<K, V>;
		public static escapeMarkdown(text: string, onlyCodeBlock?: boolean, onlyInlineCode?: boolean): string;
		public static fetchRecommendedShards(token: string, guildsPerShard?: number): Promise<number>;
		public static flatten(obj: object, ...props: { [key: string]: boolean | string }[]): object;
		public static idToBinary(num: Snowflake): string;
		public static makeError(obj: { name: string, message: string, stack: string }): Error;
		public static makePlainError(err: Error): { name: string, message: string, stack: string };
		public static mergeDefault(def: object, given: object): object;
		public static moveElementInArray(array: any[], element: any, newIndex: number, offset?: boolean): number;
		public static parseEmoji(text: string): { animated: boolean; name: string; id: string; };
		public static resolveColor(color: ColorResolvable): number;
		public static resolveString(data: StringResolvable): string;
		public static setPosition<T extends (PartialChannel | Role)>(
			item: T,
			position: number,
			relative: boolean,
			sorted: Collection<Snowflake, T>,
			route: object,
			reason?: string
		): Promise<{ id: Snowflake; position: number }[]>;
		public static splitMessage(text: string, options?: SplitOptions): string | string[];
		public static str2ab(str: string): ArrayBuffer;
	}

	class VoiceBroadcast<S extends StructureGroup = StructureGroup> extends EventEmitter {
		constructor(client: S["Client"]);
		public client: S["Client"];
		public readonly dispatcher: BroadcastDispatcher<S>;
		public play(input: string | Readable, options?: StreamOptions): BroadcastDispatcher<S>;

		public on(event: 'end', listener: () => void): this;
		public on(event: 'error', listener: (error: Error) => void): this;
		public on(event: 'subscribe', listener: (dispatcher: StreamDispatcher<this>) => void): this;
		public on(event: 'unsubscribe', listener: (dispatcher: StreamDispatcher<this>) => void): this;
		public on(event: 'warn', listener: (warning: string | Error) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'end', listener: () => void): this;
		public once(event: 'error', listener: (error: Error) => void): this;
		public once(event: 'subscribe', listener: (dispatcher: StreamDispatcher<this>) => void): this;
		public once(event: 'unsubscribe', listener: (dispatcher: StreamDispatcher<this>) => void): this;
		public once(event: 'warn', listener: (warning: string | Error) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class VoiceChannel<S extends StructureGroup = StructureGroup> extends GuildChannel<S> {
		constructor(guild: S["Guild"], data?: object);
		public bitrate: number;
		public readonly connection: VoiceConnection<S>;
		public readonly full: boolean;
		public readonly joinable: boolean;
		public readonly members: Collection<Snowflake, S["GuildMember"]>;
		public readonly speakable: boolean;
		public userLimit: number;
		public join(): Promise<VoiceConnection<S>>;
		public leave(): void;
		public setBitrate(bitrate: number, reason?: string): Promise<this>;
		public setUserLimit(userLimit: number, reason?: string): Promise<this>;
	}

	class VoiceConnection<S extends StructureGroup = StructureGroup> extends EventEmitter {
		constructor(voiceManager: object, channel: S["VoiceChannel"]);
		private authentication: object;
		private sockets: object;
		private ssrcMap: Map<number, boolean>;
		private _disconnect(): void;
		private authenticate(): void;
		private authenticateFailed(reason: string): void;
		private checkAuthenticated(): void;
		private cleanup(): void;
		private connect(): void;
		private onReady(data: object): void;
		private onSessionDescription(mode: string, secret: string): void;
		private onSpeaking(data: object): void;
		private reconnect(token: string, endpoint: string): void;
		private sendVoiceStateUpdate(options: object): void;
		private setSessionID(sessionID: string): void;
		private setSpeaking(value: BitFieldResolvable<SpeakingString>): void;
		private setTokenAndEndpoint(token: string, endpoint: string): void;
		private updateChannel(channel: S["VoiceChannel"]): void;

		public channel: S["VoiceChannel"];
		public readonly client: S["Client"];
		public player: object;
		public receiver: VoiceReceiver<S>;
		public speaking: Readonly<Speaking>;
		public status: VoiceStatus;
		public voiceManager: object;
		public disconnect(): void;
		public play<B extends VoiceBroadcast<S> = VoiceBroadcast<S>>(input: B | Readable | string, options?: StreamOptions): StreamDispatcher<B>;

		public on(event: 'authenticated', listener: () => void): this;
		public on(event: 'closing', listener: () => void): this;
		public on(event: 'debug', listener: (message: string) => void): this;
		public on(event: 'disconnect', listener: (error: Error) => void): this;
		public on(event: 'error', listener: (error: Error) => void): this;
		public on(event: 'failed', listener: (error: Error) => void): this;
		public on(event: 'newSession', listener: () => void): this;
		public on(event: 'ready', listener: () => void): this;
		public on(event: 'reconnecting', listener: () => void): this;
		public on(event: 'speaking', listener: (user: S["User"], speaking: Readonly<Speaking>) => void): this;
		public on(event: 'warn', listener: (warning: string | Error) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'authenticated', listener: () => void): this;
		public once(event: 'closing', listener: () => void): this;
		public once(event: 'debug', listener: (message: string) => void): this;
		public once(event: 'disconnect', listener: (error: Error) => void): this;
		public once(event: 'error', listener: (error: Error) => void): this;
		public once(event: 'failed', listener: (error: Error) => void): this;
		public once(event: 'newSession', listener: () => void): this;
		public once(event: 'ready', listener: () => void): this;
		public once(event: 'reconnecting', listener: () => void): this;
		public once(event: 'speaking', listener: (user: S["User"], speaking: Readonly<Speaking>) => void): this;
		public once(event: 'warn', listener: (warning: string | Error) => void): this;
		public once(event: string, listener: Function): this;
	}

	class VoiceReceiver<S extends StructureGroup = StructureGroup> extends EventEmitter {
		constructor(connection: VoiceConnection<S>);
		public createStream(user: UserResolvable<S>, options?: { mode?: 'opus' | 'pcm', end?: 'silence' | 'manual' }): Readable;

		public on(event: 'debug', listener: (error: Error | string) => void): this;
		public on(event: string, listener: Function): this;

		public once(event: 'debug', listener: (error: Error | string) => void): this;
		public once(event: string, listener: Function): this;
	}

	export class VoiceRegion {
		constructor(data: object);
		public custom: boolean;
		public deprecated: boolean;
		public id: string;
		public name: string;
		public optimal: boolean;
		public vip: boolean;
		public toJSON(): object;
	}

	export class VoiceState<S extends StructureGroup = StructureGroup> extends Base<S> {
		constructor(guild: S["Guild"], data: object);
		public readonly channel?: S["VoiceChannel"];
		public channelID?: Snowflake;
		public readonly deaf?: boolean;
		public guild: S["Guild"];
		public id: Snowflake;
		public readonly member: S["GuildMember"];
		public readonly mute?: boolean;
		public selfDeaf?: boolean;
		public selfMute?: boolean;
		public serverDeaf?: boolean;
		public serverMute?: boolean;
		public sessionID?: string;
		public readonly speaking?: boolean;

		public setDeaf(mute: boolean, reason?: string): Promise<S["GuildMember"]>;
		public setMute(mute: boolean, reason?: string): Promise<S["GuildMember"]>;
	}

	class VolumeInterface extends EventEmitter {
		constructor(options?: { volume?: number })
		public readonly volume: number;
		public readonly volumeDecibels: number;
		public readonly volumeEditable: boolean;
		public readonly volumeLogarithmic: number;
		public setVolume(volume: number): void;
		public setVolumeDecibels(db: number): void;
		public setVolumeLogarithmic(value: number): void;

		public on(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => void): this;

		public once(event: 'volumeChange', listener: (oldVolume: number, newVolume: number) => void): this;
	}

	export class Webhook<S extends StructureGroup = StructureGroup> {
		constructor(client: S["Client"], data?: object);
		public avatar: string;
		public channelID: Snowflake;
		public guildID: Snowflake;
		public name: string;
		public owner: S["User"] | object;
	}
	interface Webhook<S extends StructureGroup = StructureGroup> extends WebhookFields<S> {}
	
	export class WebhookClient {
		constructor(id: string, token: string, options?: ClientOptions);
	}
	interface WebhookClient<S extends StructureGroup = StructureGroup> extends WebhookFields<S> {}
	export class WebSocketManager<S extends StructureGroup = StructureGroup> {
		constructor(client: S["Client"]);
		public readonly client: S["Client"];
		public gateway: string | undefined;
		public readonly ping: number;
		public shards: Collection<number, WebSocketShard<S>>;
		public status: Status;

		public broadcast(packet: object): void;
	}

	export class WebSocketShard<S extends StructureGroup = StructureGroup> extends EventEmitter {
		constructor(manager: WebSocketManager<S>, id: number);
		public id: number;
		public readonly ping: number;
		public pings: number[];
		public status: Status;
		public manager: WebSocketManager<S>;

		public send(packet: object): void;

		public on(event: 'ready', listener: () => void): this;
		public once(event: 'ready', listener: () => void): this;
	}

//#endregion

//#region Stores

	export class ChannelStore<S extends StructureGroup = StructureGroup> extends DataStore<Snowflake, PartialChannel<S>, Constructable<PartialChannel<S>>, ChannelResolvable<S>, S> {
		constructor(client: S["Client"], iterable: Iterable<any>, options?: { lru: boolean });
		constructor(client: S["Client"], options?: { lru: boolean });
		public fetch(id: Snowflake, cache?: boolean): Promise<PartialChannel<S>>;
	}

	export class DataStore<K, V, VConstructor = Constructable<V>, R = any, S extends StructureGroup = StructureGroup> extends Collection<K, V> {
		constructor(client: S["Client"], iterable: Iterable<any>, holds: VConstructor);
		public static readonly [Symbol.species]: typeof Collection;
		public client: S["Client"];
		public holds: VConstructor;
		public add(data: any, cache?: boolean, { id, extras }?: { id: K, extras: any[] }): V;
		public remove(key: K): void;
		public resolve(resolvable: R): V;
		public resolveID(resolvable: R): K;
	}

	export class GuildEmojiRoleStore<S extends StructureGroup = StructureGroup> extends OverridableDataStore<Snowflake, S["Role"], Constructable<S["Role"]>, RoleResolvable<S>, S> {
		constructor(emoji: S["GuildEmoji"]);
		public add(roleOrRoles: RoleResolvable<S> | RoleResolvable<S>[] | Collection<Snowflake, S["Role"]>): Promise<S["GuildEmoji"]>;
		public set(roles: RoleResolvable<S>[] | Collection<Snowflake, S["Role"]>): Promise<S["GuildEmoji"]>;
		public remove(roleOrRoles: RoleResolvable<S> | RoleResolvable<S>[] | Collection<Snowflake, S["Role"]>): Promise<S["GuildEmoji"]>;
	}

	export class GuildEmojiStore<S extends StructureGroup = StructureGroup> extends DataStore<Snowflake, S["GuildEmoji"],Constructable<S["GuildEmoji"]>, EmojiResolvable<S>, S> {
		constructor(guild: S["Guild"], iterable?: Iterable<any>);
		public create(attachment: BufferResolvable | Base64Resolvable, name: string, options?: GuildEmojiCreateOptions<S>): Promise<S["GuildEmoji"]>;
		public resolveIdentifier(emoji: EmojiIdentifierResolvable<S>): string;
	}

	export class GuildChannelStore<S extends StructureGroup = StructureGroup> extends DataStore<Snowflake, S["GuildChannel"], Constructable<S["GuildChannel"]>, GuildChannelResolvable<S>, S> {
		constructor(guild: S["Guild"], iterable?: Iterable<any>);
		public create(name: string, options?: GuildCreateChannelOptions<S>): Promise<S["TextChannel"] | S["VoiceChannel"]>;
	}

	// Hacky workaround because changing the signature of an overriden method errors
	class OverridableDataStore<V, K, VConstructor = Constructable<V>, R = any, S extends StructureGroup = StructureGroup> extends DataStore<V, K, VConstructor, R, S> {
		public add(data: any, cache: any): any;
		public set(key: any): any;
	}

	export class GuildMemberRoleStore<S extends StructureGroup = StructureGroup> extends OverridableDataStore<Snowflake, S["Role"], Constructable<S["Role"]>, RoleResolvable<S>, S> {
		constructor(member: S["GuildMember"]);
		public readonly hoist: S["Role"];
		public readonly color: S["Role"];
		public readonly highest: S['Role'];

		public add(roleOrRoles: RoleResolvable<S> | RoleResolvable<S>[] | Collection<Snowflake, S["Role"]>, reason?: string): Promise<this>;
		public set(roles: RoleResolvable<S>[] | Collection<Snowflake, S["Role"]>, reason?: string): Promise<this>;
		public remove(roleOrRoles: RoleResolvable<S> | RoleResolvable<S>[] | Collection<Snowflake, S["Role"]>, reason?: string): Promise<this>;
	}

	export class GuildMemberStore<S extends StructureGroup = StructureGroup> extends DataStore<Snowflake, S["GuildMember"], Constructable<S["GuildMember"]>, GuildMemberResolvable<S>, S> {
		constructor(guild: S["Guild"], iterable?: Iterable<any>);
		public ban(user: UserResolvable<S>, options?: BanOptions): Promise<S["GuildMember"] | S["User"] | Snowflake>;
		public fetch(options: UserResolvable<S> | FetchMemberOptions<S>): Promise<S["GuildMember"]>;
		public fetch(): Promise<this>;
		public fetch(options: FetchMembersOptions): Promise<Collection<Snowflake, S["GuildMember"]>>;
		public prune(options?: GuildPruneMembersOptions): Promise<number>;
		public unban(user: UserResolvable<S>, reason?: string): Promise<S["User"]>;
	}

	export class GuildStore<S extends StructureGroup = StructureGroup> extends DataStore<Snowflake, S["Guild"], Constructable<S["Guild"]>, GuildResolvable<S>, S> {
		constructor(client: S["Client"], iterable?: Iterable<any>);
		public create(name: string, options?: { region?: string, icon?: BufferResolvable | Base64Resolvable }): Promise<S["Guild"]>;
	}
	
	export class MessageStore<S extends StructureGroup = StructureGroup> extends DataStore<Snowflake, S["Message"], Constructable<S["Message"]>, MessageResolvable<S>, S> {
		constructor(channel: S["TextChannel"] | S["DMChannel"], iterable?: Iterable<any>);
		public fetch(message: Snowflake, cache?: boolean): Promise<S["Message"]>;
		public fetch(options?: ChannelLogsQueryOptions, cache?: boolean): Promise<Collection<Snowflake, S["Message"]>>;
		public fetchPinned(cache?: boolean): Promise<Collection<Snowflake, S["Message"]>>;
	}

	export class PresenceStore<S extends StructureGroup = StructureGroup> extends DataStore<Snowflake, S["Presence"], Constructable<S["Presence"]>, PresenceResolvable<S>, S> {
		constructor(client: S["Client"], iterable?: Iterable<any>);
	}

	export class ReactionStore<S extends StructureGroup = StructureGroup, M extends S["Message"] = S["Message"]> extends DataStore<Snowflake, S["MessageReaction"], Constructable<S["MessageReaction"]>, MessageReactionResolvable<S>, S> {
		constructor(message: M, iterable?: Iterable<any>);
		public removeAll(): Promise<M>;
	}

	export class ReactionUserStore<S extends StructureGroup = StructureGroup, R extends S["MessageReaction"] = S["MessageReaction"]> extends DataStore<Snowflake, S["User"], Constructable<S["User"]>, UserResolvable<S>, S> {
		constructor(client: R['message']['client'], iterable: Iterable<any> | undefined, reaction: R);
		public fetch(options?: { limit?: number, after?: Snowflake, before?: Snowflake }): Promise<Collection<Snowflake, S["User"]>>;
		public remove(user?: UserResolvable<S>): Promise<R>;
	}
	export class RoleStore<S extends StructureGroup = StructureGroup> extends DataStore<Snowflake, S["Role"], Constructable<S["Role"]>, RoleResolvable<S>, S> {
		constructor(guild: S["Guild"], iterable?: Iterable<any>);
		public readonly highest: S["Role"];

		public create(options?: { data?: RoleData, reason?: string }): Promise<S["Role"]>;
		public fetch(id?: Snowflake, cache?: boolean): Promise<this>;
		public fetch(id: Snowflake, cache?: boolean): Promise<S["Role"] | null>;
	}

	export class UserStore<S extends StructureGroup = StructureGroup> extends DataStore<Snowflake, S["User"], Constructable<S["User"]>, UserResolvable<S>, S> {
		constructor(client: S["Client"], iterable?: Iterable<any>);
		public fetch(id: Snowflake, cache?: boolean): Promise<S["User"]>;
	}
//#endregion

//#region Mixins

	// Model the TextBasedChannel mixin system, allowing application of these fields
	// to the classes that use these methods without having to manually add them
	// to each of those classes

	type Constructable<T> = new (...args: any[]) => T;

	// Would ideally be generic in a better class
	interface PartialTextBasedChannelFields<S extends StructureGroup = StructureGroup> {
		lastMessageID: Snowflake;
		lastMessageChannelID: Snowflake;
		readonly lastMessage: S["Message"];
		lastPinTimestamp: number;
		readonly lastPinAt: Date;
		send(content?: StringResolvable, options?: MessageOptions<S> | MessageAdditions): Promise<S["Message"] | S["Message"][]>;
		send(options?: MessageOptions<S> | MessageAdditions | APIMessage<S>): Promise<S['Message'] | S['Message'][]>;
	}

	// Would ideally be generic in a better class
	interface TextBasedChannelFields<S extends StructureGroup = StructureGroup> extends PartialTextBasedChannelFields<S> {
		typing: boolean;
		typingCount: number;
		awaitMessages(filter: CollectorFilter, options?: AwaitMessagesOptions): Promise<Collection<Snowflake, S["Message"]>>;
		bulkDelete(messages: Collection<Snowflake, S["Message"]> | S["Message"][] | Snowflake[] | number, filterOld?: boolean): Promise<Collection<Snowflake, S["Message"]>>;
		createMessageCollector(filter: CollectorFilter, options?: MessageCollectorOptions): MessageCollector<S>;
		startTyping(count?: number): Promise<void>;
		stopTyping(force?: boolean): void;
	}

	interface WebhookFields<S extends StructureGroup = StructureGroup> {
		readonly client: S["Client"];
		id: Snowflake;
		token: string;
		delete(reason?: string): Promise<void>;
		edit(options: WebhookEditData<S>): Promise<Webhook<S>>;
		send(content?: StringResolvable, options?: WebhookMessageOptions | MessageAdditions): Promise<S["Message"] | S["Message"][]>;
		send(options?: WebhookMessageOptions | MessageAdditions | APIMessage<S>): Promise<S["Message"] | S["Message"][]>;
		sendSlackMessage(body: object): Promise<S["Message"]>;
	}

//#endregion

//#region Typedefs

	type ActivityFlagsString = 'INSTANCE'
		| 'JOIN'
		| 'SPECTATE'
		| 'JOIN_REQUEST'
		| 'SYNC'
		| 'PLAY';

	type ActivityType = 'PLAYING'
		| 'STREAMING'
		| 'LISTENING'
		| 'WATCHING';

	interface APIErrror {
		UNKNOWN_ACCOUNT: number;
		UNKNOWN_APPLICATION: number;
		UNKNOWN_CHANNEL: number;
		UNKNOWN_GUILD: number;
		UNKNOWN_INTEGRATION: number;
		UNKNOWN_INVITE: number;
		UNKNOWN_MEMBER: number;
		UNKNOWN_MESSAGE: number;
		UNKNOWN_OVERWRITE: number;
		UNKNOWN_PROVIDER: number;
		UNKNOWN_ROLE: number;
		UNKNOWN_TOKEN: number;
		UNKNOWN_USER: number;
		UNKNOWN_EMOJI: number;
		UNKNOWN_WEBHOOK: number;
		BOT_PROHIBITED_ENDPOINT: number;
		BOT_ONLY_ENDPOINT: number;
		MAXIMUM_GUILDS: number;
		MAXIMUM_FRIENDS: number;
		MAXIMUM_PINS: number;
		MAXIMUM_ROLES: number;
		MAXIMUM_REACTIONS: number;
		UNAUTHORIZED: number;
		MISSING_ACCESS: number;
		INVALID_ACCOUNT_TYPE: number;
		CANNOT_EXECUTE_ON_DM: number;
		EMBED_DISABLED: number;
		CANNOT_EDIT_MESSAGE_BY_OTHER: number;
		CANNOT_SEND_EMPTY_MESSAGE: number;
		CANNOT_MESSAGE_USER: number;
		CANNOT_SEND_MESSAGES_IN_VOICE_CHANNEL: number;
		CHANNEL_VERIFICATION_LEVEL_TOO_HIGH: number;
		OAUTH2_APPLICATION_BOT_ABSENT: number;
		MAXIMUM_OAUTH2_APPLICATIONS: number;
		INVALID_OAUTH_STATE: number;
		MISSING_PERMISSIONS: number;
		INVALID_AUTHENTICATION_TOKEN: number;
		NOTE_TOO_LONG: number;
		INVALID_BULK_DELETE_QUANTITY: number;
		CANNOT_PIN_MESSAGE_IN_OTHER_CHANNEL: number;
		CANNOT_EXECUTE_ON_SYSTEM_MESSAGE: number;
		BULK_DELETE_MESSAGE_TOO_OLD: number;
		INVITE_ACCEPTED_TO_GUILD_NOT_CONTAINING_BOT: number;
		REACTION_BLOCKED: number;
	}

	interface AddGuildMemberOptions<S extends StructureGroup = StructureGroup> {
		accessToken: String;
		nick?: string;
		roles?: Collection<Snowflake, S["Role"]> | RoleResolvable<S>[];
		mute?: boolean;
		deaf?: boolean;
	}

	interface AuditLogChange {
		key: string;
		old?: any;
		new?: any;
	}

	interface AvatarOptions {
		format?: ImageExt;
		size?: ImageSize;
	}

	interface AwaitMessagesOptions extends MessageCollectorOptions {
		errors?: string[];
	}

	interface AwaitReactionsOptions extends ReactionCollectorOptions {
		errors?: string[];
	}

	interface BanOptions {
		days?: number;
		reason?: string;
	}

	type Base64Resolvable = Buffer | Base64String;

	type Base64String = string;

	type BitFieldResolvable<T extends string> = RecursiveArray<T | number | Readonly<BitField<T>>> | T | number | Readonly<BitField<T>>;

	type BufferResolvable = Buffer | string;

	interface ChannelCreationOverwrites<S extends StructureGroup = StructureGroup> {
		allow?: PermissionResolvable | number;
		deny?: PermissionResolvable | number;
		id: RoleResolvable<S> | UserResolvable<S>;
	}

	interface ChannelData<S extends StructureGroup = StructureGroup> {
		name?: string;
		position?: number;
		topic?: string;
		nsfw?: boolean;
		bitrate?: number;
		userLimit?: number;
		parentID?: Snowflake;
		rateLimitPerUser?: number;
		lockPermissions?: boolean;
		permissionOverwrites?: OverwriteResolvable<S>[] | Collection<Snowflake, OverwriteResolvable<S>>;
	}

	interface ChannelLogsQueryOptions {
		limit?: number;
		before?: Snowflake;
		after?: Snowflake;
		around?: Snowflake;
	}

	interface ChannelPosition<S extends StructureGroup = StructureGroup> {
		channel: ChannelResolvable<S>;
		position: number;
	}

	type ChannelResolvable<S extends StructureGroup = StructureGroup> = PartialChannel<S> | Snowflake;

	interface ClientApplicationAsset {
		name: string;
		id: Snowflake;
		type: 'BIG' | 'SMALL';
	}

	interface ClientOptions {
		shards?: number | number[];
		shardCount?: number;
		totalShardCount?: number;
		messageCacheMaxSize?: number;
		messageCacheLifetime?: number;
		messageSweepInterval?: number;
		fetchAllMembers?: boolean;
		disableEveryone?: boolean;
		partials?: PartialTypes[];
		restWsBridgeTimeout?: number;
		restTimeOffset?: number;
		restSweepInterval?: number;
		retryLimit?: number;
		presence?: PresenceData;
		disabledEvents?: WSEventType[];
		ws?: WebSocketOptions;
		http?: HTTPOptions;
	}

	type CollectorFilter = (...args: any[]) => boolean;

	interface CollectorOptions {
		time?: number;
		dispose?: boolean;
	}

	type ColorResolvable = 'DEFAULT'
		| 'AQUA'
		| 'GREEN'
		| 'BLUE'
		| 'PURPLE'
		| 'LUMINOUS_VIVID_PINK'
		| 'GOLD'
		| 'ORANGE'
		| 'RED'
		| 'GREY'
		| 'DARKER_GREY'
		| 'NAVY'
		| 'DARK_AQUA'
		| 'DARK_GREEN'
		| 'DARK_BLUE'
		| 'DARK_PURPLE'
		| 'DARK_VIVID_PINK'
		| 'DARK_GOLD'
		| 'DARK_ORANGE'
		| 'DARK_RED'
		| 'DARK_GREY'
		| 'LIGHT_GREY'
		| 'DARK_NAVY'
		| 'RANDOM'
		| [number, number, number]
		| number
		| string;

	interface DeconstructedSnowflake {
		timestamp: number;
		readonly date: Date;
		workerID: number;
		processID: number;
		increment: number;
		binary: string;
	}

	type DefaultMessageNotifications = 'ALL' | 'MENTIONS';

	interface GuildEmojiEditData<S extends StructureGroup = StructureGroup> {
		name?: string;
		roles?: Collection<Snowflake, S["Role"]> | RoleResolvable<S>[];
	}

	interface EmbedField {
		name: string;
		value: string;
		inline?: boolean;
	}

	type EmojiIdentifierResolvable<S extends StructureGroup = StructureGroup> = string | EmojiResolvable<S>;

	type EmojiResolvable<S extends StructureGroup = StructureGroup> = Snowflake | S["GuildEmoji"] | ReactionEmoji<S>;

	interface Extendable {
		GuildEmoji: typeof GuildEmoji;
		DMChannel: typeof DMChannel;
		TextChannel: typeof TextChannel;
		VoiceChannel: typeof VoiceChannel;
		CategoryChannel: typeof CategoryChannel;
		GuildChannel: typeof GuildChannel;
		GuildMember: typeof GuildMember;
		Guild: typeof Guild;
		Message: typeof Message;
		MessageReaction: typeof MessageReaction;
		Presence: typeof Presence;
		VoiceState: typeof VoiceState;
		Role: typeof Role;
		User: typeof User;
	}

	interface FetchMemberOptions<S extends StructureGroup = StructureGroup> {
		user: UserResolvable<S>;
		cache?: boolean;
	}

	interface FetchMembersOptions {
		query?: string;
		limit?: number;
	}

	interface FileOptions {
		attachment: BufferResolvable | Stream;
		name?: string;
	}

	interface GroupActivity {
		partyID: string;
		type: number;
	}

	type GuildAuditLogsAction = keyof GuildAuditLogsActions;

	interface GuildAuditLogsActions {
		ALL?: null;
		GUILD_UPDATE?: number;
		CHANNEL_CREATE?: number;
		CHANNEL_UPDATE?: number;
		CHANNEL_DELETE?: number;
		CHANNEL_OVERWRITE_CREATE?: number;
		CHANNEL_OVERWRITE_UPDATE?: number;
		CHANNEL_OVERWRITE_DELETE?: number;
		MEMBER_KICK?: number;
		MEMBER_PRUNE?: number;
		MEMBER_BAN_ADD?: number;
		MEMBER_BAN_REMOVE?: number;
		MEMBER_UPDATE?: number;
		MEMBER_ROLE_UPDATE?: number;
		ROLE_CREATE?: number;
		ROLE_UPDATE?: number;
		ROLE_DELETE?: number;
		INVITE_CREATE?: number;
		INVITE_UPDATE?: number;
		INVITE_DELETE?: number;
		WEBHOOK_CREATE?: number;
		WEBHOOK_UPDATE?: number;
		WEBHOOK_DELETE?: number;
		EMOJI_CREATE?: number;
		EMOJI_UPDATE?: number;
		EMOJI_DELETE?: number;
		MESSAGE_DELETE?: number;
	}

	type GuildAuditLogsActionType = 'CREATE'
		| 'DELETE'
		| 'UPDATE'
		| 'ALL';

	interface GuildAuditLogsFetchOptions<S extends StructureGroup = StructureGroup> {
		before?: Snowflake | GuildAuditLogsEntry<S>;
		limit?: number;
		user?: UserResolvable<S>;
		type?: string | number;
	}

	type GuildAuditLogsTarget = keyof GuildAuditLogsTargets;

	interface GuildAuditLogsTargets {
		ALL?: string;
		GUILD?: string;
		CHANNEL?: string;
		USER?: string;
		ROLE?: string;
		INVITE?: string;
		WEBHOOK?: string;
		EMOJI?: string;
		MESSAGE?: string;
	}

	type GuildChannelResolvable<S extends StructureGroup = StructureGroup> = Snowflake | S["GuildChannel"];

	interface GuildCreateChannelOptions<S extends StructureGroup = StructureGroup> {
		permissionOverwrites?: OverwriteResolvable<S>[] | Collection<Snowflake, OverwriteResolvable<S>>;
		topic?: string;
		type?: 'text' | 'voice' | 'category';
		nsfw?: boolean;
		parent?: ChannelResolvable<S>;
		bitrate?: number;
		userLimit?: number;
		rateLimitPerUser?: number;
		position?: number;
		reason?: string;
	}

	interface GuildChannelCloneOptions<S extends StructureGroup = StructureGroup> extends GuildCreateChannelOptions<S> {
		name?: string;
	}

	interface GuildEmojiCreateOptions<S extends StructureGroup = StructureGroup> {
		roles?: Collection<Snowflake, S["Guild"]> | RoleResolvable<S>[];
		reason?: string;
	}

	interface GuildEditData<S extends StructureGroup = StructureGroup> {
		name?: string;
		region?: string;
		verificationLevel?: number;
		explicitContentFilter?: number;
		defaultMessageNotifications?: DefaultMessageNotifications | number;
		afkChannel?: ChannelResolvable<S>;
		systemChannel?: ChannelResolvable<S>;
		afkTimeout?: number;
		icon?: Base64Resolvable;
		owner?: GuildMemberResolvable<S>;
		splash?: Base64Resolvable;
	}

	interface GuildEmbedData<S extends StructureGroup = StructureGroup> {
		enabled: boolean;
		channel?: GuildChannelResolvable<S>;
	}

	type GuildFeatures = 'INVITE_SPLASH'
		| 'MORE_EMOJI'
		| 'VERIFIED'
		| 'VIP_REGIONS'
		| 'VANITY_URL';

	interface GuildMemberEditData<S extends StructureGroup = StructureGroup> {
		nick?: string;
		roles?: Collection<Snowflake, S["Role"]> | RoleResolvable<S>[];
		mute?: boolean;
		deaf?: boolean;
		channel?: ChannelResolvable<S>;
	}

	type GuildMemberResolvable<S extends StructureGroup = StructureGroup> = S["GuildMember"] | UserResolvable<S>;

	type GuildResolvable<S extends StructureGroup = StructureGroup> = S["Guild"] | Snowflake;

	interface GuildPruneMembersOptions {
		days?: number;
		dry?: boolean;
		reason?: string;
	}

	interface HTTPOptions {
		version?: number;
		host?: string;
		cdn?: string;
		invite?: string;
	}

	type ImageExt = 'webp'
		| 'png'
		| 'jpg'
		| 'gif';

	type ImageSize = 16
		| 32
		| 64
		| 128
		| 256
		| 512
		| 1024
		| 2048;

	interface IntegrationData {
		id: string;
		type: string;
	}

	interface IntegrationEditData {
		expireBehavior?: number;
		expireGracePeriod?: number;
	}

	interface IntegrationAccount {
		id: string;
		name: string;
	}

	interface InviteOptions {
		temporary?: boolean;
		maxAge?: number;
		maxUses?: number;
		unique?: boolean;
		reason?: string;
	}

	type InviteResolvable = string;

	interface MessageCollectorOptions extends CollectorOptions {
		max?: number;
		maxProcessed?: number;
	}

	type MessageAdditions = MessageEmbed | MessageAttachment | (MessageEmbed | MessageAttachment)[];

	interface MessageEditOptions {
		content?: string;
		embed?: MessageEmbedOptions | null;
		code?: string | boolean;
	}

	interface MessageEmbedOptions {
		title?: string;
		description?: string;
		url?: string;
		timestamp?: Date | number;
		color?: number | string;
		fields?: { name: string; value: string; inline?: boolean; }[];
		files?: (MessageAttachment | string | FileOptions)[];
		author?: { name?: string; url?: string; icon_url?: string; iconURL?: string; };
		thumbnail?: { url?: string; height?: number; width?: number; };
		image?: { url?: string; proxy_url?: string; proxyURL?: string; height?: number; width?: number; };
		video?: { url?: string; height?: number; width?: number; };
		footer?: { text?: string; icon_url?: string; iconURL?: string; };
	}

	interface MessageOptions<S extends StructureGroup = StructureGroup> {
		tts?: boolean;
		nonce?: string;
		content?: string;
		embed?: MessageEmbed | MessageEmbedOptions;
		disableEveryone?: boolean;
		files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
		code?: string | boolean;
		split?: boolean | SplitOptions;
		reply?: UserResolvable<S>;
	}

	type MessageReactionResolvable<S extends StructureGroup = StructureGroup> = S["MessageReaction"] | Snowflake;

	type MessageResolvable<S extends StructureGroup = StructureGroup> = S["Message"] | Snowflake;

	type MessageTarget<S extends StructureGroup = StructureGroup> = S["TextChannel" | "DMChannel" | "User" | "GuildMember"] | Webhook<S> | WebhookClient<S>;

	type MessageType = 'DEFAULT'
		| 'RECIPIENT_ADD'
		| 'RECIPIENT_REMOVE'
		| 'CALL'
		| 'CHANNEL_NAME_CHANGE'
		| 'CHANNEL_ICON_CHANGE'
		| 'PINS_ADD'
		| 'GUILD_MEMBER_JOIN';

	interface OverwriteData<S extends StructureGroup = StructureGroup> {
		allow?: PermissionResolvable;
		deny?: PermissionResolvable;
		id: GuildMemberResolvable<S> | RoleResolvable<S>;
		type?: OverwriteType;
	}

	type OverwriteResolvable<S extends StructureGroup = StructureGroup> = PermissionOverwrites<S> | OverwriteData<S>;

	type OverwriteType = 'member' | 'role';

	interface PermissionFlags extends Record<PermissionString, number> { }

	interface PermissionObject extends Record<PermissionString, boolean> { }

	interface PermissionOverwriteOption extends Partial<Record<PermissionString, boolean | null>> { }

	type PermissionString = 'CREATE_INSTANT_INVITE'
		| 'KICK_MEMBERS'
		| 'BAN_MEMBERS'
		| 'ADMINISTRATOR'
		| 'MANAGE_CHANNELS'
		| 'MANAGE_GUILD'
		| 'ADD_REACTIONS'
		| 'VIEW_AUDIT_LOG'
		| 'PRIORITY_SPEAKER'
		| 'VIEW_CHANNEL'
		| 'SEND_MESSAGES'
		| 'SEND_TTS_MESSAGES'
		| 'MANAGE_MESSAGES'
		| 'EMBED_LINKS'
		| 'ATTACH_FILES'
		| 'READ_MESSAGE_HISTORY'
		| 'MENTION_EVERYONE'
		| 'USE_EXTERNAL_EMOJIS'
		| 'CONNECT'
		| 'SPEAK'
		| 'MUTE_MEMBERS'
		| 'DEAFEN_MEMBERS'
		| 'MOVE_MEMBERS'
		| 'USE_VAD'
		| 'CHANGE_NICKNAME'
		| 'MANAGE_NICKNAMES'
		| 'MANAGE_ROLES'
		| 'MANAGE_WEBHOOKS'
		| 'MANAGE_EMOJIS';

	interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> { }

	type PermissionResolvable = BitFieldResolvable<PermissionString>;

	interface PermissionOverwriteOptions<S extends StructureGroup = StructureGroup> {
		allow: PermissionResolvable;
		deny: PermissionResolvable;
		id: UserResolvable<S> | RoleResolvable<S>;
	}

	interface PresenceData {
		status?: PresenceStatusData;
		afk?: boolean;
		activity?: {
			name?: string;
			type?: ActivityType | number;
			url?: string;
		};
		shardID?: number | number[];
	}

	type PresenceResolvable<S extends StructureGroup = StructureGroup> = S["Presence"] | UserResolvable<S> | Snowflake;

	type ClientPresenceStatus = 'online' | 'idle' | 'dnd';

	interface ClientPresenceStatusData {
		web?: ClientPresenceStatus;
		mobile?: ClientPresenceStatus;
		desktop?: ClientPresenceStatus;
	}

	type PartialTypes = 'USER'
		| 'CHANNEL'
		| 'GUILD_MEMBER'
		| 'MESSAGE';

	type PresenceStatus = ClientPresenceStatus | 'offline';

	type PresenceStatusData = ClientPresenceStatus | 'invisible';

	interface RateLimitData {
		timeout: number;
		limit: number;
		timeDifference: number;
		method: string;
		path: string;
		route: string;
	}

	interface RawOverwriteData {
		id: Snowflake;
		allow: number;
		deny: number;
		type: OverwriteType;
	}

	interface ReactionCollectorOptions extends CollectorOptions {
		max?: number;
		maxEmojis?: number;
		maxUsers?: number;
	}

	interface ResolvedOverwriteOptions {
		allow: Permissions;
		deny: Permissions;
	}

	interface RoleData {
		name?: string;
		color?: ColorResolvable;
		hoist?: boolean;
		position?: number;
		permissions?: PermissionResolvable;
		mentionable?: boolean;
	}

	type RoleResolvable<S extends StructureGroup = StructureGroup> = S["Role"] | string;

	type ShardingManagerMode = 'process' | 'worker';

	type Snowflake = string;

	interface SplitOptions {
		maxLength?: number;
		char?: string;
		prepend?: string;
		append?: string;
	}

	type Status = number;

	interface StreamOptions {
		type?: StreamType;
		seek?: number;
		volume?: number;
		passes?: number;
		plp?: number;
		fec?: boolean;
		bitrate?: number | 'auto';
		highWaterMark?: number;
	}

	type SpeakingString = 'SPEAKING' | 'SOUNDSHARE';

	type StreamType = 'unknown' | 'converted' | 'opus' | 'ogg/opus' | 'webm/opus';

	type StringResolvable = string | string[] | any;

	type UserResolvable<S extends StructureGroup = StructureGroup> = S["User" | "Message" | "GuildMember"] | Snowflake;

	type VoiceStatus = number;

	interface WebhookEditData<S extends StructureGroup = StructureGroup> {
		name?: string;
		avatar?: BufferResolvable;
		channel?: ChannelResolvable<S>;
		reason?: string;
	}

	interface WebhookMessageOptions {
		username?: string;
		avatarURL?: string;
		tts?: boolean;
		nonce?: string;
		embeds?: (MessageEmbed | object)[];
		disableEveryone?: boolean;
		files?: (FileOptions | BufferResolvable | Stream | MessageAttachment)[];
		code?: string | boolean;
		split?: boolean | SplitOptions;
	}

	interface WebSocketOptions {
		large_threshold?: number;
		compress?: boolean;
	}

	type WSEventType = 'READY'
		| 'RESUMED'
		| 'GUILD_CREATE'
		| 'GUILD_DELETE'
		| 'GUILD_UPDATE'
		| 'GUILD_MEMBER_ADD'
		| 'GUILD_MEMBER_REMOVE'
		| 'GUILD_MEMBER_UPDATE'
		| 'GUILD_MEMBERS_CHUNK'
		| 'GUILD_ROLE_CREATE'
		| 'GUILD_ROLE_DELETE'
		| 'GUILD_ROLE_UPDATE'
		| 'GUILD_BAN_ADD'
		| 'GUILD_BAN_REMOVE'
		| 'GUILD_EMOJIS_UPDATE'
		| 'GUILD_INTEGRATIONS_UPDATE'
		| 'CHANNEL_CREATE'
		| 'CHANNEL_DELETE'
		| 'CHANNEL_UPDATE'
		| 'CHANNEL_PINS_UPDATE'
		| 'MESSAGE_CREATE'
		| 'MESSAGE_DELETE'
		| 'MESSAGE_UPDATE'
		| 'MESSAGE_DELETE_BULK'
		| 'MESSAGE_REACTION_ADD'
		| 'MESSAGE_REACTION_REMOVE'
		| 'MESSAGE_REACTION_REMOVE_ALL'
		| 'USER_UPDATE'
		| 'PRESENCE_UPDATE'
		| 'VOICE_STATE_UPDATE'
		| 'TYPING_START'
		| 'VOICE_STATE_UPDATE'
		| 'VOICE_SERVER_UPDATE'
		| 'WEBHOOKS_UPDATE';

//#endregion
}
