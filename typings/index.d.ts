/* tslint:disable */
import { EventEmitter } from 'events';
import { Duplex, Readable as ReadableStream, Stream } from 'stream';
import { Agent as HTTPSAgent } from 'https';
import { IncomingMessage, ClientRequest } from 'http';
import OpusScript = require('opusscript'); // Thanks TypeScript
import { URL } from 'url';
import { Socket as DgramSocket } from 'dgram';
import * as WebSocket from 'ws';

declare function Eris(token: string, options?: Eris.ClientOptions): Eris.Client;

declare namespace Eris {
  export const Constants: Constants;
  export const VERSION: string;

  // TYPES
  // Cache
  interface Uncached {
    id: string;
  }

  // Channel
  type AnyChannel = AnyGuildChannel | PrivateChannel;
  type AnyGuildChannel = GuildTextableChannel | AnyVoiceChannel | CategoryChannel | StoreChannel;
  type AnyVoiceChannel = VoiceChannel | StageChannel;
  type ChannelTypes = Constants['ChannelTypes'][keyof Constants['ChannelTypes']];
  type GuildTextableChannel = TextChannel | NewsChannel;
  type InviteChannel = InvitePartialChannel | Exclude<AnyGuildChannel, CategoryChannel>;
  type PossiblyUncachedTextable = Textable | Uncached;
  type PossiblyUncachedTextableChannel = TextableChannel | Uncached;
  type TextableChannel = (GuildTextable & GuildTextableChannel) | (Textable & PrivateChannel);
  type VideoQualityMode = 1 | 2;

  // Command
  type CommandGenerator = CommandGeneratorFunction | MessageContent | MessageContent[] | CommandGeneratorFunction[];
  type CommandGeneratorFunction = (msg: Message, args: string[]) => GeneratorFunctionReturn;
  type GeneratorFunctionReturn = Promise<MessageContent> | Promise<void> | MessageContent | void;
  type GenericCheckFunction<T> = (msg: Message) => T | Promise<T>;
  type ReactionButtonsFilterFunction = (msg: Message, emoji: Emoji, userID: string) => boolean;
  type ReactionButtonsGenerator =
    | ReactionButtonsGeneratorFunction
    | MessageContent
    | MessageContent[]
    | ReactionButtonsGeneratorFunction[];
  type ReactionButtonsGeneratorFunction = (msg: Message, args: string[], userID: string) => GeneratorFunctionReturn;

  // Gateway/REST
  type IntentStrings = keyof Constants['Intents'];
  type ReconnectDelayFunction = (lastDelay: number, attempts: number) => number;
  type RequestMethod = 'GET' | 'PATCH' | 'DELETE' | 'POST' | 'PUT';

  // Guild
  type DefaultNotifications = 0 | 1;
  type ExplicitContentFilter = 0 | 1 | 2;
  type PossiblyUncachedGuild = Guild | Uncached;
  type PremiumTier = 0 | 1 | 2 | 3;
  type VerificationLevel = 0 | 1 | 2 | 3 | 4;

  // Message
  interface AdvancedMessageContent {
    allowedMentions?: AllowedMentions;
    content?: string;
    embed?: EmbedOptions;
    flags?: number;
    messageReference?: MessageReferenceReply;
    /** @deprecated */
    messageReferenceID?: string;
    tts?: boolean;
  }
  type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp';
  type MessageContent = string | AdvancedMessageContent;
  type MFALevel = 0 | 1;
  type PossiblyUncachedMessage =
    | Message
    | { channel: TextableChannel | { id: string; guild?: Uncached }; guildID?: string; id: string };
  type InteractionType = 1 | 2;

  // Permission
  type PermissionType = 'role' | 'member';

  // Presence/Relationship
  type ActivityType = BotActivityType | 4;
  type BotActivityType = 0 | 1 | 2 | 3 | 5;
  type FriendSuggestionReasons = { name: string; platform_type: string; type: number }[];
  type Status = 'online' | 'idle' | 'dnd' | 'offline';

  // Voice
  type ConverterCommand = './ffmpeg' | './avconv' | 'ffmpeg' | 'avconv';

  // Webhook
  type MessageWebhookContent = Pick<WebhookPayload, 'content' | 'embeds' | 'file' | 'allowedMentions'>;

  // INTERFACES
  // Internals
  interface JSONCache {
    [s: string]: unknown;
  }
  interface NestedJSON {
    toJSON(arg?: unknown, cache?: (string | unknown)[]): JSONCache;
  }
  interface SimpleJSON {
    toJSON(props?: string[]): JSONCache;
  }

  // Channel
  interface ChannelFollow {
    channel_id: string;
    webhook_id: string;
  }
  interface CreateChannelInviteOptions {
    maxAge?: number;
    maxUses?: number;
    temporary?: boolean;
    unique?: boolean;
  }
  interface CreateChannelOptions {
    bitrate?: number;
    nsfw?: boolean;
    parentID?: string;
    permissionOverwrites?: Overwrite[];
    rateLimitPerUser?: number;
    reason?: string;
    topic?: string;
    userLimit?: number;
  }
  interface EditChannelOptions extends Omit<CreateChannelOptions, 'permissionOverwrites' | 'reason'> {
    icon?: string;
    name?: string;
    ownerID?: string;
    rtcRegion?: string | null;
    videoQualityMode?: VideoQualityMode;
  }
  interface EditChannelPositionOptions {
    lockPermissions?: string;
    parentID?: string;
  }
  interface GetMessagesOptions {
    after?: string;
    around?: string;
    before?: string;
    limit?: number;
  }
  interface GuildTextable extends Textable {
    lastPinTimestamp: number | null;
    rateLimitPerUser: number;
    topic: string | null;
    createWebhook(options: { name: string; avatar?: string | null }, reason?: string): Promise<Webhook>;
    deleteMessages(messageIDs: string[], reason?: string): Promise<void>;
    getWebhooks(): Promise<Webhook[]>;
    purge(
      limit: number,
      filter?: (message: Message<this>) => boolean,
      before?: string,
      after?: string,
      reason?: string,
    ): Promise<number>;
    removeMessageReactionEmoji(messageID: string, reaction: string): Promise<void>;
    removeMessageReactions(messageID: string): Promise<void>;
    sendTyping(): Promise<void>;
  }
  interface PartialChannel {
    bitrate?: number;
    id?: number;
    name?: string;
    nsfw?: boolean;
    parent_id?: number;
    permission_overwrites?: Overwrite[];
    rate_limit_per_user?: number;
    topic?: string;
    type: number;
    user_limit?: number;
  }
  interface PurgeChannelOptions {
    after?: string;
    before?: string;
    filter?: (m: Message<GuildTextableChannel>) => boolean;
    limit: number;
    reason?: string;
  }
  interface Textable {
    lastMessageID: string;
    messages: Collection<Message<this>>;
    addMessageReaction(messageID: string, reaction: string): Promise<void>;
    /** @deprecated */
    addMessageReaction(messageID: string, reaction: string, userID: string): Promise<void>;
    createMessage(content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message>;
    deleteMessage(messageID: string, reason?: string): Promise<void>;
    editMessage(messageID: string, content: MessageContent): Promise<Message>;
    getMessage(messageID: string): Promise<Message>;
    getMessageReaction(messageID: string, reaction: string, options?: GetMessageReactionOptions): Promise<User[]>;
    /** @deprecated */
    getMessageReaction(
      messageID: string,
      reaction: string,
      limit?: number,
      before?: string,
      after?: string,
    ): Promise<User[]>;
    getMessages(options?: GetMessagesOptions): Promise<Message[]>;
    /** @deprecated */
    getMessages(limit?: number, before?: string, after?: string, around?: string): Promise<Message[]>;
    getPins(): Promise<Message[]>;
    pinMessage(messageID: string): Promise<void>;
    removeMessageReaction(messageID: string, reaction: string, userID?: string): Promise<void>;
    sendTyping(): Promise<void>;
    unpinMessage(messageID: string): Promise<void>;
    unsendMessage(messageID: string): Promise<void>;
  }
  interface WebhookData {
    channelID: string;
    guildID: string;
  }

  // Client
  interface ClientOptions {
    /** @deprecated */
    agent?: HTTPSAgent;
    allowedMentions?: AllowedMentions;
    autoreconnect?: boolean;
    compress?: boolean;
    connectionTimeout?: number;
    defaultImageFormat?: string;
    defaultImageSize?: number;
    disableEvents?: { [s: string]: boolean };
    firstShardID?: number;
    getAllUsers?: boolean;
    guildCreateTimeout?: number;
    guildSubscriptions?: boolean;
    intents?: number | IntentStrings[];
    largeThreshold?: number;
    lastShardID?: number;
    /** @deprecated */
    latencyThreshold?: number;
    maxReconnectAttempts?: number;
    maxResumeAttempts?: number;
    maxShards?: number | 'auto';
    messageLimit?: number;
    opusOnly?: boolean;
    /** @deprecated */
    ratelimiterOffset?: number;
    reconnectDelay?: ReconnectDelayFunction;
    requestTimeout?: number;
    rest?: RequestHandlerOptions;
    restMode?: boolean;
    seedVoiceConnections?: boolean;
    ws?: unknown;
  }
  interface CommandClientOptions {
    argsSplitter?: (str: string) => string[];
    defaultCommandOptions?: CommandOptions;
    defaultHelpCommand?: boolean;
    description?: string;
    ignoreBots?: boolean;
    ignoreSelf?: boolean;
    name?: string;
    owner?: string;
    prefix?: string | string[];
  }
  interface RequestHandlerOptions {
    agent?: HTTPSAgent;
    baseURL?: string;
    disableLatencyCompensation?: boolean;
    domain?: string;
    latencyThreshold?: number;
    ratelimiterOffset?: number;
    requestTimeout?: number;
  }

  // Command
  interface CommandCooldownExclusions {
    channelIDs?: string[];
    guildIDs?: string[];
    userIDs?: string[];
  }
  interface CommandOptions {
    aliases?: string[];
    argsRequired?: boolean;
    caseInsensitive?: boolean;
    cooldown?: number;
    cooldownExclusions?: CommandCooldownExclusions;
    cooldownMessage?: MessageContent | GenericCheckFunction<MessageContent> | false;
    cooldownReturns?: number;
    defaultSubcommandOptions?: CommandOptions;
    deleteCommand?: boolean;
    description?: string;
    dmOnly?: boolean;
    errorMessage?: MessageContent | GenericCheckFunction<MessageContent>;
    fullDescription?: string;
    guildOnly?: boolean;
    hidden?: boolean;
    hooks?: Hooks;
    invalidUsageMessage?: MessageContent | GenericCheckFunction<MessageContent> | false;
    permissionMessage?: MessageContent | GenericCheckFunction<MessageContent> | false;
    reactionButtons?: CommandReactionButtonsOptions[] | null;
    reactionButtonTimeout?: number;
    requirements?: CommandRequirements;
    restartCooldown?: boolean;
    usage?: string;
  }
  interface CommandReactionButtons extends CommandReactionButtonsOptions {
    execute: (msg: Message, args: string[], userID: string) => string | GeneratorFunctionReturn;
    responses: ((() => string) | ReactionButtonsGeneratorFunction)[];
  }
  interface CommandReactionButtonsOptions {
    emoji: string;
    filter: ReactionButtonsFilterFunction;
    response: string | ReactionButtonsGeneratorFunction;
    type: 'edit' | 'cancel';
  }
  interface CommandRequirements {
    custom?: GenericCheckFunction<boolean>;
    permissions?: { [s: string]: boolean } | GenericCheckFunction<{ [s: string]: boolean }>;
    roleIDs?: string[] | GenericCheckFunction<string[]>;
    roleNames?: string[] | GenericCheckFunction<string[]>;
    userIDs?: string[] | GenericCheckFunction<string[]>;
  }
  interface Hooks {
    postCheck?: (msg: Message, args: string[], checksPassed: boolean) => void;
    postCommand?: (msg: Message, args: string[], sent?: Message) => void;
    postExecution?: (msg: Message, args: string[], executionSuccess: boolean) => void;
    preCommand?: (msg: Message, args: string[]) => void;
  }

  // Embed
  // Omit<T, K> used to override
  interface Embed extends Omit<EmbedOptions, 'footer' | 'image' | 'thumbnail' | 'author'> {
    author?: EmbedAuthor;
    footer?: EmbedFooter;
    image?: EmbedImage;
    provider?: EmbedProvider;
    thumbnail?: EmbedImage;
    type: string;
    video?: EmbedVideo;
  }
  interface EmbedAuthor extends EmbedAuthorOptions {
    proxy_icon_url?: string;
  }
  interface EmbedAuthorOptions {
    icon_url?: string;
    name: string;
    url?: string;
  }
  interface EmbedField {
    inline?: boolean;
    name: string;
    value: string;
  }
  interface EmbedFooter extends EmbedFooterOptions {
    proxy_icon_url?: string;
  }
  interface EmbedFooterOptions {
    icon_url?: string;
    text: string;
  }
  interface EmbedImage extends EmbedImageOptions {
    height?: number;
    proxy_url?: string;
    width?: number;
  }
  interface EmbedImageOptions {
    url?: string;
  }
  interface EmbedOptions {
    author?: EmbedAuthorOptions;
    color?: number;
    description?: string;
    fields?: EmbedField[];
    footer?: EmbedFooterOptions;
    image?: EmbedImageOptions;
    thumbnail?: EmbedImageOptions;
    timestamp?: Date | string;
    title?: string;
    url?: string;
  }
  interface EmbedProvider {
    name?: string;
    url?: string;
  }
  interface EmbedVideo {
    height?: number;
    url?: string;
    width?: number;
  }

