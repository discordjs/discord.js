import { ImageExtension, ImageSize, StickerExtension } from './utils/constants';
/**
 * The options used for image URLs
 */
export interface BaseImageURLOptions {
    /**
     * The extension to use for the image URL
     * @default 'webp'
     */
    extension?: ImageExtension;
    /**
     * The size specified in the image URL
     */
    size?: ImageSize;
}
/**
 * The options used for image URLs with animated content
 */
export interface ImageURLOptions extends BaseImageURLOptions {
    /**
     * Whether or not to prefer the static version of an image asset.
     */
    forceStatic?: boolean;
}
/**
 * The options to use when making a CDN URL
 */
export interface MakeURLOptions {
    /**
     * The extension to use for the image URL
     * @default 'webp'
     */
    extension?: string | undefined;
    /**
     * The size specified in the image URL
     */
    size?: ImageSize;
    /**
     * The allowed extensions that can be used
     */
    allowedExtensions?: ReadonlyArray<string>;
}
/**
 * The CDN link builder
 */
export declare class CDN {
    private readonly base;
    constructor(base?: string);
    /**
     * Generates an app asset URL for a client's asset.
     * @param clientId The client id that has the asset
     * @param assetHash The hash provided by Discord for this asset
     * @param options Optional options for the asset
     */
    appAsset(clientId: string, assetHash: string, options?: Readonly<BaseImageURLOptions>): string;
    /**
     * Generates an app icon URL for a client's icon.
     * @param clientId The client id that has the icon
     * @param iconHash The hash provided by Discord for this icon
     * @param options Optional options for the icon
     */
    appIcon(clientId: string, iconHash: string, options?: Readonly<BaseImageURLOptions>): string;
    /**
     * Generates an avatar URL, e.g. for a user or a webhook.
     * @param id The id that has the icon
     * @param avatarHash The hash provided by Discord for this avatar
     * @param options Optional options for the avatar
     */
    avatar(id: string, avatarHash: string, options?: Readonly<ImageURLOptions>): string;
    /**
     * Generates a banner URL, e.g. for a user or a guild.
     * @param id The id that has the banner splash
     * @param bannerHash The hash provided by Discord for this banner
     * @param options Optional options for the banner
     */
    banner(id: string, bannerHash: string, options?: Readonly<ImageURLOptions>): string;
    /**
     * Generates an icon URL for a channel, e.g. a group DM.
     * @param channelId The channel id that has the icon
     * @param iconHash The hash provided by Discord for this channel
     * @param options Optional options for the icon
     */
    channelIcon(channelId: string, iconHash: string, options?: Readonly<BaseImageURLOptions>): string;
    /**
     * Generates the default avatar URL for a discriminator.
     * @param discriminator The discriminator modulo 5
     */
    defaultAvatar(discriminator: number): string;
    /**
     * Generates a discovery splash URL for a guild's discovery splash.
     * @param guildId The guild id that has the discovery splash
     * @param splashHash The hash provided by Discord for this splash
     * @param options Optional options for the splash
     */
    discoverySplash(guildId: string, splashHash: string, options?: Readonly<BaseImageURLOptions>): string;
    /**
     * Generates an emoji's URL for an emoji.
     * @param emojiId The emoji id
     * @param extension The extension of the emoji
     */
    emoji(emojiId: string, extension?: ImageExtension): string;
    /**
     * Generates a guild member avatar URL.
     * @param guildId The id of the guild
     * @param userId The id of the user
     * @param avatarHash The hash provided by Discord for this avatar
     * @param options Optional options for the avatar
     */
    guildMemberAvatar(guildId: string, userId: string, avatarHash: string, options?: Readonly<ImageURLOptions>): string;
    /**
     * Generates an icon URL, e.g. for a guild.
     * @param id The id that has the icon splash
     * @param iconHash The hash provided by Discord for this icon
     * @param options Optional options for the icon
     */
    icon(id: string, iconHash: string, options?: Readonly<ImageURLOptions>): string;
    /**
     * Generates a URL for the icon of a role
     * @param roleId The id of the role that has the icon
     * @param roleIconHash The hash provided by Discord for this role icon
     * @param options Optional options for the role icon
     */
    roleIcon(roleId: string, roleIconHash: string, options?: Readonly<BaseImageURLOptions>): string;
    /**
     * Generates a guild invite splash URL for a guild's invite splash.
     * @param guildId The guild id that has the invite splash
     * @param splashHash The hash provided by Discord for this splash
     * @param options Optional options for the splash
     */
    splash(guildId: string, splashHash: string, options?: Readonly<BaseImageURLOptions>): string;
    /**
     * Generates a sticker URL.
     * @param stickerId The sticker id
     * @param extension The extension of the sticker
     */
    sticker(stickerId: string, extension?: StickerExtension): string;
    /**
     * Generates a sticker pack banner URL.
     * @param bannerId The banner id
     * @param options Optional options for the banner
     */
    stickerPackBanner(bannerId: string, options?: Readonly<BaseImageURLOptions>): string;
    /**
     * Generates a team icon URL for a team's icon.
     * @param teamId The team id that has the icon
     * @param iconHash The hash provided by Discord for this icon
     * @param options Optional options for the icon
     */
    teamIcon(teamId: string, iconHash: string, options?: Readonly<BaseImageURLOptions>): string;
    /**
     * Generates a cover image for a guild scheduled event.
     * @param scheduledEventId The scheduled event id
     * @param coverHash The hash provided by discord for this cover image
     * @param options Optional options for the cover image
     */
    guildScheduledEventCover(scheduledEventId: string, coverHash: string, options?: Readonly<BaseImageURLOptions>): string;
    /**
     * Constructs the URL for the resource, checking whether or not `hash` starts with `a_` if `dynamic` is set to `true`.
     * @param route The base cdn route
     * @param hash The hash provided by Discord for this icon
     * @param options Optional options for the link
     */
    private dynamicMakeURL;
    /**
     * Constructs the URL for the resource
     * @param route The base cdn route
     * @param options The extension/size options for the link
     */
    private makeURL;
}
