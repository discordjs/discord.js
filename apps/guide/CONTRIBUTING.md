# Contributing

## Local development

Clone the repo into your desired folder, `cd` into it, and install the dependencies.

```bash
git clone https://github.com/discordjs/discord.js.git
cd discord.js/apps/guide
pnpm --filter guide install
```

You can use `pnpm dev` to serve a local version of the guide.

## Adding pages

To add a new page to the guide, create a `filename.mdx` file in the folder of your choice located under `/content`. Fumadocs will pick it up and route appropriately. To list the section in the sidebar, make sure it is listed in the `meta.json` file of the directory you placed it in under the `pages` key. The order in the `pages` array determines the order pages have in the sidebar.

## Layout

The guide uses the fumadocs documention framework for Next.js. You can find examples as well as documentation for many components you can use at <https://fumadocs.dev/docs/ui>.

## General guidelines

Because we want to keep everything as consistent and clean as possible, here are some guidelines we strongly recommend you try to follow when making a contribution.

### Spelling, grammar, and wording

Improper grammar, strange wording, and incorrect spelling are all things that may lead to confusion when a user reads a guide page. It's important to attempt to keep the content clear and consistent. Re-read what you've written and place yourself in the shoes of someone else for a moment to see if you can fully understand everything without any confusion.

Don't worry if you aren't super confident with your grammar/spelling/wording skills; all pull requests get thoroughly reviewed, and comments are left in areas that need to be fixed or could be done better/differently.

#### "You"/"your" instead of "we"/"our"

When explaining parts of a guide, it's recommended to use "you" instead of "we" in most situations. For example:

```diff
- To check our Node version, we can run `node -v`.
+ To check your Node version, you can run `node -v`.

- To delete a message, we can do: `message.delete();`
+ To delete a message, you can do: `message.delete();`

- Our final code should look like this: ...
+ Your final code should look like this: ...

- Before we can actually do this, we need to update our configuration file.
+ Before you can actually do this, you need to update your configuration file.
```

#### "We" instead of "I"

When referring to yourself, use "we" (as in "the writers of this guide") instead of "I". For example:

```diff
- If you don't already have this package installed, I would highly recommend doing so.
+ If you don't already have this package installed, we would highly recommend doing so.
# Valid alternative:
+ If you don't already have this package installed, it's highly recommended that you do so.

- In this section, I'll be covering how to do that really cool thing everyone's asking about.
+ In this section, we'll be covering how to do that really cool thing everyone's asking about.
```

### Inclusive language

Try to avoid gendered and otherwise non-inclusive language. Examples are:

- Whitelist -> Allowlist
- Blacklist -> Denylist
- Master/Slave -> Leader/follower, primary/replica, primary/secondary, primary/standby
- Gendered pronouns (e.g. he/him/his) -> They, them, their
- Gendered terms (e.g. guys) -> Folks, people
- Sanity check -> Quick check, confidence check, coherence check
- Dummy value -> Placeholder, sample value

### Paragraph structure

Tied in with the section above, try to keep things as neatly formatted as possible. If a paragraph gets long, split it up into multiple paragraphs so that it adds some spacing and is easier on the eyes.

