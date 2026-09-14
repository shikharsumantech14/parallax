# El Niño issue — the 1970–2026 stripe series, recorded

- **Issue:** `src/content/issues/2026-05-03-el-nino-new-floor/index.mdx`, the `climate-strip` section
- **Written:** 2026-09-14, during the Phase-4 rewrite (docs/REGISTER-PLAN.md)
- **Why this file exists:** the rewrite's verifier (`2026-09-13-el-nino-new-floor-verification.md`) found the 57-value annual anomaly series the strip renders was never recorded in the dossier — the dossier's §9 left it to a fetch that was not written down, and the May verification audited a different section. The series was published on 2026-05-03 and is carried into the rewrite verbatim; this note is the dossier addendum the verifier asked for, so the trace exists.

## What the series is

`values[]`: one global mean surface temperature anomaly per year, 1970–2026, in °C above the 1850–1900 pre-industrial average, rounded to two decimals. 2026 is the Carbon Brief projected best estimate (1.47), not an observation. The data source line on the section credits **Berkeley Earth · Copernicus C3S ERA5 · WMO State of Global Climate 2025 · Carbon Brief**; the rewrite adds `src-14` (Berkeley Earth's data page) and `src-15` (the Copernicus climate-indicators temperature page) to `sources[]` so the two dataset names resolve.

## What the operator should confirm before the published flip

1. That the two dataset URLs are the pages you want cited (both are the datasets' standing landing pages; neither is a dated document).
2. That the 1970–2014 values match those datasets at two decimals — the May session fetched them; this session did not re-fetch. The 2015–2026 values are in the dossier (§3, §4) and trace.

## Two figures for 2016, deliberately

The strip's 2016 stripe reads 1.29 (the series' dataset); the dossier's Carbon Brief figure is ~1.25. Datasets differ by a few hundredths on any given year. The rewrite prints the number once, on the stripe, and the timeline note says only "the warmest year then on record" — so the issue no longer carries two values for the same year.
