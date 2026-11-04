import type { APIActivityInstance, APIActivityLocation } from 'discord-api-types/v10';
import { ActivityLocationKind } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { ActivityInstance, ActivityLocation } from '../src/application/index.js';
import { kClone, kData, kPatch } from '../src/utils/symbols.js';

class MutableActivityInstance<Omitted extends keyof APIActivityInstance | '' = ''> extends ActivityInstance<Omitted> {
	public patch(data: Partial<APIActivityInstance>) {
		return this[kPatch](data);
	}

	public clone(data?: Partial<APIActivityInstance>) {
		return this[kClone](data);
	}
}

class MutableActivityLocation<Omitted extends keyof APIActivityLocation | '' = ''> extends ActivityLocation<Omitted> {
	public patch(data: Partial<APIActivityLocation>) {
		return this[kPatch](data);
	}

	public clone(data?: Partial<APIActivityLocation>) {
		return this[kClone](data);
	}
}

const location: APIActivityLocation = {
	id: 'gc-912952092627435520-912954213460484116',
	kind: ActivityLocationKind.GuildChannel,
	channel_id: '912954213460484116',
	guild_id: '912952092627435520',
};

const activity: APIActivityInstance = {
	application_id: '1215413995645968394',
	instance_id: 'i-1276580072400224306-gc-912952092627435520-912954213460484116',
	launch_id: '1276580072400224306',
	location,
	users: ['205519959982473217'],
};

describe('ActivityInstance', () => {
	test('exposes scalar fields and user IDs without occupying substructure getters', () => {
		const instance = new ActivityInstance(activity);
		expect(instance.applicationId).toBe(activity.application_id);
		expect(instance.instanceId).toBe(activity.instance_id);
		expect(instance.launchId).toBe(activity.launch_id);
		expect(instance.userIds).toEqual(activity.users);
		expect('location' in instance).toBe(false);
		expect('users' in instance).toBe(false);
		expect(instance.toJSON()).toStrictEqual(activity);
		expect(JSON.parse(JSON.stringify(instance))).toStrictEqual(activity);
	});

	test('patches in place while preserving unchanged nested data', () => {
		const instance = new MutableActivityInstance(activity);
		expect(instance.patch({ users: [], launch_id: '1276580072400224307' })).toBe(instance);
		expect(instance.userIds).toEqual([]);
		expect(instance.launchId).toBe('1276580072400224307');
		expect(instance.toJSON()).toStrictEqual({ ...activity, users: [], launch_id: '1276580072400224307' });
		instance.patch({ location: { ...location, guild_id: null } });
		expect(instance.toJSON().location.guild_id).toBeNull();
	});

	test('serialization and cloning detach nested objects and arrays', () => {
		const instance = new MutableActivityInstance(activity);
		const json = instance.toJSON();
		json.location.channel_id = '1';
		json.users.push('2');
		expect(instance.toJSON()).toStrictEqual(activity);

		const clone = instance.clone();
		expect(clone).toBeInstanceOf(MutableActivityInstance);
		expect(clone).not.toBe(instance);
		expect(clone.toJSON()).toStrictEqual(activity);
		(clone.userIds as string[]).push('3');
		expect(clone.userIds).toEqual(activity.users);
		expect(instance.userIds).toEqual(activity.users);
		const patchedClone = instance.clone({ instance_id: 'another-instance', users: [] });
		expect(patchedClone.instanceId).toBe('another-instance');
		expect(patchedClone.userIds).toEqual([]);
		expect(instance.instanceId).toBe(activity.instance_id);
	});

	test('returns detached copies of the user IDs', () => {
		const instance = new ActivityInstance(activity);
		const ids = instance.userIds as string[];
		expect(ids).not.toBe(activity.users);
		expect(instance.userIds).not.toBe(ids);
		ids.push('1');
		expect(instance.userIds).toEqual(activity.users);
		expect(instance.toJSON()).toStrictEqual(activity);
	});

	test('omits fields through a subclass data template in construction, patching and cloning', () => {
		class OmittedActivityInstance extends MutableActivityInstance<'location' | 'users'> {
			public static override readonly DataTemplate: Partial<APIActivityInstance> = {
				set location(_: APIActivityLocation) {},
				set users(_: string[]) {},
			};
		}

		const instance = new OmittedActivityInstance(activity);
		const { location: _location, users: _users, ...expected } = activity;
		expect(instance.toJSON()).toStrictEqual(expected);
		expect(instance.userIds).toBeUndefined();
		instance.patch({ location, users: ['1'] });
		expect(instance.toJSON()).toStrictEqual(expected);
		expect(instance.clone({ users: ['2'] }).toJSON()).toStrictEqual(expected);
	});

	test('allows a caching subclass to expose constructed location and users', () => {
		class CachedActivityInstance extends ActivityInstance {
			public get location() {
				return new ActivityLocation(this[kData].location);
			}

			public get users() {
				return this[kData].users.map((id) => ({ id }));
			}
		}

		const instance = new CachedActivityInstance(activity);
		expect(instance.location).toBeInstanceOf(ActivityLocation);
		expect(instance.location.channelId).toBe(location.channel_id);
		expect(instance.users).toEqual(activity.users.map((id) => ({ id })));
		expect(instance.toJSON()).toStrictEqual(activity);
	});
});