  // Emoji
  interface Emoji extends EmojiBase {
    animated: boolean;
    available: boolean;
    id: string;
    managed: boolean;
    require_colons: boolean;
    roles: string[];
    user?: PartialUser;
  }
  interface EmojiBase {
    icon?: string;
    name: string;
  }
  interface EmojiOptions extends Exclude<EmojiBase, 'icon'> {
    image: string;
    roles?: string[];
  }
  interface PartialEmoji {
    id: string | null;
    name: string;
    animated?: boolean;
  }

  // Events
  interface OldCall {
    endedTimestamp?: number;
    participants: string[];
    region: string;
    ringing: string[];
    unavailable: boolean;
  }
  interface OldGroupChannel {
    name: string;
    ownerID: string;
    icon: string;
  }
  interface OldGuild {
    afkChannelID: string | null;
    afkTimeout: number;
    banner: string | null;
    defaultNotifications: DefaultNotifications;
    description: string | null;
    discoverySplash: string | null;
    emojis: Omit<Emoji, 'user' | 'icon'>[];
    explicitContentFilter: ExplicitContentFilter;
    features: string[];
    icon: string | null;
    large: boolean;
    maxMembers?: number;
    maxVideoChannelUsers?: number;
    mfaLevel: MFALevel;
    name: string;
    nsfw: boolean;
    ownerID: string;
    preferredLocale?: string;
    premiumSubscriptionCount?: number;
    premiumTier: PremiumTier;
    publicUpdatesChannelID: string | null;
    region: string;
    rulesChannelID: string | null;
    splash: string | null;
    systemChannelFlags: number;
    systemChannelID: string | null;
    vanityURL: string | null;
    verificationLevel: VerificationLevel;
  }
  interface OldGuildChannel {
    bitrate?: number;
    name: string;
    nsfw?: boolean;
    parentID: string | null;
    permissionOverwrites: Collection<PermissionOverwrite>;
    position: number;
    rateLimitPerUser?: number;
    rtcRegion?: string | null;
    topic?: string | null;
    type: Exclude<ChannelTypes, 1 | 3>;
  }
  interface OldGuildTextChannel extends OldGuildChannel {
    nsfw: boolean;
    rateLimitPerUser: number;
    topic: string | null;
    type: 0 | 5;
  }
  interface OldGuildVoiceChannel extends OldGuildChannel {
    bitrate: number;
    rtcRegion: string | null;
    type: 2 | 13;
    userLimit: number;
    videoQualityMode: VideoQualityMode;
  }
  interface OldMember {
    roles: string[];
    nick: string | null;
    premiumSince: number;
    pending?: boolean;
  }
  interface OldMessage {
    attachments: Attachment[];
    channelMentions: string[];
    content: string;
    editedTimestamp?: number;
    embeds: Embed[];
    flags: number;
    mentionedBy?: unknown;
    mentions: string[];
    pinned: boolean;
    roleMentions: string[];
    tts: boolean;
  }
  interface OldRole {
    color: number;
    hoist: boolean;
    managed: boolean;
    mentionable: boolean;
    name: string;
    permissions: Permission;
    position: number;
  }
  interface OldVoiceState {
    deaf: boolean;
    mute: boolean;
    selfDeaf: boolean;
    selfMute: boolean;
    selfStream: boolean;
    selfVideo: boolean;
  }
  interface EventListeners<T> {
    (event: 'ready' | 'disconnect', listener: () => void): T;
    (event: 'callCreate' | 'callRing' | 'callDelete', listener: (call: Call) => void): T;
    (event: 'callUpdate', listener: (call: Call, oldCall: OldCall) => void): T;
    (event: 'channelCreate' | 'channelDelete', listener: (channel: AnyChannel) => void): T;
    (
      event: 'channelPinUpdate',
      listener: (channel: TextableChannel, timestamp: number, oldTimestamp: number) => void,
    ): T;
    (event: 'channelRecipientAdd' | 'channelRecipientRemove', listener: (channel: GroupChannel, user: User) => void): T;
    (
      event: 'channelUpdate',
      listener: (
        channel: AnyGuildChannel,
        oldChannel: OldGuildChannel | OldGuildTextChannel | OldGuildVoiceChannel,
      ) => void,
    ): T;
    (event: 'channelUpdate', listener: (channel: GroupChannel, oldChannel: OldGroupChannel) => void): T;
    (event: 'connect' | 'shardPreReady', listener: (id: number) => void): T;
    (event: 'error', listener: (err: Error, id: number) => void): T;
    (event: 'friendSuggestionCreate', listener: (user: User, reasons: FriendSuggestionReasons) => void): T;
    (event: 'friendSuggestionDelete', listener: (user: User) => void): T;
    (event: 'guildBanAdd' | 'guildBanRemove', listener: (guild: Guild, user: User) => void): T;
    (event: 'guildAvailable' | 'guildCreate', listener: (guild: Guild) => void): T;
    (event: 'guildDelete', listener: (guild: PossiblyUncachedGuild) => void): T;
    (
      event: 'guildEmojisUpdate',
      listener: (guild: PossiblyUncachedGuild, emojis: Emoji[], oldEmojis: Emoji[] | null) => void,
    ): T;
    (event: 'guildMemberAdd', listener: (guild: Guild, member: Member) => void): T;
    (event: 'guildMemberChunk', listener: (guild: Guild, members: Member[]) => void): T;
    (event: 'guildMemberRemove', listener: (guild: Guild, member: Member | MemberPartial) => void): T;
    (event: 'guildMemberUpdate', listener: (guild: Guild, member: Member, oldMember: OldMember | null) => void): T;
    (event: 'guildRoleCreate' | 'guildRoleDelete', listener: (guild: Guild, role: Role) => void): T;
    (event: 'guildRoleUpdate', listener: (guild: Guild, role: Role, oldRole: OldRole) => void): T;
    (event: 'guildUnavailable' | 'unavailableGuildCreate', listener: (guild: UnavailableGuild) => void): T;
    (event: 'guildUpdate', listener: (guild: Guild, oldGuild: OldGuild) => void): T;
    (event: 'hello', listener: (trace: string[], id: number) => void): T;
    (event: 'inviteCreate' | 'inviteDelete', listener: (guild: Guild, invite: Invite) => void): T;
    (event: 'messageCreate', listener: (message: Message<PossiblyUncachedTextableChannel>) => void): T;
    (event: 'messageDelete' | 'messageReactionRemoveAll', listener: (message: PossiblyUncachedMessage) => void): T;
    (event: 'messageReactionRemoveEmoji', listener: (message: PossiblyUncachedMessage, emoji: PartialEmoji) => void): T;
    (event: 'messageDeleteBulk', listener: (messages: PossiblyUncachedMessage[]) => void): T;
    (
      event: 'messageReactionAdd',
      listener: (message: PossiblyUncachedMessage, emoji: PartialEmoji, reactor: Member | Uncached) => void,
    ): T;
    (
      event: 'messageReactionRemove',
      listener: (message: PossiblyUncachedMessage, emoji: PartialEmoji, userID: string) => void,
    ): T;
    (
      event: 'messageUpdate',
      listener: (message: Message<PossiblyUncachedTextableChannel>, oldMessage: OldMessage | null) => void,
    ): T;
    (event: 'presenceUpdate', listener: (other: Member | Relationship, oldPresence: Presence | null) => void): T;
    (event: 'rawREST', listener: (request: RawRESTRequest) => void): T;
    (event: 'rawWS' | 'unknown', listener: (packet: RawPacket, id: number) => void): T;
    (event: 'relationshipAdd' | 'relationshipRemove', listener: (relationship: Relationship) => void): T;
    (event: 'relationshipUpdate', listener: (relationship: Relationship, oldRelationship: { type: number }) => void): T;
    (
      event: 'typingStart',
      listener: (channel: GuildTextableChannel | Uncached, user: User | Uncached, member: Member) => void,
    ): T;
    (
      event: 'typingStart',
      listener: (channel: PrivateChannel | Uncached, user: User | Uncached, member: null) => void,
    ): T;
    (event: 'userUpdate', listener: (user: User, oldUser: PartialUser | null) => void): T;
    (event: 'voiceChannelJoin' | 'voiceChannelLeave', listener: (member: Member, channel: AnyVoiceChannel) => void): T;
    (
      event: 'voiceChannelSwitch',
      listener: (member: Member, newChannel: AnyVoiceChannel, oldChannel: AnyVoiceChannel) => void,
    ): T;
    (event: 'voiceStateUpdate', listener: (member: Member, oldState: OldVoiceState) => void): T;
    (event: 'warn' | 'debug', listener: (message: string, id: number) => void): T;
    (event: 'webhooksUpdate', listener: (data: WebhookData) => void): T;
    (event: string, listener: (...args: any[]) => void): T;
  }
  interface ClientEvents<T> extends EventListeners<T> {
    (event: 'shardReady' | 'shardResume', listener: (id: number) => void): T;
    (event: 'shardDisconnect', listener: (err: Error | undefined, id: number) => void): T;
  }
  interface ShardEvents<T> extends EventListeners<T> {
    (event: 'resume', listener: () => void): T;
  }
  interface StreamEvents<T> extends EventListeners<T> {
    (event: 'end' | 'start', listener: () => void): T;
    (event: 'error', listener: (err: Error) => void): T;
  }
  interface VoiceEvents<T> {
    (event: 'connect' | 'end' | 'ready' | 'start', listener: () => void): T;
    (event: 'debug' | 'warn', listener: (message: string) => void): T;
    (event: 'disconnect', listener: (err?: Error) => void): T;
    (event: 'error', listener: (err: Error) => void): T;
    (event: 'pong', listener: (latency: number) => void): T;
    (event: 'speakingStart' | 'speakingStop' | 'userDisconnect', listener: (userID: string) => void): T;
    (event: 'unknown', listener: (packet: unknown) => void): T;
  }

  // Gateway/REST
  interface HTTPResponse {
    code: number;
    message: string;
  }
  interface LatencyRef {
    lastTimeOffsetCheck: number;
    latency: number;
    raw: number[];
    timeOffset: number;
    timeOffsets: number[];
  }
  interface RawPacket {
    d?: unknown;
    op: number;
    s?: number;
    t?: string;
  }
  interface RawRESTRequest {
    auth: boolean;
    body?: unknown;
    file?: MessageFile;
    method: string;
    resp: IncomingMessage;
    route: string;
    short: boolean;
    url: string;
  }
  interface RequestMembersPromise {
    members: Member;
    received: number;
    res: (value: Member[]) => void;
    timeout: NodeJS.Timeout;
  }

