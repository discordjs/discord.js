// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const nock = require('nock');

beforeAll(() => {
	nock.disableNetConnect();
});

afterAll(() => {
	nock.restore();
});