describe('ActivityLocation', () => {
	test('exposes the API location fields', () => {
		const instance = new ActivityLocation(location);
		expect(instance.id).toBe(location.id);
		expect(instance.kind).toBe(ActivityLocationKind.GuildChannel);
		expect(instance.channelId).toBe(location.channel_id);
		expect(instance.guildId).toBe(location.guild_id);
		expect(instance.toJSON()).toStrictEqual(location);
	});

	test('preserves absent and null guild IDs without adding defaults', () => {
		const privateLocation: APIActivityLocation = {
			id: 'pc-912954213460484116',
			kind: ActivityLocationKind.PrivateChannel,
			channel_id: location.channel_id,
		};
		const instance = new MutableActivityLocation(privateLocation);
		expect(instance.kind).toBe(ActivityLocationKind.PrivateChannel);
		expect(instance.guildId).toBeUndefined();
		expect(instance.toJSON()).toStrictEqual(privateLocation);
		expect(instance.clone().toJSON()).toStrictEqual(privateLocation);
		instance.patch({ guild_id: null });
		expect(instance.guildId).toBeNull();
		expect(instance.clone().toJSON()).toStrictEqual({ ...privateLocation, guild_id: null });
		expect(instance.patch({ channel_id: '1' })).toBe(instance);
		expect(instance.guildId).toBeNull();
		expect(instance.channelId).toBe('1');
	});

	test('clones with a patch without changing the source', () => {
		const instance = new MutableActivityLocation(location);
		const clone = instance.clone({ guild_id: null, kind: ActivityLocationKind.PrivateChannel });
		expect(clone).toBeInstanceOf(MutableActivityLocation);
		expect(clone).not.toBe(instance);
		expect(clone.guildId).toBeNull();
		expect(clone.kind).toBe(ActivityLocationKind.PrivateChannel);
		expect(instance.toJSON()).toStrictEqual(location);
	});

	test('supports omitting required fields in subclasses', () => {
		class OmittedActivityLocation extends MutableActivityLocation<'channel_id'> {
			public static override readonly DataTemplate: Partial<APIActivityLocation> = {
				set channel_id(_: string) {},
			};
		}

		const instance = new OmittedActivityLocation({ id: location.id, kind: location.kind });
		expect(instance.channelId).toBeUndefined();
		expect(instance.patch(location)).toBe(instance);
		const { channel_id: _channelId, ...expected } = location;
		expect(instance.toJSON()).toStrictEqual(expected);
		expect(instance.clone({ channel_id: '1' }).toJSON()).toStrictEqual(expected);
	});
});
