# Onboarding

## How good is the onboarding documentation? How easily can you build the project? Briefly describe if everything worked as documented or not:

- Did you have to install a lot of additional tools to build the software?
  - Different for everyone, but as long as you have node installed, you should be able to build the project without any additional tools. Samuel had bun installed, and `bun add discord.js` worked fine. Phoebe and the rest of the group used pnpm after installing it, and it worked fine.

https://github.com/discordjs/discord.js/blob/main/.github/CONTRIBUTING.md

use this document above, and make sure to install pnpm beforehand.

- Were those tools well documented?
  These tools were well documented. They had another page where they listed exactly how to get started and how to create new things. They also had a page that explains how to get started to work on the codebase. So this was extremely helpful in getting started. Given that this is a very popular library for discord and development for bots, the documentation is and has to be good and comprehensive.

- Were other components installed automatically by the build script?
  The components needed were installed using the runtime tools presented in the readme and everything was installed automatically. It was a really simple process to get started.

- Did the build conclude automatically without errors?
  The build concluded automatically without errors, when using pnpm as the package manager.

- How well do examples and tests run on your system(s)?
  Running `pnpm run test` ran 27 tasks that were all successful. Amazing!
