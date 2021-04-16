/* eslint-disable strict */
const { Util, Collection } = require('../src');

describe('Util unit tests', () => {
  describe('Util#flatten', () => {
    test('test collection flattening', () => {
      const bar = new Collection();
      bar.set('a', 1);
      bar.set('b', 2);
      bar.set('c', 3);

      const obj = {
        foo: 'foo',
        bar,
      };

      expect(Util.flatten(obj)).toStrictEqual({ foo: 'foo', bar: ['a', 'b', 'c'] });
    });

    test('only include specific props', () => {
      const obj = {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz',
      };

      expect(Util.flatten(obj, { foo: true, bar: false, baz: false })).toStrictEqual({ foo: 'foo' });
    });

    test('ignore props that start with an underscore', () => {
      const bar = new Collection();
      bar.set('a', 1);
      bar.set('b', 2);
      bar.set('c', 3);

      const obj = {
        foo: 'foo',
        bar,
        _ignore: 'me',
      };

      expect(Util.flatten(obj)).toStrictEqual({ foo: 'foo', bar: ['a', 'b', 'c'] });
    });
  });

  test('Util#splitMessage', () => {
    const text = `${'x'.repeat(1955)}\n${'x'.repeat(1984)}`;
    const split = Util.splitMessage(text);
    expect(split.length).toStrictEqual(2);
    expect(split[0].length).toStrictEqual(1955);
    expect(split[1].length).toStrictEqual(1984);
  });

  describe('Util#escapeMarkdown', () => {
    test('escape a code block', () => {
      const input = '```\nhello```';
      expect(Util.escapeMarkdown(input)).toStrictEqual('\\`\\`\\`\nhello\\`\\`\\`');
    });

    test('escape code block content', () => {
      const input = '```\n**hello**```';
      expect(Util.escapeMarkdown(input)).toStrictEqual('\\`\\`\\`\n\\*\\*hello\\*\\*\\`\\`\\`');
    });

    test('escape an inline code block', () => {
      const input = '`hello`';
      expect(Util.escapeMarkdown(input)).toStrictEqual('\\`hello\\`');
    });

    test('escape inline code block content', () => {
      const input = '`**hello**`';
      expect(Util.escapeMarkdown(input)).toStrictEqual('\\`\\*\\*hello\\*\\*\\`');
    });

    test('escape bold text', () => {
      const input = '**hello**';
      expect(Util.escapeMarkdown(input)).toStrictEqual('\\*\\*hello\\*\\*');
    });

    test('escape italic text (underscores)', () => {
      const input = '_hello_';
      expect(Util.escapeMarkdown(input)).toStrictEqual('\\_hello\\_');
    });

    test('escape italic text (asterisks)', () => {
      const input = '*hello*';
      expect(Util.escapeMarkdown(input)).toStrictEqual('\\*hello\\*');
    });

    test('escape underlined text', () => {
      const input = '__hello__';
      expect(Util.escapeMarkdown(input)).toStrictEqual('\\_\\_hello\\_\\_');
    });

    test('escape strikethrough text', () => {
      const input = '~~hello~~';
      expect(Util.escapeMarkdown(input)).toStrictEqual('\\~\\~hello\\~\\~');
    });

    test('escape spoiled text', () => {
      const input = '||hello||';
      expect(Util.escapeMarkdown(input)).toStrictEqual('\\|\\|hello\\|\\|');
    });
  });

  describe('Util#parseEmoji', () => {
    test('parse static emoji', () => {
      expect(Util.parseEmoji('<:lulBOYE:665650673454678026>')).toStrictEqual({
        animated: false,
        name: 'lulBOYE',
        id: '665650673454678026',
      });
    });

    test('parse animated emoji', () => {
      expect(Util.parseEmoji('<a:petTheSouji:825700269785612308>')).toStrictEqual({
        animated: true,
        name: 'petTheSouji',
        id: '825700269785612308',
      });
    });
  });

  test('Util#cloneObject', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(Util.cloneObject(obj)).toStrictEqual(obj);
  });

  test('Util#mergeDefault', () => {
    const def = { a: 1, b: 2, c: 3, d: 4, e: 5 };
    const given = { a: 10 };
    expect(Util.mergeDefault(def, given)).toStrictEqual({ a: 10, b: 2, c: 3, d: 4, e: 5 });
  });

  test('Util#moveElementInArray', () => {
    const array = [1, 2, 3];
    Util.moveElementInArray(array, 3, 1);
    expect(array).toStrictEqual([1, 3, 2]);
  });

  describe('Util#resolveString', () => {
    test('resolve basic string', () => {
      expect(Util.resolveString('foo')).toStrictEqual('foo');
    });

    test('resolve an array', () => {
      expect(Util.resolveString(['a', 'b', 'c'])).toStrictEqual('a\nb\nc');
    });

    test('resolve an object', () => {
      expect(Util.resolveString({})).toStrictEqual('[object Object]');
    });
  });

  describe('Util#resolveColor', () => {
    test('resolve hex color', () => {
      expect(Util.resolveColor('#FF0000')).toStrictEqual(16711680);
    });

    test('resolve RGB color', () => {
      expect(Util.resolveColor([31, 139, 76])).toStrictEqual(2067276);
    });

    test('resolve built-in color', () => {
      expect(Util.resolveColor('RED')).toStrictEqual(15158332);
    });
  });

  test('Util#discordSort', () => {
    const input = new Collection([
      ['830207118878703657', { id: '830207118878703657', rawPosition: 79 }],
      ['596949365638168583', { id: '596949365638168583', rawPosition: 20 }],
      ['672489920262307896', { id: '672489920262307896', rawPosition: 13 }],
      ['609226117596971013', { id: '609226117596971013', rawPosition: 22 }],
      ['581635439878733916', { id: '581635439878733916', rawPosition: 0 }],
      ['584948068080943136', { id: '584948068080943136', rawPosition: 16 }],
      ['802308010638442557', { id: '802308010638442557', rawPosition: 26 }],
      ['581635926757998613', { id: '581635926757998613', rawPosition: 19 }],
      ['596949413579194379', { id: '596949413579194379', rawPosition: 17 }],
      ['581635377471946763', { id: '581635377471946763', rawPosition: 18 }],
      ['581673024164462653', { id: '581673024164462653', rawPosition: 21 }],
    ]);

    const output = new Collection([
      ['581635439878733916', { id: '581635439878733916', rawPosition: 0 }],
      ['672489920262307896', { id: '672489920262307896', rawPosition: 13 }],
      ['584948068080943136', { id: '584948068080943136', rawPosition: 16 }],
      ['596949413579194379', { id: '596949413579194379', rawPosition: 17 }],
      ['581635377471946763', { id: '581635377471946763', rawPosition: 18 }],
      ['581635926757998613', { id: '581635926757998613', rawPosition: 19 }],
      ['596949365638168583', { id: '596949365638168583', rawPosition: 20 }],
      ['581673024164462653', { id: '581673024164462653', rawPosition: 21 }],
      ['609226117596971013', { id: '609226117596971013', rawPosition: 22 }],
      ['802308010638442557', { id: '802308010638442557', rawPosition: 26 }],
      ['830207118878703657', { id: '830207118878703657', rawPosition: 79 }],
    ]);

    expect(Util.discordSort(input)).toStrictEqual(output);
  });

  describe('Util#basename', () => {
    test('test basic file path', () => {
      expect(Util.basename('/home/fyko/code/discord.js/discord.js/test/Util.test.js')).toStrictEqual('Util.test.js');
    });

    test('test path with query', () => {
      expect(Util.basename('https://cdn.discordapp.com/emojis/230072332897484800.png?v=1')).toStrictEqual(
        '230072332897484800.png',
      );
    });
  });

  test('Util#idToBinary', () => {
    expect(Util.idToBinary('492374435274162177')).toStrictEqual(
      '11011010101010000111111000010101111000000000000000000000001',
    );
  });

  test('Util#binaryToIDn', () => {
    expect(Util.binaryToID('11011010101010000111111000010101111000000000000000000000001')).toStrictEqual(
      '492374435274162177',
    );
  });

  test('Util#removeMentions', () => {
    expect(Util.removeMentions('<@​!492374435274162177> @​everyone')).toStrictEqual(
      '<@​\u200b!492374435274162177> @​\u200beveryone',
    );
  });

  test('Util#delayFor', async () => {
    jest.useFakeTimers();
    const spy = jest.fn();

    const promise = Util.delayFor(100).then(spy);
    jest.runAllTimers();
    await promise;

    expect(spy).toHaveBeenCalled();
  });
});
