# Refactoring Plan

Is the high complexity you identified really necessary? Is it possible to split up the code (in the five complex functions you have identified) into smaller units to reduce complexity? If so, how would you go about this?
Document your plan.

For 4/5 of our highly complex functions, they are considered patch functions. These are used to update object properties with new data. When new data is received from the API, the patch function will update the information for the specific object referenced. It is also necessary to have many of the conditions in these functions to check to see if any data is null so that it can handle the initialization properly. By keeping the logic of the patch function all in one place, it allows for updating these objects to be consistent since all of the updates occur in one place. It is possible to split up these complex functions, but perhaps for cohesiveness it would be best to keep them together. We each attempted to refactor our solutions to see if we could reduce the cyclomatic complexity by at least 35 percent.

One (out of 5) of our most complex functions was the equals function in the ApplicationCommand.js file. It is quite a cyclomatic complex function since it aims to do a lot of top level parameter checks, null checks, and permissions checks all in one function.

Below we will need to show how we might make these changes (and how we implemented them for the P+) so that it reduces the cyclomatic complexity.

### \src\structures\Attachment.js: \_patch - Carl

### \src\structures\VoiceState.js: \_patch - Klara

### \src\structures\ApplicationCommand.js: equals - Jacob

### \src\structures\ThreadChannel.js: \_patch - Phoebe

My \_patch function in ThreadChannel.js had an original CCN of 55. There were many different conditional checks for what data was contained in the metadata. In order to reduce this number, I ended up splitting each of these conditional checks into their own functions. I made these changes and you can see them in this [file](../DD2480-docs/functions/thread-patch-refactor.js). By separating out each of the data checks into their own functions, I was able to reduce the CCN from 55 to 8! This created 13 new functions that all have a cyclomatic complexity of less than 11. You can run lizard on this file by running `lizard .\packages\discord.js\DD2480-docs\functions\thread-patch-refactor.js`.

### \src\structures\Guild.js: \_patch - Samuel
