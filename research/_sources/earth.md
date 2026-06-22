# Earth — source allowlist

Tiered, viewpoint-tagged allowlist for the **earth** topic (climate, oceans,
biodiversity, geology, atmosphere, energy/emissions). Schema: `_TAXONOMY.md`
(8 tiers, per-source field format, vetting rubric, diversity gate). Lines are
grep-stable — match the format exactly.

**Viewpoint clusters for earth** (apply only to T3/T4/T7 *interpretation*
sources; T0/T1/T2 empirical/primary = `viewpoint: n/a`):
`mainstream-science` · `policy-market` (market/innovation framing) ·
`policy-regulatory` (state/precaution framing) · `industry` ·
`primary` (IPCC / agencies).

> The physics is settled → it lives in `primary` / `mainstream-science` and is
> carried by the T0–T2 anchor; it is **not** "balanced" against a contrary
> opinion. Viewpoint diversity applies only to the **policy response** layer.

---

## T0 — Primary documents / official data

- **IPCC — Reports hub (AR6 + cycle)** — https://www.ipcc.ch/reports/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: assessment-cycle landing page; WG I/II/III + special reports; the consensus spine.
- **IPCC — AR6 Synthesis Report (Climate Change 2023)** — https://www.ipcc.ch/report/ar6/syr/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: SPM + longer report + headline statements; the single most citable summary.
- **IPCC — Sixth Assessment Report (AR6)** — https://www.ipcc.ch/assessment-report/ar6/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: full WG I (physical science), WG II (impacts/adaptation), WG III (mitigation) volumes + chapters.
- **NASA GISS — GISTEMP v4 Surface Temperature Analysis** — https://data.giss.nasa.gov/gistemp/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: global land-ocean temperature index 1880–present, monthly; the canonical anomaly record.
- **NASA Earth Observatory** — https://earthobservatory.nasa.gov/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: satellite imagery + agency-written explainers on climate/ocean/land change.
- **NOAA NCEI — Climate at a Glance** — https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: official US/global temperature + precipitation time series, rankings, monitoring reports.
- **NOAA Newsroom** — https://www.noaa.gov/news — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: official US weather/ocean/atmosphere announcements + record-setting events.
- **NOAA GML — Trends in Atmospheric CO₂ (Mauna Loa)** — https://gml.noaa.gov/ccgg/trends/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: the Keeling-curve record; CO₂/CH₄/N₂O global means; the load-bearing concentration figure.
- **WMO — News & State of the Global Climate** — https://wmo.int/news — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: annual State of the Global Climate + provisional records; UN authority on weather/climate.
- **WMO — Greenhouse Gas Bulletin** — https://wmo.int/wmo-greenhouse-gas-bulletins — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: authoritative annual CO₂/CH₄/N₂O atmospheric burdens + growth rates with uncertainties.
- **Copernicus Climate Change Service (C3S)** — https://climate.copernicus.eu/ — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: EU climate bulletins, ERA5-based monthly temperature reports, European warmest-year calls.
- **UNEP — Emissions Gap Report** — https://www.unep.org/resources/emissions-gap-report-2025 — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: science-based gap between pledged/policy emissions and the 1.5–2 °C pathway; pre-COP each year.
- **US Global Change Research Program — National Climate Assessment** — https://www.globalchange.gov/our-work/national-climate-assessment — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: congressionally-mandated US assessment (NCA5, 2023); regional impacts, risks, adaptation.
- **IPBES — Global Assessment (Biodiversity & Ecosystem Services)** — https://www.ipbes.net/global-assessment — tier: T0 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: the biodiversity equivalent of IPCC; the "1 million species at risk" assessment + SPM.
- **India Meteorological Department (IMD)** — https://mausam.imd.gov.in/ — tier: T0 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: India's official met agency — monsoon, heatwave, cyclone forecasts + seasonal outlooks.
- **Ministry of Environment, Forest and Climate Change (India)** — https://moef.gov.in/ — tier: T0 · access: open · ingest: live · viewpoint: n/a · cadence: weekly — focus: India's nodal climate/forest ministry — policy, NDC actions, official statistics, notifications.

## T1 — Datasets / data portals

