import { test, expect } from 'vitest';
import { CDN } from '../src';

const base = 'https://discord.com';
const id = '123456';
const hash = 'abcdef';
const animatedHash = 'a_bcdef';
const defaultAvatar = 1234 % 5;

const cdn = new CDN(base);

test('appAsset default', () => {
	expect(cdn.appAsset(id, hash)).toEqual(`${base}/app-assets/${id}/${hash}.webp`);
});

test('appIcon default', () => {
	expect(cdn.appIcon(id, hash)).toEqual(`${base}/app-icons/${id}/${hash}.webp`);
});

test('avatar default', () => {
	expect(cdn.avatar(id, hash)).toEqual(`${base}/avatars/${id}/${hash}.webp`);
});

test('avatar dynamic-animated', () => {
	expect(cdn.avatar(id, animatedHash)).toEqual(`${base}/avatars/${id}/${animatedHash}.gif`);
});

test('avatar dynamic-not-animated', () => {
	expect(cdn.avatar(id, hash)).toEqual(`${base}/avatars/${id}/${hash}.webp`);
});

test('banner default', () => {
	expect(cdn.banner(id, hash)).toEqual(`${base}/banners/${id}/${hash}.webp`);
});

test('channelIcon default', () => {
	expect(cdn.channelIcon(id, hash)).toEqual(`${base}/channel-icons/${id}/${hash}.webp`);
});

test('defaultAvatar default', () => {
	expect(cdn.defaultAvatar(defaultAvatar)).toEqual(`${base}/embed/avatars/${defaultAvatar}.png`);
});

test('discoverySplash default', () => {
	expect(cdn.discoverySplash(id, hash)).toEqual(`${base}/discovery-splashes/${id}/${hash}.webp`);
});

test('emoji default', () => {
	expect(cdn.emoji(id)).toEqual(`${base}/emojis/${id}.webp`);
});

test('emoji gif', () => {
	expect(cdn.emoji(id, 'gif')).toEqual(`${base}/emojis/${id}.gif`);
});

test('guildMemberAvatar default', () => {
	expect(cdn.guildMemberAvatar(id, id, hash)).toEqual(`${base}/guilds/${id}/users/${id}/avatars/${hash}.webp`);
});

test('guildMemberAvatar dynamic-animated', () => {
	expect(cdn.guildMemberAvatar(id, id, animatedHash)).toEqual(
		`${base}/guilds/${id}/users/${id}/avatars/${animatedHash}.gif`,
	);
});

test('guildMemberAvatar dynamic-not-animated', () => {
	expect(cdn.guildMemberAvatar(id, id, hash)).toEqual(`${base}/guilds/${id}/users/${id}/avatars/${hash}.webp`);
});

test('guildScheduledEventCover default', () => {
	expect(cdn.guildScheduledEventCover(id, hash)).toEqual(`${base}/guild-events/${id}/${hash}.webp`);
});

test('icon default', () => {
	expect(cdn.icon(id, hash)).toEqual(`${base}/icons/${id}/${hash}.webp`);
});

test('icon dynamic-animated', () => {
	expect(cdn.icon(id, animatedHash)).toEqual(`${base}/icons/${id}/${animatedHash}.gif`);
});

test('icon dynamic-not-animated', () => {
	expect(cdn.icon(id, hash)).toEqual(`${base}/icons/${id}/${hash}.webp`);
});

test('role icon default', () => {
	expect(cdn.roleIcon(id, hash)).toEqual(`${base}/role-icons/${id}/${hash}.webp`);
});

test('splash default', () => {
	expect(cdn.splash(id, hash)).toEqual(`${base}/splashes/${id}/${hash}.webp`);
});

test('sticker default', () => {
	expect(cdn.sticker(id)).toEqual(`${base}/stickers/${id}.png`);
});

test('stickerPackBanner default', () => {
	expect(cdn.stickerPackBanner(id)).toEqual(`${base}/app-assets/710982414301790216/store/${id}.webp`);
});

test('teamIcon default', () => {
	expect(cdn.teamIcon(id, hash)).toEqual(`${base}/team-icons/${id}/${hash}.webp`);
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
	expect(cdn.avatar(id, animatedHash, { size: 512 })).toEqual(`${base}/avatars/${id}/${animatedHash}.gif?size=512`);
});
