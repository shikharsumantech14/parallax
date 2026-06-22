# Space — source allowlist

Tiered, viewpoint-tagged allowlist for the **space** topic (orbital mechanics,
missions, launches, near-Earth objects, debris, space weather, policy &
sustainability). Schema + field definitions live in `_TAXONOMY.md`; read it
before editing. This is both the brand-protection citation gate **and** the
tiered config that feeds the RAG corpus.

**Viewpoint clusters (space):** `agency-official` · `commercial-industry` ·
`science-academic` · `policy-sustainability` · `primary`. Space is mostly
empirical — T0/T1/T2 carry facts (`viewpoint: n/a`); clusters matter on the
*interpretation* layer (debris, militarisation, regulation, commercialisation).

**Last updated 2026-06-21.**

---

## T0 — Primary documents / official data

- **NASA Newsroom** — https://www.nasa.gov/news/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: mission milestones, science releases, official program statements (US gov works = public domain)
- **NASA — Solar System / Planetary Defense (PDCO)** — https://www.nasa.gov/planetarydefense/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: official NEO impact-risk posture, DART/Hera, planetary-defense policy
- **JPL Newsroom** — https://www.jpl.nasa.gov/news/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: robotic missions, navigation, asteroid/comet tracking releases
- **ESA Newsroom** — https://www.esa.int/Newsroom — tier: T0 · access: open · ingest: metadata · viewpoint: n/a · cadence: live — focus: European missions, Space Safety, environment statements
- **ESA — Space Debris (Space Safety)** — https://www.esa.int/Space_Safety/Space_Debris — tier: T0 · access: open · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: official debris-environment framing, mitigation, ADRIOS/ClearSpace
- **ISRO** — https://www.isro.gov.in/ — tier: T0 · access: open · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: Indian space program — launches, missions, official statements
- **JAXA — What's New** — https://global.jaxa.jp/news/ — tier: T0 · access: open · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: Japanese missions (Hayabusa2 sample return, lunar, ISS HTV-X)
- **UNOOSA — Register of Objects Launched into Outer Space** — https://www.unoosa.org/oosa/en/spaceobjectregister/index.html — tier: T0 · access: open · ingest: metadata · viewpoint: n/a · cadence: archival — focus: treaty register; which states registered which objects (registration-Convention compliance)
- **IADC — Space Debris Mitigation Guidelines** — https://www.iadc-home.org/ — tier: T0 · access: open · ingest: metadata · viewpoint: n/a · cadence: archival — focus: the international debris-mitigation consensus (25-yr / post-mission disposal rules)
- **FCC — Space / Orbital Debris rules** — https://www.fcc.gov/space — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: US satellite licensing, 5-year post-mission disposal rule, debris enforcement actions
- **U.S. Office of Space Commerce** — https://www.space.commerce.gov/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: civil space traffic coordination (TraCSS), commercial remote-sensing licensing
- **SpaceX Updates** — https://www.spacex.com/updates/ — tier: T0 · access: open · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: Starship/Starlink primary operator statements (corporate primary, treat as self-reported)

## T1 — Datasets / data portals

