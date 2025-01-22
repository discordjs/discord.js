import { REST } from '@discordjs/rest';
import type {
	APIActionRowComponent,
	APIModalActionRowComponent,
	RESTPostAPIInteractionCallbackWithResponseResult,
} from 'discord-api-types/v10';
import { assertType, describe, test } from 'vitest';
import { API } from '../src/index.js';

const rest = new REST();
const api = new API(rest);
const SNOWFLAKE = '123456789012345678' as const;
const TOKEN = 'token' as const;
const MODAL_COMPONENTS: APIActionRowComponent<APIModalActionRowComponent>[] = [] as const;
const boolValue = true as boolean;

describe('Interaction with_response overloads.', () => {
	test('Replying returns RESTPostAPIInteractionCallbackWithResponseResult.', () =>
		assertType<Promise<RESTPostAPIInteractionCallbackWithResponseResult>>(
			api.interactions.reply(SNOWFLAKE, TOKEN, { with_response: true }),
		));

	test('Replying returns undefined.', () => {
		assertType<Promise<undefined>>(api.interactions.reply(SNOWFLAKE, TOKEN, {}));
		assertType<Promise<undefined>>(api.interactions.reply(SNOWFLAKE, TOKEN, { with_response: false }));
	});

	test('Replying returns either RESTPostAPIInteractionCallbackWithResponseResult or undefined.', () => {
		assertType<Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>>(
			api.interactions.reply(SNOWFLAKE, TOKEN, { with_response: boolValue }),
		);
	});

	test('Defer returns RESTPostAPIInteractionCallbackWithResponseResult.', () =>
		assertType<Promise<RESTPostAPIInteractionCallbackWithResponseResult>>(
			api.interactions.defer(SNOWFLAKE, TOKEN, { with_response: true }),
		));

	test('Defer returns undefined.', () => {
		assertType<Promise<undefined>>(api.interactions.defer(SNOWFLAKE, TOKEN));
		assertType<Promise<undefined>>(api.interactions.defer(SNOWFLAKE, TOKEN, { with_response: false }));
	});

	test('Defer returns either RESTPostAPIInteractionCallbackWithResponseResult or undefined.', () => {
		assertType<Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>>(
			api.interactions.defer(SNOWFLAKE, TOKEN, { with_response: boolValue }),
		);
	});

	test('Defer message update returns RESTPostAPIInteractionCallbackWithResponseResult.', () =>
		assertType<Promise<RESTPostAPIInteractionCallbackWithResponseResult>>(
			api.interactions.deferMessageUpdate(SNOWFLAKE, TOKEN, { with_response: true }),
		));

	test('Defer message update returns undefined.', () => {
		assertType<Promise<undefined>>(api.interactions.deferMessageUpdate(SNOWFLAKE, TOKEN));
		assertType<Promise<undefined>>(api.interactions.deferMessageUpdate(SNOWFLAKE, TOKEN, { with_response: false }));
	});

	test('Defer message update returns either RESTPostAPIInteractionCallbackWithResponseResult or undefined.', () => {
		assertType<Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>>(
			api.interactions.deferMessageUpdate(SNOWFLAKE, TOKEN, { with_response: boolValue }),
		);
	});

	test('Update message returns RESTPostAPIInteractionCallbackWithResponseResult.', () =>
		assertType<Promise<RESTPostAPIInteractionCallbackWithResponseResult>>(
			api.interactions.updateMessage(SNOWFLAKE, TOKEN, { with_response: true }),
		));

	test('Update message returns undefined.', () => {
		assertType<Promise<undefined>>(api.interactions.updateMessage(SNOWFLAKE, TOKEN, {}));
		assertType<Promise<undefined>>(api.interactions.updateMessage(SNOWFLAKE, TOKEN, { with_response: false }));
	});

	test('Update message returns either RESTPostAPIInteractionCallbackWithResponseResult or undefined.', () => {
		assertType<Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>>(
			api.interactions.updateMessage(SNOWFLAKE, TOKEN, { with_response: boolValue }),
		);
	});

	test('Create autocomplete response returns RESTPostAPIInteractionCallbackWithResponseResult.', () =>
		assertType<Promise<RESTPostAPIInteractionCallbackWithResponseResult>>(
			api.interactions.createAutocompleteResponse(SNOWFLAKE, TOKEN, { with_response: true }),
		));

	test('Create autocomplete response returns undefined.', () => {
		assertType<Promise<undefined>>(api.interactions.createAutocompleteResponse(SNOWFLAKE, TOKEN, {}));
		assertType<Promise<undefined>>(
			api.interactions.createAutocompleteResponse(SNOWFLAKE, TOKEN, { with_response: false }),
		);
	});

	test('Create autocomplete response returns either RESTPostAPIInteractionCallbackWithResponseResult or undefined.', () => {
		assertType<Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>>(
			api.interactions.createAutocompleteResponse(SNOWFLAKE, TOKEN, { with_response: boolValue }),
		);
	});

	test('Create modal returns RESTPostAPIInteractionCallbackWithResponseResult.', () =>
		assertType<Promise<RESTPostAPIInteractionCallbackWithResponseResult>>(
			api.interactions.createModal(SNOWFLAKE, TOKEN, {
				title: '',
				custom_id: '',
				components: MODAL_COMPONENTS,
				with_response: true,
			}),
		));

	test('Create modal returns undefined.', () => {
		assertType<Promise<undefined>>(
			api.interactions.createModal(SNOWFLAKE, TOKEN, { title: '', custom_id: '', components: MODAL_COMPONENTS }),
		);
		assertType<Promise<undefined>>(
			api.interactions.createModal(SNOWFLAKE, TOKEN, {
				title: '',
				custom_id: '',
				components: MODAL_COMPONENTS,
				with_response: false,
			}),
		);
	});

	test('Create modal returns either RESTPostAPIInteractionCallbackWithResponseResult or undefined.', () => {
		assertType<Promise<RESTPostAPIInteractionCallbackWithResponseResult | undefined>>(
			api.interactions.createModal(SNOWFLAKE, TOKEN, {
				title: '',
				custom_id: '',
				components: MODAL_COMPONENTS,
				with_response: boolValue,
			}),
		);
	});
});
