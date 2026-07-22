# Changes Review Notes

> [!CAUTION]
> **Reviewer: Please delete this file before or immediately after merging this PR.**
> It is a temporary review aid and must not land on `main`.

---

## Summary of changes in this PR

### 1. `apps/guide/source.config.js` → `source.config.ts`

Migrated the Fumadocs MDX configuration from JavaScript to TypeScript for full type inference.

- Renamed `source.config.js` → `source.config.ts`

---

### 2. `apps/guide/public/robots.txt` *(new file)*

Added a `robots.txt` to control search-engine crawler behaviour:

- Allows crawling of all public pages (`Allow: /`)
- Blocks internal/framework paths (`/api/`, `/_next/`, `/private/`, `/admin/`, `/draft/`, `/tmp/`)
- Points crawlers to the sitemap via `Sitemap: https://discord.js.org/sitemap.xml`
- Declares preferred host: `Host: https://discord.js.org`

---

### 3. `apps/guide/src/scripts/sitemap.ts` *(new file)*

A Bun-compatible sitemap builder for the guide app. Crawls `https://discord.js.org` and writes `public/sitemap.xml`.

- Follows internal links up to 10 000 pages
- Priority rules: root = `1.0`, `/guide/*` = `0.9`, `/docs/*` = `0.9`, `/api/*` = `0.8`, everything else = `0.7`
- Run via `pnpm sitemap` or `bun run src/scripts/sitemap.ts`

---

### 4. `apps/guide/public/sitemap.xml` *(new file)*

Generated output of the sitemap script above. Committed so deployments always have a sitemap without needing a live crawl at build time. Regenerate with `pnpm sitemap` and commit the result.

---

### 5. `apps/guide/package.json`

Added two npm scripts:

```json
"sitemap:bun": "bun run src/scripts/sitemap.ts",
"sitemap": "pnpm run sitemap:bun"
```

Also added `cheerio` and `@types/cheerio` as dev dependencies (required by the sitemap script).

---

### 6. `apps/website/scripts/sitemap.ts` *(new file)*

Parallel sitemap builder for the website app — same crawl logic as the guide script, outputs to `public/sitemap.xml` relative to the website app root.

---

### 7. `apps/website/public/sitemap.xml` *(new file)*

Generated sitemap for the website app. Same rationale as the guide sitemap — committed for stable deployment availability.

---

### 8. `apps/website/scripts/generateAllIndices.ts` *(replaces `.js`)*

Migrated `generateAllIndices.js` → `generateAllIndices.ts` (the `.js` file is deleted).

Key fix: added explicit async callback type aliases matching the signatures expected by `generateAllIndices` in `@discordjs/scripts`:

```ts
type FetchPackageVersion    = () => Promise<string[]>;
type FetchPackageVersionDocs = (pkg: string, version: string) => Promise<string>;
```

These match the parameter types defined in `packages/scripts/src/generateIndex.ts` and `generateSplitDocumentation.ts`. Without the explicit types, TypeScript could not infer the async return shapes correctly.

---

### 9. `apps/guide/CONTRIBUTING.md`

Updated to document all of the above infrastructure additions:

- New **Project structure** section with directory tree
- New **Infrastructure & tooling** section covering `source.config.ts`, `robots.txt`, sitemap script, and committed `sitemap.xml`
- All original writing-style and grammar guidelines preserved

---

> [!CAUTION]
> **Reminder: delete this file (`CHANGES_REVIEW.md`) before merging.**

> *Contributor*:[nishur31](https://github.com/nishur31)
