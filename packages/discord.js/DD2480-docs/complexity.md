# Complexity Measurement

## Running lizard on the code base

The top 5 cyclomatic complex functions were:

    NLOC    CCN   token  PARAM  length  location
     176     81   1120      1     357 _patch@129-485@.\packages\discord.js\src\structures\Guild.js
      69     55    521      1     154 _patch@54-207@.\packages\discord.js\src\structures\ThreadChannel.js
      37     51    319      2      46 equals@362-407@.\packages\discord.js\src\structures\ApplicationCommand.js
      53     34    290      1     105 _patch@27-131@.\packages\discord.js\src\structures\VoiceState.js
      53     30    303      1     121 _patch@27-147@.\packages\discord.js\src\structures\Attachment.js


## Cyclomatic complexity

Functions assigned to each group member:

### \src\structures\Attachment.js: \_patch - Carl
  - Samuel's count: 14
  - Carl's count: 21

### \src\structures\VoiceState.js: \_patch - Klara
  - Carl's count: 23
  - Klara's count: 29

### \src\structures\ApplicationCommand.js: equals - Jacob
  - Klara's count: 34
  - Jacob's count: 39

### \src\structures\ThreadChannel.jsL \_patch - Phoebe
  - Jacob's count: 25
  - Phoebe's count: 38

### \src\structures\Guild.js: \_patch - Samuel
  - Phoebe's count: 62
  - Samuel's count: 30

Note: Use at least two group members to count the complexity separately, to get a reliable results. Use a
third member if the two counts differ.

- Did everyone get the same result? Is there something that is unclear? If you
  have a tool, is its result the same as yours?
  - Everyone got different results. The tool consistently gave a higher count than us. An unclear aspect was that, after looking at the source code for the tool, we noticed that it seems to recursively count branches and the frequency of different types of symbols. In any piece of code that is not trivially simple, humans will have a hard time counting the branches correctly, especially given the exponential growth of branches in the number of symbols. The formula for counting the cyclomatic complexity itself is quite simple, but it's hard to apply it correctly to a piece of code. Source code for TypeScript specifically:
      ```ts
      class TypeScriptReader(CodeReader, CCppCommentsMixin):
        # pylint: disable=R0903

        ext = ['ts']
        language_names = ['typescript', 'ts']
        _conditions = set(['if', 'elseif', 'for', 'while', '&&', '||', '?',
                          'catch', 'case'])

        def __init__(self, context):
            super().__init__(context)
            self.parallel_states = [TypeScriptStates(context)]

        @staticmethod
        @js_style_regex_expression
        def generate_tokens(source_code, addition='', token_class=None):
            addition = addition +\
                r"|(?:\$\w+)" + \
                r"|(?:\w+\?)" + \
                r"|`.*?`"
            js_tokenizer = JSTokenizer()
            for token in CodeReader.generate_tokens(
                    source_code, addition, token_class):
                for tok in js_tokenizer(token):
                    yield tok
    ```

- Are the functions/methods with high CC also very long in terms of LOC?
  - It seems to be positively correlated, however, it's not always the case, see the equals function in ApplicationCommand.js.
- What is the purpose of these functions? Is it related to the high CC?
  - We have two different kinds of functions:
    - `equals`: determines whether two commands are the same
    - `_patch`: updates the relevant parts of the object based on the data received from the API
  - It makes sense that the `equals` function has a high CC, because it has to check all properties of the object. The `_patch` functions are also quite long, but they are not as complex as the `equals` - they mostly just check if a property exists and then update the object accordingly.
- If your programming language uses exceptions: Are they taken into account by the tool? If you think of an exception as another possible branch (to the catch block or the end of the function), how is the CC affected?
  - Looking at the source code for the tool above, it seems that it does take exceptions into account as noted by the 'catch' in the _conditions set.
- Is the documentation of the function clear about the different possible outcomes induced by different branches taken?
  - In the `_patch`, since the functions themselves are not very complex, documentation is not really needed since the code is self-explanatory. For the `equals` function, the documentation is clearer.