- **Global Carbon Project — Global Carbon Budget** — https://globalcarbonbudget.org/ — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: the annual fossil + land-use CO₂ budget; per-country emissions; the citable emissions backbone.
- **Our World in Data — CO₂ & Greenhouse Gas Emissions** — https://ourworldindata.org/co2-and-greenhouse-gas-emissions — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: tidy, documented, CC-BY emissions/energy dataset + explorers; built on GCP; ideal for data-viz.
- **Our World in Data — CO₂ Data Explorer** — https://ourworldindata.org/explorers/co2 — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: annual — focus: interactive per-country / per-capita / cumulative / consumption-based emissions selector.
- **Copernicus Climate Data Store (CDS) — ERA5** — https://cds.climate.copernicus.eu/ — tier: T1 · access: reg · ingest: live · viewpoint: n/a · cadence: live — focus: ERA5 reanalysis (1940–present, hourly, ~31 km); the gridded atmospheric backbone for any climate figure.
- **World Bank — Climate Change Knowledge Portal** — https://climateknowledgeportal.worldbank.org/ — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: annual — focus: per-country observed + projected climate variables, risk profiles, downloadable indices.
- **WRI — Climate Watch (CAIT)** — https://www.climatewatchdata.org/ — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: annual — focus: comparable historical GHG emissions for 190+ countries by sector/gas + NDC + net-zero tracking.
- **NSIDC — Sea Ice Index** — https://nsidc.org/data/seaice_index — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: Arctic + Antarctic sea-ice extent/concentration 1978–present; daily; the cryosphere figure.
- **Berkeley Earth — Temperature Data** — https://berkeleyearth.org/data/ — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: live — focus: independent land+ocean temperature record from 1850 (1750 land); ~39k stations; cross-check on GISTEMP.
- **Energy Institute — Statistical Review of World Energy** — https://www.energyinst.org/statistical-review — tier: T1 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: free-to-access global energy production/consumption/emissions by fuel + country (former bp review since 1952).
- **IEA — Data & Statistics** — https://www.iea.org/data-and-statistics — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: annual — focus: energy-related CO₂, Global Energy Review datasets; some products paywalled — link the free data product.
- **Global Forest Watch** — https://www.globalforestwatch.org/ — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: live — focus: near-real-time deforestation alerts + 20+ yr tree-cover-change data (WRI/UMD GLAD); the forest-loss figure.
- **UNFCCC — NDC Registry** — https://unfccc.int/NDCREG — tier: T1 · access: open · ingest: live · viewpoint: n/a · cadence: annual — focus: official national climate pledges as filed; the primary document behind any "what did country X promise" claim.

## T2 — Peer-reviewed & preprints

- **Earth System Science Data (ESSD)** — https://essd.copernicus.org/ — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: CC-BY open-access data-description journal (Copernicus); home of the Global Carbon Budget + key dataset papers.
- **Geophysical Research Letters (GRL)** — https://agupubs.onlinelibrary.wiley.com/journal/19448007 — tier: T2 · access: open · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: AGU gold-OA letters on climate attribution, atmospheric/ocean dynamics; high-impact short results.
- **Nature Climate Change** — https://www.nature.com/nclimate/ — tier: T2 · access: paywall · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: flagship climate journal; abstracts guide; quote the legally-accessed original or the OA preprint.
- **Nature Geoscience** — https://www.nature.com/ngeo/ — tier: T2 · access: paywall · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: earth-system mechanism papers (ocean circulation, ice, carbon cycle); metadata-only — non-quotable.
- **Science (AAAS)** — https://www.science.org/journal/science — tier: T2 · access: paywall · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: landmark earth/climate studies; abstract-only index; cite the original.
- **PNAS** — https://www.pnas.org/ — tier: T2 · access: open · ingest: metadata · viewpoint: n/a · cadence: weekly — focus: climate/biogeoscience studies (tipping points, attribution); many OA but mixed — default metadata.
- **The Cryosphere (Copernicus)** — https://tc.copernicus.org/ — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: CC-BY OA journal on ice sheets, glaciers, sea ice, permafrost; the cryosphere mechanism literature.
- **Atmospheric Chemistry and Physics (ACP)** — https://acp.copernicus.org/ — tier: T2 · access: open · ingest: full · viewpoint: n/a · cadence: weekly — focus: CC-BY OA journal on atmospheric composition, aerosols, GHG chemistry; quotable full text.

## T3 — Think-tanks / NGOs / research institutes (tagged by viewpoint)

