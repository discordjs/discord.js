import { GuildMemberFlags, GuildSystemChannelFlags, RoleFlags, UserFlags } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import {
	GuildMemberFlagsBitField,
	RoleFlagsBitField,
	SystemChannelFlagsBitField,
	UserFlagsBitField,
} from '../src/bitfields/index.js';

describe('GuildMemberFlagsBitField', () => {
	test('should create with no flags', () => {
		const bitfield = new GuildMemberFlagsBitField();
		expect(bitfield.bitField).toBe(0n);
	});

	test('should create with DidRejoin flag', () => {
		const bitfield = new GuildMemberFlagsBitField(GuildMemberFlags.DidRejoin);
		expect(bitfield.has(GuildMemberFlags.DidRejoin)).toBe(true);
	});

	test('should create with CompletedOnboarding flag', () => {
		const bitfield = new GuildMemberFlagsBitField(GuildMemberFlags.CompletedOnboarding);
		expect(bitfield.has(GuildMemberFlags.CompletedOnboarding)).toBe(true);
	});

	test('should add flags', () => {
		const bitfield = new GuildMemberFlagsBitField();
		bitfield.add(GuildMemberFlags.BypassesVerification);
		expect(bitfield.has(GuildMemberFlags.BypassesVerification)).toBe(true);
	});

	test('should remove flags', () => {
		const bitfield = new GuildMemberFlagsBitField(GuildMemberFlags.StartedOnboarding);
		bitfield.remove(GuildMemberFlags.StartedOnboarding);
		expect(bitfield.has(GuildMemberFlags.StartedOnboarding)).toBe(false);
	});

	test('should serialize flags', () => {
		const bitfield = new GuildMemberFlagsBitField([
			GuildMemberFlags.DidRejoin,
			GuildMemberFlags.CompletedOnboarding,
		]);
		const serialized = bitfield.serialize();
		expect(serialized).toBeDefined();
		expect(Object.keys(serialized).length).toBeGreaterThan(0);
	});

	test('should check flag presence', () => {
		const bitfield = new GuildMemberFlagsBitField(GuildMemberFlags.StartedOnboarding);
		expect(bitfield.has(GuildMemberFlags.StartedOnboarding)).toBe(true);
		expect(bitfield.has(GuildMemberFlags.DidRejoin)).toBe(false);
	});

	test('should convert to JSON as number', () => {
		const bitfield = new GuildMemberFlagsBitField(GuildMemberFlags.DidRejoin);
		const json = bitfield.toJSON();
		expect(typeof json).toBe('number');
	});
});

describe('RoleFlagsBitField', () => {
	test('should create with no flags', () => {
		const bitfield = new RoleFlagsBitField();
		expect(bitfield.bitField).toBe(0n);
	});

	test('should create with InPrompt flag', () => {
		const bitfield = new RoleFlagsBitField(RoleFlags.InPrompt);
		expect(bitfield.has(RoleFlags.InPrompt)).toBe(true);
	});

	test('should add flags', () => {
		const bitfield = new RoleFlagsBitField();
		bitfield.add(RoleFlags.InPrompt);
		expect(bitfield.has(RoleFlags.InPrompt)).toBe(true);
	});

	test('should remove flags', () => {
		const bitfield = new RoleFlagsBitField(RoleFlags.InPrompt);
		bitfield.remove(RoleFlags.InPrompt);
		expect(bitfield.has(RoleFlags.InPrompt)).toBe(false);
	});

	test('should serialize flags', () => {
		const bitfield = new RoleFlagsBitField(RoleFlags.InPrompt);
		const serialized = bitfield.serialize();
		expect(serialized).toBeDefined();
		expect(Object.keys(serialized).length).toBeGreaterThan(0);
	});

	test('should convert to JSON as number', () => {
		const bitfield = new RoleFlagsBitField(RoleFlags.InPrompt);
		const json = bitfield.toJSON();
		expect(typeof json).toBe('number');
	});
});

