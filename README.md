# NusaStat — Indonesia in Numbers

A national statistics site for Indonesia: population, economy, people and
regions, with real figures (BPS, Bank Indonesia, World Bank, IMF) for
2015–2024. Static files only — no network requests, no build step.

## What it is

- **Overview** — headline indicators, population and GDP-growth charts with
  a year-range selector and a bar/line toggle, latest releases, five largest
  provinces.
- **Population** — population trend, age structure, yearly table.
- **Economy** — GDP growth chart, GDP-by-sector donut, inflation line,
  trade-balance bars, yearly table.
- **People** — HDI trend, unemployment, HDI by province (top 10).
- **Regions** — all 38 provinces in a sortable, searchable table with an
  island filter; tap a row for a detail panel against the national average.
- **Data & sources** — every series as a downloadable CSV (generated in the
  browser), the full provinces table, sources and method notes.

## Run it

```sh
# serve app/ with any static server, e.g. Python's, then open http://localhost:8000
python3 -m http.server 8000 --directory app
```

`main.ts` (Node 22) hands the site in: it validates the screenshots, copies `app/` and
`screenshots/` to `/output`, and writes `/output/dossier.json`.

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Sources

Statistics Indonesia (BPS), Bank Indonesia, World Bank, IMF. See
`#/data` in the site for the full source and method notes. NusaStat is an
independent demonstration portal, not an official BPS publication.
