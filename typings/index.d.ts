// Type definitions for discord.js 10.0.1
// Project: https://github.com/hydrabolt/discord.js
// Definitions by: acdenisSK <acdenissk69@gmail.com> (https://github.com/acdenisSK)

declare module "discord.js" {
    import { EventEmitter } from "events";
    import { Readable as ReadableStream } from "stream";
    import { ChildProcess } from "child_process";

    export const version: string;
    export class Client extends EventEmitter {
        constructor(options?: ClientOptions);
        email: string;
        emojis: Collection<string, Emoji>;
        guilds: Collection<string, Guild>;
        channels: Collection<string, Channel>;
        options: ClientOptions;
        password: string;
        readyAt: Date;
        readyTimestamp: number;
        status: number;
        token: string;
        uptime: number;
        user: ClientUser;
        users: Collection<string, User>;
        voiceConnections: Collection<string, VoiceConnection>;
        clearInterval(timeout: NodeJS.Timer): void;
        clearTimeout(timeout: NodeJS.Timer): void;
        destroy(): Promise<void>;
        fetchInvite(code: string): Promise<Invite>;
        fetchUser(id: string): Promise<User>;
        login(tokenOrEmail: string, password?: string): Promise<string>;
        setInterval(fn: Function, delay: number, ...args: any[]): NodeJS.Timer;
        setTimeout(fn: Function, delay: number, ...args: any[]): NodeJS.Timer;
        sweepMessages(lifetime?: number): number;
        syncGuilds(guilds?: Guild[]): void;
        on(event: string, listener: Function): this;
        on(event: "debug", listener: (the: string) => void): this;
        on(event: "disconnect", listener: () => void): this;
        on(event: "error", listener: (error: Error) => void): this;
        on(event: "guildBanAdd", listener: (user: User) => void): this;
        on(event: "guildBanRemove", listener: (user: User) => void): this;
        on(event: "guildCreate", listener: (guild: Guild) => void): this;
        on(event: "guildDelete", listener: (guild: Guild) => void): this;
        on(event: "guildEmojiCreate", listener: (emoji: Emoji) => void): this;
        on(event: "guildEmojiDelete", listener: (emoji: Emoji) => void): this;
        on(event: "guildEmojiUpdate", listener: (oldEmoji: Emoji, newEmoji: Emoji) => void): this;
        on(event: "guildMemberAdd", listener: (member: GuildMember) => void): this;
        on(event: "guildMemberAvailable", listener: (member: GuildMember) => void): this;
        on(event: "guildMemberRemove", listener: (member: GuildMember) => void): this;
        on(event: "guildMembersChunk", listener: (members: GuildMember[]) => void): this;
        on(event: "guildMemberSpeaking", listener: (member: GuildMember, speaking: boolean) => void): this;
        on(event: "guildMemberUpdate", listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
        on(event: "roleCreate", listener: (role: Role) => void): this;
        on(event: "roleDelete", listener: (role: Role) => void): this;
        on(event: "roleUpdate", listener: (oldRole: Role, newRole: Role) => void): this;
        on(event: "guildUnavailable", listener: (guild: Guild) => void): this;
        on(event: "guildUpdate", listener: (oldGuild: Guild, newGuild: Guild) => void): this;
        on(event: "channelCreate", listener: (channel: Channel) => void): this;
        on(event: "channelDelete", listener: (channel: Channel) => void): this;
        on(event: "channelPinsUpdate", listener: (channel: Channel, time: Date) => void): this;
        on(event: "channelUpdate", listener: (oldChannel: Channel, newChannel: Channel) => void): this;
        on(event: "message", listener: (message: Message) => void): this;
        on(event: "messageDelete", listener: (message: Message) => void): this;
        on(event: "messageDeleteBulk", listener: (messages: Collection<string, Message>) => void): this;
        on(event: "messageUpdate", listener: (oldMessage: Message, newMessage: Message) => void): this;
        on(event: "presenceUpdate", listener: (oldUser: User, newUser: User) => void): this;
        on(event: "ready", listener: () => void): this;
        on(event: "reconnecting", listener: () => void): this;
        on(event: "typingStart", listener: (channel: Channel, user: User) => void): this;
        on(event: "typingStop", listener: (channel: Channel, user: User) => void): this;
        on(event: "userUpdate", listener: (oldClientUser: ClientUser, newClientUser: ClientUser) => void): this;
        on(event: "voiceStateUpdate", listener: (oldMember: GuildMember, newMember: GuildMember) => void): this;
        on(event: "warn", listener: (the: string) => void): this;
    }
    export class Webhook {
        avatar: string;
        client: Client;
        guildID: string;
        channelID: string;
        id: string;
        name: string;
        token: string;
        delete(): Promise<void>;
        edit(name: string, avatar: FileResolvable): Promise<Webhook>;
        sendCode(lang: string, content: StringResolvable, options?: WebhookMessageOptions): Promise<Message | Message[]>;
        sendFile(attachment: FileResolvable, fileName?: string, content?: StringResolvable, options?: WebhookMessageOptions): Promise<Message>;
        sendMessage(content: StringResolvable, options?: WebhookMessageOptions): Promise<Message | Message[]>;
        sendSlackMessage(body: Object): Promise<void>;
        sendTTSMessage(content: StringResolvable, options?: WebhookMessageOptions): Promise<Message | Message[]>;
    }
    class SecretKey {
        key: Uint8Array;
    }
    class RequestHandler { // docs going nowhere again, yay
        constructor(restManager: {});
        globalLimit: boolean;
        queue: {}[];
        restManager: {};
        handle();
        push(request: {});
    }
    export class WebhookClient extends Webhook {
        contructor(id: string, token: string, options?: ClientOptions);
        options: ClientOptions;
    }
    export class Emoji {
        client: Client;
        createdAt: Date;
        createdTimestamp: number;
        guild: Guild;
        id: string;
        managed: boolean;
        name: string;
        requiresColons: boolean;
        roles: Collection<string, Role>;
        url: string;
        toString(): string;
    }
    export class ReactionEmoji {
        id: string;
        identifier: string;
        name: string;
        reaction: MessageReaction;
        toString(): string;
    }
    export class ClientUser extends User {
        email: string;
        verified: boolean;
        blocked: Collection<string, User>;
        friends: Collection<string, User>;
        addFriend(user: UserResolvable): Promise<User>;
        removeFriend(user: UserResolvable): Promise<User>;
        setAvatar(avatar: Base64Resolvable): Promise<ClientUser>;
        setEmail(email: string): Promise<ClientUser>;
        setPassword(password: string): Promise<ClientUser>;
        setStatus(status?: string): Promise<ClientUser>;
        setGame(game: string, streamingURL?: string): Promise<ClientUser>;
        setPresence(data: Object): Promise<ClientUser>;
        setUsername(username: string): Promise<ClientUser>;
        createGuild(name: string, region: string, icon?: FileResolvable): Promise<Guild>;
    }
    export class Presence {
        game: Game;
        status: string;
        equals(other: Presence): boolean;
    }
    export class Channel {
        client: Client;
        createdAt: Date;
        createdTimestamp: number;
        id: string;
        type: string;
        delete(): Promise<Channel>;
    }
    export class DMChannel extends Channel {
        lastMessageID: string;
        messages: Collection<string, Message>;
        recipient: User;
        typing: boolean;
        typingCount: number;
        awaitMessages(filter: CollectorFilterFunction, options?: AwaitMessagesOptions): Promise<Collection<string, Message>>;
        bulkDelete(messages: Collection<string, Message> | Message[] | number): Collection<string, Message>;
        createCollector(filter: CollectorFilterFunction, options?: CollectorOptions): MessageCollector;
        fetchMessage(messageID: string): Promise<Message>;
        fetchMessages(options?: ChannelLogsQueryOptions): Promise<Collection<string, Message>>;
        fetchPinnedMessages(): Promise<Collection<string, Message>>;
        sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
        sendFile(attachment: FileResolvable, fileName?: string, content?: StringResolvable, options?: MessageOptions): Promise<Message>;
        sendMessage(content: string, options?: MessageOptions): Promise<Message | Message[]>;
        sendTTSMessage(content: string, options?: MessageOptions): Promise<Message | Message[]>;
        startTyping(count?: number): void;
        stopTyping(force?: boolean): void;
        toString(): string;
    }
    export class GroupDMChannel extends Channel {
        lastMessageID: string;
        messages: Collection<string, Message>;
        recipients: Collection<string, User>;
        owner: User;
        typing: boolean;
        typingCount: number;
        awaitMessages(filter: CollectorFilterFunction, options?: AwaitMessagesOptions): Promise<Collection<string, Message>>;
        bulkDelete(messages: Collection<string, Message> | Message[] | number): Collection<string, Message>;
        createCollector(filter: CollectorFilterFunction, options?: CollectorOptions): MessageCollector;
        fetchMessage(messageID: string): Promise<Message>;
        fetchMessages(options?: ChannelLogsQueryOptions): Promise<Collection<string, Message>>;
        fetchPinnedMessages(): Promise<Collection<string, Message>>;
        sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
        sendFile(attachment: FileResolvable, fileName?: string, content?: StringResolvable, options?: MessageOptions): Promise<Message>;
        sendMessage(content: string, options?: MessageOptions): Promise<Message | Message[]>;
        sendTTSMessage(content: string, options?: MessageOptions): Promise<Message | Message[]>;
        startTyping(count?: number): void;
        stopTyping(force?: boolean): void;
        toString(): string;
    }
    export class GuildChannel extends Channel {
        guild: Guild;
        name: string;
        permissionOverwrites: Collection<string, PermissionOverwrites>;
        position: number;
        createInvite(options?: InviteOptions): Promise<Invite>;
        equals(channel: GuildChannel): boolean;
        overwritePermissions(userOrRole: Role | User, options: PermissionOverwriteOptions): Promise<void>;
        permissionsFor(member: GuildMemberResolvable): EvaluatedPermissions;
        setName(name: string): Promise<GuildChannel>;
        setPosition(position: number): Promise<GuildChannel>;
        setTopic(topic: string): Promise<GuildChannel>;
        toString(): string;
    }
    export class TextChannel extends GuildChannel {
        lastMessageID: string;
        members: Collection<string, GuildMember>;
        messages: Collection<string, Message>;
        topic: string;
        typing: boolean;
        typingCount: number;
        awaitMessages(filter: CollectorFilterFunction, options?: AwaitMessagesOptions): Promise<Collection<string, Message>>;
        bulkDelete(messages: Collection<string, Message> | Message[] | number): Collection<string, Message>;
        createCollector(filter: CollectorFilterFunction, options?: CollectorOptions): MessageCollector;
        fetchMessage(messageID: string): Promise<Message>;
        fetchMessages(options?: ChannelLogsQueryOptions): Promise<Collection<string, Message>>;
        fetchPinnedMessages(): Promise<Collection<string, Message>>;
        sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
        sendFile(attachment: FileResolvable, fileName?: string, content?: StringResolvable, options?: MessageOptions): Promise<Message>;
        sendMessage(content: string, options?: MessageOptions): Promise<Message | Message[]>;
        sendTTSMessage(content: string, options?: MessageOptions): Promise<Message | Message[]>;
        startTyping(count?: number): void;
        stopTyping(force?: boolean): void;
    }
    export class MessageCollector extends EventEmitter {
        constructor(channel: Channel, filter: CollectorFilterFunction, options?: CollectorOptions);
        collected: Collection<string, Message>;
        filter: CollectorFilterFunction;
        channel: Channel;
        options: CollectorOptions;
        stop(reason?: string): void;
        on(event: "end", listener: (collection: Collection<string, Message>, reason: string) => void): this;
        on(event: "message", listener: (message: Message, collector: MessageCollector) => void): this;
    }
    export class Game {
        name: string;
        streaming: boolean;
        url: string;
        type: number;
        equals(other: Game): boolean;
    }
    export class PermissionOverwrites {
        channel: GuildChannel;
        id: string;
        type: string;
        delete(): Promise<PermissionOverwrites>;
    }
    export class Guild {
        afkChannelID: string;
        afkTimeout: number;
        available: boolean;
        client: Client;
        createdAt: Date;
        createdTimestamp: number;
        defaultChannel: GuildChannel;
        embedEnabled: boolean;
        emojis: Collection<string, Emoji>;
        features: Object[];
        channels: Collection<string, GuildChannel>;
        icon: string;
        iconURL: string;
        id: string;
        joinDate: Date;
        large: boolean;
        memberCount: number;
        members: Collection<string, GuildMember>;
        name: string;
        owner: GuildMember;
        ownerID: string;
        region: string;
        roles: Collection<string, Role>;
        splash: string;
        verificationLevel: number;
        voiceConnection: VoiceConnection;
        ban(user: GuildMember, deleteDays?: number): Promise<GuildMember | User | string>;
        createChannel(name: string, type: "text" | "voice"): Promise<TextChannel | VoiceChannel>;
        createRole(data?: RoleData): Promise<Role>;
        delete(): Promise<Guild>;
        edit(data: {}): Promise<Guild>;
        equals(guild: Guild): boolean;
        fetchBans(): Promise<Collection<string, User>>;
        fetchInvites(): Promise<Collection<string, Invite>>;
        fetchMember(user: UserResolvable): Promise<GuildMember>;
        fetchMembers(query?: string): Promise<Guild>;
        leave(): Promise<Guild>;
        member(user: UserResolvable): GuildMember;
        pruneMembers(days: number, dry?: boolean): Promise<number>;
        setAFKChannel(afkChannel: ChannelResovalble): Promise<Guild>;
        setAFKTimeout(afkTimeout: number): Promise<Guild>;
        setIcon(icon: Base64Resolvable): Promise<Guild>;
        setName(name: string): Promise<Guild>;
        setOwner(owner: GuildMemberResolvable): Promise<Guild>;
        setRegion(region: string): Promise<Guild>;
        setSplash(splash: Base64Resolvable): Promise<Guild>;
        setVerificationLevel(level: number): Promise<Guild>;
        sync(): void;
        toString(): string;
        unban(user: UserResolvable): Promise<User>;
    }
    export class GuildMember {
        bannable: boolean;
        client: Client;
        deaf: boolean;
        guild: Guild;
        highestRole: Role;
        id: string;
        joinDate: Date;
        kickable: boolean;
        mute: boolean;
        nickname: string;
        permissions: EvaluatedPermissions;
        roles: Collection<string, Role>;
        selfDeaf: boolean;
        selfMute: boolean;
        serverDeaf: boolean;
        serverMute: boolean;
        speaking: boolean;
        user: User;
        voiceChannel: VoiceChannel;
        voiceChannelID: string;
        voiceSessionID: string;
        addRole(role: Role | string): Promise<GuildMember>;
        addRoles(roles: Collection<string, Role> | Role[] | string[]): Promise<GuildMember>;
        ban(deleteDays?: number): Promise<GuildMember>;
        deleteDM(): Promise<DMChannel>;
        edit(data: {}): Promise<GuildMember>;
        hasPermission(permission: PermissionResolvable, explicit?: boolean): boolean;
        hasPermissions(permission: Permissions[], explicit?: boolean): boolean;
        kick(): Promise<GuildMember>;
        permissionsIn(channel: ChannelResovalble): EvaluatedPermissions;
        removeRole(role: Role | string): Promise<GuildMember>;
        removeRoles(roles: Collection<string, Role> | Role[] | string[]): Promise<GuildMember>;
        sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
        sendFile(attachment: FileResolvable, fileName?: string, content?: StringResolvable, options?: MessageOptions): Promise<Message>;
        sendMessage(content: string, options?: MessageOptions): Promise<Message | Message[]>;
        sendTTSMessage(content: string, options?: MessageOptions): Promise<Message | Message[]>;
        setDeaf(deaf: boolean): Promise<GuildMember>;
        setMute(mute: boolean): Promise<GuildMember>;
        setNickname(nickname: string): Promise<GuildMember>;
        setRoles(roles: Collection<string, Role> | Role[] | string[]): Promise<GuildMember>;
        setVoiceChannel(voiceChannel: ChannelResovalble): Promise<GuildMember>;
        toString(): string;
    }
    export class User {
        avatar: string;
        avatarURL: string;
        bot: boolean;
        client: Client;
        createdAt: Date;
        createdTimestamp: number;
        discriminator: string;
        presence: Presence;
        id: string;
        status: string;
        username: string;
        block(): Promise<User>;
        unblock(): Promise<User>;
        fetchProfile(): Promise<UserProfile>;
        deleteDM(): Promise<DMChannel>;
        equals(user: User): boolean;
        sendCode(lang: string, content: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
        sendFile(attachment: FileResolvable, fileName?: string, content?: StringResolvable, options?: MessageOptions): Promise<Message>;
        sendMessage(content: string, options?: MessageOptions): Promise<Message | Message[]>;
        sendTTSMessage(content: string, options?: MessageOptions): Promise<Message | Message[]>;
        toString(): string;
    }
    export class PartialGuildChannel {
        client: Client;
        id: string;
        name: string;
        type: string;
    }
    export class PartialGuild {
        client: Client;
        icon: string;
        id: string;
        name: string;
        splash: string;
    }
    class PendingVoiceConnection {
        data: Object;
        deathTimer: NodeJS.Timer;
        channel: VoiceChannel;
        voiceManager: ClientVoiceManager;
        setSessionID(sessionID: string);
        setTokenAndEndpoint(token: string, endpoint: string);
        upgrade(): VoiceConnection;
    }
    export class OAuth2Application {
        client: Client;
        createdAt: Date;
        createdTimestamp: number;
        description: string;
        icon: string;
        iconURL: string;
        id: string;
        name: string;
        rpcOrigins: string[];
        toString(): string;
    }
    export class ClientOAuth2Application extends OAuth2Application {
        flags: number;
        owner: User;
    }
    export class Message {
        attachments: Collection<string, MessageAttachment>;
        author: User;
        channel: TextChannel | DMChannel | GroupDMChannel;
        cleanContent: string;
        client: Client;
        content: string;
        createdAt: Date;
        createdTimestamp: number;
        deletable: boolean;
        editable: boolean;
        editedAt: Date;
        editedTimestamp: number;
        edits: Message[];
        embeds: MessageEmbed[];
        guild: Guild;
        id: string;
        member: GuildMember;
        mentions: {
            users: Collection<string, User>;
            roles: Collection<string, Role>;
            channels: Collection<string, GuildChannel>;
            everyone: boolean;
        };
        nonce: string;
        pinnable: boolean;
        pinned: boolean;
        reactions: Collection<string, MessageReaction>;
        system: boolean;
        tts: boolean;
        type: string;
        addReaction(emoji: string): MessageReaction; // Not really documented but still worth using/making typings for it.
        delete(timeout?: number): Promise<Message>;
        edit(content: StringResolvable): Promise<Message>;
        editCode(lang: string, content: StringResolvable): Promise<Message>;
        equals(message: Message, rawData: Object): boolean;
        isMentioned(data: GuildChannel | User | Role | string): boolean;
        pin(): Promise<Message>;
        reply(content: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
        toString(): string;
        unpin(): Promise<Message>;
    }
    export class MessageEmbed {
        author: MessageEmbedAuthor;
        client: Client;
        description: string;
        message: Message;
        provider: MessageEmbedProvider;
        thumbnail: MessageEmbedThumbnail;
        title: string;
        type: string;
        url: string;
    }
    export class MessageEmbedThumbnail {
        embed: MessageEmbed;
        height: number;
        proxyURL: string;
        url: string;
        width: number;
    }
    export class MessageEmbedProvider {
        embed: MessageEmbed;
        name: string;
        url: string;
    }
    export class MessageEmbedAuthor {
        embed: MessageEmbed;
        name: string;
        url: string;
    }
    export class MessageAttachment {
        client: Client;
        filename: string;
        filesize: number;
        height: number;
        id: string;
        message: Message;
        proxyURL: string;
        url: string;
        width: number;
    }
    export class MessageReaction {
        count: number;
        emoji: Emoji | ReactionEmoji;
        me: boolean;
        message: Message;
        users: Collection<string, User>;
        fetchUsers(limit?: number): Promise<Collection<string, User>>;
        remove(user?: UserResolvable): Promise<MessageReaction>;
    }
    export class Invite {
        client: Client;
        code: string;
        createdAt: Date;
        createdTimestamp: number;
        guild: Guild | PartialGuild;
        channel: GuildChannel | PartialGuildChannel;
        inviter: User;
        maxUses: number;
        temporary: boolean;
        url: string;
        uses: number;
        delete(): Promise<Invite>;
        toString(): string;
    }
    export class VoiceChannel extends GuildChannel {
        bitrate: number;
        connection: VoiceConnection;
        members: Collection<string, GuildMember>;
        userLimit: number;
        join(): Promise<VoiceConnection>;
        leave(): null;
        setBitrate(bitrate: number): Promise<VoiceChannel>;
    }
    export class Shard {
        id: string;
        manager: ShardingManager;
        process: ChildProcess;
        eval(script: string): Promise<any>;
        fetchClientValue(prop: string): Promise<any>;
        send(message: any): Promise<Shard>;
    }
    export class ShardingManager extends EventEmitter {
        constructor(file: string, options?: {
            totalShards?: number;
            respawn?: boolean;
            shardArgs?: string[];
            token?: string;
        });
        file: string;
        respawn: boolean;
        shardArgs: string[];
        shards: Collection<number, Shard>;
        totalShards: number;
        broadcast(message: any): Promise<Shard[]>;
        broadcastEval(script: string): Promise<any[]>;
        createShard(id: number): Promise<Shard>;
        fetchClientValues(prop: string): Promise<any[]>;
        spawn(amount?: number, delay?: number): Promise<Collection<number, Shard>>;
        on(event: "launch", listener: (shard: Shard) => void): this;
    }
    export class ShardClientUtil {
        contructor(client: Client);
        id: number;
        count: number;
        broadcastEval(script: string): Promise<any[]>;
        fetchClientValues(prop: string): Promise<any[]>;
        send(message: any): Promise<void>;
        singleton(client: Client): ShardClientUtil;
    }
    export class UserConnection {
        id: string;
        integrations: Object[];
        name: string;
        revoked: boolean;
        type: string;
        user: User;
    }
    export class UserProfile {
        client: Client;
        connections: Collection<string, UserConnection>;
        mutualGuilds: Collection<string, Guild>;
        user: User;
    }
    export class StreamDispatcher extends EventEmitter {
        passes: number;
        time: number;
        totalStreamTime: number;
        volume: number;
        end(): void;
        pause(): void;
        resume(): void;
        setVolume(volume: number): void;
        setVolumeDecibels(db: number): void;
        setVolumeLogarithmic(value: number): void;
        on(event: "debug", listener: (information: string) => void): this;
        on(event: "end", listener: () => void): this;
        on(event: "error", listener: (err: Error) => void): this;
        on(event: "speaking", listener: (value: boolean) => void): this;
        on(event: "start", listener: () => void): this;
    }
    interface Permissions {
        CREATE_INSTANT_INVITE: boolean;
        KICK_MEMBERS: boolean;
        BAN_MEMBERS: boolean;
        ADMINISTRATOR: boolean;
        MANAGE_CHANNELS: boolean;
        MANAGE_GUILD: boolean;
        READ_MESSAGES: boolean;
        SEND_MESSAGES: boolean;
        SEND_TTS_MESSAGES: boolean;
        MANAGE_MESSAGES: boolean;
        EMBED_LINKS: boolean;
        ATTACH_FILES: boolean;
        READ_MESSAGE_HISTORY: boolean;
        MENTION_EVERYONE: boolean;
        USE_EXTERNAL_EMOJIS: boolean;
        CONNECT: boolean;
        SPEAK: boolean;
        MUTE_MEMBERS: boolean;
        DEAFEN_MEMBERS: boolean;
        MOVE_MEMBERS: boolean;
        USE_VAD: boolean;
        CHANGE_NICKNAME: boolean;
        MANAGE_NICKNAMES: boolean;
        MANAGE_ROLES: boolean;
        MANAGE_WEBHOOKS: boolean;
    }
    export class EvaluatedPermissions {
        member: GuildMember;
        raw: number;
        hasPermission(permission: PermissionResolvable, explicit?: boolean): boolean;
        hasPermissions(permission: PermissionResolvable[], explicit?: boolean): boolean;
        serialize(): Permissions;
    }
    export class Role {
        client: Client;
        color: number;
        createdAt: Date; createdTimestamp: number;
        guild: Guild;
        hexColor: string;
        hoist: boolean;
        id: string;
        managed: boolean;
        members: Collection<string, GuildMember>;
        mentionable: boolean;
        name: string;
        permissions: number;
        position: number;
        delete(): Promise<Role>;
        edit(data: RoleData): Promise<Role>;
        equals(role: Role): boolean;
        hasPermission(permission: PermissionResolvable, explicit?: boolean): boolean;
        hasPermissions(permissions: PermissionResolvable[], explicit?: boolean): boolean;
        serialize(): Permissions;
        setColor(color: string | number): Promise<Role>;
        setHoist(hoist: boolean): Promise<Role>;
        setName(name: string): Promise<Role>;
        setPermissions(permissions: string[]): Promise<Role>;
        setPosition(position: number): Promise<Role>;
        toString(): string;
    }
    export class ClientVoiceManager {
        client: Client;
        connections: Collection<string, VoiceConnection>;
        pending: Collection<string, VoiceConnection>;
        joinChannel(channel: VoiceChannel): Promise<VoiceConnection>;
        sendVoiceStateUpdate(channel: VoiceChannel, options?: Object);
    }
    class AudioPlayer extends EventEmitter {
        dispatcher: StreamDispatcher;
        voiceConnection: VoiceConnection;
    }
    export class VoiceConnection extends EventEmitter {
        authentication: Object;
        channel: VoiceChannel;
        player: AudioPlayer;
        receivers: VoiceReceiver[];
        sockets: Object;
        ssrcMap: Map<number, boolean>;
        voiceManager: ClientVoiceManager;
        createReceiver(): VoiceReceiver;
        disconnect();
        playConvertedStream(stream: ReadableStream, options?: StreamOptions): StreamDispatcher;
        playFile(file: string, options?: StreamOptions): StreamDispatcher;
        playStream(stream: ReadableStream, options?: StreamOptions): StreamDispatcher;
        on(event: "disconnect", listener: (error: Error) => void): this;
        on(event: "error", listener: (error: Error) => void): this;
        on(event: "ready", listener: () => void): this;
        on(event: "speaking", listener: (user: User, speaking: boolean) => void): this;
    }
    export class VoiceReceiver extends EventEmitter {
        connection: VoiceConnection;
        destroyed: boolean;
        createOpusStream(user: User): ReadableStream;
        createPCMStream(user: User): ReadableStream;
        destroy(): void;
        recreate(): void;
        on(event: "opus", listener: (user: User, buffer: Buffer) => void): this;
        on(event: "pcm", listener: (user: User, buffer: Buffer) => void): this;
        on(event: "warn", listener: (message: string) => void): this;
    }
    export class Collection<key, value> extends Map<key, value> {
        array(): value[];
        concat(...collections: Collection<any, any>[]): Collection<any, any>;
        deleteAll(): Promise<void[]>;
        every(fn: Function, thisArg?: Object): boolean;
        exists(prop: string, value: any): boolean;
        filter(fn: Function, thisArg?: Object): Collection<key, value>;
        filterArray(fn: Function, thisArg?: Object): value[];
        find(propOrFn: string | Function, value?: any): value;
        findAll(prop: string, value: any): value[];
        findKey(propOrFn: string | Function, value?: any): key;
        first(): value;
        firstKey(): key;
        keyArray(): key[];
        last(): value;
        lastKey(): key;
        map(fn: Function, thisArg?: Object): any[];
        random(): value;
        randomKey(): key;
        reduce(fn: Function, startVal?: any): any;
        some(fn: Function, thisArg?: Object): boolean;
    }
    type CollectorOptions = { time?: number; max?: number };
    type AwaitMessagesOptions = { time?: number; max?: number; errors?: string[]; };
    type Base64Resolvable = Buffer | string;
    type CollectorFilterFunction = (message: Message, collector: MessageCollector) => boolean;
    type FileResolvable = Buffer | string;
    type GuildMemberResolvable = GuildMember | User;
    type GuildResolvable = Guild;
    type ChannelLogsQueryOptions = { limit?: number; before?: string; after?: string; around?: string };
    type ChannelResovalble = Channel | Guild | Message | string;
    type InviteOptions = { temporary?: boolean; maxAge?: number; maxUses?: number; };
    type MessageOptions = { tts?: boolean; nonce?: string; disableEveryone?: boolean; split?: boolean | SplitOptions; };
    type PermissionOverwriteOptions = Permissions;
    type PermissionResolvable = string | string[] | number[];
    type SplitOptions = { maxLength?: number; char?: string; prepend?: string; append?: string; };
    type StreamOptions = { seek?: number; volume?: number; passes?: number; };
    type StringResolvable = any[] | string | any;
    type UserResolvable = User | string | Message | Guild | GuildMember;
    type WebSocketOptions = { large_threshold?: number; compress?: boolean; };
    type ClientOptions = {
        apiRequestMethod?: string;
        shardId?: number;
        shardCount?: number;
        maxMessageCache?: number;
        messageCacheLifetime?: number;
        messageSweepInterval?: number;
        fetchAllMembers?: boolean;
        disableEveryone?: boolean;
        restWsBridgeTimeout?: number;
        ws?: WebSocketOptions;
    };
    type WebhookMessageOptions = {
        tts?: boolean;
        disableEveryone?: boolean;
    };
    type WebhookOptions = {
        large_threshold?: number;
        compress?: boolean;
    };
    type RoleData = {
        name?: string;
        color?: number | string;
        hoist?: boolean;
        position?: number;
        permissions?: string[];
        mentionable?: boolean;
    };
}