- **JPL Horizons System** — https://ssd.jpl.nasa.gov/horizons/ — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: high-precision ephemerides for 1.4M+ asteroids, comets, planets, spacecraft, Lagrange points
- **JPL SSD/CNEOS API** — https://ssd-api.jpl.nasa.gov/ — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: programmatic close-approach, Sentry, fireball, NEO-discovery-stats endpoints
- **CNEOS — Center for Near-Earth Object Studies** — https://cneos.jpl.nasa.gov/ — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: close-approach tables, Sentry impact-risk list, discovery statistics, fireball log
- **IAU Minor Planet Center** — https://www.minorplanetcenter.net/ — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: the world clearinghouse for minor-body astrometry, designations, MPCORB orbital elements
- **ESA Space Debris User Portal (DISCOSweb)** — https://sdup.esoc.esa.int/ — tier: T1 · access: reg · ingest: live · viewpoint: n/a · cadence: live — focus: object catalogue + space-environment statistics behind the Environment Report
- **CelesTrak (GP element sets)** — https://celestrak.org/ — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: SGP4 element sets, supplemental owner/operator data, SOCRATES conjunction screening (T.S. Kelso)
- **Space-Track.org (18th SDS)** — https://www.space-track.org/ — tier: T1 · access: reg · ingest: live · viewpoint: n/a · cadence: live — focus: authoritative US catalogue — TLEs, decay/reentry predictions for 16,000+ tracked objects
- **NASA Open Data Portal** — https://data.nasa.gov/ — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: agency datasets, mission telemetry, NEO/exoplanet/heliophysics catalogues
- **NASA Exoplanet Archive** — https://exoplanetarchive.ipac.caltech.edu/ — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: weekly — focus: confirmed/candidate exoplanet parameters, the canonical population dataset
- **NOAA Space Weather Prediction Center** — https://www.swpc.noaa.gov/ — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: official US space-weather data — solar wind, geomagnetic storm scales, satellite environment

## T2 — Peer-reviewed & preprints

- **arXiv — Earth & Planetary Astrophysics (astro-ph.EP)** — https://arxiv.org/list/astro-ph.EP/recent — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: preprints on NEOs, planetary formation, orbital dynamics (OA, but quote the published version)
- **arXiv — Instrumentation & Methods (astro-ph.IM)** — https://arxiv.org/list/astro-ph.IM/recent — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: survey/telescope methods, SSA & debris-tracking technique preprints
- **Astronomy & Astrophysics (A&A)** — https://www.aanda.org/ — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: peer-reviewed astrophysics; fully OA under Subscribe-to-Open (quotable)
- **The Planetary Science Journal (AAS/IOP)** — https://iopscience.iop.org/journal/2632-3338 — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: gold-OA (CC-BY) planetary science — asteroids, comets, solar-system bodies
- **The Astronomical Journal (AAS/IOP)** — https://iopscience.iop.org/journal/1538-3881 — tier: T2 · access: paywall · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: observational astronomy, survey results (cite published article)
- **Icarus (Elsevier)** — https://www.sciencedirect.com/journal/icarus — tier: T2 · access: paywall · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: the journal of record for solar-system & planetary science (metadata-only; quote original)
- **Nature Astronomy** — https://www.nature.com/natastron/ — tier: T2 · access: paywall · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: high-impact astrophysics & planetary results (abstract-guides; quote licensed copy)
- **Monthly Notices of the RAS (MNRAS)** — https://academic.oup.com/mnras — tier: T2 · access: paywall · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: broad astrophysics; many author-OA preprints on arXiv
- **JGR: Space Physics (AGU)** — https://agupubs.onlinelibrary.wiley.com/journal/21699402 — tier: T2 · access: paywall · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: magnetosphere, ionosphere, space-weather physics
- **NASA ADS (Astrophysics Data System)** — https://ui.adsabs.harvard.edu/ — tier: T2 · access: open · ingest: metadata · viewpoint: n/a · cadence: live — focus: discovery layer — 12M+ astro/physics records, citation graph, links to OA full text
- **NASA Technical Reports Server (NTRS)** — https://ntrs.nasa.gov/ — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: 200k+ full-text NASA/NACA technical reports, conference & journal papers (US gov works)

## T3 — Think-tanks / NGOs / research institutes

