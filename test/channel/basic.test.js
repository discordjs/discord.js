const common = require('../common');

const fixture = common.fixture('channel/393598884695375872');

const client = common.getClient();
common.ensureGuild(client, '393598884221550624');
const channel = common.Discord.Channel.create(client, fixture, client.guilds.get(fixture.guild_id));

test('channel name', () => {
  expect(channel.name).toBe(fixture.name);
});