  // Guild
  interface CreateGuildOptions {
    afkChannelID?: string;
    afkTimeout?: number;
    channels?: PartialChannel[];
    defaultNotifications?: DefaultNotifications;
    explicitContentFilter?: ExplicitContentFilter;
    icon?: string;
    region?: string;
    roles?: PartialRole[];
    systemChannelID: string;
    verificationLevel?: VerificationLevel;
  }
  interface DiscoveryCategory {
    id: number;
    is_primary: boolean;
    name: {
      default: string;
      localizations?: { [lang: string]: string };
    };
  }
  interface DiscoveryMetadata {
    category_ids: number[];
    emoji_discoverability_enabled: boolean;
    guild_id: string;
    keywords: string[] | null;
    primary_category_id: number;
  }
  interface DiscoveryOptions {
    emojiDiscoverabilityEnabled?: boolean;
    keywords?: string[];
    primaryCategoryID?: string;
    reason?: string;
  }
  interface DiscoverySubcategoryResponse {
    category_id: number;
    guild_id: string;
  }
  interface GetGuildAuditLogOptions {
    actionType?: number;
    before?: string;
    limit?: number;
    userID?: string;
  }
  interface GetGuildIntegrationsOptions {
    includeApplications?: boolean;
  }
  interface GetPruneOptions {
    days?: number;
    includeRoles?: string[];
  }
  interface GetRESTGuildMembersOptions {
    after?: string;
    limit?: number;
  }
  interface GetRESTGuildsOptions {
    after?: string;
    before?: string;
    limit?: number;
  }
  interface GuildAuditLog {
    entries: GuildAuditLogEntry[];
    integrations: GuildIntegration[];
    users: User[];
    webhooks: Webhook[];
  }
  interface GuildOptions {
    afkChannelID?: string;
    afkTimeout?: number;
    banner?: string;
    defaultNotifications?: DefaultNotifications;
    description?: string;
    discoverySplash?: string;
    explicitContentFilter?: ExplicitContentFilter;
    features?: string[];
    icon?: string;
    name?: string;
    ownerID?: string;
    preferredLocale?: string;
    publicUpdatesChannelID?: string;
    region?: string;
    rulesChannelID?: string;
    splash?: string;
    systemChannelFlags?: number;
    systemChannelID?: string;
    verificationLevel?: VerificationLevel;
  }
  interface GuildTemplateOptions {
    name?: string;
    description?: string | null;
  }
  interface GuildVanity {
    code: string | null;
    uses: number;
  }
  interface IntegrationApplication {
    bot?: User;
    description: string;
    icon: string | null;
    id: string;
    name: string;
    summary: string;
  }
  interface IntegrationOptions {
    enableEmoticons: string;
    expireBehavior: string;
    expireGracePeriod: string;
  }
  interface PruneMemberOptions extends GetPruneOptions {
    computePruneCount?: boolean;
    reason?: string;
  }
  interface VoiceRegion {
    custom: boolean;
    deprecated: boolean;
    id: string;
    name: string;
    optimal: boolean;
    vip: boolean;
  }
  interface WelcomeChannel {
    channelID: string;
    description: string;
    emojiID: string | null;
    emojiName: string | null;
  }
  interface WelcomeScreen {
    description: string;
    welcomeChannels: WelcomeChannel[];
  }
  interface WelcomeScreenOptions extends WelcomeScreen {
    enabled: boolean;
  }
  interface Widget {
    channel_id?: string;
    enabled: boolean;
  }

  // Invite
  interface CreateInviteOptions {
    maxAge?: number;
    maxUses?: number;
    temporary?: boolean;
    unique?: boolean;
  }
  interface Invitable {
    createInvite(options?: CreateInviteOptions, reason?: string): Promise<Invite>;
    getInvites(): Promise<Invite[]>;
  }
  interface InvitePartialChannel {
    icon?: string | null;
    id: string;
    name: string | null;
    recipients?: { username: string }[];
    type: Exclude<ChannelTypes, 1>;
  }

  // Member/User
  interface FetchMembersOptions {
    limit?: number;
    presences?: boolean;
    query?: string;
    timeout?: number;
    userIDs?: string[];
  }
  interface MemberOptions {
    channelID?: string | null;
    deaf?: boolean;
    mute?: boolean;
    nick?: string;
    roles?: string[];
  }
  interface MemberPartial {
    id: string;
    user: User;
  }
  interface PartialUser {
    avatar: string | null;
    discriminator: string;
    id: string;
    username: string;
  }
  interface RequestGuildMembersOptions extends Omit<FetchMembersOptions, 'userIDs'> {
    nonce: string;
    user_ids?: string[];
  }
  interface RequestGuildMembersReturn {
    members: Member[];
    received: number;
    res: (value?: unknown) => void;
    timeout: NodeJS.Timer;
  }

  // Message
  interface ActiveMessages {
    args: string[];
    command: Command;
    timeout: NodeJS.Timer;
  }
  interface AllowedMentions {
    everyone?: boolean;
    repliedUser?: boolean;
    roles?: boolean | string[];
    users?: boolean | string[];
  }
  interface Attachment {
    content_type?: string;
    filename: string;
    height?: number;
    id: string;
    proxy_url: string;
    size: number;
    url: string;
    width?: number;
  }
  interface GetMessageReactionOptions {
    after?: string;
    /** @deprecated */
    before?: string;
    limit?: number;
  }
  interface MessageActivity {
    party_id?: string;
    type: Constants['MessageActivityTypes'][keyof Constants['MessageActivityTypes']];
  }
  interface MessageApplication {
    cover_image?: string;
    description: string;
    icon: string | null;
    id: string;
    name: string;
  }
  interface MessageFile {
    file: Buffer | string;
    name: string;
  }
  interface MessageInteraction {
    id: string;
    member: Member | null;
    name: string;
    type: InteractionType;
    user: User;
  }
  interface MessageReference extends MessageReferenceBase {
    channelID: string;
  }
  interface MessageReferenceBase {
    channelID?: string;
    guildID?: string;
    messageID?: string;
  }
  interface MessageReferenceReply extends MessageReferenceBase {
    messageID: string;
    failIfNotExists?: boolean;
  }
  interface Sticker {
    asset: string;
    description: string;
    format_type: Constants['StickerFormats'][keyof Constants['StickerFormats']];
    id: string;
    name: string;
    pack_id: string;
    tags?: string;
  }

  // Presence
  interface Activity extends ActivityPartial<ActivityType> {
    application_id?: string;
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
      [key: string]: unknown;
    };
    created_at: number;
    details?: string;
    emoji?: { animated?: boolean; id?: string; name: string };
    flags?: number;
    instance?: boolean;
    party?: { id?: string; size?: [number, number] };
    secrets?: { join?: string; spectate?: string; match?: string };
    state?: string;
    timestamps?: { end?: number; start: number };
    // the stuff attached to this object apparently varies even more than documented, so...
    [key: string]: unknown;
  }
  interface ActivityPartial<T extends ActivityType = BotActivityType> {
    name?: string;
    type?: T;
    url?: string;
  }
  interface ClientStatus {
    desktop: Status;
    mobile: Status;
    web: Status;
  }
  interface Presence {
    activities?: Activity[];
    clientStatus?: ClientStatus;
    game: Activity | null;
    status?: Status;
  }

  // Role
  interface Overwrite {
    allow: bigint | number;
    deny: bigint | number;
    id: string;
    type: PermissionType;
  }
  interface PartialRole {
    color?: number;
    hoist?: boolean;
    id?: number;
    mentionable?: boolean;
    name?: string;
    permissions?: number;
    position?: number;
  }
  interface RoleOptions {
    color?: number;
    hoist?: boolean;
    mentionable?: boolean;
    name?: string;
    permissions?: bigint | number;
  }
  interface RoleTags {
    bot_id?: string;
    integration_id?: string;
    premium_subscriber?: true;
  }

  // Voice
  interface VoiceConnectData {
    channel_id: string;
    endpoint: string;
    session_id: string;
    token: string;
    user_id: string;
  }
  interface VoiceResourceOptions {
    encoderArgs?: string[];
    format?: string;
    frameDuration?: number;
    frameSize?: number;
    inlineVolume?: boolean;
    inputArgs?: string[];
    pcmSize?: number;
    samplingRate?: number;
    voiceDataTimeout?: number;
  }
  interface VoiceServerUpdateData extends Omit<VoiceConnectData, 'channel_id'> {
    guild_id: string;
    shard: Shard;
  }
  interface VoiceStateOptions {
    channelID: string;
    requestToSpeakTimestamp?: Date | null;
    suppress?: boolean;
  }
  interface VoiceStreamCurrent {
    buffer: Buffer | null;
    bufferingTicks: number;
    options: VoiceResourceOptions;
    pausedTime?: number;
    pausedTimestamp?: number;
    playTime: number;
    startTime: number;
    timeout: NodeJS.Timeout | null;
  }

  // Webhook
  interface Webhook {
    avatar?: string;
    channel_id: string;
    guild_id: string;
    id: string;
    name: string;
    token: string;
    user: PartialUser;
  }
  interface WebhookOptions {
    avatar?: string;
    channelID?: string;
    name?: string;
  }
  interface WebhookPayload {
    allowedMentions?: AllowedMentions;
    auth?: boolean;
    avatarURL?: string;
    content?: string;
    embeds?: EmbedOptions[];
    file?: MessageFile | MessageFile[];
    tts?: boolean;
    username?: string;
    wait?: boolean;
  }

  // TODO: Does this have more stuff?
  interface BaseData {
    id: string;
    [key: string]: unknown;
  }
  interface OAuthApplicationInfo {
    bot_public: boolean;
    bot_require_code_grant: boolean;
    description: string;
    icon?: string;
    id: string;
    name: string;
    owner: {
      avatar?: string;
      discriminator: string;
      id: string;
      username: string;
    };
    team: OAuthTeamInfo | null;
  }
  interface OAuthTeamInfo {
    icon: string | null;
    id: string;
    members: OAuthTeamMember[];
    owner_user_id: string;
  }
  interface OAuthTeamMember {
    membership_state: number;
    permissions: string[];
    team_id: string;
    user: PartialUser;
  }
  interface Constants {
    AuditLogActions: {
      GUILD_UPDATE: 1;

      CHANNEL_CREATE: 10;
      CHANNEL_UPDATE: 11;
      CHANNEL_DELETE: 12;
      CHANNEL_OVERWRITE_CREATE: 13;
      CHANNEL_OVERWRITE_UPDATE: 14;
      CHANNEL_OVERWRITE_DELETE: 15;

      MEMBER_KICK: 20;
      MEMBER_PRUNE: 21;
      MEMBER_BAN_ADD: 22;
      MEMBER_BAN_REMOVE: 23;
      MEMBER_UPDATE: 24;
      MEMBER_ROLE_UPDATE: 25;
      MEMBER_MOVE: 26;
      MEMBER_DISCONNECT: 27;
      BOT_ADD: 28;

      ROLE_CREATE: 30;
      ROLE_UPDATE: 31;
      ROLE_DELETE: 32;

      INVITE_CREATE: 40;
      INVITE_UPDATE: 41;
      INVITE_DELETE: 42;

      WEBHOOK_CREATE: 50;
      WEBHOOK_UPDATE: 51;
      WEBHOOK_DELETE: 52;

      EMOJI_CREATE: 60;
      EMOJI_UPDATE: 61;
      EMOJI_DELETE: 62;

      MESSAGE_DELETE: 72;
      MESSAGE_BULK_DELETE: 73;
      MESSAGE_PIN: 74;
      MESSAGE_UNPIN: 75;

      INTEGRATION_CREATE: 80;
      INTEGRATION_UPDATE: 81;
      INTEGRATION_DELETE: 82;
    };
    ChannelTypes: {
      GUILD_TEXT: 0;
      DM: 1;
      GUILD_VOICE: 2;
      GROUP_DM: 3;
      GUILD_CATEGORY: 4;
      GUILD_NEWS: 5;
      GUILD_STORE: 6;
      GUILD_STAGE: 13;
    };
    GATEWAY_VERSION: 6;
    GatewayOPCodes: {
      EVENT: 0;
      HEARTBEAT: 1;
      IDENTIFY: 2;
      STATUS_UPDATE: 3;
      VOICE_STATE_UPDATE: 4;
      VOICE_SERVER_PING: 5;
      RESUME: 6;
      RECONNECT: 7;
      GET_GUILD_MEMBERS: 8;
      INVALID_SESSION: 9;
      HELLO: 10;
      HEARTBEAT_ACK: 11;
      SYNC_GUILD: 12;
      SYNC_CALL: 13;
    };
    ImageFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    ImageSizeBoundaries: {
      MAXIMUM: 4096;
      MINIMUM: 16;
    };
    Intents: {
      guilds: 1;
      guildMembers: 2;
      guildBans: 4;
      guildEmojis: 8;
      guildIntegrations: 16;
      guildWebhooks: 32;
      guildInvites: 64;
      guildVoiceStates: 128;
      guildPresences: 256;
      guildMessages: 512;
      guildMessageReactions: 1024;
      guildMessageTyping: 2048;
      directMessages: 4096;
      directMessageReactions: 8192;
      directMessageTyping: 16384;
    };
    MessageActivityTypes: {
      JOIN: 1;
      SPECTATE: 2;
      LISTEN: 3;
      JOIN_REQUEST: 5;
    };
    MessageFlags: {
      CROSSPOSTED: 0;
      IS_CROSSPOST: 2;
      SUPPRESS_EMBEDS: 4;
      SOURCE_MESSAGE_DELETED: 8;
      URGENT: 16;
    };
    MessageTypes: {
      DEFAULT: 0;
      RECIPIENT_ADD: 1;
      RECIPIENT_REMOVE: 2;
      CALL: 3;
      CHANNEL_NAME_CHANGE: 4;
      CHANNEL_ICON_CHANGE: 5;
      CHANNEL_PINNED_MESSAGE: 6;
      GUILD_MEMBER_JOIN: 7;
      USER_PREMIUM_GUILD_SUBSCRIPTION: 8;
      USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1: 9;
      USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2: 10;
      USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3: 11;
      CHANNEL_FOLLOW_ADD: 12;

      GUILD_DISCOVERY_DISQUALIFIED: 14;
      GUILD_DISCOVERY_REQUALIFIED: 15;
      GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING: 16;
      GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING: 17;
      REPLY: 19;
      APPLICATION_COMMAND: 20;

      GUILD_INVITE_REMINDER: 22;
    };
    Permissions: {
      createInstantInvite: 1n;
      kickMembers: 2n;
      banMembers: 4n;
      administrator: 8n;
      manageChannels: 16n;
      manageGuild: 32n;
      addReactions: 64n;
      viewAuditLog: 128n;
      /** @deprecated */
      viewAuditLogs: 128n;
      voicePrioritySpeaker: 256n;
      voiceStream: 512n;
      /** @deprecated */
      stream: 512n;
      viewChannel: 1024n;
      /** @deprecated */
      readMessages: 1024n;
      sendMessages: 2048n;
      sendTTSMessages: 4096n;
      manageMessages: 8192n;
      embedLinks: 16384n;
      attachFiles: 32768n;
      readMessageHistory: 65536n;
      mentionEveryone: 131072n;
      useExternalEmojis: 262144n;
      /** @deprecated */
      externalEmojis: 262144n;
      viewGuildInsights: 524288n;
      voiceConnect: 1048576n;
      voiceSpeak: 2097152n;
      voiceMuteMembers: 4194304n;
      voiceDeafenMembers: 8388608n;
      voiceMoveMembers: 16777216n;
      voiceUseVAD: 33554432n;
      changeNickname: 67108864n;
      manageNicknames: 134217728n;
      manageRoles: 268435456n;
      manageWebhooks: 536870912n;
      manageEmojis: 1073741824n;
      useSlashCommands: 2147483648n;
      voiceRequestToSpeak: 4294967296n;
      allGuild: 2080899262n;
      allText: 2953313361n;
      allVoice: 4629464849n;
      all: 8589934591n;
    };
    REST_VERSION: 7;
    StickerFormats: {
      PNG: 1;
      APNG: 2;
      LOTTIE: 3;
    };
    SystemJoinMessages: [
      '%user% joined the party.',
      '%user% is here.',
      'Welcome, %user%. We hope you brought pizza.',
      'A wild %user% appeared.',
      '%user% just landed.',
      '%user% just slid into the server.',
      '%user% just showed up!',
      'Welcome %user%. Say hi!',
      '%user% hopped into the server.',
      'Everyone welcome %user%!',
      "Glad you're here, %user%.",
      'Good to see you, %user%.',
      'Yay you made it, %user%!',
    ];
    UserFlags: {
      NONE: 0;
      DISCORD_EMPLOYEE: 1;
      DISCORD_PARTNER: 2;
      HYPESQUAD_EVENTS: 4;
      BUG_HUNTER_LEVEL_1: 8;
      HOUSE_BRAVERY: 64;
      HOUSE_BRILLIANCE: 128;
      HOUSE_BALANCE: 256;
      EARLY_SUPPORTER: 512;
      TEAM_USER: 1024;
      SYSTEM: 4096;
      BUG_HUNTER_LEVEL_2: 16384;
      VERIFIED_BOT: 65536;
      VERIFIED_BOT_DEVELOPER: 131072;
    };
    VoiceOPCodes: {
      IDENTIFY: 0;
      SELECT_PROTOCOL: 1;
      READY: 2;
      HEARTBEAT: 3;
      SESSION_DESCRIPTION: 4;
      SPEAKING: 5;
      HEARTBEAT_ACK: 6;
      RESUME: 7;
      HELLO: 8;
      RESUMED: 9;
      DISCONNECT: 13;
    };
  }

