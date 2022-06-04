import { test, expect } from 'vitest';
import { DiscordAPIError } from '../src';

test('Unauthorized', () => {
	const error = new DiscordAPIError(
		{ message: '401: Unauthorized', code: 0 },
		0,
		401,
		'PATCH',
		'https://discord.com/api/v10/guilds/:id',
		{
			files: undefined,
			body: undefined,
		},
	);

	expect(error.code).toEqual(0);
	expect(error.message).toEqual('401: Unauthorized');
	expect(error.method).toEqual('PATCH');
	expect(error.name).toEqual('DiscordAPIError[0]');
	expect(error.status).toEqual(401);
	expect(error.url).toEqual('https://discord.com/api/v10/guilds/:id');
	expect(error.requestBody.files).toBeUndefined();
	expect(error.requestBody.json).toBeUndefined();
});

test('Invalid Form Body Error (error.{property}._errors.{index})', () => {
	const error = new DiscordAPIError(
		{
			code: 50035,
			errors: {
				username: { _errors: [{ code: 'BASE_TYPE_BAD_LENGTH', message: 'Must be between 2 and 32 in length.' }] },
			},
			message: 'Invalid Form Body',
		},
		50035,
		400,
		'PATCH',
		'https://discord.com/api/v10/users/@me',
		{
			files: undefined,
			body: {
				username: 'a',
			},
		},
	);

	expect(error.code).toEqual(50035);
	expect(error.message).toEqual(
		['Invalid Form Body', 'username[BASE_TYPE_BAD_LENGTH]: Must be between 2 and 32 in length.'].join('\n'),
	);
	expect(error.method).toEqual('PATCH');
	expect(error.name).toEqual('DiscordAPIError[50035]');
	expect(error.status).toEqual(400);
	expect(error.url).toEqual('https://discord.com/api/v10/users/@me');
	expect(error.requestBody.files).toBeUndefined();
	expect(error.requestBody.json).toStrictEqual({ username: 'a' });
});

test('Invalid FormFields Error (error.errors.{property}.{property}.{index}.{property}._errors.{index})', () => {
	const error = new DiscordAPIError(
		{
			code: 50035,
			errors: {
				embed: {
					fields: { '0': { value: { _errors: [{ code: 'BASE_TYPE_REQUIRED', message: 'This field is required' }] } } },
				},
			},
			message: 'Invalid Form Body',
		},
		50035,
		400,
		'POST',
		'https://discord.com/api/v10/channels/:id',
		{},
	);

	expect(error.code).toEqual(50035);
	expect(error.message).toEqual(
		['Invalid Form Body', 'embed.fields[0].value[BASE_TYPE_REQUIRED]: This field is required'].join('\n'),
	);
	expect(error.method).toEqual('POST');
	expect(error.name).toEqual('DiscordAPIError[50035]');
	expect(error.status).toEqual(400);
	expect(error.url).toEqual('https://discord.com/api/v10/channels/:id');
});

test('Invalid FormFields Error (error.errors.{property}.{property}._errors.{index}._errors)', () => {
	const error = new DiscordAPIError(
		{
			code: 50035,
			errors: {
				form_fields: {
					label: { _errors: [{ _errors: [{ code: 'BASE_TYPE_REQUIRED', message: 'This field is required' }] }] },
				},
			},
			message: 'Invalid Form Body',
		},
		50035,
		400,
		'PATCH',
		'https://discord.com/api/v10/guilds/:id',
		{},
	);

	expect(error.code).toEqual(50035);
	expect(error.message).toEqual(
		['Invalid Form Body', 'form_fields.label[0][BASE_TYPE_REQUIRED]: This field is required'].join('\n'),
	);
	expect(error.method).toEqual('PATCH');
	expect(error.name).toEqual('DiscordAPIError[50035]');
	expect(error.status).toEqual(400);
	expect(error.url).toEqual('https://discord.com/api/v10/guilds/:id');
});

test('Invalid Oauth Code Error (error.error)', () => {
	const error = new DiscordAPIError(
		{
			error: 'invalid_request',
			error_description: 'Invalid "code" in request.',
		},
		'invalid_request',
		400,
		'POST',
		'https://discord.com/api/v10/oauth2/token',
		{
			body: new URLSearchParams([
				['client_id', '1234567890123545678'],
				['client_secret', 'totally-valid-secret'],
				['redirect_uri', 'http://localhost'],
				['grant_type', 'authorization_code'],
				['code', 'very-invalid-code'],
			]),
		},
	);

	expect(error.code).toEqual('invalid_request');
	expect(error.message).toEqual('Invalid "code" in request.');
	expect(error.method).toEqual('POST');
	expect(error.name).toEqual('DiscordAPIError[invalid_request]');
	expect(error.status).toEqual(400);
	expect(error.url).toEqual('https://discord.com/api/v10/oauth2/token');
});
