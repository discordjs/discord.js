# Contributing

## Local development

Clone the code base into a local folder, `cd` into it, and install the dependencies:

```bash
git clone https://github.com/discordjs/discord.js.git
cd discord.js/apps/guide
pnpm --filter guide install
```

You can and should use `pnpm dev` to check your changes out locally before pushing them for review.

## Adding pages

To add a new page to the guide, create a `filename.mdx` file in the folder of your choice located under `/content`. Fumadocs will pick it up and route appropriately. To list the section in the sidebar, make sure it is listed in the `meta.json` file of the directory you placed it in under the `pages` key. The order in the `pages` array determines the order pages have in the sidebar.

## Framework and components

The guide uses the fumadocs documentation framework for Next.js. You can find examples as well as documentation for the components you can use at <https://fumadocs.dev/docs/ui>.

## General guidelines

Please try your best to follow the guidelines below. They help to make the guide appear as a coherent piece of work rather than a collection of disconnected pieces with different writing styles.

### Spelling, grammar, and wording

Improper grammar, strange wording, and incorrect spelling are all things that may lead to confusion when a user reads a guide page. It's important to attempt to keep the content clear and consistent. Re-read what you've written and place yourself in the shoes of someone else for a moment to see if you can fully understand everything without any confusion.

Don't worry if you aren't super confident with your grammar/spelling/wording skills; all pull requests get thoroughly reviewed, and comments are left in areas that need to be fixed or could be done better/differently.

#### "You"/"your" instead of "we"/"our"

When explaining parts of the guide, we recommend to use "you" instead of "we" when referring to the read or things they can do:

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

#### Inclusive language

Try to avoid using gendered and otherwise non-inclusive language. The following are just examples to give you an idea of what we expect. Don't understand this as a complete list of "banned terms":

- Use they/them/their instead of gendered pronouns (he/him/his, she/her/hers).
- Avoid using "master" and "slave", you can use "primary" and "replica" or "secondary" instead.
- Avoid gendered terms like "guys", "folks" and "people" work just as well.
- Avoid ableist terms "sanity check", use "confidence check" or "coherence check" instead.
- Avoid talking about "dummy" values, call them "placeholder" or "sample value" instead.

### Paragraph structure

Try to keep guide articles formatted nicely and easy to read. If paragraphs get too long, you can usually split them up where they introduce a new concept or facet. Adding a bit of spacing can make the guide easier to digest and follow! Try to avoid run-on sentences with many embedded clauses.

## Semantic components

You can find the full documentation for the guide framework at <https://fumadocs.dev/docs/ui/>. If you are unsure what to use when, consider looking through the existing guide pages and how they approach things.

### Callouts

You can use [Callouts](https://fumadocs.dev/docs/ui/markdown#callouts) to describe additional context that doesn't fully fit into the flow of the paragraph or requires special attention. Prefer to MDX syntax `<Callout />` over Remark `:::` admonitions.

### Code

Fumadocs integrates [Shiki transformers](https://fumadocs.dev/docs/ui/markdown#shiki-transformers) for visual highlighting through the use of [Rhype Code](https://fumadocs.dev/docs/headless/mdx/rehype-code).

When describing changes or additions to code, prefer using the appropriate language (`js` in most cases for this guide) with diff transformers over `diff` highlights:

```js
console.log('Hello'); // [!code --]
console.log('Hello World'); // [!code ++]
```

You can put the transformer syntax above the respective line and declare ranges instead of repeating formatting intsructions. You can also combine different transformers on the same line. Note that word highlights highlight the word across the code block by default, but do respect ranges.

```js
console.log('Hello'); // [!code --:2]
console.log('World');
// [!code ++]
console.log('Hello World');
```

```js
// ...
// [!code focus:2] [!code word:log:1]
console.log('Hello World!'); // this instance of "log" is highlighted
console.log('Foobar'); // this one is not
// ...
```

When introducing new functions in a paragraph, consider highlighting them in the following code snippet to draw additional attention to their use. For example, if you just described the `log` function:

```js
console.log('Hello World'); // [!code word:log]
```

Make sure to denote the file names or paths if you describe progress in a specific code sample. When descrbing multiple files, use [tab groups](https://fumadocs.dev/docs/ui/markdown#tab-groups).

````md
```json title="package.json" tab="Configuration"
{ ... }
```

```js tab="Usage"
// code showing how to use what is being configured
```
````

### Directory Structure

You can use the [Files](https://fumadocs.dev/docs/ui/components/files) component to visualize the expected directory structure, if it is relevant to the approach you describe.