  // Selfbot
  interface Connection {
    friend_sync: boolean;
    id: string;
    integrations: unknown[]; // TODO ????
    name: string;
    revoked: boolean;
    type: string;
    verified: boolean;
    visibility: number;
  }
  interface GuildSettings {
    channel_override: {
      channel_id: string;
      message_notifications: number;
      muted: boolean;
    }[];
    guild_id: string;
    message_notifications: number;
    mobile_push: boolean;
    muted: boolean;
    suppress_everyone: boolean;
  }
  interface SearchOptions {
    attachmentExtensions?: string;
    attachmentFilename?: string;
    authorID?: string;
    channelIDs?: string[];
    content?: string;
    contextSize?: number;
    embedProviders?: string;
    embedTypes?: string;
    has?: string;
    limit?: number;
    maxID?: string;
    minID?: string;
    offset?: number;
    sortBy?: string;
    sortOrder?: string;
  }
  interface SearchResults {
    results: (Message & { hit?: boolean })[][];
    totalResults: number;
  }
  interface UserProfile {
    connected_accounts: { id: string; name: string; type: string; verified: boolean }[];
    mutual_guilds: { id: string; nick?: string }[];
    premium_since?: number;
    user: PartialUser & { flags: number };
  }
  interface UserSettings {
    afk_timeout: number;
    convert_emojis: boolean;
    default_guilds_restricted: boolean;
    detect_platform_accounts: boolean;
    developer_mode: boolean;
    enable_tts_command: boolean;
    explicit_content_filter: number;
    friend_source_flags: {
      all: boolean; // not sure about other keys, abal heeeelp
    };
    inline_attachment_media: boolean;
    inline_embed_media: boolean;
    guild_positions: string[];
    locale: string;
    message_display_compact: boolean;
    render_embeds: boolean;
    render_reactions: boolean;
    restricted_guilds: string[];
    show_current_game: boolean;
    status: string;
    theme: string;
  }

  class Base implements SimpleJSON {
    public createdAt: number;
    public id: string;
    constructor(id: string);
    public static getCreatedAt(id: string): number;
    public inspect(): this;
    public toString(): string;
    public toJSON(props?: string[]): JSONCache;
  }

  export class Bucket {
    public interval: number;
    public lastReset: number;
    public lastSend: number;
    public tokenLimit: number;
    public tokens: number;
    constructor(
      tokenLimit: number,
      interval: number,
      options: { latencyRef: { latency: number }; reservedTokens: number },
    );
    public check(): void;
    public queue(func: () => void, priority?: boolean): void;
  }

  export class BrowserWebSocket extends EventEmitter {
    public static CONNECTING: 0;
    public static OPEN: 1;
    public static CLOSING: 2;
    public static CLOSED: 3;
    public readyState: number;
    constructor(url: string);
    public close(code?: number, reason?: string): void;
    public removeEventListener(event: string | symbol, listener: (...args: any[]) => void): this;
    // @ts-ignore: DOM
    public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
    public terminate(): void;
  }

  export class BrowserWebSocketError extends Error {
    // @ts-ignore: DOM
    public event: Event;
    // @ts-ignore: DOM
    constructor(message: string, event: Event);
  }

  export class Call extends Base {
    public channel: GroupChannel;
    public createdAt: number;
    public endedTimestamp: number | null;
    public id: string;
    public participants: string[];
    public region: string | null;
    public ringing: string[];
    public unavailable: boolean;
    public voiceStates: Collection<VoiceState>;
    constructor(data: BaseData, channel: GroupChannel);
  }

  export class CategoryChannel extends GuildChannel {
    public channels: Collection<Exclude<AnyGuildChannel, CategoryChannel>>;
    public type: 4;
    public edit(options: Omit<CreateChannelOptions, 'permissionOverwrites' | 'reason'>, reason?: string): Promise<this>;
  }

  export class Channel extends Base {
    public client: Client;
    public createdAt: number;
    public id: string;
    public mention: string;
    public type: ChannelTypes;
    constructor(data: BaseData);
    public static from(data: BaseData, client: Client): AnyChannel;
  }

