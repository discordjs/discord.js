import { REST } from '@discordjs/rest';
import type { APIThreadMember, RESTGetAPIChannelThreadMemberResult } from 'discord-api-types/v10';
import { describe, expectTypeOf, test } from 'vitest';
import { API } from '../src/index.js';

const SNOWFLAKE = '123456789012345678' as const;
const api = new API(new REST());

describe('Thread member overloads.', () => {
	test('Getting a thread member with with_member makes the guild member present.', () =>
		expectTypeOf(async () => api.threads.getMember(SNOWFLAKE, SNOWFLAKE, { with_member: true })).returns.toEqualTypeOf<
			Promise<Required<Pick<RESTGetAPIChannelThreadMemberResult, 'member'>> & RESTGetAPIChannelThreadMemberResult>
		>());

	test('Getting a thread member without with_member returns RESTGetAPIChannelThreadMemberResult.', () => {
		expectTypeOf(async () => api.threads.getMember(SNOWFLAKE, SNOWFLAKE, { with_member: false })).returns.toEqualTypeOf<
			Promise<RESTGetAPIChannelThreadMemberResult>
		>();

		expectTypeOf(async () => api.threads.getMember(SNOWFLAKE, SNOWFLAKE)).returns.toEqualTypeOf<
			Promise<RESTGetAPIChannelThreadMemberResult>
		>();
	});

	test('Passing options as the third parameter still resolves to the deprecated overload.', () =>
		expectTypeOf(async () =>
			api.threads.getMember(SNOWFLAKE, SNOWFLAKE, { signal: new AbortController().signal }),
		).returns.toEqualTypeOf<Promise<APIThreadMember>>());
});
