import { DiscordAPIError } from '../src';

test('Unauthorized', () => {
	const error = new DiscordAPIError(
		{ message: '401: Unauthorized', code: 0 },
		0,
		401,
		'PATCH',
		'https://discord.com/api/v9/guilds/:id',
		{
			files: undefined,
			body: undefined,
		},
	);

	expect(error.code).toBe(0);
	expect(error.message).toBe('401: Unauthorized');
	expect(error.method).toBe('PATCH');
	expect(error.name).toBe('DiscordAPIError[0]');
	expect(error.status).toBe(401);
	expect(error.url).toBe('https://discord.com/api/v9/guilds/:id');
	expect(error.requestBody.files).toBe(undefined);
	expect(error.requestBody.json).toBe(undefined);
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
		'https://discord.com/api/v9/users/@me',
		{
			files: undefined,
			body: {
				username: 'a',
			},
		},
	);

	expect(error.code).toBe(50035);
	expect(error.message).toBe(
		['Invalid Form Body', 'username[BASE_TYPE_BAD_LENGTH]: Must be between 2 and 32 in length.'].join('\n'),
	);
	expect(error.method).toBe('PATCH');
	expect(error.name).toBe('DiscordAPIError[50035]');
	expect(error.status).toBe(400);
	expect(error.url).toBe('https://discord.com/api/v9/users/@me');
	expect(error.requestBody.files).toBe(undefined);
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
		'https://discord.com/api/v9/channels/:id',
		{},
	);

	expect(error.code).toBe(50035);
	expect(error.message).toBe(
		['Invalid Form Body', 'embed.fields[0].value[BASE_TYPE_REQUIRED]: This field is required'].join('\n'),
	);
	expect(error.method).toBe('POST');
	expect(error.name).toBe('DiscordAPIError[50035]');
	expect(error.status).toBe(400);
	expect(error.url).toBe('https://discord.com/api/v9/channels/:id');
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
		'https://discord.com/api/v9/guilds/:id',
		{},
	);

	expect(error.code).toBe(50035);
	expect(error.message).toBe(
		['Invalid Form Body', 'form_fields.label[0][BASE_TYPE_REQUIRED]: This field is required'].join('\n'),
	);
	expect(error.method).toBe('PATCH');
	expect(error.name).toBe('DiscordAPIError[50035]');
	expect(error.status).toBe(400);
	expect(error.url).toBe('https://discord.com/api/v9/guilds/:id');
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
		'https://discord.com/api/v9/oauth2/token',
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

	expect(error.code).toBe('invalid_request');
	expect(error.message).toBe('Invalid "code" in request.');
	expect(error.method).toBe('POST');
	expect(error.name).toBe('DiscordAPIError[invalid_request]');
	expect(error.status).toBe(400);
	expect(error.url).toBe('https://discord.com/api/v9/oauth2/token');
});
