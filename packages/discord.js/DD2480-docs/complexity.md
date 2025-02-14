# Complexity Measurement

## Running lizard on the code base

The top 5 cyclomatic complex functions were:

    NLOC    CCN   token  PARAM  length  location
    54      21    448    5      71      remove@273-343@.\src\managers\ApplicationCommandPermissionsManager.js
    59      20    478    2      111     constructor@48-158@.\src\sharding\ShardingManager.js
    35      16    307    3      42      spawn@192-233@.\src\sharding\ShardingManager.js
    43      25    230    1      87      _patch@17-103@.\src\structures\interfaces\Application.js
    53      29    293    1      109     _patch@64-172@.\src\structures\ApplicationCommand.js

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

### \src\structures\ApplicationCommand.js: \_patch - Carl

### \src\structures\interfaces\Application.js: \_patch - Klara

### \src\sharding\ShardingManager.js: spawn - Jacob

### \src\sharding\ShardingManager.js: constructor - Phoebe

### \src\managers\ApplicationCommandPermissionsManager.js: remove - Samuel
