# Coverage measurement and Improvement

## Task 1: DIY

Manual instrumentation of the cyclomatic complexity for each function, answer these questions.

- What is the quality of your own coverage measurement? Does it take into account ternary operators(condition ? yes : no) and exceptions, if available in your language?

The quality of our coverage measurement seems to be accurate. It takes in to account all of the branches available in the code, only counting the if statements. The ternary operators in JavaScript were also split into if/else statements in order to properly count the branches. We had no exceptions in any of your 5 functions so we did not need to meausre how the coverage would be affected by an exception.

- What are the limitations of your tool? How would the instrumentation change if you modify the program?

Our tools are made specifically for the functions we chose. The decision points are manually calculated and markers are put there to count the branches. If we were to modify the program, we would also need to modify our branch coverage checker to ensure that we are correctly counting the branch coverage.

- If you have an automated tool, are your results consistent with the ones produced by existing tool(s)?

We don't have an automated tool. ...?

### \src\structures\Attachment.js: \_patch - Carl

### \src\structures\VoiceState.js: \_patch - Klara

### \src\structures\ApplicationCommand.js: equals - Jacob

### \src\structures\ThreadChannel.js: \_patch - Phoebe

### \src\structures\Guild.js: \_patch - Samuel

## Task 2: Coverage improvement

Keep a copy of your original coverage, try to improve coverage with additional test cases on a new branch.

- Identify the requirements that are tested or untested by the given test suite.
- Document the requirements (as comments), and use them later as assertions.
- Create new test cases as needed to improve branch coverage in the given functions. Can you call the function directly? Can you expand on existing tests? Do you have to add additional interfaces to the system (as public methods) to make it possible to set up test data structures?

### \src\structures\Attachment.js: \_patch - Carl

### \src\structures\VoiceState.js: \_patch - Klara

### \src\structures\ApplicationCommand.js: equals - Jacob

### \src\structures\ThreadChannel.js: \_patch - Phoebe

### \src\structures\Guild.js: \_patch - Samuel

# Task 3: Refactoring Plan

Is the high complexity you identified really necessary? Is it possible to split up the code (in the five complex functions you have identified) into smaller units to reduce complexity? If so, how would you go about this? Document your plan.

### \src\structures\Attachment.js: \_patch - Carl

### \src\structures\VoiceState.js: \_patch - Klara

### \src\structures\ApplicationCommand.js: equals - Jacob

### \src\structures\ThreadChannel.js: \_patch - Phoebe

### \src\structures\Guild.js: \_patch - Samuel
