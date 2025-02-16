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

for 5 functions, state the cyclomatic complexity here and each person answer these questions.

Note: Use at least two group members to count the complexity separately, to get a reliable results. Use a
third member if the two counts differ.

- What are your results? Did everyone get the same result? Is there something that is unclear? If you
  have a tool, is its result the same as yours?
- Are the functions/methods with high CC also very long in terms of LOC?
- What is the purpose of these functions? Is it related to the high CC?
- If your programming language uses exceptions: Are they taken into account by the tool? If you think of an exception as another possible branch (to the catch block or the end of the function), how is the CC affected?
- Is the documentation of the function clear about the different possible outcomes induced by different branches taken?

### \src\structures\Attachment.js: \_patch - Carl

### \src\structures\VoiceState.js: \_patch - Klara

### \src\structures\ApplicationCommand.js: equals - Jacob

### \src\structures\ThreadChannel.jsL \_patch - Phoebe

### \src\structures\Guild.js: \_patch - Samuel