- **Climate Action Tracker** — https://climateactiontracker.org/ — tier: T3 · access: open · ingest: live · viewpoint: policy-regulatory · cadence: weekly — focus: independent (Climate Analytics + NewClimate) scoring of national pledges vs 1.5 °C; precaution/ambition framing.
- **World Resources Institute (WRI)** — https://www.wri.org/ — tier: T3 · access: open · ingest: live · viewpoint: policy-regulatory · cadence: weekly — focus: emissions/forest/water research + Climate Watch + GFW analysis; data-led, mainstream-policy lean.
- **Resources for the Future (RFF)** — https://www.rff.org/ — tier: T3 · access: open · ingest: live · viewpoint: policy-market · cadence: weekly — focus: impartial environmental/energy economics; carbon pricing, market mechanisms, cost-benefit framing.
- **Breakthrough Institute** — https://thebreakthrough.org/ — tier: T3 · access: open · ingest: live · viewpoint: policy-market · cadence: weekly — focus: ecomodernist innovation/decoupling framing; pro-nuclear, technology-first; critical of cap-and-trade. Tag the lean.
- **International Institute for Sustainable Development (IISD)** — https://www.iisd.org/ — tier: T3 · access: open · ingest: live · viewpoint: policy-regulatory · cadence: weekly — focus: negotiations reporting (ENB), fossil-subsidy + just-transition policy; multilateral/precaution lean.
- **Council on Energy, Environment and Water (CEEW), India** — https://www.ceew.in/ — tier: T3 · access: open · ingest: live · viewpoint: policy-market · cadence: weekly — focus: India's leading energy/climate think-tank; power-sector reform, RE deployment, climate-risk; data-driven India lens.
- **The Energy and Resources Institute (TERI), India** — https://www.teriin.org/ — tier: T3 · access: open · ingest: live · viewpoint: policy-regulatory · cadence: weekly — focus: India sustainability research; TEDDY energy/environment yearbook; clean energy + adaptation, state-policy lean.
- **Centre for Science and Environment (CSE), India** — https://www.cseindia.org/ — tier: T3 · access: open · ingest: live · viewpoint: policy-regulatory · cadence: weekly — focus: India environment advocacy + research (air, water, waste, equity); strong precaution/justice framing. Tag the lean.
- **Global CCS Institute** — https://www.globalccsinstitute.com/ — tier: T3 · access: open · ingest: live · viewpoint: industry · cadence: annual — focus: industry-backed carbon-capture/storage status reports + project database; CCS-advocacy lean — tag it.
- **NewClimate Institute** — https://newclimate.org/ — tier: T3 · access: open · ingest: live · viewpoint: policy-regulatory · cadence: weekly — focus: corporate net-zero accountability, NDC analysis, "Corporate Climate Responsibility Monitor"; rigorous, watchdog lean.

## T4 — Long-form journalism

- **Carbon Brief** — https://www.carbonbrief.org/ — tier: T4 · access: open · ingest: live · viewpoint: mainstream-science · cadence: weekly — focus: deeply-sourced climate science + policy explainers, factchecks, Q&As; MBFC high-factual, left-center. The first explainer stop.
- **Inside Climate News** — https://insideclimatenews.org/ — tier: T4 · access: open · ingest: live · viewpoint: policy-regulatory · cadence: weekly — focus: Pulitzer-winning investigative climate/energy reporting; accountability + fossil-industry scrutiny. Tag the lean.
- **Yale Climate Connections** — https://yaleclimateconnections.org/ — tier: T4 · access: open · ingest: live · viewpoint: mainstream-science · cadence: weekly — focus: university-backed explainers translating the science; calm, consensus register.
- **Mongabay** — https://news.mongabay.com/ — tier: T4 · access: open · ingest: live · viewpoint: policy-regulatory · cadence: weekly — focus: tropical forests, biodiversity, conservation reporting from the field; on-the-ground sourcing.
- **Grist** — https://grist.org/ — tier: T4 · access: open · ingest: live · viewpoint: policy-regulatory · cadence: weekly — focus: climate + justice/equity framing; solutions + policy reporting. Explicit justice lean — tag it.
- **The Guardian — Environment** — https://www.theguardian.com/environment — tier: T4 · access: open · ingest: live · viewpoint: policy-regulatory · cadence: weekly — focus: global environment reporting + investigations; MBFC left-center. Strong coverage, lean tagged.
- **Down To Earth (India)** — https://www.downtoearth.org.in/ — tier: T4 · access: open · ingest: live · viewpoint: policy-regulatory · cadence: weekly — focus: CSE-published India environment magazine; longform on climate, water, agriculture, equity. Tag the lean.
- **IndiaSpend — Environment** — https://www.indiaspend.com/ — tier: T4 · access: open · ingest: live · viewpoint: mainstream-science · cadence: weekly — focus: data-journalism on India's environment/climate; numbers-first, fact-check discipline.
- **The Economist — Climate & Environment** — https://www.economist.com/topics/climate-change — tier: T4 · access: paywall · ingest: metadata · viewpoint: policy-market · cadence: weekly — focus: market-liberal climate framing (carbon price, tech, adaptation economics); paywalled ⇒ metadata only.

## T5 — Books / reference

