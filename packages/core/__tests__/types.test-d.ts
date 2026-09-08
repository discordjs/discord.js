import { REST } from '@discordjs/rest';
import type {
	APIActionRowComponent,
	APIComponentInModalActionRow,
	RESTGetAPIChannelThreadMemberResult,
	RESTPostAPIInteractionCallbackWithResponseResult,
} from 'discord-api-types/v10';
import { expectTypeOf, describe, test } from 'vitest';
import { API } from '../src/index.js';

const rest = new REST();
const api = new API(rest);
const SNOWFLAKE = '123456789012345678' as const;
const TOKEN = 'token' as const;
const MODAL_COMPONENTS: APIActionRowComponent<APIComponentInModalActionRow>[] = [] as const;
const boolValue = true as boolean;

describe('Interaction with_response overloads.', () => {
	test('Replying returns RESTPostAPIInteractionCallbackWithResponseResult.', () =>
		expectTypeOf(api.interactions.reply(SNOWFLAKE, TOKEN, { with_response: true })).toEqualTypeOf<
			Promise<RESTPostAPIInteractionCallbackWithResponseResult>
		>());

	test('Replying returns undefined.', () => {
		expectTypeOf(api.interactions.reply(SNOWFLAKE, TOKEN, {})).toEqualTypeOf<Promise<undefined>>();
		expectTypeOf(api.interactions.reply(SNOWFLAKE, TOKEN, { with_response: false })).toEqualTypeOf<
			Promise<undefined>
		>();
	});

	test('Replying returns either RESTPostAPIInteractionCallbackWithResponseResult or undefined.', () => {
		expectTypeOf(api.interactions.reply(SNOWFLAKE, TOKEN, { with_response: boolValue })).toEqualTypeOf<
			Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>
		>();
	});

	test('Defer returns RESTPostAPIInteractionCallbackWithResponseResult.', () =>
		expectTypeOf(api.interactions.defer(SNOWFLAKE, TOKEN, { with_response: true })).toEqualTypeOf<
			Promise<RESTPostAPIInteractionCallbackWithResponseResult>
		>());

	test('Defer returns undefined.', () => {
		expectTypeOf(api.interactions.defer(SNOWFLAKE, TOKEN)).toEqualTypeOf<Promise<undefined>>();
		expectTypeOf(api.interactions.defer(SNOWFLAKE, TOKEN, { with_response: false })).toEqualTypeOf<
			Promise<undefined>
		>();
	});

	test('Defer returns either RESTPostAPIInteractionCallbackWithResponseResult or undefined.', () => {
		expectTypeOf(api.interactions.defer(SNOWFLAKE, TOKEN, { with_response: boolValue })).toEqualTypeOf<
			Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>
		>();
	});

	test('Defer message update returns RESTPostAPIInteractionCallbackWithResponseResult.', () =>
		expectTypeOf(api.interactions.deferMessageUpdate(SNOWFLAKE, TOKEN, { with_response: true })).toEqualTypeOf<
			Promise<RESTPostAPIInteractionCallbackWithResponseResult>
		>());

	test('Defer message update returns undefined.', () => {
		expectTypeOf(api.interactions.deferMessageUpdate(SNOWFLAKE, TOKEN)).toEqualTypeOf<Promise<undefined>>();
		expectTypeOf(api.interactions.deferMessageUpdate(SNOWFLAKE, TOKEN, { with_response: false })).toEqualTypeOf<
			Promise<undefined>
		>();
	});

	test('Defer message update returns either RESTPostAPIInteractionCallbackWithResponseResult or undefined.', () => {
		expectTypeOf(api.interactions.deferMessageUpdate(SNOWFLAKE, TOKEN, { with_response: boolValue })).toEqualTypeOf<
			Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>
		>();
	});

	test('Update message returns RESTPostAPIInteractionCallbackWithResponseResult.', () =>
		expectTypeOf(api.interactions.updateMessage(SNOWFLAKE, TOKEN, { with_response: true })).toEqualTypeOf<
			Promise<RESTPostAPIInteractionCallbackWithResponseResult>
		>());

	test('Update message returns undefined.', () => {
		expectTypeOf(api.interactions.updateMessage(SNOWFLAKE, TOKEN, {})).toEqualTypeOf<Promise<undefined>>();
		expectTypeOf(api.interactions.updateMessage(SNOWFLAKE, TOKEN, { with_response: false })).toEqualTypeOf<
			Promise<undefined>
		>();
	});

	test('Update message returns either RESTPostAPIInteractionCallbackWithResponseResult or undefined.', () => {
		expectTypeOf(api.interactions.updateMessage(SNOWFLAKE, TOKEN, { with_response: boolValue })).toEqualTypeOf<
			Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>
		>();
	});

	test('Create autocomplete response returns RESTPostAPIInteractionCallbackWithResponseResult.', () =>
		expectTypeOf(api.interactions.createAutocompleteResponse(SNOWFLAKE, TOKEN, { with_response: true })).toEqualTypeOf<
			Promise<RESTPostAPIInteractionCallbackWithResponseResult>
		>());

	test('Create autocomplete response returns undefined.', () => {
		expectTypeOf(api.interactions.createAutocompleteResponse(SNOWFLAKE, TOKEN, {})).toEqualTypeOf<Promise<undefined>>();
		expectTypeOf(api.interactions.createAutocompleteResponse(SNOWFLAKE, TOKEN, { with_response: false })).toEqualTypeOf<
			Promise<undefined>
		>();
	});

	test('Create autocomplete response returns either RESTPostAPIInteractionCallbackWithResponseResult or undefined.', () => {
		expectTypeOf(
			api.interactions.createAutocompleteResponse(SNOWFLAKE, TOKEN, { with_response: boolValue }),
		).toEqualTypeOf<Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>>();
	});

	test('Create modal returns RESTPostAPIInteractionCallbackWithResponseResult.', () =>
		expectTypeOf(
			api.interactions.createModal(SNOWFLAKE, TOKEN, {
				title: '',
				custom_id: '',
				components: MODAL_COMPONENTS,
				with_response: true,
			}),
		).toEqualTypeOf<Promise<RESTPostAPIInteractionCallbackWithResponseResult>>());

	test('Create modal returns undefined.', () => {
		expectTypeOf(
			api.interactions.createModal(SNOWFLAKE, TOKEN, { title: '', custom_id: '', components: MODAL_COMPONENTS }),
		).toEqualTypeOf<Promise<undefined>>();

		expectTypeOf(
			api.interactions.createModal(SNOWFLAKE, TOKEN, {
				title: '',
				custom_id: '',
				components: MODAL_COMPONENTS,
				with_response: false,
			}),
		).toEqualTypeOf<Promise<undefined>>();
	});

	test('Create modal returns either RESTPostAPIInteractionCallbackWithResponseResult or undefined.', () => {
		expectTypeOf(
			api.interactions.createModal(SNOWFLAKE, TOKEN, {
				title: '',
				custom_id: '',
				components: MODAL_COMPONENTS,
				with_response: boolValue,
			}),
		).toEqualTypeOf<Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>>();
	});

	test('Launch activity returns undefined.', () => {
		expectTypeOf(api.interactions.launchActivity(SNOWFLAKE, TOKEN, { with_response: false })).toEqualTypeOf<
			Promise<undefined>
		>();
		expectTypeOf(api.interactions.launchActivity(SNOWFLAKE, TOKEN)).toEqualTypeOf<Promise<undefined>>();
	});

	test('Launch activity returns RESTPostAPIInteractionCallbackWithResponseResult.', () =>
		expectTypeOf(api.interactions.launchActivity(SNOWFLAKE, TOKEN, { with_response: true })).toEqualTypeOf<
			Promise<RESTPostAPIInteractionCallbackWithResponseResult>
		>());

	test('Launch activity returns either RESTPostAPIInteractionCallbackWithResponseResult or undefined.', () =>
		expectTypeOf(api.interactions.launchActivity(SNOWFLAKE, TOKEN, { with_response: boolValue })).toEqualTypeOf<
			Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>
		>());
});

describe('Thread member overloads.', () => {
	test('Getting a thread member with with_member makes the guild member present.', () =>
		expectTypeOf(api.threads.getMember(SNOWFLAKE, SNOWFLAKE, { with_member: true })).toEqualTypeOf<
			Promise<Required<Pick<RESTGetAPIChannelThreadMemberResult, 'member'>> & RESTGetAPIChannelThreadMemberResult>
		>());

	test('Getting a thread member without with_member returns RESTGetAPIChannelThreadMemberResult.', () => {
		expectTypeOf(api.threads.getMember(SNOWFLAKE, SNOWFLAKE, { with_member: false })).toEqualTypeOf<
			Promise<RESTGetAPIChannelThreadMemberResult>
		>();

		expectTypeOf(api.threads.getMember(SNOWFLAKE, SNOWFLAKE)).toEqualTypeOf<
			Promise<RESTGetAPIChannelThreadMemberResult>
		>();
	});
});
