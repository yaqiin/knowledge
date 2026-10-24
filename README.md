# يقين للمعرفة · Yaqiin Knowledge

The Yaqiin knowledge site: a free Islamic e-book **library**, **holy places** and Islamic landmarks, and curated **tools** for Muslims and students of knowledge. It links to the other Yaqiin projects (Quran, Sudur, and Yaqiin Mosques).

It is a **fully static site** (Next.js `output: "export"`): no backend, no database. Content lives in JSON files in the repo, and every page is pre-rendered HTML.

## Run locally

```sh
npm install
npm run dev     # http://localhost:3000
npm run build   # writes the static site to ./out
```

Deploy the `out/` folder to any static host (Cloudflare Pages, Vercel, GitHub Pages, Netlify). Planned domain: `knowledge.yaqiin.org`.

## Editing content

All content is in `src/data/`:

| File | Content |
|---|---|
| `books.json` | Library books: title, authors, description, pages, cover URL, download link, categories |
| `holy-places.json` | Holy places: `slug` (used in the URL), name, location, Google Maps link, **Markdown** description, images (the first one is the cover) |
| `tools.json` | Tools: name, description, link, category |

Images are hosted in the [`yaqiin/assets`](https://github.com/yaqiin/assets) repository. To add an image, push it there and use its `raw.githubusercontent.com` URL.

Categories are not configured separately: the filters show whatever categories appear in the data.

Links to other Yaqiin products (Quran, Sudur, the main site) are in `src/lib/links.ts`.

## History

This content was previously part of `yaqiin-web` (`/library`, `/holy-places`, `/tools`) and `yaqiin-ui`, and was served by the Yaqiin API and Supabase. It was exported once to JSON when Knowledge became its own product, so Yaqiin Mosques could stay focused on mosques and their activities.