- **Darwin — On the Origin of Species (Project Gutenberg)** — https://www.gutenberg.org/ebooks/2009 — tier: T5 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: public-domain foundational text on natural selection; deep-time / biodiversity framing. (PD — full text quotable.)
- **IPCC AR6 WG1 — The Physical Science Basis (full report)** — https://www.ipcc.ch/report/ar6/wg1/ — tier: T5 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: chapter-level reference for the physical mechanisms (radiative forcing, carbon cycle, attribution). Citable in depth.
- **Spencer Weart — The Discovery of Global Warming (AIP)** — https://history.aip.org/climate/index.htm — tier: T5 · access: open · ingest: metadata · viewpoint: n/a · cadence: archival — focus: AIP hypertext history of climate science; how the consensus was built. (AIP-hosted; metadata-guide, cite the original.)
- **The Economics of Biodiversity: The Dasgupta Review** — https://www.gov.uk/government/publications/final-report-the-economics-of-biodiversity-the-dasgupta-review — tier: T5 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: UK-commissioned landmark review framing nature as an economic asset; the natural-capital argument.

## T6 — Case-study / postmortem / incident repositories

- **EM-DAT — International Disaster Database (CRED/UCLouvain)** — https://www.emdat.be/ — tier: T6 · access: reg · ingest: metadata · viewpoint: n/a · cadence: live — focus: 27k+ disasters 1900–present with impacts; non-commercial licence ⇒ metadata-guide, cite the accessed record.
- **IPCC — Special Report: Global Warming of 1.5 °C (SR1.5)** — https://www.ipcc.ch/sr15/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: the worked case for the 1.5 vs 2 °C threshold; impacts-per-half-degree; pathways. Citable in full.
- **IPCC — Special Report: Ocean & Cryosphere (SROCC)** — https://www.ipcc.ch/srocc/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: sea-level rise, ice loss, ocean warming case assessment; coastal/cryosphere stakes.
- **IPCC — Special Report: Climate Change and Land (SRCCL)** — https://www.ipcc.ch/srccl/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: land–climate feedbacks, food systems, desertification, land-use emissions case study.
- **NOAA — Billion-Dollar Weather and Climate Disasters** — https://www.ncei.noaa.gov/access/billions/ — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: annual — focus: official US catalogue of billion-dollar disasters with cost methodology; the canonical impact-cost worked example.
- **WMO — Atlas of Mortality and Economic Losses from Weather, Climate & Water Extremes** — https://library.wmo.int/idurl/4/57564 — tier: T6 · access: open · ingest: full · viewpoint: n/a · cadence: archival — focus: 1970–2019 global disaster mortality + losses; the long-run incident retrospective.

## T7 — Named expert blogs / newsletters / data shops

- **RealClimate** — https://www.realclimate.org/ — tier: T7 · access: open · ingest: live · viewpoint: mainstream-science · cadence: weekly — focus: climate-scientist-run commentary (Gavin Schmidt et al., est. 2004); rebuts misreadings, explains new papers. Named, high-credibility.
- **Carbon Brief — Cropped / DeBriefed (newsletters)** — https://www.carbonbrief.org/newsletters/ — tier: T7 · access: open · ingest: live · viewpoint: mainstream-science · cadence: weekly — focus: curated weekly food/land + global climate-policy briefings; named editorial team.
- **Climate Analytics — Insights** — https://climateanalytics.org/publications — tier: T7 · access: open · ingest: live · viewpoint: policy-regulatory · cadence: weekly — focus: named climate-science institute behind CAT; 1.5 °C pathway analysis, science-policy notes. Precaution lean.

## WebFetch domains to allow in .claude/settings.local.json

```
ipcc.ch
data.giss.nasa.gov
earthobservatory.nasa.gov
ncei.noaa.gov
noaa.gov
gml.noaa.gov
wmo.int
climate.copernicus.eu
unep.org
globalchange.gov
ipbes.net
mausam.imd.gov.in
moef.gov.in
globalcarbonbudget.org
ourworldindata.org
cds.climate.copernicus.eu
climateknowledgeportal.worldbank.org
climatewatchdata.org
nsidc.org
berkeleyearth.org
energyinst.org
iea.org
globalforestwatch.org
unfccc.int
essd.copernicus.org
agupubs.onlinelibrary.wiley.com
nature.com
science.org
pnas.org
tc.copernicus.org
acp.copernicus.org
climateactiontracker.org
wri.org
rff.org
thebreakthrough.org
iisd.org
ceew.in
teriin.org
cseindia.org
globalccsinstitute.com
newclimate.org
carbonbrief.org
insideclimatenews.org
yaleclimateconnections.org
mongabay.com
grist.org
theguardian.com
downtoearth.org.in
indiaspend.com
economist.com
gutenberg.org
history.aip.org
gov.uk
emdat.be
library.wmo.int
realclimate.org
climateanalytics.org
```
