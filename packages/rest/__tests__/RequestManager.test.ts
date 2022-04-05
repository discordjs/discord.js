import { MockAgent, setGlobalDispatcher } from 'undici';
import { REST } from '../src';
import { genPath } from './util';

const api = new REST();

const mockAgent = new MockAgent();
mockAgent.disableNetConnect();
setGlobalDispatcher(mockAgent);

const mockPool = mockAgent.get('https://discord.com');

mockPool
	.intercept({
		path: genPath('/simpleGet'),
		method: 'GET',
	})
	.reply(200, 'Well this is awkward...');

test('no token', async () => {
	const promise = api.get('/simpleGet');
	await expect(promise).rejects.toThrowError('Expected token to be set for this request, but none was present');
	await expect(promise).rejects.toBeInstanceOf(Error);
});

test('negative offset', () => {
	const badREST = new REST({ offset: -5000 });

	expect(badREST.requestManager.options.offset).toBe(0);
});
