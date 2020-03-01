'use strict';

/* eslint-disable max-len, no-undef */

const Util = require('../src/util/Util');
const testString = "`_Behold!_`\n||___~~***```js\n`use strict`;\nrequire('discord.js');```***~~___||";

describe('escapeCodeblock', () => {
  test('shared', () => {
    expect(Util.escapeCodeBlock(testString)).toBe(
      "`_Behold!_`\n||___~~***\\`\\`\\`js\n`use strict`;\nrequire('discord.js');\\`\\`\\`***~~___||",
    );
  });

  test('basic', () => {
    expect(Util.escapeCodeBlock('```test```')).toBe('\\`\\`\\`test\\`\\`\\`');
  });
});

describe('escapeInlineCode', () => {
  test('shared', () => {
    expect(Util.escapeInlineCode(testString)).toBe(
      "\\`_Behold!_\\`\n||___~~***```js\n\\`use strict\\`;\nrequire('discord.js');```***~~___||",
    );
  });

  test('basic', () => {
    expect(Util.escapeInlineCode('`test`')).toBe('\\`test\\`');
  });
});

describe('escapeBold', () => {
  test('shared', () => {
    expect(Util.escapeBold(testString)).toBe(
      "`_Behold!_`\n||___~~*\\*\\*```js\n`use strict`;\nrequire('discord.js');```\\*\\**~~___||",
    );
  });

  test('basic', () => {
    expect(Util.escapeBold('**test**')).toBe('\\*\\*test\\*\\*');
  });
});

describe('escapeItalic', () => {
  test('shared', () => {
    expect(Util.escapeItalic(testString)).toBe(
      "`\\_Behold!\\_`\n||\\___~~\\***```js\n`use strict`;\nrequire('discord.js');```**\\*~~__\\_||",
    );
  });

  test('basic (_)', () => {
    expect(Util.escapeItalic('_test_')).toBe('\\_test\\_');
  });

  test('basic (*)', () => {
    expect(Util.escapeItalic('*test*')).toBe('\\*test\\*');
  });
});

describe('escapeUnderline', () => {
  test('shared', () => {
    expect(Util.escapeUnderline(testString)).toBe(
      "`_Behold!_`\n||_\\_\\_~~***```js\n`use strict`;\nrequire('discord.js');```***~~\\_\\__||",
    );
  });

  test('basic', () => {
    expect(Util.escapeUnderline('__test__')).toBe('\\_\\_test\\_\\_');
  });
});

describe('escapeStrikethrough', () => {
  test('shared', () => {
    expect(Util.escapeStrikethrough(testString)).toBe(
      "`_Behold!_`\n||___\\~\\~***```js\n`use strict`;\nrequire('discord.js');```***\\~\\~___||",
    );
  });

  test('basic', () => {
    expect(Util.escapeStrikethrough('~~test~~')).toBe('\\~\\~test\\~\\~');
  });
});

describe('escapeSpoiler', () => {
  test('shared', () => {
    expect(Util.escapeSpoiler(testString)).toBe(
      "`_Behold!_`\n\\|\\|___~~***```js\n`use strict`;\nrequire('discord.js');```***~~___\\|\\|",
    );
  });

  test('basic', () => {
    expect(Util.escapeSpoiler('||test||')).toBe('\\|\\|test\\|\\|');
  });
});

describe('escapeMarkdown', () => {
  test('shared', () => {
    expect(Util.escapeMarkdown(testString)).toBe(
      "\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
    );
  });

  test('no codeBlock', () => {
    expect(Util.escapeMarkdown(testString, { codeBlock: false })).toBe(
      "\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*```js\n\\`use strict\\`;\nrequire('discord.js');```\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
    );
  });

  test('no inlineCode', () => {
    expect(Util.escapeMarkdown(testString, { inlineCode: false })).toBe(
      "`\\_Behold!\\_`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n`use strict`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
    );
  });

  test('no bold', () => {
    expect(Util.escapeMarkdown(testString, { bold: false })).toBe(
      "\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_\\~\\~\\***\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`**\\*\\~\\~\\_\\_\\_\\|\\|",
    );
  });

  test('no italic', () => {
    expect(Util.escapeMarkdown(testString, { italic: false })).toBe(
      "\\`_Behold!_\\`\n\\|\\|_\\_\\_\\~\\~*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`\\*\\**\\~\\~\\_\\__\\|\\|",
    );
  });

  test('no underline', () => {
    expect(Util.escapeMarkdown(testString, { underline: false })).toBe(
      "\\`\\_Behold!\\_\\`\n\\|\\|\\___\\~\\~\\*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~__\\_\\|\\|",
    );
  });

  test('no strikethrough', () => {
    expect(Util.escapeMarkdown(testString, { strikethrough: false })).toBe(
      "\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_~~\\*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*~~\\_\\_\\_\\|\\|",
    );
  });

  test('no spoiler', () => {
    expect(Util.escapeMarkdown(testString, { spoiler: false })).toBe(
      "\\`\\_Behold!\\_\\`\n||\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_||",
    );
  });

  describe('code content', () => {
    test('no code block content', () => {
      expect(Util.escapeMarkdown(testString, { codeBlockContent: false })).toBe(
        "\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n`use strict`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
      );
    });

    test('no inline code content', () => {
      expect(Util.escapeMarkdown(testString, { inlineCodeContent: false })).toBe(
        "\\`_Behold!_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n\\`use strict\\`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
      );
    });

    test('neither inline code or code block content', () => {
      expect(Util.escapeMarkdown(testString, { inlineCodeContent: false, codeBlockContent: false }))
        // eslint-disable-next-line max-len
        .toBe(
          "\\`_Behold!_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n`use strict`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
        );
    });

    test('neither code blocks or code block content', () => {
      expect(Util.escapeMarkdown(testString, { codeBlock: false, codeBlockContent: false })).toBe(
        "\\`\\_Behold!\\_\\`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*```js\n`use strict`;\nrequire('discord.js');```\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
      );
    });

    test('neither inline code or inline code content', () => {
      expect(Util.escapeMarkdown(testString, { inlineCode: false, inlineCodeContent: false })).toBe(
        "`_Behold!_`\n\\|\\|\\_\\_\\_\\~\\~\\*\\*\\*\\`\\`\\`js\n`use strict`;\nrequire('discord.js');\\`\\`\\`\\*\\*\\*\\~\\~\\_\\_\\_\\|\\|",
      );
    });

    test('edge-case odd number of fenses with no code block content', () => {
      expect(
        Util.escapeMarkdown('**foo** ```**bar**``` **fizz** ``` **buzz**', {
          codeBlock: false,
          codeBlockContent: false,
        }),
      ).toBe('\\*\\*foo\\*\\* ```**bar**``` \\*\\*fizz\\*\\* ``` \\*\\*buzz\\*\\*');
    });

    test('edge-case odd number of backticks with no inline code content', () => {
      expect(
        Util.escapeMarkdown('**foo** `**bar**` **fizz** ` **buzz**', { inlineCode: false, inlineCodeContent: false }),
      ).toBe('\\*\\*foo\\*\\* `**bar**` \\*\\*fizz\\*\\* ` \\*\\*buzz\\*\\*');
    });
  });
});

/* eslint-enable max-len, no-undef */
