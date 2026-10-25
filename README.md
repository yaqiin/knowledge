# يقين للمعرفة · Yaqiin Knowledge

The Yaqiin knowledge site: a free Islamic e-book **library**, Islamic **landmarks** (المعالم), curated **tools** for Muslims and students of knowledge, and **محفوظاتي**, a memorization tracker (starting with the Quran).

It is a **fully static site** (Next.js `output: "export"`): no backend, no database. Content lives in JSON files in the repo, and every page is pre-rendered HTML.

## Run locally

```sh
npm install
npm run dev     # http://localhost:3000
npm run build   # writes the static site to ./out
```

## Editing content

All content is in `src/data/`:

| File | Content |
|---|---|
| `books.json` | Library books: title, authors, description, pages, cover URL, download link, categories |
| `places.json` | Islamic landmarks (المعالم, at `/places/`): `slug` (used in the URL), name, location, Google Maps link, **Markdown** description, images (the first one is the cover) |
| `tools.json` | Tools: name, description, link, category |
| `quran-heart.json` | Shapes of the Quran heart in محفوظاتي (see below); not meant to be edited by hand |

Images are hosted in the [`yaqiin/assets`](https://github.com/yaqiin/assets) repository. To add an image, push it there and use its `raw.githubusercontent.com` URL.

## Contribution 🤝

Read the guideline: [CONTRIBUTING.md](../../Naseej/discover/discover-api/CONTRIBUTING.md).

### Notes:
- The Quran Heart svg file is taken and the idea is inspired from this project: [The Quran Heart](https://github.com/maro-medhat/The-Quran-Heart)
