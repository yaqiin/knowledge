# يقين للمعرفة · Yaqiin Knowledge

The Yaqiin knowledge site: a free Islamic e-book **library**, **holy places** and Islamic landmarks, curated **tools** for Muslims and students of knowledge, and **محفوظاتي**, a memorization tracker (starting with the Quran). It links to the other Yaqiin projects (Quran and Yaqiin Mosques).

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
| `quran-heart.json` | Shapes of the Quran heart in محفوظاتي (see below); not meant to be edited by hand |

Images are hosted in the [`yaqiin/assets`](https://github.com/yaqiin/assets) repository. To add an image, push it there and use its `raw.githubusercontent.com` URL.

Categories are not configured separately: the filters show whatever categories appear in the data.

Links to other Yaqiin products (Quran, the main site) are in `src/lib/links.ts`.

## محفوظاتي (memorization tracker)

`/memorization/` lets visitors track what they've memorized, one **collection** at a time. Progress is saved in the visitor's browser only (`localStorage`, keys prefixed `yaqiin:memorization:`); there are no accounts.

Today the only collection is **the Quran** (`/memorization/quran/`): mark surahs on the interactive heart or in a numbered list, follow your progress, and download a picture of your heart as PNG, JPG or SVG, choosing the background colour, the colour of memorized surahs, and the size in the export dialog. الأربعون النووية and hadith books are listed as coming soon.

| Path (in `src/app/memorization/`) | Role |
|---|---|
| `collections.ts` | The collection registry (`COLLECTIONS`) and the "coming soon" list (`UPCOMING`) |
| `storage.ts` | `useMemorized(slug)`: memorized ids per collection, saved locally and synced across tabs |
| `components/` | Shared UI for any collection: hub cards, progress bar, and `ItemGrid` (numbered list with search and filters) |
| `quran/surahs.ts` | The 114 surahs in mushaf order (`id` = surah number) |
| `quran/heart.ts`, `QuranHeart.tsx` | The heart: shapes from `src/data/quran-heart.json` (keyed by surah number), site and export colours, backgrounds |
| `quran/QuranTracker.tsx` | The Quran page: heart/list views, search, zoom, progress, start over |
| `quran/ExportDialog.tsx`, `download.ts` | Export dialog with live preview; builds a standalone SVG and renders it to an image |

**Adding a collection** (e.g. الأربعون النووية): create its items (`{ id, name }`; ids must never change once published, since they're stored in visitors' browsers), add it to `COLLECTIONS` (and remove it from `UPCOMING`), and add `memorization/<slug>/page.tsx` that renders `ItemGrid` with `useMemorized`. The hub card and progress work automatically.

The heart started as the [`yaqiin/sudur`](https://github.com/yaqiin/sudur) app ("في صدور"), itself based on [The Quran Heart](https://github.com/maro-medhat/The-Quran-Heart); its MIT license is kept in `quran/LICENSE`.

## History

This content was previously part of `yaqiin-web` (`/library`, `/holy-places`, `/tools`) and `yaqiin-ui`, and was served by the Yaqiin API and Supabase. It was exported once to JSON when Knowledge became its own product, so Yaqiin Mosques could stay focused on mosques and their activities.
