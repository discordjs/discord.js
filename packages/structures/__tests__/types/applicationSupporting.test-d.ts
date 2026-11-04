import type { APIActivityInstance, APIActivityLocation, ActivityLocationKind } from 'discord-api-types/v10';
import { expectTypeOf } from 'vitest';
import { ActivityInstance, ActivityLocation } from '../../src/application/index.js';
import { kClone, kData, kPatch } from '../../src/utils/symbols.js';

declare const activityData: APIActivityInstance;
declare const locationData: APIActivityLocation;

const activity = new ActivityInstance(activityData);
expectTypeOf(activity.applicationId).toBeString();
expectTypeOf(activity.instanceId).toBeString();
expectTypeOf(activity.launchId).toBeString();
expectTypeOf(activity.userIds).toEqualTypeOf<readonly string[]>();
// @ts-expect-error User IDs are exposed as a readonly array.
activity.userIds.push('1');
expectTypeOf(activity.toJSON()).toEqualTypeOf<APIActivityInstance>();
expectTypeOf<ActivityInstance>().not.toHaveProperty('location');
expectTypeOf<ActivityInstance>().not.toHaveProperty('users');

const omittedActivity = new ActivityInstance<'location' | 'users'>({
	application_id: activityData.application_id,
	instance_id: activityData.instance_id,
	launch_id: activityData.launch_id,
});
expectTypeOf(omittedActivity.userIds).toBeUnknown();
expectTypeOf(omittedActivity.applicationId).toBeString();

// @ts-expect-error An activity instance requires its location unless it is explicitly omitted.
new ActivityInstance({ application_id: '1', instance_id: 'instance', launch_id: '2', users: [] });
// @ts-expect-error Omission keys must come from the pinned API activity instance.
new ActivityInstance<'guild_id'>(activityData);

const location = new ActivityLocation(locationData);
expectTypeOf(location.id).toBeString();
expectTypeOf(location.kind).toEqualTypeOf<ActivityLocationKind>();
expectTypeOf(location.channelId).toBeString();
expectTypeOf(location.guildId).toEqualTypeOf<string | null | undefined>();
expectTypeOf(location.toJSON()).toEqualTypeOf<APIActivityLocation>();
const omittedLocation = new ActivityLocation<'channel_id'>({ id: locationData.id, kind: locationData.kind });
expectTypeOf(omittedLocation.channelId).toBeUnknown();
expectTypeOf(omittedLocation.id).toBeString();
// @ts-expect-error A location requires its channel id unless it is explicitly omitted.
new ActivityLocation({ id: locationData.id, kind: locationData.kind });

class CachedActivityInstance extends ActivityInstance {
	public get location() {
		return new ActivityLocation(this[kData].location);
	}

	public get users() {
		return this[kData].users.map((id) => ({ id }));
	}

	public patch(data: Partial<APIActivityInstance>) {
		return this[kPatch](data);
	}

	public clone(data?: Partial<APIActivityInstance>) {
		return this[kClone](data);
	}
}

const cachedActivity = new CachedActivityInstance(activityData);
expectTypeOf(cachedActivity.location).toEqualTypeOf<ActivityLocation>();
expectTypeOf(cachedActivity.users).toEqualTypeOf<{ id: string }[]>();
expectTypeOf(cachedActivity.patch({ users: [] })).toEqualTypeOf<CachedActivityInstance>();
expectTypeOf(cachedActivity.clone()).toEqualTypeOf<CachedActivityInstance>();
// @ts-expect-error Patching still requires valid API field values.
cachedActivity.patch({ users: [1] });