- **Secure World Foundation** — https://swfound.org/ — tier: T3 · access: open · ingest: metadata · viewpoint: policy-sustainability · cadence: weekly — focus: space sustainability, debris governance, the Global Counterspace Capabilities report
- **CSIS — Aerospace Security Project** — https://aerospace.csis.org/ — tier: T3 · access: open · ingest: metadata · viewpoint: policy-sustainability · cadence: weekly — focus: annual Space Threat Assessment, counterspace tracking (US-policy lean — tag accordingly)
- **The Aerospace Corporation — CORDS** — https://aerospace.org/cords — tier: T3 · access: open · ingest: metadata · viewpoint: science-academic · cadence: weekly — focus: reentry-breakup & debris-survivability modelling, reentry-prediction database (FFRDC)
- **McGill — Centre for Research in Air & Space Law (MILAMOS / McGill Manual)** — https://www.mcgill.ca/iasl/ — tier: T3 · access: open · ingest: metadata · viewpoint: policy-sustainability · cadence: archival — focus: international space-law clarification, military-use rules, governance scholarship
- **Planetary Society** — https://www.planetary.org/ — tier: T3 · access: open · ingest: metadata · viewpoint: science-academic · cadence: weekly — focus: advocacy + accessible analysis of planetary science, budgets, mission policy (advocacy lean — tag)
- **Commercial Spaceflight Federation** — https://www.commercialspace.org/ — tier: T3 · access: open · ingest: metadata · viewpoint: commercial-industry · cadence: weekly — focus: industry-association framing of commercial-space policy (industry lean — tag for balance)

## T4 — Long-form journalism

- **SpaceNews** — https://spacenews.com/ — tier: T4 · access: open · ingest: metadata · viewpoint: commercial-industry · cadence: live — focus: industry & policy reporting — launches, contracts, regulation, financials
- **Ars Technica — Space** — https://arstechnica.com/space/ — tier: T4 · access: open · ingest: metadata · viewpoint: science-academic · cadence: live — focus: deep technical reporting (Eric Berger), launch-cadence + rocket-program analysis
- **Aviation Week — Space** — https://aviationweek.com/space — tier: T4 · access: paywall · ingest: metadata · viewpoint: commercial-industry · cadence: weekly — focus: defense + commercial space, program-level reporting
- **Space.com** — https://www.space.com/ — tier: T4 · access: open · ingest: metadata · viewpoint: science-academic · cadence: live — focus: news roundup, mission explainers, observing (general-audience — corroborate facts upstream)
- **Sky & Telescope** — https://skyandtelescope.org/ — tier: T4 · access: open · ingest: metadata · viewpoint: science-academic · cadence: weekly — focus: observational astronomy, sky events, instrument-literate explainers
- **Astronomy Magazine** — https://www.astronomy.com/ — tier: T4 · access: open · ingest: metadata · viewpoint: science-academic · cadence: weekly — focus: astrophysics features for a general audience
- **Spaceflight Now** — https://spaceflightnow.com/ — tier: T4 · access: open · ingest: metadata · viewpoint: commercial-industry · cadence: live — focus: launch coverage + a meticulous launch schedule/log
- **NASASpaceflight (NSF)** — https://www.nasaspaceflight.com/ — tier: T4 · access: open · ingest: metadata · viewpoint: commercial-industry · cadence: live — focus: granular vehicle-development & test reporting (Starship, SLS), forum-sourced detail
- **BBC — Science (Space)** — https://www.bbc.com/news/science_and_environment — tier: T4 · access: open · ingest: metadata · viewpoint: science-academic · cadence: live — focus: international, accessible space reporting (Jonathan Amos) — center-rated for balance

## T5 — Books / reference

- **Kepler — Walter W. Bryant (Project Gutenberg)** — https://www.gutenberg.org/ebooks/12406 — tier: T5 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: PD biography (author d. 1929; PD in India life+60) — Kepler's laws, history-of-orbits framing
- **NASA History Series (e-books)** — https://www.nasa.gov/history/history-publications-and-resources/ — tier: T5 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: full-text official program histories (Apollo, Shuttle, robotic missions); US gov works
- **The Cambridge Encyclopedia of Amateur Astronomy / reference astronomy** — https://www.cambridge.org/core/ — tier: T5 · access: paywall · ingest: metadata · viewpoint: n/a · cadence: archival — focus: reference depth for definitions & context (metadata-only; quote licensed copy)

