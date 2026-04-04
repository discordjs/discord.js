import { DiscordSnowflake } from '@sapphire/snowflake';
import {
	type APIUser,
	TeamMemberMembershipState,
	TeamMemberRole,
	type APITeam,
	type APITeamMember,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { Team, TeamMember } from '../src/index.js';
import { kPatch } from '../src/utils/symbols';

const team_id = '32857243857805';
const user: APIUser = {
	id: '435426254365346',
	global_name: 'Open Source is Cool!',
	username: 'username',
	discriminator: '0000',
	avatar: '4564536345646543653hetrhtrhthrhertheh',
};

const teamMember: APITeamMember = {
	user,
	team_id,
	membership_state: TeamMemberMembershipState.Accepted,
	role: TeamMemberRole.Developer,
	permissions: ['*'],
};

const team: APITeam = {
	icon: 'dkfjdkjfdskaljfdsfhdas',
	id: team_id,
	members: [teamMember],
	name: 'discord.js team',
	owner_user_id: '2984509824358905',
};

describe('Team structure', () => {
	const data = team;
	const instance = new Team(data);

	test('correct value for all getters', () => {
		expect(instance.icon).toBe(data.icon);
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.ownerUserId).toBe(data.owner_user_id);

		const createdTimestamp = DiscordSnowflake.timestampFrom(instance.id!);
		expect(instance.createdTimestamp).toBe(createdTimestamp);
		expect(instance.createdAt!.valueOf()).toBe(createdTimestamp);
	});

	test('toJSON() is accurate', () => {
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('patching the structure works in-place', () => {
		const icon = '45y345y345y354y354y5344565464654365436';

		const patched = instance[kPatch]({
			icon,
		});

		expect(patched.icon).toBe(icon);

		expect(patched.toJSON()).not.toEqual(data);
		expect(patched).toBe(instance);
	});

	describe('TeamMember structure', () => {
		const data = teamMember;
		const instance = new TeamMember(data);

		test('correct value for all getters', () => {
			expect(instance.membershipState).toBe(data.membership_state);
			expect(instance.role).toBe(data.role);
			expect(instance.teamId).toBe(data.team_id);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const role = TeamMemberRole.Admin;

			const patched = instance[kPatch]({
				role,
			});

			expect(patched.role).toEqual(role);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});
});