describe('UserFlagsBitField', () => {
	test('should create with no flags', () => {
		const bitfield = new UserFlagsBitField();
		expect(bitfield.bitField).toBe(0n);
	});

	test('should create with Staff flag', () => {
		const bitfield = new UserFlagsBitField(UserFlags.Staff);
		expect(bitfield.has(UserFlags.Staff)).toBe(true);
	});

	test('should create with multiple flags', () => {
		const bitfield = new UserFlagsBitField([UserFlags.Partner, UserFlags.Hypesquad]);
		expect(bitfield.has(UserFlags.Partner)).toBe(true);
		expect(bitfield.has(UserFlags.Hypesquad)).toBe(true);
	});

	test('should add flags', () => {
		const bitfield = new UserFlagsBitField();
		bitfield.add(UserFlags.BugHunterLevel1);
		expect(bitfield.has(UserFlags.BugHunterLevel1)).toBe(true);
	});

	test('should remove flags', () => {
		const bitfield = new UserFlagsBitField(UserFlags.HypeSquadOnlineHouse1);
		bitfield.remove(UserFlags.HypeSquadOnlineHouse1);
		expect(bitfield.has(UserFlags.HypeSquadOnlineHouse1)).toBe(false);
	});

	test('should serialize flags', () => {
		const bitfield = new UserFlagsBitField([UserFlags.VerifiedBot, UserFlags.VerifiedDeveloper]);
		const serialized = bitfield.serialize();
		expect(serialized).toBeDefined();
		expect(Object.keys(serialized).length).toBeGreaterThan(0);
	});

	test('should check multiple flags', () => {
		const bitfield = new UserFlagsBitField([UserFlags.ActiveDeveloper, UserFlags.CertifiedModerator]);
		expect(bitfield.has(UserFlags.ActiveDeveloper)).toBe(true);
		expect(bitfield.has(UserFlags.CertifiedModerator)).toBe(true);
		expect(bitfield.has(UserFlags.Staff)).toBe(false);
	});

	test('should convert to JSON as number', () => {
		const bitfield = new UserFlagsBitField(UserFlags.Staff);
		const json = bitfield.toJSON();
		expect(typeof json).toBe('number');
	});
});

describe('SystemChannelFlagsBitField', () => {
	test('should create with no flags', () => {
		const bitfield = new SystemChannelFlagsBitField();
		expect(bitfield.bitField).toBe(0n);
	});

	test('should create with SuppressJoinNotifications flag', () => {
		const bitfield = new SystemChannelFlagsBitField(GuildSystemChannelFlags.SuppressJoinNotifications);
		expect(bitfield.has(GuildSystemChannelFlags.SuppressJoinNotifications)).toBe(true);
	});

	test('should create with SuppressPremiumSubscriptions flag', () => {
		const bitfield = new SystemChannelFlagsBitField(GuildSystemChannelFlags.SuppressPremiumSubscriptions);
		expect(bitfield.has(GuildSystemChannelFlags.SuppressPremiumSubscriptions)).toBe(true);
	});

	test('should add flags', () => {
		const bitfield = new SystemChannelFlagsBitField();
		bitfield.add(GuildSystemChannelFlags.SuppressGuildReminderNotifications);
		expect(bitfield.has(GuildSystemChannelFlags.SuppressGuildReminderNotifications)).toBe(true);
	});

	test('should remove flags', () => {
		const bitfield = new SystemChannelFlagsBitField(GuildSystemChannelFlags.SuppressJoinNotificationReplies);
		bitfield.remove(GuildSystemChannelFlags.SuppressJoinNotificationReplies);
		expect(bitfield.has(GuildSystemChannelFlags.SuppressJoinNotificationReplies)).toBe(false);
	});

	test('should handle multiple flags', () => {
		const bitfield = new SystemChannelFlagsBitField([
			GuildSystemChannelFlags.SuppressJoinNotifications,
			GuildSystemChannelFlags.SuppressPremiumSubscriptions,
		]);
		expect(bitfield.has(GuildSystemChannelFlags.SuppressJoinNotifications)).toBe(true);
		expect(bitfield.has(GuildSystemChannelFlags.SuppressPremiumSubscriptions)).toBe(true);
	});

	test('should serialize flags', () => {
		const bitfield = new SystemChannelFlagsBitField(GuildSystemChannelFlags.SuppressJoinNotifications);
		const serialized = bitfield.serialize();
		expect(serialized).toBeDefined();
		expect(Object.keys(serialized).length).toBeGreaterThan(0);
	});

	test('should check multiple flags', () => {
		const bitfield = new SystemChannelFlagsBitField([
			GuildSystemChannelFlags.SuppressJoinNotifications,
			GuildSystemChannelFlags.SuppressGuildReminderNotifications,
		]);
		expect(bitfield.has(GuildSystemChannelFlags.SuppressJoinNotifications)).toBe(true);
		expect(bitfield.has(GuildSystemChannelFlags.SuppressGuildReminderNotifications)).toBe(true);
		expect(bitfield.has(GuildSystemChannelFlags.SuppressPremiumSubscriptions)).toBe(false);
	});

	test('should convert to JSON as number', () => {
		const bitfield = new SystemChannelFlagsBitField(GuildSystemChannelFlags.SuppressJoinNotifications);
		const json = bitfield.toJSON();
		expect(typeof json).toBe('number');
	});
});
