import { CDN } from '../src';

const base = 'https://discord.com';
const id = '123456';
const hash = 'abcdef';
const animatedHash = 'a_bcdef';
const defaultAvatar = 1234 % 5;

const cdn = new CDN(base);

test('appAsset default', () => {
	expect(cdn.appAsset(id, hash)).toBe(`${base}/app-assets/${id}/${hash}.webp`);
});

test('appIcon default', () => {
	expect(cdn.appIcon(id, hash)).toBe(`${base}/app-icons/${id}/${hash}.webp`);
});

test('avatar default', () => {
	expect(cdn.avatar(id, hash)).toBe(`${base}/avatars/${id}/${hash}.webp`);
});

test('avatar dynamic-animated', () => {
	expect(cdn.avatar(id, animatedHash)).toBe(`${base}/avatars/${id}/${animatedHash}.gif`);
});

test('avatar dynamic-not-animated', () => {
	expect(cdn.avatar(id, hash)).toBe(`${base}/avatars/${id}/${hash}.webp`);
});

test('banner default', () => {
	expect(cdn.banner(id, hash)).toBe(`${base}/banners/${id}/${hash}.webp`);
});

test('channelIcon default', () => {
	expect(cdn.channelIcon(id, hash)).toBe(`${base}/channel-icons/${id}/${hash}.webp`);
});

test('defaultAvatar default', () => {
	expect(cdn.defaultAvatar(defaultAvatar)).toBe(`${base}/embed/avatars/${defaultAvatar}.webp`);
});

test('discoverySplash default', () => {
	expect(cdn.discoverySplash(id, hash)).toBe(`${base}/discovery-splashes/${id}/${hash}.webp`);
});

test('emoji default', () => {
	expect(cdn.emoji(id)).toBe(`${base}/emojis/${id}.webp`);
});

test('emoji gif', () => {
	expect(cdn.emoji(id, 'gif')).toBe(`${base}/emojis/${id}.gif`);
});

test('guildMemberAvatar default', () => {
	expect(cdn.guildMemberAvatar(id, id, hash)).toBe(`${base}/guilds/${id}/users/${id}/avatars/${hash}.webp`);
});

test('guildMemberAvatar dynamic-animated', () => {
	expect(cdn.guildMemberAvatar(id, id, animatedHash)).toBe(
		`${base}/guilds/${id}/users/${id}/avatars/${animatedHash}.gif`,
	);
});

test('guildMemberAvatar dynamic-not-animated', () => {
	expect(cdn.guildMemberAvatar(id, id, hash)).toBe(`${base}/guilds/${id}/users/${id}/avatars/${hash}.webp`);
});

test('icon default', () => {
	expect(cdn.icon(id, hash)).toBe(`${base}/icons/${id}/${hash}.webp`);
});

test('icon dynamic-animated', () => {
	expect(cdn.icon(id, animatedHash)).toBe(`${base}/icons/${id}/${animatedHash}.gif`);
});

test('icon dynamic-not-animated', () => {
	expect(cdn.icon(id, hash)).toBe(`${base}/icons/${id}/${hash}.webp`);
});

test('role icon default', () => {
	expect(cdn.roleIcon(id, hash)).toBe(`${base}/role-icons/${id}/${hash}.webp`);
});

test('splash default', () => {
	expect(cdn.splash(id, hash)).toBe(`${base}/splashes/${id}/${hash}.webp`);
});

test('sticker default', () => {
	expect(cdn.sticker(id)).toBe(`${base}/stickers/${id}.png`);
});

test('stickerPackBanner default', () => {
	expect(cdn.stickerPackBanner(id)).toBe(`${base}/app-assets/710982414301790216/store/${id}.webp`);
});

test('teamIcon default', () => {
	expect(cdn.teamIcon(id, hash)).toBe(`${base}/team-icons/${id}/${hash}.webp`);
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
	expect(cdn.avatar(id, animatedHash, { size: 512 })).toBe(`${base}/avatars/${id}/${animatedHash}.gif?size=512`);
});
