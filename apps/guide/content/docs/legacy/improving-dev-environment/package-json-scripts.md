---
title: Package scripts
---

# Setting up package.json scripts

An easy way to run scripts like a script to start your bot, a script to lint your bot's files, or whatever scripts you use is by storing them in your `package.json` file. After you store these scripts in your `package.json` file, you can run the `start` script to start your bot or the `lint` script to lint your code for errors.

```sh tab="npm"
npm run start
npm run lint
```

```sh tab="yarn"
yarn run start
yarn run lint
```

```sh tab="pnpm"
pnpm run start
pnpm run lint
```

```sh tab="bun"
bun run start
bun run lint
```

## Getting started

Before getting started, you'll need to have a `package.json` file. If you don't have a `package.json` file yet, you can run the following command in the console to generate one.

<CodeGroup>
  <CodeGroupItem title="npm">

```sh
npm init -y
```

  </CodeGroupItem>
  <CodeGroupItem title="yarn">

```sh
yarn init -y
```

  </CodeGroupItem>
  <CodeGroupItem title="pnpm">

```sh
pnpm init
```

  </CodeGroupItem>
  <CodeGroupItem title="bun">

```sh
bun init -y
```

  </CodeGroupItem>
</CodeGroup>
:::

If you haven't touched your `package.json` file yet (excluding installing dependencies), your `package.json` file should look similar to the following:

```json
{
	"name": "my-bot",
	"version": "1.0.0",
	"description": "A Discord bot!",
	"main": "index.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"keywords": [],
	"author": "",
	"license": "ISC"
}
```

Let's zoom in more. Below `main`, you'll see `scripts`. You can specify your scripts there. In this guide, we'll show how to start and lint your bot using a `package.json` script.

## Adding your first script

::: tip
We'll assume you have finished the [creating your first bot](/creating-your-bot/) section of the guide. If you haven't, ensure to follow it first!
:::

Over at your `package.json` file, add the following line to the `scripts`:

```json
"start": "node ."
```

::: tip
The `node .` script will run the file you have specified at the `main` entry in your `package.json` file. If you don't have it set yet, make sure to select your bot's main file as `main`!
:::

Now, whenever you run the `start` script in your bot's directory, it will run the `node .` command.

:::: code-group
::: code-group-item npm

```sh
npm run start
```

:::
::: code-group-item yarn

```sh
yarn run start
```

:::
::: code-group-item pnpm

```sh
pnpm run start
```

:::
::: code-group-item bun

```sh
bun run start
```

:::
::::

Let's create another script to lint your code via the command line.

::: tip
If you do not have ESLint installed globally, you can use [npx](https://alligator.io/workflow/npx/) to run the ESLint script for your local directory. For more info on how to set it up, you can read the site [here](https://alligator.io/workflow/npx/).
:::

Add the following line to your scripts:

```json
"lint": "eslint ."
```

Now, whenever you run the `lint` script, ESLint will lint your `index.js` file.

:::: code-group
::: code-group-item npm

```sh
npm run lint
```

:::
::: code-group-item yarn

```sh
yarn run lint
```

:::
::: code-group-item pnpm

```sh
pnpm run lint
```

:::
::: code-group-item bun

```sh
bun run lint
```

:::
::::

Your `package.json` file should now look similar to the following:

```json
{
	"name": "my-bot",
	"version": "1.0.0",
	"description": "A Discord bot!",
	"main": "index.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1",
		"start": "node .",
		"lint": "eslint ."
	},
	"keywords": [],
	"author": "",
	"license": "ISC"
}
```

And that's it! You can always add more scripts now, running them with:

```sh tab="npm"
npm run <script-name>
```

```sh tab="yarn"
yarn run <script-name>
```

```sh tab="pnpm"
pnpm run <script-name>
```

```sh tab="bun"
bun run <script-name>
```

<Card>
    <Card title="Package Scripts" href="https://docs.npmjs.com/cli/v7/using-npm/scripts">
        Package scripts allow some more configuration (like pre-, post- and lifecycle scripts) than we can cover in this guide. Check out the official documentation on for more information.
    </Card>
</Cards>
