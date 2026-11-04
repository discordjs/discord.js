import { MessageFlags, PermissionFlagsBits } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { MessageFlagsBitField } from '../src/bitfields/MessageFlagsBitField.js';
import { PermissionsBitField } from '../src/bitfields/PermissionsBitField.js';

describe('Named bitfield flags', () => {
	test('resolves numeric enum names to bigint for construction and mutation', () => {
		const flags = new MessageFlagsBitField('SuppressNotifications');
		expect(flags.bitField).toBe(BigInt(MessageFlags.SuppressNotifications));
		expect(flags.has('SuppressNotifications')).toBe(true);
		expect(flags.has('Crossposted')).toBe(false);

		flags.add('Crossposted');
		expect(flags.has(['SuppressNotifications', 'Crossposted'])).toBe(true);
		expect(flags.toJSON()).toBe(MessageFlags.SuppressNotifications | MessageFlags.Crossposted);

		flags.remove('SuppressNotifications');
		expect(flags.equals('Crossposted')).toBe(true);
		expect(flags.toJSON()).toBe(MessageFlags.Crossposted);
	});

	test('continues to resolve bigint permission names and mixed representations', () => {
		const permissions = new PermissionsBitField(['ViewChannel', PermissionFlagsBits.SendMessages]);
		expect(permissions.bitField).toBe(PermissionFlagsBits.ViewChannel | PermissionFlagsBits.SendMessages);
		expect(permissions.has('ViewChannel')).toBe(true);
		expect(permissions.has(['ViewChannel', 'SendMessages'])).toBe(true);
		expect(permissions.toJSON()).toBe((PermissionFlagsBits.ViewChannel | PermissionFlagsBits.SendMessages).toString());
	});
});
