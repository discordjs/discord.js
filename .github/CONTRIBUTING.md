# Contributing

**The issue tracker is only for bug reports and enhancement suggestions. If you have a question, please ask it in the [Discord server](https://discord.gg/djs) instead of opening an issue – you will get redirected there anyway.**

If you wish to contribute to the discord.js codebase or documentation, feel free to fork the repository and submit a
pull request. We use ESLint to enforce a consistent coding style, so having that set up in your editor of choice
is a great boon to your development process.

## Setup

To get ready to work on the codebase, please do the following:

1. Fork & clone the repository, and make sure you're on the **main** branch
2. Run `pnpm install --frozen-lockfile` ([install](https://pnpm.io/installation))
3. Run `pnpm run build` to build local packages
4. Code your heart out!
5. Run `pnpm run test` to run ESLint and ensure any JSDoc changes are valid
6. [Submit a pull request](https://github.com/discordjs/discord.js/compare) (Make sure you follow the [conventional commit format](https://github.com/discordjs/discord.js/blob/main/.github/COMMIT_CONVENTION.md))

## Testing changes locally

If you want to test changes you've made locally, you can do so by using `pnpm link <package-you-want-to-link-to-your-current-package>`. This will create a symlink to your local copy of the discord.js libraries.

1. Create a new directory `mkdir discordjs-test` and move into it `cd discordjs-test`
2. Initialize a new pnpm project `pnpm init`
3. Now link the discord.js package from the directory you cloned earlier `pnpm link {PATH_TO_DISCORDJS_REPO}/packages/<package>`. (e.g. `pnpm link ~/discord.js/packages/rest`)
4. Import the package in your source code and test them out!

### Working with TypeScript packages

When testing local changes, you may notice you need to manually recompile TypeScript projects on every change in order to get the latest code changes to test locally.

To avoid this you can use the `--watch` parameter in the package build script to automatically recompile the project when changes are detected.

For example, to automatically recompile the `@discordjs/rest` project when changes are detected, run `pnpm turbo run build --filter='@discordjs/rest' -- --watch` in the root folder of where you cloned the discord.js repo.

## Adding new packages

If you'd like to create another package under the `@discordjs` organization run the following command:

```sh
pnpm run create-package <package-name> [package-description]
```

This will create new package directory under `packages/` with the required configuration files. You may begin
to make changes within the `src/` directory. You may also need to:

- Update workflows that utilize packages
- Update the CODEOWNERS file