  export class Client extends EventEmitter {
    public application?: { id: string; flags: number };
    public bot: boolean;
    public channelGuildMap: { [s: string]: string };
    public gatewayURL?: string;
    public groupChannels: Collection<GroupChannel>;
    public guilds: Collection<Guild>;
    public guildShardMap: { [s: string]: number };
    public lastConnect: number;
    public lastReconnectDelay: number;
    public notes: { [s: string]: string };
    public options: ClientOptions;
    public presence: Presence;
    public privateChannelMap: { [s: string]: string };
    public privateChannels: Collection<PrivateChannel>;
    public ready: boolean;
    public reconnectAttempts: number;
    public relationships: Collection<Relationship>;
    public requestHandler: RequestHandler;
    public shards: ShardManager;
    public startTime: number;
    public unavailableGuilds: Collection<UnavailableGuild>;
    public uptime: number;
    public user: ExtendedUser;
    public userGuildSettings: { [s: string]: GuildSettings };
    public users: Collection<User>;
    public userSettings: UserSettings;
    public voiceConnections: VoiceConnectionManager;
    constructor(token: string, options?: ClientOptions);
    public acceptInvite(inviteID: string): Promise<Invite<'withoutCount'>>;
    public addGroupRecipient(groupID: string, userID: string): Promise<void>;
    public addGuildDiscoverySubcategory(
      guildID: string,
      categoryID: string,
      reason?: string,
    ): Promise<DiscoverySubcategoryResponse>;
    public addGuildMemberRole(guildID: string, memberID: string, roleID: string, reason?: string): Promise<void>;
    public addMessageReaction(channelID: string, messageID: string, reaction: string): Promise<void>;
    /** @deprecated */
    public addMessageReaction(channelID: string, messageID: string, reaction: string, userID: string): Promise<void>;
    public addRelationship(userID: string, block?: boolean): Promise<void>;
    public addSelfPremiumSubscription(token: string, plan: string): Promise<void>;
    public banGuildMember(guildID: string, userID: string, deleteMessageDays?: number, reason?: string): Promise<void>;
    public closeVoiceConnection(guildID: string): void;
    public connect(): Promise<void>;
    public createChannel(guildID: string, name: string): Promise<TextChannel>;
    public createChannel(guildID: string, name: string, type: 0, options?: CreateChannelOptions): Promise<TextChannel>;
    public createChannel(guildID: string, name: string, type: 2, options?: CreateChannelOptions): Promise<VoiceChannel>;
    public createChannel(
      guildID: string,
      name: string,
      type: 4,
      options?: CreateChannelOptions,
    ): Promise<CategoryChannel>;
    public createChannel(guildID: string, name: string, type: 5, options?: CreateChannelOptions): Promise<NewsChannel>;
    public createChannel(guildID: string, name: string, type: 6, options?: CreateChannelOptions): Promise<StoreChannel>;
    public createChannel(
      guildID: string,
      name: string,
      type: 13,
      options?: CreateChannelOptions,
    ): Promise<StageChannel>;
    public createChannel(
      guildID: string,
      name: string,
      type?: number,
      options?: CreateChannelOptions,
    ): Promise<unknown>;
    /** @deprecated */
    public createChannel(
      guildID: string,
      name: string,
      type: 0,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<TextChannel>;
    /** @deprecated */
    public createChannel(
      guildID: string,
      name: string,
      type: 2,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<VoiceChannel>;
    /** @deprecated */
    public createChannel(
      guildID: string,
      name: string,
      type: 4,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<CategoryChannel>;
    /** @deprecated */
    public createChannel(
      guildID: string,
      name: string,
      type: 5,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<NewsChannel>;
    /** @deprecated */
    public createChannel(
      guildID: string,
      name: string,
      type: 6,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<StoreChannel>;
    /** @deprecated */
    public createChannel(
      guildID: string,
      name: string,
      type: 13,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<StageChannel>;
    /** @deprecated */
    public createChannel(
      guildID: string,
      name: string,
      type?: number,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<unknown>;
    public createChannelInvite(
      channelID: string,
      options?: CreateChannelInviteOptions,
      reason?: string,
    ): Promise<Invite<'withoutCount'>>;
    public createChannelWebhook(
      channelID: string,
      options: { name: string; avatar?: string | null },
      reason?: string,
    ): Promise<Webhook>;
    public createGroupChannel(userIDs: string[]): Promise<GroupChannel>;
    public createGuild(name: string, options?: CreateGuildOptions): Promise<Guild>;
    public createGuildEmoji(guildID: string, options: EmojiOptions, reason?: string): Promise<Emoji>;
    public createGuildFromTemplate(code: string, name: string, icon?: string): Promise<Guild>;
    public createGuildTemplate(guildID: string, name: string, description?: string | null): Promise<GuildTemplate>;
    public createMessage(
      channelID: string,
      content: MessageContent,
      file?: MessageFile | MessageFile[],
    ): Promise<Message>;
    public createRole(guildID: string, options?: RoleOptions | Role, reason?: string): Promise<Role>;
    public crosspostMessage(channelID: string, messageID: string): Promise<Message>;
    public deleteChannel(channelID: string, reason?: string): Promise<void>;
    public deleteChannelPermission(channelID: string, overwriteID: string, reason?: string): Promise<void>;
    public deleteGuild(guildID: string): Promise<void>;
    public deleteGuildDiscoverySubcategory(guildID: string, categoryID: string, reason?: string): Promise<void>;
    public deleteGuildEmoji(guildID: string, emojiID: string, reason?: string): Promise<void>;
    public deleteGuildIntegration(guildID: string, integrationID: string): Promise<void>;
    public deleteGuildTemplate(guildID: string, code: string): Promise<GuildTemplate>;
    public deleteInvite(inviteID: string, reason?: string): Promise<void>;
    public deleteMessage(channelID: string, messageID: string, reason?: string): Promise<void>;
    public deleteMessages(channelID: string, messageIDs: string[], reason?: string): Promise<void>;
    public deleteRole(guildID: string, roleID: string, reason?: string): Promise<void>;
    public deleteSelfConnection(platform: string, id: string): Promise<void>;
    public deleteSelfPremiumSubscription(): Promise<void>;
    public deleteUserNote(userID: string): Promise<void>;
    public deleteWebhook(webhookID: string, token?: string, reason?: string): Promise<void>;
    public deleteWebhookMessage(webhookID: string, token: string, messageID: string): Promise<void>;
    public disableSelfMFATOTP(code: string): Promise<{ token: string }>;
    public disconnect(options: { reconnect?: boolean | 'auto' }): void;
    public editAFK(afk: boolean): void;
    public editChannel(
      channelID: string,
      options: EditChannelOptions,
      reason?: string,
    ): Promise<GroupChannel | AnyGuildChannel>;
    public editChannelPermission(
      channelID: string,
      overwriteID: string,
      allow: bigint | number,
      deny: bigint | number,
      type: string,
      reason?: string,
    ): Promise<void>;
    public editChannelPosition(
      channelID: string,
      position: number,
      options?: EditChannelPositionOptions,
    ): Promise<void>;
    public editGuild(guildID: string, options: GuildOptions, reason?: string): Promise<Guild>;
    public editGuildDiscovery(guildID: string, options?: DiscoveryOptions): Promise<DiscoveryMetadata>;
    public editGuildEmoji(
      guildID: string,
      emojiID: string,
      options: { name?: string; roles?: string[] },
      reason?: string,
    ): Promise<Emoji>;
    public editGuildIntegration(guildID: string, integrationID: string, options: IntegrationOptions): Promise<void>;
    public editGuildMember(guildID: string, memberID: string, options: MemberOptions, reason?: string): Promise<void>;
    public editGuildTemplate(guildID: string, code: string, options: GuildTemplateOptions): Promise<GuildTemplate>;
    public editGuildVanity(guildID: string, code: string | null): Promise<GuildVanity>;
    public editGuildVoiceState(guildID: string, options: VoiceStateOptions, userID?: string): Promise<void>;
    public editGuildWelcomeScreen(guildID: string, options: WelcomeScreenOptions): Promise<WelcomeScreen>;
    public editGuildWidget(guildID: string, options: Widget): Promise<Widget>;
    public editMessage(channelID: string, messageID: string, content: MessageContent): Promise<Message>;
    public editNickname(guildID: string, nick: string, reason?: string): Promise<void>;
    public editRole(guildID: string, roleID: string, options: RoleOptions, reason?: string): Promise<Role>; // TODO not all options are available?
    public editRolePosition(guildID: string, roleID: string, position: number): Promise<void>;
    public editSelf(options: { avatar?: string; username?: string }): Promise<ExtendedUser>;
    public editSelfConnection(
      platform: string,
      id: string,
      data: { friendSync: boolean; visibility: number },
    ): Promise<Connection>;
    public editSelfSettings(data: UserSettings): Promise<UserSettings>;
    public editStatus(status?: Status, game?: ActivityPartial<BotActivityType>): void;
    public editUserNote(userID: string, note: string): Promise<void>;
    public editWebhook(webhookID: string, options: WebhookOptions, token?: string, reason?: string): Promise<Webhook>;
    public editWebhookMessage(
      webhookID: string,
      token: string,
      messageID: string,
      options: MessageWebhookContent,
    ): Promise<Message<GuildTextableChannel>>;
    public enableSelfMFATOTP(
      secret: string,
      code: string,
    ): Promise<{ backup_codes: { code: string; consumed: boolean }[]; token: string }>;
    public executeSlackWebhook(
      webhookID: string,
      token: string,
      options: Record<string, unknown> & { auth?: boolean },
    ): Promise<void>;
    public executeSlackWebhook(
      webhookID: string,
      token: string,
      options: Record<string, unknown> & { auth?: boolean; wait: true },
    ): Promise<Message<GuildTextableChannel>>;
    public executeWebhook(
      webhookID: string,
      token: string,
      options: WebhookPayload & { wait: true },
    ): Promise<Message<GuildTextableChannel>>;
    public executeWebhook(webhookID: string, token: string, options: WebhookPayload): Promise<void>;
    public followChannel(channelID: string, webhookChannelID: string): Promise<ChannelFollow>;
    public getBotGateway(): Promise<{
      session_start_limit: { max_concurrency: number; remaining: number; reset_after: number; total: number };
      shards: number;
      url: string;
    }>;
    public getChannel(channelID: string): AnyChannel;
    public getChannelInvites(channelID: string): Promise<Invite[]>;
    public getChannelWebhooks(channelID: string): Promise<Webhook[]>;
    public getDiscoveryCategories(): Promise<DiscoveryCategory[]>;
    public getDMChannel(userID: string): Promise<PrivateChannel>;
    public getGateway(): Promise<{ url: string }>;
    public getGuildAuditLog(guildID: string, options?: GetGuildAuditLogOptions): Promise<GuildAuditLog>;
    /** @deprecated */
    public getGuildAuditLogs(
      guildID: string,
      limit?: number,
      before?: string,
      actionType?: number,
      userID?: string,
    ): Promise<GuildAuditLog>;
    public getGuildBan(guildID: string, userID: string): Promise<{ reason?: string; user: User }>;
    public getGuildBans(guildID: string): Promise<{ reason?: string; user: User }[]>;
    public getGuildDiscovery(guildID: string): Promise<DiscoveryMetadata>;
    /** @deprecated */
    public getGuildEmbed(guildID: string): Promise<Widget>;
    public getGuildIntegrations(guildID: string, options?: GetGuildIntegrationsOptions): Promise<GuildIntegration[]>;
    public getGuildInvites(guildID: string): Promise<Invite[]>;
    public getGuildPreview(guildID: string): Promise<GuildPreview>;
    public getGuildTemplate(code: string): Promise<GuildTemplate>;
    public getGuildTemplates(guildID: string): Promise<GuildTemplate[]>;
    public getGuildVanity(guildID: string): Promise<GuildVanity>;
    public getGuildWebhooks(guildID: string): Promise<Webhook[]>;
    public getGuildWelcomeScreen(guildID: string): Promise<WelcomeScreen>;
    public getGuildWidget(guildID: string): Promise<Widget>;
    public getInvite(inviteID: string, withCounts?: false): Promise<Invite<'withoutCount'>>;
    public getInvite(inviteID: string, withCounts: true): Promise<Invite<'withCount'>>;
    public getMessage(channelID: string, messageID: string): Promise<Message>;
    public getMessageReaction(
      channelID: string,
      messageID: string,
      reaction: string,
      options?: GetMessageReactionOptions,
    ): Promise<User[]>;
    /** @deprecated */
    public getMessageReaction(
      channelID: string,
      messageID: string,
      reaction: string,
      limit?: number,
      before?: string,
      after?: string,
    ): Promise<User[]>;
    public getMessages(channelID: string, options?: GetMessagesOptions): Promise<Message[]>;
    /** @deprecated */
    public getMessages(
      channelID: string,
      limit?: number,
      before?: string,
      after?: string,
      around?: string,
    ): Promise<Message[]>;
    public getOAuthApplication(appID?: string): Promise<OAuthApplicationInfo>;
    public getPins(channelID: string): Promise<Message[]>;
    public getPruneCount(guildID: string, options?: GetPruneOptions): Promise<number>;
    public getRESTChannel(channelID: string): Promise<AnyChannel>;
    public getRESTGuild(guildID: string, withCounts?: boolean): Promise<Guild>;
    public getRESTGuildChannels(guildID: string): Promise<AnyGuildChannel[]>;
    public getRESTGuildEmoji(guildID: string, emojiID: string): Promise<Emoji>;
    public getRESTGuildEmojis(guildID: string): Promise<Emoji[]>;
    public getRESTGuildMember(guildID: string, memberID: string): Promise<Member>;
    public getRESTGuildMembers(guildID: string, options?: GetRESTGuildMembersOptions): Promise<Member[]>;
    /** @deprecated */
    public getRESTGuildMembers(guildID: string, limit?: number, after?: string): Promise<Member[]>;
    public getRESTGuildRoles(guildID: string): Promise<Role[]>;
    public getRESTGuilds(options?: GetRESTGuildsOptions): Promise<Guild[]>;
    /** @deprecated */
    public getRESTGuilds(limit?: number, before?: string, after?: string): Promise<Guild[]>;
    public getRESTUser(userID: string): Promise<User>;
    public getSelf(): Promise<ExtendedUser>;
    public getSelfBilling(): Promise<{
      payment_gateway?: string;
      payment_source?: {
        brand: string;
        expires_month: number;
        expires_year: number;
        invalid: boolean;
        last_4: number;
        type: string;
      };
      premium_subscription?: {
        canceled_at?: string;
        created_at: string;
        current_period_end?: string;
        current_period_start?: string;
        ended_at?: string;
        plan: string;
        status: number;
      };
    }>;
    public getSelfConnections(): Promise<Connection[]>;
    public getSelfMFACodes(
      password: string,
      regenerate?: boolean,
    ): Promise<{ backup_codes: { code: string; consumed: boolean }[] }>;
    public getSelfPayments(): Promise<
      {
        amount: number;
        amount_refunded: number;
        created_at: string; // date
        currency: string;
        description: string;
        status: number;
      }[]
    >;
    public getSelfSettings(): Promise<UserSettings>;
    public getUserProfile(userID: string): Promise<UserProfile>;
    public getVoiceRegions(guildID?: string): Promise<VoiceRegion[]>;
    public getWebhook(webhookID: string, token?: string): Promise<Webhook>;
    public getWebhookMessage(
      webhookID: string,
      token: string,
      messageID: string,
    ): Promise<Message<GuildTextableChannel>>;
    public joinVoiceChannel(
      channelID: string,
      options?: { opusOnly?: boolean; shared?: boolean },
    ): Promise<VoiceConnection>;
    public kickGuildMember(guildID: string, userID: string, reason?: string): Promise<void>;
    public leaveGuild(guildID: string): Promise<void>;
    public leaveVoiceChannel(channelID: string): void;
    public pinMessage(channelID: string, messageID: string): Promise<void>;
    public pruneMembers(guildID: string, options?: PruneMemberOptions): Promise<number>;
    public purgeChannel(channelID: string, options: PurgeChannelOptions): Promise<number>;
    /** @deprecated */
    public purgeChannel(
      channelID: string,
      limit?: number,
      filter?: (m: Message<GuildTextableChannel>) => boolean,
      before?: string,
      after?: string,
      reason?: string,
    ): Promise<number>;
    public removeGroupRecipient(groupID: string, userID: string): Promise<void>;
    public removeGuildMemberRole(guildID: string, memberID: string, roleID: string, reason?: string): Promise<void>;
    public removeMessageReaction(
      channelID: string,
      messageID: string,
      reaction: string,
      userID?: string,
    ): Promise<void>;
    public removeMessageReactionEmoji(channelID: string, messageID: string, reaction: string): Promise<void>;
    public removeMessageReactions(channelID: string, messageID: string): Promise<void>;
    public removeRelationship(userID: string): Promise<void>;
    public searchChannelMessages(channelID: string, query: SearchOptions): Promise<SearchResults>;
    public searchGuildMembers(guildID: string, query: string, limit?: number): Promise<Member[]>;
    public searchGuildMessages(guildID: string, query: SearchOptions): Promise<SearchResults>;
    public sendChannelTyping(channelID: string): Promise<void>;
    public syncGuildIntegration(guildID: string, integrationID: string): Promise<void>;
    public syncGuildTemplate(guildID: string, code: string): Promise<GuildTemplate>;
    public unbanGuildMember(guildID: string, userID: string, reason?: string): Promise<void>;
    public unpinMessage(channelID: string, messageID: string): Promise<void>;
    public validateDiscoverySearchTerm(term: string): Promise<{ valid: boolean }>;
    public on: ClientEvents<this>;
    public toString(): string;
  }

  export class Collection<T extends { id: string | number }> extends Map<string | number, T> {
    public baseObject: new (...args: any[]) => T;
    public limit?: number;
    constructor(baseObject: new (...args: any[]) => T, limit?: number);
    public add(obj: T, extra?: unknown, replace?: boolean): T;
    public every(func: (i: T) => boolean): boolean;
    public filter(func: (i: T) => boolean): T[];
    public find(func: (i: T) => boolean): T | undefined;
    public map<R>(func: (i: T) => R): R[];
    public random(): T | undefined;
    public reduce<U>(func: (accumulator: U, val: T) => U, initialValue?: U): U;
    public remove(obj: T | Uncached): T | null;
    public some(func: (i: T) => boolean): boolean;
    public update(obj: T, extra?: unknown, replace?: boolean): T;
  }

  export class Command implements CommandOptions, SimpleJSON {
    public aliases: string[];
    public argsRequired: boolean;
    public caseInsensitive: boolean;
    public cooldown: number;
    public cooldownExclusions: CommandCooldownExclusions;
    public cooldownMessage: MessageContent | false | GenericCheckFunction<MessageContent>;
    public cooldownReturns: number;
    public defaultSubcommandOptions: CommandOptions;
    public deleteCommand: boolean;
    public description: string;
    public dmOnly: boolean;
    public errorMessage: MessageContent | GenericCheckFunction<MessageContent>;
    public fullDescription: string;
    public fullLabel: string;
    public guildOnly: boolean;
    public hidden: boolean;
    public hooks: Hooks;
    public invalidUsageMessage: MessageContent | false | GenericCheckFunction<MessageContent>;
    public label: string;
    public parentCommand?: Command;
    public permissionMessage: MessageContent | false | GenericCheckFunction<MessageContent>;
    public reactionButtons: null | CommandReactionButtons[];
    public reactionButtonTimeout: number;
    public requirements: CommandRequirements;
    public restartCooldown: boolean;
    public subcommandAliases: { [alias: string]: string };
    public subcommands: { [s: string]: Command };
    public usage: string;
    constructor(label: string, generate: CommandGenerator, options?: CommandOptions);
    public cooldownCheck(msg: Message): boolean;
    public cooldownExclusionCheck(msg: Message): boolean;
    public executeCommand(msg: Message, args: string[]): Promise<GeneratorFunctionReturn>;
    public permissionCheck(msg: Message): Promise<boolean>;
    public process(args: string[], msg: Message): Promise<void | GeneratorFunctionReturn>;
    public registerSubcommand(label: string, generator: CommandGenerator, options?: CommandOptions): Command;
    public registerSubcommandAlias(alias: string, label: string): void;
    public unregisterSubcommand(label: string): void;
    public toString(): string;
    public toJSON(props?: string[]): JSONCache;
  }

  export class CommandClient extends Client {
    public activeMessages: { [s: string]: ActiveMessages };
    public commandAliases: { [s: string]: string };
    public commandOptions: CommandClientOptions;
    public commands: { [s: string]: Command };
    public guildPrefixes: { [s: string]: string | string[] };
    public preReady?: true;
    constructor(token: string, options?: ClientOptions, commandOptions?: CommandClientOptions);
    public checkPrefix(msg: Message): string;
    public onMessageCreate(msg: Message): Promise<void>;
    public onMessageReactionEvent(msg: Message, emoji: Emoji, reactor: Member | Uncached | string): Promise<void>;
    public registerCommand(label: string, generator: CommandGenerator, options?: CommandOptions): Command;
    public registerCommandAlias(alias: string, label: string): void;
    public registerGuildPrefix(guildID: string, prefix: string[] | string): void;
    public resolveCommand(label: string): Command;
    public unregisterCommand(label: string): void;
    public unwatchMessage(id: string, channelID: string): void;
    public toString(): string;
  }

  export class DiscordHTTPError extends Error {
    public code: number;
    public name: 'DiscordHTTPError';
    public req: ClientRequest;
    public res: IncomingMessage;
    public response: HTTPResponse;
    constructor(req: ClientRequest, res: IncomingMessage, response: HTTPResponse, stack: string);
    public flattenErrors(errors: HTTPResponse, keyPrefix?: string): string[];
  }

  export class DiscordRESTError extends Error {
    public code: number;
    public name: string;
    public req: ClientRequest;
    public res: IncomingMessage;
    public response: HTTPResponse;
    constructor(req: ClientRequest, res: IncomingMessage, response: HTTPResponse, stack: string);
    public flattenErrors(errors: HTTPResponse, keyPrefix?: string): string[];
  }

  export class ExtendedUser extends User {
    public email: string;
    public mfaEnabled: boolean;
    public premiumType: 0 | 1 | 2;
    public verified: boolean;
  }

  export class GroupChannel extends PrivateChannel {
    public icon: string | null;
    public iconURL: string | null;
    public name: string;
    public ownerID: string;
    public recipients: Collection<User>;
    public type: 3;
    public addRecipient(userID: string): Promise<void>;
    public dynamicIconURL(format?: ImageFormat, size?: number): string;
    public edit(options: { icon?: string; name?: string; ownerID?: string }): Promise<GroupChannel>;
    public removeRecipient(userID: string): Promise<void>;
  }

  export class Guild extends Base {
    public afkChannelID: string | null;
    public afkTimeout: number;
    public applicationID: string | null;
    public approximateMemberCount?: number;
    public approximatePresenceCount?: number;
    public autoRemoved?: boolean;
    public banner: string | null;
    public bannerURL: string | null;
    public channels: Collection<AnyGuildChannel>;
    public createdAt: number;
    public defaultNotifications: DefaultNotifications;
    public description: string | null;
    public discoverySplash: string | null;
    public discoverySplashURL: string | null;
    public emojiCount?: number;
    public emojis: Emoji[];
    public explicitContentFilter: ExplicitContentFilter;
    public features: string[];
    public icon: string | null;
    public iconURL: string | null;
    public id: string;
    public joinedAt: number;
    public large: boolean;
    public maxMembers: number;
    public maxPresences: number;
    public maxVideoChannelUsers?: number;
    public memberCount: number;
    public members: Collection<Member>;
    public mfaLevel: MFALevel;
    public name: string;
    public nsfw: boolean;
    public ownerID: string;
    public preferredLocale: string;
    public premiumSubscriptionCount?: number;
    public premiumTier: PremiumTier;
    public primaryCategory?: DiscoveryCategory;
    public primaryCategoryID?: number;
    public publicUpdatesChannelID: string;
    public region: string;
    public roles: Collection<Role>;
    public rulesChannelID: string | null;
    public shard: Shard;
    public splash: string | null;
    public splashURL: string | null;
    public systemChannelFlags: number;
    public systemChannelID: string | null;
    public unavailable: boolean;
    public vanityURL: string | null;
    public verificationLevel: VerificationLevel;
    public voiceStates: Collection<VoiceState>;
    public welcomeScreen?: WelcomeScreen;
    public widgetChannelID?: string | null;
    public widgetEnabled?: boolean | null;
    constructor(data: BaseData, client: Client);
    public addDiscoverySubcategory(categoryID: string, reason?: string): Promise<DiscoverySubcategoryResponse>;
    public addMemberRole(memberID: string, roleID: string, reason?: string): Promise<void>;
    public banMember(userID: string, deleteMessageDays?: number, reason?: string): Promise<void>;
    public createChannel(name: string): Promise<TextChannel>;
    public createChannel(name: string, type: 0, options?: CreateChannelOptions): Promise<TextChannel>;
    public createChannel(name: string, type: 2, options?: CreateChannelOptions): Promise<VoiceChannel>;
    public createChannel(name: string, type: 4, options?: CreateChannelOptions): Promise<CategoryChannel>;
    public createChannel(name: string, type: 5, options?: CreateChannelOptions | string): Promise<NewsChannel>;
    public createChannel(name: string, type: 6, options?: CreateChannelOptions | string): Promise<StoreChannel>;
    public createChannel(name: string, type: 13, options?: CreateChannelOptions | string): Promise<StageChannel>;
    public createChannel(name: string, type?: number, options?: CreateChannelOptions): Promise<unknown>;
    /** @deprecated */
    public createChannel(
      name: string,
      type: 0,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<TextChannel>;
    /** @deprecated */
    public createChannel(
      name: string,
      type: 2,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<VoiceChannel>;
    /** @deprecated */
    public createChannel(
      name: string,
      type: 4,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<CategoryChannel>;
    /** @deprecated */
    public createChannel(
      name: string,
      type: 5,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<NewsChannel>;
    /** @deprecated */
    public createChannel(
      name: string,
      type: 6,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<StoreChannel>;
    /** @deprecated */
    public createChannel(
      name: string,
      type: 13,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<StageChannel>;
    /** @deprecated */
    public createChannel(
      name: string,
      type?: number,
      reason?: string,
      options?: CreateChannelOptions | string,
    ): Promise<unknown>;
    public createEmoji(options: { image: string; name: string; roles?: string[] }, reason?: string): Promise<Emoji>;
    public createRole(options: RoleOptions | Role, reason?: string): Promise<Role>;
    public createTemplate(name: string, description?: string | null): Promise<GuildTemplate>;
    public delete(): Promise<void>;
    public deleteDiscoverySubcategory(categoryID: string, reason?: string): Promise<void>;
    public deleteEmoji(emojiID: string, reason?: string): Promise<void>;
    public deleteIntegration(integrationID: string): Promise<void>;
    public deleteRole(roleID: string): Promise<void>;
    public deleteTemplate(code: string): Promise<GuildTemplate>;
    public dynamicBannerURL(format?: ImageFormat, size?: number): string;
    public dynamicDiscoverySplashURL(format?: ImageFormat, size?: number): string;
    public dynamicIconURL(format?: ImageFormat, size?: number): string;
    public dynamicSplashURL(format?: ImageFormat, size?: number): string;
    public edit(options: GuildOptions, reason?: string): Promise<Guild>;
    public editDiscovery(options?: DiscoveryOptions): Promise<DiscoveryMetadata>;
    public editEmoji(emojiID: string, options: { name: string; roles?: string[] }, reason?: string): Promise<Emoji>;
    public editIntegration(integrationID: string, options: IntegrationOptions): Promise<void>;
    public editMember(memberID: string, options: MemberOptions, reason?: string): Promise<void>;
    public editNickname(nick: string): Promise<void>;
    public editRole(roleID: string, options: RoleOptions): Promise<Role>;
    public editTemplate(code: string, options: GuildTemplateOptions): Promise<GuildTemplate>;
    public editVanity(code: string | null): Promise<GuildVanity>;
    public editVoiceState(options: VoiceStateOptions, userID?: string): Promise<void>;
    public editWelcomeScreen(options: WelcomeScreenOptions): Promise<WelcomeScreen>;
    public editWidget(options: Widget): Promise<Widget>;
    public fetchAllMembers(timeout?: number): Promise<number>;
    public fetchMembers(options?: FetchMembersOptions): Promise<Member[]>;
    public getAuditLog(options?: GetGuildAuditLogOptions): Promise<GuildAuditLog>;
    /** @deprecated */
    public getAuditLogs(limit?: number, before?: string, actionType?: number, userID?: string): Promise<GuildAuditLog>;
    public getBan(userID: string): Promise<{ reason?: string; user: User }>;
    public getBans(): Promise<{ reason?: string; user: User }[]>;
    public getDiscovery(): Promise<DiscoveryMetadata>;
    /** @deprecated */
    public getEmbed(): Promise<Widget>;
    public getIntegrations(options?: GetGuildIntegrationsOptions): Promise<GuildIntegration>;
    public getInvites(): Promise<Invite[]>;
    public getPruneCount(options?: GetPruneOptions): Promise<number>;
    public getRESTChannels(): Promise<AnyGuildChannel[]>;
    public getRESTEmoji(emojiID: string): Promise<Emoji>;
    public getRESTEmojis(): Promise<Emoji[]>;
    public getRESTMember(memberID: string): Promise<Member>;
    public getRESTMembers(options?: GetRESTGuildMembersOptions): Promise<Member[]>;
    /** @deprecated */
    public getRESTMembers(limit?: number, after?: string): Promise<Member[]>;
    public getRESTRoles(): Promise<Role[]>;
    public getTemplates(): Promise<GuildTemplate[]>;
    public getVanity(): Promise<GuildVanity>;
    public getVoiceRegions(): Promise<VoiceRegion[]>;
    public getWebhooks(): Promise<Webhook[]>;
    public getWelcomeScreen(): Promise<WelcomeScreen>;
    public getWidget(): Promise<Widget>;
    public kickMember(userID: string, reason?: string): Promise<void>;
    public leave(): Promise<void>;
    public leaveVoiceChannel(): void;
    public permissionsOf(memberID: string | Member): Permission;
    public pruneMembers(options?: PruneMemberOptions): Promise<number>;
    public removeMemberRole(memberID: string, roleID: string, reason?: string): Promise<void>;
    public searchMembers(query: string, limit?: number): Promise<Member[]>;
    public syncIntegration(integrationID: string): Promise<void>;
    public syncTemplate(code: string): Promise<GuildTemplate>;
    public unbanMember(userID: string, reason?: string): Promise<void>;
  }

  export class GuildAuditLogEntry extends Base {
    public actionType: number;
    public after: { [key: string]: unknown } | null;
    public before: { [key: string]: unknown } | null;
    public channel?: AnyGuildChannel;
    public count?: number;
    public deleteMemberDays?: number;
    public guild: Guild;
    public id: string;
    public member?: Member | unknown;
    public membersRemoved?: number;
    public message?: Message<GuildTextableChannel>;
    public reason: string | null;
    public role?: Role | { id: string; name: string };
    public target?: Guild | AnyGuildChannel | Member | Role | Invite | Emoji | Message<GuildTextableChannel> | null;
    public targetID: string;
    public user: User;
    constructor(data: BaseData, guild: Guild);
  }

  export class GuildChannel extends Channel {
    public guild: Guild;
    public name: string;
    public nsfw: boolean;
    public parentID: string | null;
    public permissionOverwrites: Collection<PermissionOverwrite>;
    public position: number;
    public type: Exclude<ChannelTypes, 1 | 3>;
    constructor(data: BaseData, guild: Guild);
    public delete(reason?: string): Promise<void>;
    public deletePermission(overwriteID: string, reason?: string): Promise<void>;
    public edit(options: Omit<EditChannelOptions, 'icon' | 'ownerID'>, reason?: string): Promise<this>;
    public editPermission(
      overwriteID: string,
      allow: bigint | number,
      deny: bigint | number,
      type: PermissionType,
      reason?: string,
    ): Promise<PermissionOverwrite>;
    public editPosition(position: number, options?: EditChannelPositionOptions): Promise<void>;
    public getInvites(): Promise<Invite[]>;
    public permissionsOf(memberID: string | Member): Permission;
  }

  export class GuildIntegration extends Base {
    public account: { id: string; name: string };
    public application?: IntegrationApplication;
    public createdAt: number;
    public enabled: boolean;
    public enableEmoticons: boolean;
    public expireBehavior: number;
    public expireGracePeriod: number;
    public id: string;
    public name: string;
    public revoked: boolean;
    public roleID: string;
    public subscriberCount: number;
    public syncedAt: number;
    public syncing: boolean;
    public type: string;
    public user?: User;
    constructor(data: BaseData, guild: Guild);
    public delete(): Promise<void>;
    public edit(options: { enableEmoticons: string; expireBehavior: string; expireGracePeriod: string }): Promise<void>;
    public sync(): Promise<void>;
  }

  export class GuildPreview extends Base {
    public approximateMemberCount: number;
    public approximatePresenceCount: number;
    public description: string | null;
    public discoverySplash: string | null;
    public discoverySplashURL: string | null;
    public emojis: Emoji[];
    public features: string[];
    public icon: string | null;
    public iconURL: string | null;
    public id: string;
    public name: string;
    public splash: string | null;
    public splashURL: string | null;
    constructor(data: BaseData, client: Client);
    public dynamicDiscoverySplashURL(format?: ImageFormat, size?: number): string;
    public dynamicIconURL(format?: ImageFormat, size?: number): string;
    public dynamicSplashURL(format?: ImageFormat, size?: number): string;
  }

  export class GuildTemplate {
    public code: string;
    public createdAt: number;
    public creator: User;
    public description: string | null;
    public isDirty: string | null;
    public name: string;
    public serializedSourceGuild: Guild;
    public sourceGuild: Guild | Uncached;
    public updatedAt: number;
    public usageCount: number;
    constructor(data: BaseData, client: Client);
    public createGuild(name: string, icon?: string): Promise<Guild>;
    public delete(): Promise<GuildTemplate>;
    public edit(options: GuildTemplateOptions): Promise<GuildTemplate>;
    public sync(): Promise<GuildTemplate>;
    public toJSON(props?: string[]): JSONCache;
  }

  // If CT (count) is "withMetadata", it will not have count properties
  export class Invite<
    CT extends 'withMetadata' | 'withCount' | 'withoutCount' = 'withMetadata',
    CH extends InviteChannel = InviteChannel,
  > extends Base {
    public channel: CH;
    public code: string;
    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore: Property is only not null when invite metadata is supplied
    public createdAt: CT extends 'withMetadata' ? number : null;
    public guild: CT extends 'withMetadata'
      ? Guild // Invite with Metadata always has guild prop
      : CH extends Extract<InviteChannel, GroupChannel> // Invite without Metadata
      ? never // If the channel is GroupChannel, there is no guild
      : CH extends Exclude<InviteChannel, InvitePartialChannel> // Invite without Metadata and not GroupChanel
      ? Guild // If the invite channel is not partial
      : Guild | undefined; // If the invite channel is partial
    public inviter?: User;
    public maxAge: CT extends 'withMetadata' ? number : null;
    public maxUses: CT extends 'withMetadata' ? number : null;
    public memberCount: CT extends 'withMetadata' | 'withoutCount' ? null : number;
    public presenceCount: CT extends 'withMetadata' | 'withoutCount' ? null : number;
    public temporary: CT extends 'withMetadata' ? boolean : null;
    public uses: CT extends 'withMetadata' ? number : null;
    constructor(data: BaseData, client: Client);
    public delete(reason?: string): Promise<void>;
  }

  export class Member extends Base implements Presence {
    public activities?: Activity[];
    public avatar: string | null;
    public avatarURL: string;
    public bot: boolean;
    public clientStatus?: ClientStatus;
    public createdAt: number;
    public defaultAvatar: string;
    public defaultAvatarURL: string;
    public discriminator: string;
    public game: Activity | null;
    public guild: Guild;
    public id: string;
    public joinedAt: number;
    public mention: string;
    public nick: string | null;
    public pending?: boolean;
    /** @deprecated */
    public permission: Permission;
    public permissions: Permission;
    public premiumSince: number;
    public roles: string[];
    public staticAvatarURL: string;
    public status?: Status;
    public user: User;
    public username: string;
    public voiceState: VoiceState;
    constructor(data: BaseData, guild?: Guild, client?: Client);
    public addRole(roleID: string, reason?: string): Promise<void>;
    public ban(deleteMessageDays?: number, reason?: string): Promise<void>;
    public edit(options: MemberOptions, reason?: string): Promise<void>;
    public kick(reason?: string): Promise<void>;
    public removeRole(roleID: string, reason?: string): Promise<void>;
    public unban(reason?: string): Promise<void>;
  }

  export class Message<T extends PossiblyUncachedTextable = TextableChannel> extends Base {
    public activity?: MessageActivity;
    public application?: MessageApplication;
    public attachments: Attachment[];
    public author: User;
    public channel: T;
    public channelMentions: string[];
    /** @deprecated */
    public cleanContent: string;
    public command?: Command;
    public content: string;
    public createdAt: number;
    public editedTimestamp?: number;
    public embeds: Embed[];
    public flags: number;
    public guildID: T extends GuildTextable ? string : undefined;
    public id: string;
    public interaction: MessageInteraction | null;
    public jumpLink: string;
    public member: T extends GuildTextable ? Member : null;
    public mentionEveryone: boolean;
    public mentions: User[];
    public messageReference: MessageReference | null;
    public pinned: boolean;
    public prefix?: string;
    public reactions: { [s: string]: { count: number; me: boolean } };
    public referencedMessage?: Message | null;
    public roleMentions: string[];
    public stickers?: Sticker[];
    public timestamp: number;
    public tts: boolean;
    public type: number;
    public webhookID: T extends GuildTextable ? string | undefined : undefined;
    constructor(data: BaseData, client: Client);
    public addReaction(reaction: string): Promise<void>;
    /** @deprecated */
    public addReaction(reaction: string, userID: string): Promise<void>;
    public crosspost(): Promise<T extends NewsChannel ? Message<NewsChannel> : never>;
    public delete(reason?: string): Promise<void>;
    public deleteWebhook(token: string): Promise<void>;
    public edit(content: MessageContent): Promise<Message<T>>;
    public editWebhook(token: string, options: MessageWebhookContent): Promise<Message<T>>;
    public getReaction(reaction: string, options?: GetMessageReactionOptions): Promise<User[]>;
    /** @deprecated */
    public getReaction(reaction: string, limit?: number, before?: string, after?: string): Promise<User[]>;
    public pin(): Promise<void>;
    public removeReaction(reaction: string, userID?: string): Promise<void>;
    public removeReactionEmoji(reaction: string): Promise<void>;
    public removeReactions(): Promise<void>;
    public unpin(): Promise<void>;
  }

  // News channel rate limit is always 0
  export class NewsChannel extends TextChannel {
    public rateLimitPerUser: 0;
    public type: 5;
    public createInvite(options?: CreateInviteOptions, reason?: string): Promise<Invite<'withMetadata', NewsChannel>>;
    public createMessage(content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message<NewsChannel>>;
    public crosspostMessage(messageID: string): Promise<Message<NewsChannel>>;
    public editMessage(messageID: string, content: MessageContent): Promise<Message<NewsChannel>>;
    public follow(webhookChannelID: string): Promise<ChannelFollow>;
    public getInvites(): Promise<Invite<'withMetadata', NewsChannel>[]>;
    public getMessage(messageID: string): Promise<Message<NewsChannel>>;
    public getMessages(options?: GetMessagesOptions): Promise<Message<NewsChannel>[]>;
    /** @deprecated */
    public getMessages(
      limit?: number,
      before?: string,
      after?: string,
      around?: string,
    ): Promise<Message<NewsChannel>[]>;
    public getPins(): Promise<Message<NewsChannel>[]>;
  }

  export class Permission extends Base {
    public allow: bigint;
    public deny: bigint;
    public json: Record<keyof Constants['Permissions'], boolean>;
    constructor(allow: number | string | bigint, deny?: number | string | bigint);
    public has(permission: keyof Constants['Permissions']): boolean;
  }

  export class PermissionOverwrite extends Permission {
    public id: string;
    public type: PermissionType;
    constructor(data: Overwrite);
  }

  export class Piper extends EventEmitter {
    public converterCommand: ConverterCommand;
    public dataPacketCount: number;
    public encoding: boolean;
    public libopus: boolean;
    public opus: OpusScript | null;
    public opusFactory: () => OpusScript;
    public volumeLevel: number;
    constructor(converterCommand: string, opusFactory: OpusScript);
    public addDataPacket(packet: unknown): void;
    public encode(source: string | Stream, options: VoiceResourceOptions): boolean;
    public getDataPacket(): Buffer;
    public reset(): void;
    public resetPackets(): void;
    public setVolume(volume: number): void;
    public stop(e: Error, source: Duplex): void;
  }

  export class PrivateChannel extends Channel implements Textable {
    public lastMessageID: string;
    public messages: Collection<Message<this>>;
    public recipient: User;
    public type: 1 | 3;
    public addMessageReaction(messageID: string, reaction: string): Promise<void>;
    /** @deprecated */
    public addMessageReaction(messageID: string, reaction: string, userID: string): Promise<void>;
    public createMessage(content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message<PrivateChannel>>;
    public deleteMessage(messageID: string, reason?: string): Promise<void>;
    public editMessage(messageID: string, content: MessageContent): Promise<Message<PrivateChannel>>;
    public getMessage(messageID: string): Promise<Message<PrivateChannel>>;
    public getMessageReaction(
      messageID: string,
      reaction: string,
      options?: GetMessageReactionOptions,
    ): Promise<User[]>;
    /** @deprecated */
    public getMessageReaction(
      messageID: string,
      reaction: string,
      limit?: number,
      before?: string,
      after?: string,
    ): Promise<User[]>;
    public getMessages(options?: GetMessagesOptions): Promise<Message<PrivateChannel>[]>;
    /** @deprecated */
    public getMessages(
      limit?: number,
      before?: string,
      after?: string,
      around?: string,
    ): Promise<Message<PrivateChannel>[]>;
    public getPins(): Promise<Message<PrivateChannel>[]>;
    public leave(): Promise<void>;
    public pinMessage(messageID: string): Promise<void>;
    public removeMessageReaction(messageID: string, reaction: string): Promise<void>;
    /** @deprecated */
    public removeMessageReaction(messageID: string, reaction: string, userID: string): Promise<void>;
    public ring(recipient: string[]): void;
    public sendTyping(): Promise<void>;
    public syncCall(): void;
    public unpinMessage(messageID: string): Promise<void>;
    public unsendMessage(messageID: string): Promise<void>;
  }

  export class Relationship extends Base implements Presence {
    public activities?: Activity[];
    public clientStatus?: ClientStatus;
    public game: Activity | null;
    public id: string;
    public status: Status;
    public type: number;
    public user: User;
    constructor(data: BaseData, client: Client);
  }

  export class RequestHandler implements SimpleJSON {
    public globalBlock: boolean;
    public latencyRef: LatencyRef;
    public options: RequestHandlerOptions;
    public ratelimits: { [route: string]: SequentialBucket };
    public readyQueue: (() => void)[];
    public userAgent: string;
    constructor(client: Client, options?: RequestHandlerOptions);
    /** @deprecated */
    constructor(client: Client, forceQueueing?: boolean);
    public globalUnblock(): void;
    public request(
      method: RequestMethod,
      url: string,
      auth?: boolean,
      body?: { [s: string]: unknown },
      file?: MessageFile,
      _route?: string,
      short?: boolean,
    ): Promise<unknown>;
    public routefy(url: string, method: RequestMethod): string;
    public toString(): string;
    public toJSON(props?: string[]): JSONCache;
  }

  export class Role extends Base {
    public color: number;
    public createdAt: number;
    public guild: Guild;
    public hoist: boolean;
    public id: string;
    public json: Partial<
      Record<Exclude<keyof Constants['Permissions'], 'all' | 'allGuild' | 'allText' | 'allVoice'>, boolean>
    >;
    public managed: boolean;
    public mention: string;
    public mentionable: boolean;
    public name: string;
    public permissions: Permission;
    public position: number;
    public tags?: RoleTags;
    constructor(data: BaseData, guild: Guild);
    public delete(reason?: string): Promise<void>;
    public edit(options: RoleOptions, reason?: string): Promise<Role>;
    public editPosition(position: number): Promise<void>;
  }

  class SequentialBucket {
    public latencyRef: LatencyRef;
    public limit: number;
    public processing: boolean;
    public remaining: number;
    public reset: number;
    constructor(limit: number, latencyRef?: LatencyRef);
    public check(override?: boolean): void;
    public queue(func: (cb: () => void) => void, short?: boolean): void;
  }

  export class Shard extends EventEmitter implements SimpleJSON {
    public client: Client;
    public connectAttempts: number;
    public connecting: boolean;
    public connectTimeout: NodeJS.Timeout | null;
    public discordServerTrace?: string[];
    public getAllUsersCount: { [guildID: string]: boolean };
    public getAllUsersLength: number;
    public getAllUsersQueue: string;
    public globalBucket: Bucket;
    public guildCreateTimeout: NodeJS.Timeout | null;
    public guildSyncQueue: string[];
    public guildSyncQueueLength: number;
    public heartbeatInterval: NodeJS.Timeout | null;
    public id: number;
    public lastHeartbeatAck: boolean;
    public lastHeartbeatReceived: number | null;
    public lastHeartbeatSent: number | null;
    public latency: number;
    public preReady: boolean;
    public presence: Presence;
    public presenceUpdateBucket: Bucket;
    public ready: boolean;
    public reconnectInterval: number;
    public requestMembersPromise: { [s: string]: RequestMembersPromise };
    public seq: number;
    public sessionID: string | null;
    public status: 'disconnected' | 'connecting' | 'handshaking' | 'ready' | 'resuming';
    public unsyncedGuilds: number;
    public ws: WebSocket | BrowserWebSocket | null;
    constructor(id: number, client: Client);
    public checkReady(): void;
    public connect(): void;
    public createGuild(_guild: Guild): Guild;
    public disconnect(options?: { reconnect?: boolean | 'auto' }, error?: Error): void;
    public editAFK(afk: boolean): void;
    public editStatus(status?: Status, game?: ActivityPartial<BotActivityType>): void;
    public editStatus(game?: ActivityPartial<BotActivityType>): void;
    // @ts-ignore: Method override
    public emit(event: string, ...args: any[]): void;
    public getGuildMembers(guildID: string, timeout: number): void;
    public hardReset(): void;
    public heartbeat(normal?: boolean): void;
    public identify(): void;
    public initializeWS(): void;
    public onPacket(packet: RawPacket): void;
    public requestGuildMembers(
      guildID: string,
      options?: RequestGuildMembersOptions,
    ): Promise<RequestGuildMembersReturn>;
    public requestGuildSync(guildID: string): void;
    public reset(): void;
    public restartGuildCreateTimeout(): void;
    public resume(): void;
    public sendStatusUpdate(): void;
    public sendWS(op: number, _data: Record<string, unknown>, priority?: boolean): void;
    public syncGuild(guildID: string): void;
    public wsEvent(packet: Required<RawPacket>): void;
    public on: ShardEvents<this>;
    public toJSON(props?: string[]): JSONCache;
  }

  export class ShardManager extends Collection<Shard> implements SimpleJSON {
    public connectQueue: Shard[];
    public connectTimeout: NodeJS.Timer | null;
    public lastConnect: number;
    constructor(client: Client);
    public connect(shard: Shard): void;
    public spawn(id: number): void;
    public tryConnect(): void;
    public toString(): string;
    public toJSON(props?: string[]): JSONCache;
  }

  export class SharedStream extends EventEmitter {
    public bitrate: number;
    public channels: number;
    public current?: VoiceStreamCurrent;
    public ended: boolean;
    public frameDuration: number;
    public piper: Piper;
    public playing: boolean;
    public samplingRate: number;
    public speaking: boolean;
    public voiceConnections: Collection<VoiceConnection>;
    public volume: number;
    public add(connection: VoiceConnection): void;
    public play(resource: ReadableStream | string, options?: VoiceResourceOptions): void;
    public remove(connection: VoiceConnection): void;
    public setSpeaking(value: boolean): void;
    public setVolume(volume: number): void;
    public stopPlaying(): void;
    public on: StreamEvents<this>;
  }

  export class StageChannel extends VoiceChannel {
    public topic?: string;
    public type: 13;
  }

  export class StoreChannel extends GuildChannel {
    public type: 6;
    public edit(options: Omit<EditChannelOptions, 'icon' | 'ownerID'>, reason?: string): Promise<this>;
  }

  export class TextChannel extends GuildChannel implements GuildTextable, Invitable {
    public lastMessageID: string;
    public lastPinTimestamp: number | null;
    public messages: Collection<Message<this>>;
    public rateLimitPerUser: number;
    public topic: string | null;
    public type: 0 | 5;
    constructor(data: BaseData, guild: Guild, messageLimit: number);
    public addMessageReaction(messageID: string, reaction: string): Promise<void>;
    /** @deprecated */
    public addMessageReaction(messageID: string, reaction: string, userID: string): Promise<void>;
    public createInvite(options?: CreateInviteOptions, reason?: string): Promise<Invite<'withMetadata', TextChannel>>;
    public createMessage(content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message<TextChannel>>;
    public createWebhook(options: { name: string; avatar?: string | null }, reason?: string): Promise<Webhook>;
    public deleteMessage(messageID: string, reason?: string): Promise<void>;
    public deleteMessages(messageIDs: string[], reason?: string): Promise<void>;
    public edit(options: Omit<EditChannelOptions, 'icon' | 'ownerID'>, reason?: string): Promise<this>;
    public editMessage(messageID: string, content: MessageContent): Promise<Message<TextChannel>>;
    public getInvites(): Promise<Invite<'withMetadata', TextChannel>[]>;
    public getMessage(messageID: string): Promise<Message<TextChannel>>;
    public getMessageReaction(
      messageID: string,
      reaction: string,
      options?: GetMessageReactionOptions,
    ): Promise<User[]>;
    /** @deprecated */
    public getMessageReaction(
      messageID: string,
      reaction: string,
      limit?: number,
      before?: string,
      after?: string,
    ): Promise<User[]>;
    public getMessages(options?: GetMessagesOptions): Promise<Message<TextChannel>[]>;
    /** @deprecated */
    public getMessages(
      limit?: number,
      before?: string,
      after?: string,
      around?: string,
    ): Promise<Message<TextChannel>[]>;
    public getPins(): Promise<Message<TextChannel>[]>;
    public getWebhooks(): Promise<Webhook[]>;
    public pinMessage(messageID: string): Promise<void>;
    public purge(options: PurgeChannelOptions): Promise<number>;
    /** @deprecated */
    public purge(
      limit: number,
      filter?: (message: Message<this>) => boolean,
      before?: string,
      after?: string,
      reason?: string,
    ): Promise<number>;
    public removeMessageReaction(messageID: string, reaction: string, userID?: string): Promise<void>;
    public removeMessageReactionEmoji(messageID: string, reaction: string): Promise<void>;
    public removeMessageReactions(messageID: string): Promise<void>;
    public sendTyping(): Promise<void>;
    public unpinMessage(messageID: string): Promise<void>;
    public unsendMessage(messageID: string): Promise<void>;
  }

  export class UnavailableGuild extends Base {
    public createdAt: number;
    public id: string;
    public shard: Shard;
    public unavailable: boolean;
    constructor(data: BaseData, client: Client);
  }

  export class User extends Base {
    public avatar: string | null;
    public avatarURL: string;
    public bot: boolean;
    public createdAt: number;
    public defaultAvatar: string;
    public defaultAvatarURL: string;
    public discriminator: string;
    public id: string;
    public mention: string;
    public publicFlags?: number;
    public staticAvatarURL: string;
    public system: boolean;
    public username: string;
    constructor(data: BaseData, client: Client);
    public addRelationship(block?: boolean): Promise<void>;
    public deleteNote(): Promise<void>;
    public dynamicAvatarURL(format?: ImageFormat, size?: number): string;
    public editNote(note: string): Promise<void>;
    public getDMChannel(): Promise<PrivateChannel>;
    public getProfile(): Promise<UserProfile>;
    public removeRelationship(): Promise<void>;
  }

  export class VoiceChannel extends GuildChannel implements Invitable {
    public bitrate: number;
    public rtcRegion: string | null;
    public type: 2 | 13;
    public userLimit: number;
    public videoQualityMode: VideoQualityMode;
    public voiceMembers: Collection<Member>;
    public createInvite(options?: CreateInviteOptions, reason?: string): Promise<Invite<'withMetadata', VoiceChannel>>;
    public getInvites(): Promise<Invite<'withMetadata', VoiceChannel>[]>;
    public join(options: { opusOnly?: boolean; shared?: boolean }): Promise<VoiceConnection>;
    public leave(): void;
  }

  export class VoiceConnection extends EventEmitter implements SimpleJSON {
    public bitrate: number;
    public channelID: string | null;
    public channels: number;
    public connecting: boolean;
    public connectionTimeout: NodeJS.Timeout | null;
    public current?: VoiceStreamCurrent | null;
    public ended?: boolean;
    public endpoint: URL;
    public frameDuration: number;
    public frameSize: number;
    public heartbeatInterval: NodeJS.Timeout | null;
    public id: string;
    public mode?: string;
    public modes?: string;
    /** Optional dependencies OpusScript (opusscript) or OpusEncoder (@discordjs/opus) */
    public opus: { [userID: string]: unknown };
    public opusOnly: boolean;
    public paused: boolean;
    public pcmSize: number;
    public piper: Piper;
    public playing: boolean;
    public ready: boolean;
    public receiveStreamOpus?: VoiceDataStream | null;
    public receiveStreamPCM?: VoiceDataStream | null;
    public reconnecting: boolean;
    public samplingRate: number;
    public secret: Buffer;
    public sendBuffer: Buffer;
    public sendNonce: Buffer;
    public sequence: number;
    public shard: Shard | Record<string, never>;
    public shared: boolean;
    public speaking: boolean;
    public ssrc?: number;
    public ssrcUserMap: { [s: number]: string };
    public timestamp: number;
    public udpIP?: string;
    public udpPort?: number;
    public udpSocket: DgramSocket | null;
    public volume: number;
    public ws: BrowserWebSocket | WebSocket | null;
    constructor(id: string, options?: { shard?: Shard; shared?: boolean; opusOnly?: boolean });
    public connect(data: VoiceConnectData): NodeJS.Timer | void;
    public disconnect(error?: Error, reconnecting?: boolean): void;
    public heartbeat(): void;
    public pause(): void;
    public play(resource: ReadableStream | string, options?: VoiceResourceOptions): void;
    public receive(type: 'opus' | 'pcm'): VoiceDataStream;
    public registerReceiveEventHandler(): void;
    public resume(): void;
    public sendWS(op: number, data: Record<string, unknown>): void;
    public setSpeaking(value: boolean): void;
    public setVolume(volume: number): void;
    public stopPlaying(): void;
    public switchChannel(channelID: string): void;
    public updateVoiceState(selfMute: boolean, selfDeaf: boolean): void;
    public on: VoiceEvents<this>;
    public toJSON(props?: string[]): JSONCache;
  }

  export class VoiceConnectionManager<T extends VoiceConnection = VoiceConnection>
    extends Collection<T>
    implements SimpleJSON
  {
    constructor(vcObject: new () => T);
    public join(guildID: string, channelID: string, options: VoiceResourceOptions): Promise<VoiceConnection>;
    public leave(guildID: string): void;
    public switch(guildID: string, channelID: string): void;
    public voiceServerUpdate(data: VoiceServerUpdateData): void;
    public toJSON(props?: string[]): JSONCache;
  }

  export class VoiceDataStream extends EventEmitter {
    public type: 'opus' | 'pcm';
    constructor(type: string);
    public on(
      event: 'data',
      listener: (data: Buffer, userID: string, timestamp: number, sequence: number) => void,
    ): this;
  }

  export class VoiceState extends Base {
    public channelID: string | null;
    public createdAt: number;
    public deaf: boolean;
    public id: string;
    public mute: boolean;
    public requestToSpeakTimestamp: number | null;
    public selfDeaf: boolean;
    public selfMute: boolean;
    public selfStream: boolean;
    public selfVideo: boolean;
    public sessionID: string | null;
    public suppress: boolean;
    constructor(data: BaseData);
  }
}

export = Eris;
