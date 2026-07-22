import { writeFile } from "node:fs/promises";
import * as cheerio from "cheerio";


const BASE_URL = "https://discord.js.org";
const MAX_PAGES = 10000;

const visited = new Set<string>();
const queue = [BASE_URL];

// Store metadata for each page
const metadata = new Map<
    string,
    {
        lastmod?: string;
        changefreq: string;
        priority: string;
    }
>();

while (queue.length && visited.size < MAX_PAGES) {
    const url = queue.shift()!;

    if (visited.has(url)) continue;
    visited.add(url);

    console.log(`Crawling: ${url}`);

    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Sitemap Builder/1.0",
            },
        });

        if (!res.ok) continue;

        const lastModified = res.headers.get("last-modified");

        metadata.set(url, {
            lastmod: lastModified
                ? new Date(lastModified).toISOString()
                : new Date().toISOString(),
            changefreq: url === BASE_URL ? "daily" : "weekly",
            priority:
                url === BASE_URL
                    ? "1.0"
                    : url.includes("/guide/")
                        ? "0.9"
                        : url.includes("/docs/")
                            ? "0.9"
                            : url.includes("/api/")
                                ? "0.8"
                                : "0.7",
        });

        const type = res.headers.get("content-type") ?? "";
        if (!type.includes("text/html")) continue;

        const html = await res.text();
        const $ = cheerio.load(html);

        $("a[href]").each((_: any, el: any) => {
            const href = $(el).attr("href");
            if (!href) return;

            const next = new URL(href, BASE_URL);

            if (next.origin !== new URL(BASE_URL).origin) return;

            next.hash = "";
            next.search = "";

            const normalized = next.toString().replace(/\/$/, "");

            if (!visited.has(normalized)) {
                queue.push(normalized);
            }
        });
    } catch (err) {
        console.error(url, err);
    }
}

const escapeXml = (str: string) =>
    str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${[...visited]
        .sort()
        .map((url) => {
            const meta = metadata.get(url)!;

            return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${meta.lastmod}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`;
        })
        .join("\n")}
</urlset>
`;

await writeFile("./public/sitemap.xml", xml, "utf8");

console.log(`Done. ${visited.size} URLs found.`);