## T6 — Case-study / postmortem / incident repositories

- **NASA Orbital Debris Quarterly News (ODPO)** — https://orbitaldebris.jsc.nasa.gov/quarterly-news/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: worked debris case studies — breakup forensics, source attribution, environment trends
- **ESA Annual Space Environment Report** — https://www.sdo.esoc.esa.int/environment_report/Space_Environment_Report_latest.pdf — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: the canonical yearly debris-population readout + mitigation-compliance scorecard
- **Columbia Accident Investigation Board (CAIB) Report** — https://www.nasa.gov/history/columbia-accident-investigation-board-synopsis/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: the model engineering+organizational-failure postmortem (foam strike, normalization of deviance)
- **NASA Office of Inspector General — Audit Reports** — https://oig.nasa.gov/audits/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: program cost/schedule postmortems (Artemis, HLS, Orion) — independent oversight
- **U.S. GAO — Space / NASA assessments** — https://www.gao.gov/topics/space — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: annual major-project assessments, cost-overrun forensics, ISAM & policy-option reports
- **Aerospace CORDS — Reentry Database & breakup studies** — https://aerospace.org/reentries — tier: T6 · access: open · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: documented reentries since 2000, recovered-debris analyses, survivability case studies

## T7 — Named expert blogs / newsletters / data shops

- **Jonathan McDowell — Jonathan's Space Report (planet4589)** — https://planet4589.org/ — tier: T7 · access: open · ingest: metadata · viewpoint: science-academic · cadence: weekly — focus: the authoritative independent launch/object log, reentry & Starlink statistics, catalogue corrections
- **LeoLabs — News & analysis** — https://leolabs.space/news/ — tier: T7 · access: open · ingest: metadata · viewpoint: commercial-industry · cadence: weekly — focus: commercial radar SSA — conjunction events, debris-cloud tracking, LEO mapping
- **Slingshot Aerospace — insights** — https://www.slingshot.space/ — tier: T7 · access: open · ingest: metadata · viewpoint: commercial-industry · cadence: weekly — focus: commercial optical SSA, space-traffic & object-behavior analytics (vendor framing — tag)
- **The Space Review** — https://www.thespacereview.com/ — tier: T7 · access: open · ingest: metadata · viewpoint: policy-sustainability · cadence: weekly — focus: long essays on space policy, history, commercialization, law (Jeff Foust et al.)
- **Planetary Society — The Downlink / blog** — https://www.planetary.org/articles — tier: T7 · access: open · ingest: metadata · viewpoint: science-academic · cadence: weekly — focus: named-author explainers on missions, budgets, planetary-defense policy

## WebFetch domains to allow in .claude/settings.local.json

```
nasa.gov
jpl.nasa.gov
esa.int
isro.gov.in
global.jaxa.jp
unoosa.org
iadc-home.org
fcc.gov
space.commerce.gov
spacex.com
ssd.jpl.nasa.gov
ssd-api.jpl.nasa.gov
cneos.jpl.nasa.gov
minorplanetcenter.net
sdup.esoc.esa.int
celestrak.org
space-track.org
data.nasa.gov
exoplanetarchive.ipac.caltech.edu
swpc.noaa.gov
arxiv.org
aanda.org
iopscience.iop.org
sciencedirect.com
nature.com
academic.oup.com
agupubs.onlinelibrary.wiley.com
ui.adsabs.harvard.edu
ntrs.nasa.gov
swfound.org
aerospace.csis.org
aerospace.org
mcgill.ca
planetary.org
commercialspace.org
spacenews.com
arstechnica.com
aviationweek.com
space.com
skyandtelescope.org
astronomy.com
spaceflightnow.com
nasaspaceflight.com
bbc.com
gutenberg.org
cambridge.org
orbitaldebris.jsc.nasa.gov
sdo.esoc.esa.int
oig.nasa.gov
gao.gov
thespacereview.com
leolabs.space
slingshot.space
```
