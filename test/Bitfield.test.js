/* eslint-disable strict */
const { Permissions } = require('../src');

describe('Bitfield unit tests', () => {
  test('Bitfield#any', () => {
    const bf = new Permissions([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL]);
    expect(bf.any(Permissions.FLAGS.SEND_MESSAGES)).toStrictEqual(true);
    expect(bf.any(Permissions.FLAGS.ADMINISTRATOR)).toStrictEqual(false);
  });

  test('Bitfield#equals', () => {
    const bf = new Permissions([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL]);
    // Redundant?
    expect(
      bf.equals(new Permissions([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL]).bitfield),
    ).toStrictEqual(true);
    expect(bf.equals(Permissions.FLAGS.ADMINISTRATOR)).toStrictEqual(false);
  });

  test('Bitfield#has', () => {
    const bf = new Permissions([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL]);
    expect(bf.has(Permissions.FLAGS.SEND_MESSAGES)).toStrictEqual(true);
    expect(bf.has(Permissions.FLAGS.ADMINISTRATOR)).toStrictEqual(false);
  });

  test('Bitfield#missing', () => {
    const bf = new Permissions([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL]);
    expect(bf.missing(Permissions.FLAGS.ADMINISTRATOR)).toStrictEqual(['ADMINISTRATOR']);
    expect(bf.missing(Permissions.FLAGS.SEND_MESSAGES)).toStrictEqual([]);
  });

  test('Bitfield#add', () => {
    const bf = new Permissions([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL]);
    bf.add(Permissions.FLAGS.ADMINISTRATOR);
    expect(bf.bitfield).toStrictEqual(
      new Permissions([
        Permissions.FLAGS.SEND_MESSAGES,
        Permissions.FLAGS.VIEW_CHANNEL,
        Permissions.FLAGS.ADMINISTRATOR,
      ]).bitfield,
    );
  });

  test('Bitfield#remove', () => {
    const bf = new Permissions([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL]);
    bf.remove(Permissions.FLAGS.SEND_MESSAGES);
    expect(bf.bitfield).toStrictEqual(Permissions.FLAGS.VIEW_CHANNEL);
  });

  test('Bitfield#serialize', () => {
    const bf = new Permissions([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL]);
    expect(bf.serialize()).toStrictEqual({
      CREATE_INSTANT_INVITE: false,
      KICK_MEMBERS: false,
      BAN_MEMBERS: false,
      ADMINISTRATOR: false,
      MANAGE_CHANNELS: false,
      MANAGE_GUILD: false,
      ADD_REACTIONS: false,
      VIEW_AUDIT_LOG: false,
      PRIORITY_SPEAKER: false,
      STREAM: false,
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
      SEND_TTS_MESSAGES: false,
      MANAGE_MESSAGES: false,
      EMBED_LINKS: false,
      ATTACH_FILES: false,
      READ_MESSAGE_HISTORY: false,
      MENTION_EVERYONE: false,
      USE_EXTERNAL_EMOJIS: false,
      VIEW_GUILD_INSIGHTS: false,
      CONNECT: false,
      SPEAK: false,
      MUTE_MEMBERS: false,
      DEAFEN_MEMBERS: false,
      MOVE_MEMBERS: false,
      USE_VAD: false,
      CHANGE_NICKNAME: false,
      MANAGE_NICKNAMES: false,
      MANAGE_ROLES: false,
      MANAGE_WEBHOOKS: false,
      MANAGE_EMOJIS: false,
      REQUEST_TO_SPEAK: false,
    });
  });

  test('Bitfield#toArray', () => {
    const bf = new Permissions([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL]);
    expect(bf.toArray()).toStrictEqual(['VIEW_CHANNEL', 'SEND_MESSAGES']);
  });
});
