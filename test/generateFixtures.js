const path = require('path');
const fs = require('fs');
const request = require('snekfetch');
const { createPromise, promiseResolve } = process.binding('util');

const guildId = '393598884221550624';
const messageId = '393598884695375872/messages/393599393636286467';
const token = `Bot ${process.env.TOKEN}`;

const getq = [];
getq.fetching = false;

function dump(data, name) {
  fs.writeFileSync(
    path.resolve(__dirname, 'fixtures', `${name}.json`), JSON.stringify(data, null, 2));
}

get(`/guilds/${guildId}`).then(guild => {
  dump(guild, `guild/${guild.id}`);
  for (const role of guild.roles) {
    dump(role, `role/${role.id}`);
  }
});

get(`/guilds/${guildId}/channels`).then(channels => {
  for (const channel of channels) {
    dump(channel, `channel/${channel.id}`);
  }
});

get(`/guilds/${guildId}/members`).then(members => {
  for (const member of members) {
    dump(member, `member/${member.user.id}`);
  }
});

get(`/channels/${messageId}`).then(message => {
  dump(message, `message/${message.id}`);
});

function get(p) {
  const promise = createPromise();
  getq.push({ path: p, promise });
  _get();
  return promise;
}

function _get() {
  if (getq.fetching) {
    return;
  }

  if (!getq[0]) {
    return;
  }

  getq.fetching = true;

  const item = getq.shift();

  request.get(`https://discordapp.com/api/v7${item.path}`)
    .set('Authorization', token)
    .end((_, res) => {
      const resetTime = Number(res.headers['x-ratelimit-reset']) * 1000;
      const remaining = Number(res.headers['x-ratelimit-remaining']);
      if (remaining === 0) {
        getq.unshift(item);
        setTimeout(() => {
          getq.fetching = false;
          _get();
        }, resetTime - Date.now());
      } else {
        promiseResolve(item.promise, res.body);
        getq.fetching = false;
        _get();
      }
    });
}

