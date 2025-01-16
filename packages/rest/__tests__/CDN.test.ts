import { test, expect } from 'vitest';
import { CDN } from '../src/index.js';

const baseCDN = 'https://cdn-discord.com';
const baseMedia = 'https://media-discord.com';
const id = '123456';
const hash = 'abcdef';
const animatedHash = 'a_bcdef';
const defaultAvatar = 1_234 % 5;

const cdn = new CDN(baseCDN, baseMedia);

test('appAsset default', () => {
	expect(cdn.appAsset(id, hash)).toEqual(`${baseCDN}/app-assets/${id}/${hash}.webp`);
});

test('appIcon default', () => {
	expect(cdn.appIcon(id, hash)).toEqual(`${baseCDN}/app-icons/${id}/${hash}.webp`);
});

test('avatar default', () => {
	expect(cdn.avatar(id, hash)).toEqual(`${baseCDN}/avatars/${id}/${hash}.webp`);
});

test('avatar dynamic-animated', () => {
	expect(cdn.avatar(id, animatedHash)).toEqual(`${baseCDN}/avatars/${id}/${animatedHash}.gif`);
});

test('avatar dynamic-not-animated', () => {
	expect(cdn.avatar(id, hash)).toEqual(`${baseCDN}/avatars/${id}/${hash}.webp`);
});

test('avatar decoration preset', () => {
	expect(cdn.avatarDecoration(hash)).toEqual(`${baseCDN}/avatar-decoration-presets/${hash}.png`);
});

test('banner default', () => {
	expect(cdn.banner(id, hash)).toEqual(`${baseCDN}/banners/${id}/${hash}.webp`);
});

test('channelIcon default', () => {
	expect(cdn.channelIcon(id, hash)).toEqual(`${baseCDN}/channel-icons/${id}/${hash}.webp`);
});

test('defaultAvatar default', () => {
	expect(cdn.defaultAvatar(defaultAvatar)).toEqual(`${baseCDN}/embed/avatars/${defaultAvatar}.png`);
});

test('discoverySplash default', () => {
	expect(cdn.discoverySplash(id, hash)).toEqual(`${baseCDN}/discovery-splashes/${id}/${hash}.webp`);
});

test('emoji static', () => {
	expect(cdn.emoji(id, false)).toEqual(`${baseCDN}/emojis/${id}.webp`);
});

test('emoji static with JPG extension', () => {
	expect(cdn.emoji(id, false, { extension: 'jpg' })).toEqual(`${baseCDN}/emojis/${id}.jpg`);
});

test('emoji static with JPG extension with force static', () => {
	expect(cdn.emoji(id, false, { extension: 'jpg', forceStatic: true })).toEqual(`${baseCDN}/emojis/${id}.jpg`);
});

test('emoji animated', () => {
	expect(cdn.emoji(id, true)).toEqual(`${baseCDN}/emojis/${id}.gif`);
});

test('emoji animated with JPG extension', () => {
	expect(cdn.emoji(id, true, { extension: 'jpg' })).toEqual(`${baseCDN}/emojis/${id}.gif`);
});

test('emoji animated with JPG extension with force static', () => {
	expect(cdn.emoji(id, true, { extension: 'jpg', forceStatic: true })).toEqual(`${baseCDN}/emojis/${id}.jpg`);
});

test('guildMemberAvatar default', () => {
	expect(cdn.guildMemberAvatar(id, id, hash)).toEqual(`${baseCDN}/guilds/${id}/users/${id}/avatars/${hash}.webp`);
});

test('guildMemberAvatar dynamic-animated', () => {
	expect(cdn.guildMemberAvatar(id, id, animatedHash)).toEqual(
		`${baseCDN}/guilds/${id}/users/${id}/avatars/${animatedHash}.gif`,
	);
});

test('guildMemberAvatar dynamic-not-animated', () => {
	expect(cdn.guildMemberAvatar(id, id, hash)).toEqual(`${baseCDN}/guilds/${id}/users/${id}/avatars/${hash}.webp`);
});

test('guildMemberBanner default', () => {
	expect(cdn.guildMemberBanner(id, id, hash)).toEqual(`${baseCDN}/guilds/${id}/users/${id}/banners/${hash}.webp`);
});

test('guildMemberBanner dynamic-animated', () => {
	expect(cdn.guildMemberBanner(id, id, animatedHash)).toEqual(
		`${baseCDN}/guilds/${id}/users/${id}/banners/${animatedHash}.gif`,
	);
});

test('guildMemberBanner dynamic-not-animated', () => {
	expect(cdn.guildMemberBanner(id, id, hash)).toEqual(`${baseCDN}/guilds/${id}/users/${id}/banners/${hash}.webp`);
});

test('guildScheduledEventCover default', () => {
	expect(cdn.guildScheduledEventCover(id, hash)).toEqual(`${baseCDN}/guild-events/${id}/${hash}.webp`);
});

test('icon default', () => {
	expect(cdn.icon(id, hash)).toEqual(`${baseCDN}/icons/${id}/${hash}.webp`);
});

test('icon dynamic-animated', () => {
	expect(cdn.icon(id, animatedHash)).toEqual(`${baseCDN}/icons/${id}/${animatedHash}.gif`);
});

test('icon dynamic-not-animated', () => {
	expect(cdn.icon(id, hash)).toEqual(`${baseCDN}/icons/${id}/${hash}.webp`);
});

test('role icon default', () => {
	expect(cdn.roleIcon(id, hash)).toEqual(`${baseCDN}/role-icons/${id}/${hash}.webp`);
});

test('splash default', () => {
	expect(cdn.splash(id, hash)).toEqual(`${baseCDN}/splashes/${id}/${hash}.webp`);
});

test('sticker default', () => {
	expect(cdn.sticker(id)).toEqual(`${baseCDN}/stickers/${id}.png`);
});

test('sticker GIF', () => {
	expect(cdn.sticker(id, 'gif')).toEqual(`${baseMedia}/stickers/${id}.gif`);
});

test('stickerPackBanner default', () => {
	expect(cdn.stickerPackBanner(id)).toEqual(`${baseCDN}/app-assets/710982414301790216/store/${id}.webp`);
});

test('teamIcon default', () => {
	expect(cdn.teamIcon(id, hash)).toEqual(`${baseCDN}/team-icons/${id}/${hash}.webp`);
});

test('makeURL throws on invalid size', () => {
	// @ts-expect-error: Invalid size
	expect(() => cdn.avatar(id, animatedHash, { size: 5 })).toThrow(RangeError);
});

test('makeURL throws on invalid extension', () => {
	// @ts-expect-error: Invalid extension
	expect(() => cdn.avatar(id, animatedHash, { extension: 'tif', forceStatic: true })).toThrow(RangeError);
});

test('makeURL valid size', () => {
	expect(cdn.avatar(id, animatedHash, { size: 512 })).toEqual(`${baseCDN}/avatars/${id}/${animatedHash}.gif?size=512`);
});
