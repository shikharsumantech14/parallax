# Parallax Visual Mode Library

> Canonical visual reference. The **illustrator** agent reads this at
> runtime on every issue. Editors maintain it. Last updated 2026-05-20.

---

## What this document is

Every Parallax issue ships with one editorial cover image (the OG card)
that previews the issue on social platforms and at the head of the
article. The visual is not decoration — it is the issue's first
structural argument, made before a single word is read.

This library defines **six visual modes**, parallel to the eight prose
rhetorical modes in `mode-library.md`. Each visual mode is a recipe:
composition rules, palette logic, texture / medium, what to avoid, a
prompt scaffold, and a sample prompt for a real Parallax issue.

The aesthetic register is **editorial illustration**, not "AI art."
Reference exemplars: *Bloomberg Businessweek* covers (Tracy Ma, Robert
Vargas), *New York Magazine* (Mark Pernice, Pablo Delcan), the *Economist*
(Jon Berkeley), *The Atlantic* feature illustration (Oliver Munday), *De
Volkskrant* infographics. The named figures are calibration anchors —
the goal is not to imitate any one of them but to channel the editorial
restraint they share.

A single issue uses one mode. The image is one frame; it does not blend
modes within itself.

---

## Brand-wide constants

These apply to **every** prompt regardless of mode. They are the
non-negotiable layer that makes Parallax cover art recognisably Parallax.

### Subjects

- **No identifiable real faces.** When a story is person-anchored, use
  silhouette, back-of-head, profile-from-behind, or a hand-on-document
  fragment instead. Never a face that could be mistaken for the actual
  named subject. (Diffusion models hallucinate likenesses; the brand
  cannot accept that risk.)
- **No visible hands or fingers.** Flux's strongest AI tell. If a hand
  is necessary, render it gloved, in shadow, holding a single object,
  cropped at the wrist, or replaced by a tool / pen / instrument.
- **No text in image.** Typography is layered separately at the page
  level. Asking Flux for text introduces gibberish letterforms that read
  as AI artifact on hover. If a sign / label is structurally needed,
  describe it as "blank rectangle where a sign would be" or "the
  silhouette of a marquee, lettering illegible."
- **No fictional flags, currency, or official seals.** These read as
  amateur. If a flag is needed, describe the country and let Flux render
  a real one; for currency use abstract financial symbols (a bar chart,
  a ledger column) rather than fake banknotes.

### Composition

- **Quiet zone for headline overlay.** Reserve the upper-third *or*
  bottom-left as low-contrast / single-tone area. The cover may later
  carry a title overlay; the image must support that without re-cropping.
- **Off-centre focal point.** Symmetrical centre-framing is an AI tell.
  Prefer rule-of-thirds placement or asymmetric weight (one large
  element + one small counterpoint).
- **Hard-edged silhouettes, soft interiors.** Confident outlines, no
  fuzzy glow halos. Diffusion's default soft-glow rendering must be
  actively suppressed.
- **Single light source.** Multiple light sources produce the "render"
  look (subsurface scattering, ambient occlusion, every surface
  illuminated). One direction, one source, real shadows.

### Palette

- **Topic-aware.** Pull the topic's accent hex from
  `src/styles/themes/<topic>.css` and use it as the cover's accent. The
  background should be a neutral / muted tone that harmonises (cream,
  warm grey, off-black, atlas paper). Two colours dominate the image;
  a third may appear as a quiet supporting tone.
- **Muted saturation.** Imagine a -25% saturation slider applied
  globally. The Parallax accent hexes are vivid by design (`#b8341f`
  oxide red, `#00d4ff` mission cyan, `#c6f432` lime); on the cover they
  become *accents*, never *floods*.
- **Per-topic palette guidance** (drawn from the existing topic themes):

  | Topic | Background | Accent (vivid) | Accent (deep) | Tone |
  |---|---|---|---|---|
  | politics | warm paper `#faf5ec` | oxide red `#b8341f` | deep red `#8b2416` | broadsheet, restrained |
  | space | deep navy `#0a1428` | mission cyan `#00d4ff` | deep cyan `#0085a1` | console, technical |
  | earth | atlas paper `#f0e9d8` | forest green `#2d6a4f` | deep green `#1a4a36` | cartographic, archival |
  | tech | near-black `#0c0d0a` | lime `#c6f432` | olive `#5a6e16` | terminal, monospace lattice |
  | travel | cream `#f8efe0` | terracotta `#c85a3c` | deep terracotta `#9a4028` | postcard, sun-bleached |
  | sports | pitch green `#2a4a36` | neon lime `#e8f048` | olive `#3f5428` | programme, scoreboard |

### Texture

- **35mm film grain OR print-stipple.** Editorial print register. Never
  glossy CGI render, never high-fidelity 3D, never digital-illustration
  vector flatness. The grain is a constant — it's how the brand reads
  as "made," not "generated."
- **One medium per image.** Watercolour OR ink wash OR linocut OR
  half-tone OR colour photography — pick one in the mode card and stick
  with it. Mixing media within a single cover reads as AI confusion.

### Negative-prompt defaults (always)

The script appends these to every prompt's `negative` field:

```
photoreal face, identifiable likeness, visible hands, fingers, text,
letters, words, watermark, logo, signature, glowing edges, neon glow,
HDR, oversaturated, vibrant, hyperrealistic, 3d render, octane, unreal
engine, CGI, gloss, plastic, ambient occlusion, lens flare, bokeh,
shallow depth of field, symmetrical, perfectly centred, AI art,
generated, ai
```

---

## Visual AI-tell catalog

These are the production-observed visual equivalents of the prose AI
tells. The illustrator agent must check the prompt it writes against
this list before invoking generation.

### 1. Symmetrical perfectly-centred composition
**Pattern.** Subject dead-centre, equal margins, rule-of-quarters
implicit. Reads as a stock vector or a default DALL-E layout.
**Fix.** Always specify an off-axis composition: `"subject placed at
right-third intersection, large negative space top-left"` or `"low
horizon line, subject occupying the lower-right quadrant."`

### 2. Glowing / luminous edges
**Pattern.** Subject rimmed in light, suggested specular highlights on
every contour, "magical" aura. Flux's default rendering for any
high-value subject.
**Fix.** Explicit negative: `"no glow, no rim light, no halo,
flat shadow, hard-edged silhouette."` In the positive prompt, anchor
with `"matte surface, paper-flat, no highlights."`

### 3. Render lighting (subsurface scatter, ambient occlusion)
**Pattern.** Every surface softly illuminated; shadows soft and
ambient. Tells the eye "3D scene, not illustration."
**Fix.** `"single hard light source from upper-left, sharp cast shadows,
no ambient bounce, no fill light."`

### 4. Cinematic teal-and-orange grading
**Pattern.** Every shadow shifted teal, every highlight shifted orange.
The Hollywood look. Reads as generated and dated.
**Fix.** Specify the palette in hex. Add `"natural colour, no colour
grading, no teal shadows, no orange highlights."`

### 5. Isometric vector stock-photo look
**Pattern.** Tiny figures in flat colour blocks, isometric ground,
"workplace illustration" register. The default style for the word
"illustration" in any image prompt.
**Fix.** Never use the word "illustration" in a prompt — use
"editorial cover art," "linocut," "screen print," "ink wash," or
"oil pastel" instead. Specify a real medium.

### 6. Excessive depth of field
**Pattern.** Subject sharp, everything else melted into bokeh. Reads
photographic-cinematic, not editorial.
**Fix.** `"deep focus throughout, no bokeh, no shallow depth of field,
no blur."`

### 7. Generic "powerful" symbolism
**Pattern.** Globe + chain + dollar sign + clock + magnifying glass, all
in one frame. Compositional clutter as substitute for argument.
**Fix.** **One subject per image.** Mode cards specify what that
subject is. The prompt names exactly one object and one secondary
element; never a collage.

### 8. Saturated accent colour as background flood
**Pattern.** The topic's vivid accent colour fills 60%+ of the frame as
background.
**Fix.** Accent is **never** the background. Background is always the
topic's muted paper / dark / cream tone. Accent is 10–25% of the frame.

---

## How to use this library

When the illustrator agent runs:

### Step 1 — Read the issue

Read the full dossier and the stylist-rewritten draft MDX. Identify:

- The structural argument in one sentence.
- The dominant subject of the issue — a *thing*, a *system*, a *number*,
  a *person*, a *record*, or an *abstract idea*.
- The emotional register the issue lands in (forensic? lyrical?
  satirical? awe?).

### Step 2 — Walk the Decision Tree

```
Q1: Does the structural argument turn on a single physical object?
    (a gold bar, a microscope, a satellite, a passport, a ballot box)
    → SINGLE OBJECT STILL

Q2: Is the argument about a system, mechanism, or geography?
    (orbital debris, voting infrastructure, monsoon currents, supply chains)
    → AERIAL DIAGRAM

Q3: Is the argument about an institution, historical record, or document?
    (a treaty, a bill, a constitutional amendment, a census)
    → ARCHIVAL DOCUMENT

Q4: Is the argument anchored in a single dominant number or comparison?
    (a record-breaking statistic, a vote count, a deficit, a temperature)
    → TYPOGRAPHIC GRID

Q5: Is a person the structural anchor?
    (a leader, a player, a founder, a victim)
    → MONOCHROME PORTRAIT

Q6: Default — concept with no clear physical referent
    (a paradox, a feedback loop, an idea, a regime shift)
    → GEOMETRIC ABSTRACTION
```

If two modes seem to fit, pick the one that requires fewer
brand-constant overrides. (E.g. SINGLE OBJECT STILL is preferable to
MONOCHROME PORTRAIT when the story has both an object and a person —
the object is safer to render and less likely to trigger likeness
issues.)

### Step 3 — Open the mode card and write the prompt

Each mode card below has a **Prompt scaffold** with `[BRACKETED]` slots.
Fill them. Add the topic palette from §"Per-topic palette guidance."
Append the brand-wide negatives.

### Step 4 — Run the AI-tell audit (before generation)

Re-read your prompt against the eight visual AI tells. Each one that
applies costs a regeneration attempt. Catch them at prompt-write time.

---

## Mode allocation reference

This is a guide, not a rule. The Decision Tree determines mode; this
table tells you what mode usually fits what kind of issue.

| Issue type | Recommended mode | Alt |
|---|---|---|
| Resource / commodity dependency story | SINGLE OBJECT STILL | TYPOGRAPHIC GRID |
| Infrastructure / system / network | AERIAL DIAGRAM | GEOMETRIC ABSTRACTION |
| Bill / constitutional / legal | ARCHIVAL DOCUMENT | TYPOGRAPHIC GRID |
| Election / vote / poll | TYPOGRAPHIC GRID | ARCHIVAL DOCUMENT |
| Treaty / diplomacy / historical | ARCHIVAL DOCUMENT | MONOCHROME PORTRAIT |
| Climate / earth / ocean | AERIAL DIAGRAM | SINGLE OBJECT STILL |
| Space mission / satellite | SINGLE OBJECT STILL | AERIAL DIAGRAM |
| Technology release / paradigm | GEOMETRIC ABSTRACTION | TYPOGRAPHIC GRID |
| Sports tactical / structural | AERIAL DIAGRAM | MONOCHROME PORTRAIT |
| Travel place / destination | SINGLE OBJECT STILL | AERIAL DIAGRAM |
| Personal / leader-anchored | MONOCHROME PORTRAIT | SINGLE OBJECT STILL |
| Pure concept / paradox | GEOMETRIC ABSTRACTION | TYPOGRAPHIC GRID |

---

## The six modes

---

### 1. AERIAL DIAGRAM

**Use when.** The structural argument is about a system, mechanism,
network, or geography. The reader needs to see the *shape of the thing*
before they read about it.

**Reference exemplars.** Nigel Holmes infographics, *Le Monde
Diplomatique* atlas plates, MUJI catalogue diagrams, the Eames *Powers
of Ten*, Edward Tufte's *Visual Display of Quantitative Information*,
Berliner Morgenpost geographic feature illustration.

**Composition rules.**
- Top-down or high-angle isometric view.
- Subject occupies 40–70% of frame; remainder is neutral ground.
- Hierarchy via line weight, not via colour — heavy on the focal node,
  light on context.
- One accent colour highlights the structural argument's centre of
  gravity (the bottleneck, the cascade origin, the missing link).
- Off-axis: shift the focal point off-centre by at least 15% on one axis.

**Palette.** Topic background tone + topic accent at 15–20% area. One
neutral mid-tone for non-focal lines (warm grey for paper topics, slate
grey for dark topics).

**Texture / medium.** Pen-and-ink technical drawing OR muted screen
print. Lines must look drawn (slight variation in weight), not
algorithmically perfect.

**What to avoid.**
- Photoreal aerial photography — too journalistic-newspaper.
- Glow / "heatmap" rendering — too dashboard.
- Labels and numbers in the image — that's the page's job.
- Perspective vanishing points — keep it diagrammatic-flat.

**Prompt scaffold.**

```
Editorial cover art, [SUBJECT_SYSTEM] rendered as a top-down [VIEW_TYPE:
schematic / isometric diagram / cartographic plate], pen-and-ink
technical drawing on [BACKGROUND_TONE] paper, [ACCENT_HEX] used sparingly
to mark [STRUCTURAL_CENTRE], remaining elements in muted [NEUTRAL_TONE]
ink, hard-edged lines with slight hand-drawn variation in weight, no
labels, no text, no perspective vanishing points, off-centre focal
placement, large negative space [QUIET_ZONE_DIRECTION], single light
source from upper-left, soft 35mm film grain overlay, editorial print
register, no glow, no neon, no CGI render, no shallow depth of field.
```

**Sample prompt (Parallax issue: *The Architecture of Every Crisis* —
politics / rupee pressure):**

> Editorial cover art, the Strait of Hormuz oil chokepoint rendered as a
> top-down cartographic plate, pen-and-ink technical drawing on warm
> paper background `#faf5ec`, oxide red `#b8341f` used sparingly to mark
> the single tanker route at the strait's narrowest point, remaining
> coastline and currents in muted warm grey ink, hard-edged lines with
> slight hand-drawn variation in weight, no labels, no text, no
> perspective vanishing points, focal point off-centre to the right-third,
> large negative space upper-left, single light source from upper-left,
> soft 35mm film grain overlay, editorial print register, no glow, no
> neon, no CGI render, no shallow depth of field.

---

### 2. SINGLE OBJECT STILL

**Use when.** The structural argument turns on a single physical
artefact — a thing the reader can hold in their head. Gold bar, ballot
box, passport, satellite component, manuscript page, scoreboard, oar.

**Reference exemplars.** Irving Penn's still life photography (small
trades, vegetable studies), Peter Saville's *Unknown Pleasures*
restraint, the *Wallpaper* magazine product page, Robert Polidori's
documentary stillness, *The New York Times Magazine* food-section
photography.

**Composition rules.**
- One object. Optionally one secondary element that frames or contains
  it (a velvet ground, a wooden plinth, a folded cloth). Never three
  things.
- Object cropped tight — 70–85% of frame height.
- Studio lighting from one direction (upper-left or upper-right);
  visible cast shadow grounds the object in space.
- Background is a single tone — the topic's background paper or a
  flat-painted backdrop in topic's deep accent.
- Off-axis placement: object at golden ratio, not centre.

**Palette.** Topic background OR topic deep-accent as flat backdrop.
Object renders in its natural tones (gold yellow, brass, marble, paper
white). Topic vivid accent appears only on a small secondary
element or a printed surface on the object itself.

**Texture / medium.** Studio still-life photography in 35mm film
register, museum-catalogue framing. Slight grain, slight warm tone,
matte surface, no glossy reflections.

**What to avoid.**
- Multiple objects in a tableau (looks like a tarot card).
- Floating-in-void rendering (looks like a 3D product visual).
- Dramatic chiaroscuro — keep lighting editorial, not Caravaggio.
- Mirror finishes / chrome / glass with intense reflections.

**Prompt-construction rules learned the hard way (2026-05-23).**

When the subject is metallic, colourful, or textually-associated (a gold
bar, a passport, a banknote, a flag, a label), Flux defaults to:
1. flooding the background with the subject's dominant colour (gold bar
   → gold background),
2. hallucinating stamped text on the object's surface even when "no
   text" is in the negatives,
3. centring the composition regardless of placement instruction.

To prevent each:
- **Lead with the background.** "Warm cream-paper background filling the
  frame, off-centre composition…" must appear **before** the subject is
  introduced. Flux sets the first noun as the dominant element.
- **State the contrast explicitly.** "The [SUBJECT] in [TONE] against
  the contrasting [BACKGROUND_TONE] paper backdrop" — name the
  contrast as a property of the composition.
- **Move "no text" into the positive prompt as a description, not a
  negative.** "Smooth blank [SURFACE], unmarked, no engraving, no
  inscription, no stamped lettering" — phrase it as the object's
  property, not as a rule.
- **Reinforce off-centre placement twice.** Once early ("composition
  weighted to the [QUADRANT]") and once at the placement clause
  ("subject placed at golden-ratio intersection [DIRECTION]").

**Prompt scaffold.**

```
Editorial still life cover art, single [OBJECT] photographed in 35mm
film register, museum-catalogue framing, object cropped at 80% frame
height, placed at golden-ratio intersection [DIRECTION], flat backdrop
in [BACKGROUND_TONE], single hard light source from upper-[LEFT/RIGHT],
visible cast shadow grounding the object, [ACCENT_HEX] appears only on
[SECONDARY_DETAIL], matte natural surface tones, slight 35mm grain, no
gloss reflections, no chrome, no multiple objects, no perspective
distortion, no glow, no HDR, no shallow depth of field.
```

**Sample prompt (Parallax issue: *The Pacific That No Longer Resets* —
earth / El Niño):**

> Editorial still life cover art, a single weather buoy half-submerged,
> photographed in 35mm film register, museum-catalogue framing, object
> cropped at 80% frame height, placed at golden-ratio intersection lower-
> right, flat backdrop in atlas-paper `#f0e9d8`, single hard light source
> from upper-left, visible cast shadow falling left, forest green
> `#2d6a4f` appears only on the buoy's painted band, matte natural
> surface tones of salt-weathered steel, slight 35mm grain, no gloss
> reflections, no chrome, no multiple objects, no perspective
> distortion, no glow, no HDR, no shallow depth of field.

---

### 3. ARCHIVAL DOCUMENT

**Use when.** The structural argument is about an institution, a
historical record, a treaty, a bill, a census, a constitutional clause,
or any story that runs on documentary evidence.

**Reference exemplars.** *Granta* feature plates, the *London Review of
Books* cover style, Walker Evans documentary photography, Aby Warburg's
Mnemosyne Atlas pages, India's National Archives photographic plates,
the Bodleian Library's manuscript exhibition prints.

**Composition rules.**
- One document fragment as focal element — page edge, stamp, sealing
  wax, ledger column, signature scrawl, marginalia.
- Show texture: paper grain, fold lines, ink bleed, foxing (age spots),
  punched holes, deckle edge.
- Slight angle (5–12°) — document is not perfectly square to camera.
  Suggests it was placed, not staged.
- One supporting element optional: a paperweight, an envelope, a hand
  shadow (no actual hand), a stamp pad.
- Off-axis: focal text block at right-third, paper edge running off-frame.

**Palette.** Aged paper as background (cream, ivory, sepia-tinted
neutral). Topic deep-accent appears as ink or stamp colour. Subtle
shadow tones in warm grey or sepia.

**Texture / medium.** Documentary photography of historical document OR
collage with aged-paper texture. Slight sepia in shadows. Visible
paper fibres, ink bleed, edge wear.

**What to avoid.**
- Fake-aged digital paper texture (recognisable as overlay).
- Gothic ornamental fonts — keep the document plausible, modern.
- Period-drama gold-leaf embellishment — too theatrical.
- Wax seal as primary subject — too gothic-novel.

**Prompt scaffold.**

```
Editorial cover art, close-up of [DOCUMENT_TYPE] photographed flat,
slight 8-degree angle off-camera, aged [PAPER_COLOUR] paper with visible
fibre texture, ink in [ACCENT_DEEP_HEX] forming [INK_DETAIL: a stamped
seal / a signature / a ledger column / a marginal note], paper edge
running off-frame [DIRECTION], subtle foxing and edge wear, soft shadow
in warm grey, no gold leaf, no wax seal, no gothic ornamentation, no
modern typography, single editorial light source, slight 35mm grain,
documentary stillness, no glow, no HDR.
```

**Sample prompt (Parallax issue: *The Trojan Horse in Parliament* —
politics / delimitation):**

> Editorial cover art, close-up of a constitutional amendment page
> photographed flat, slight 8-degree angle off-camera, aged warm-paper
> background `#faf5ec` with visible fibre texture, ink in deep red
> `#8b2416` forming a stamped seal at the right-third intersection,
> paper edge running off-frame to the lower-left, subtle foxing along
> the upper edge, soft shadow in warm grey falling right, no gold leaf,
> no wax seal, no gothic ornamentation, no modern typography, single
> editorial light source from upper-left, slight 35mm grain, documentary
> stillness, no glow, no HDR.

---

### 4. TYPOGRAPHIC GRID

**Use when.** The argument is anchored in a single dominant number,
record, ratio, or comparison. The reader needs to see the *quantity*
hit first, then the context.

**Reference exemplars.** Massimo Vignelli (Unimark) corporate identity
plates, *Pentagram* annual reports, *Eye* magazine covers, *Wired*'s
early Sagmeister/Walsh issues, Bloomberg Markets numeric covers,
*Monocle* spread typography.

**Composition rules.**
- One number, ratio, or single word. Massive. Filling 50–75% of frame
  vertically.
- Background is a single field of muted topic background.
- One small contextual element (a tiny date, a tiny unit label, a hair-thin
  rule line) sits below or beside the number — quiet, not competing.
- Typography is the image: no decorative illustration around it.
- Off-axis: number anchored at lower-left or upper-right, never centred.

**Palette.** Background in topic's muted background tone. Numeral in
topic deep-accent (the high-contrast version) OR in near-black for high
contrast on light backgrounds. Topic vivid accent reserved for a single
sliver — an underline, a colon, a percent sign.

**Texture / medium.** Letterpress register: slight ink bleed at letter
edges, paper grain underneath, no perfect digital crispness. Or a
risograph two-colour print register with deliberate mis-registration of
1–2 pixels.

**Critical brand-constant violation warning.** The "no text in image"
rule does NOT apply to this mode — typography IS the image. But:
- The text must be a **number, ratio, percent, or single short word**
  (`"$71B"`, `"206/294"`, `"+1.5°C"`, `"ZERO"`, `"NINETY"`).
- Never a sentence, headline, or phrase.
- Specify the typeface family: `"set in Fraunces"`, `"set in JetBrains
  Mono"`, `"set in Oswald"` (use the topic's display font).
- Prompt must specify exact characters in quotes.
- Run multiple generations; Flux often hallucinates letterforms even
  with explicit instructions. Be prepared to retry.

**What to avoid.**
- Words longer than 8 characters (Flux renders these poorly).
- Multiple lines of text.
- Decorative ornament around the number (no laurel wreaths, no
  illustration backgrounds).
- Drop shadows on the type (looks PowerPoint).

**Prompt scaffold.**

```
Editorial cover art, the single [TYPOGRAPHIC_ELEMENT] "[EXACT_TEXT]"
rendered massive in [TYPEFACE], filling 60% of frame vertically,
anchored at [LOWER-LEFT / UPPER-RIGHT], flat background in
[BACKGROUND_HEX], numeral in [DEEP_ACCENT_HEX] with letterpress ink-bleed
register, slight paper grain underneath, one thin [ACCENT_HEX] rule line
[POSITION: beneath the number / above the number], optionally a small
unit label "[UNIT]" in [TYPEFACE] at one-tenth the height, off-centre
placement, no decorative ornament, no drop shadows, no illustration
elements, no perfect digital crispness — letterpress imperfection
visible.
```

**Sample prompt (Parallax issue: a hypothetical sports league-table
record):**

> Editorial cover art, the single numeral "144" rendered massive in
> condensed Oswald typeface, filling 60% of frame vertically, anchored
> at lower-left, flat background in pitch-green `#2a4a36`, numeral in
> neon-lime `#e8f048` with letterpress ink-bleed register, slight paper
> grain underneath, one thin olive `#3f5428` rule line above the
> number, a small unit label "AYES" set in Oswald at one-tenth the
> height to the right of the number, off-centre placement, no decorative
> ornament, no drop shadows, no illustration elements, no perfect
> digital crispness — letterpress imperfection visible.

---

### 5. MONOCHROME PORTRAIT

**Use when.** A person is the structural anchor of the issue — a leader,
a player, a founder, a witness, a victim — and the story cannot be told
without the human figure. **Strictly: never an identifiable face.**

**Reference exemplars.** Saul Leiter colour street photography, Roy
DeCarava's Harlem portraits, Daido Moriyama silhouettes, *The
Atlantic*'s "Issue Of" portrait illustration (Oliver Munday), Lotte
Reiniger silhouette animation stills.

**Composition rules.**
- Figure rendered as silhouette, profile-from-behind, back-of-head, or
  partial fragment (shoulders + collar, hands obscured).
- Single tone for the figure (deep accent or near-black against the
  background tone). No facial detail visible.
- Figure occupies 50–70% of frame, off-centre.
- Background is a flat field of the topic's background tone OR a single
  contextual element (a doorway, a horizon line, a window frame).
- Single light source casting silhouette-defining shadow.

**Palette.** Two tones dominant: figure in topic deep-accent or
near-black, background in muted topic background. A third sliver of
the topic vivid accent allowed on one detail (a lapel pin, a tie, a
chair edge, a horizon band).

**Texture / medium.** High-contrast black-and-white photography with
deliberate grain OR ink wash / sumi-e silhouette work. Lighting is
documentary, not theatrical.

**What to avoid.**
- Any facial feature visible at all — eyes, mouth, jawline. The figure
  is shape, not face.
- Stylised abstraction that turns the figure into a logo (we want
  documentary register, not symbol).
- Heroic / power-pose framing — keep the figure observed, not posed.
- Multiple figures.

**Prompt scaffold.**

```
Editorial cover art, single human figure rendered as [SILHOUETTE /
PROFILE-FROM-BEHIND / BACK-OF-HEAD / SHOULDERS-AND-COLLAR], no facial
features visible, figure in [DEEP_ACCENT_HEX] against flat background in
[BACKGROUND_HEX], figure occupies 60% of frame off-centre to the
[DIRECTION], single light source from [UPPER-LEFT / UPPER-RIGHT] casting
defining shadow, [CONTEXTUAL_ELEMENT: a doorway / a horizon / a chair
edge] visible in the [QUADRANT], small detail of [ACCENT_HEX] on
[SPECIFIC_DETAIL], high-contrast black-and-white photography register
with deliberate grain, documentary stillness, no facial detail at all,
no eyes, no mouth, no recognisable likeness, no posed gesture, no glow,
no neon, no CGI.
```

**Sample prompt (hypothetical Parallax issue: a coaching change in
sports):**

> Editorial cover art, single human figure rendered as profile-from-
> behind, no facial features visible, figure in deep olive `#3f5428`
> against flat background in pitch-green `#2a4a36`, figure occupies 60%
> of frame off-centre to the left, single light source from upper-right
> casting defining shadow across the figure's back, the edge of a
> floodlit pitch visible in the lower-right quadrant as a thin band of
> neon-lime `#e8f048`, high-contrast black-and-white photography
> register with deliberate grain, documentary stillness, no facial
> detail at all, no eyes, no mouth, no recognisable likeness, no posed
> gesture, no glow, no neon, no CGI.

---

### 6. GEOMETRIC ABSTRACTION

**Use when.** The argument is conceptual — a paradox, a feedback loop,
a regime shift, an inversion — and no obvious physical referent exists.
This is the default mode when none of Q1–Q5 fire.

**Reference exemplars.** Saul Bass film posters, Bauhaus design (László
Moholy-Nagy, Herbert Bayer), Anni Albers textiles, Sister Corita Kent
serigraphs, the Vignelli MTA subway map, *Domus* magazine covers of the
1960s.

**Composition rules.**
- Two or three primary shapes (circle, rectangle, triangle, arc, line)
  in deliberate geometric relationship.
- Shapes are flat colour — no gradient, no shading except a single hard
  cast shadow.
- One relationship encodes the argument: containment, intersection,
  overlap, displacement, alignment, inversion.
- One shape carries the topic accent; the rest are neutrals.
- Off-axis composition: golden ratio, asymmetric balance, never four
  quadrants.

**Palette.** Two flat colours + one accent: topic background, one mid-
tone neutral, and one occurrence of topic accent. Three colour zones
total.

**Texture / medium.** Risograph two-colour print OR screen-print
register: deliberate mis-registration of 1–2 pixels between colour
layers, slight ink texture, no perfect digital edges. Or hand-cut paper
collage with visible cut edges.

**What to avoid.**
- Gradient fills (instantly reads as digital-vector-default).
- More than four distinct shapes (becomes a logo lockup).
- Symbolic icons (no light bulbs, no arrows, no question marks).
- Symmetry — the whole point of this mode is *encoded asymmetry*.

**Prompt scaffold.**

```
Editorial cover art, [N: two / three] primary geometric shapes —
[SHAPE_A] and [SHAPE_B] [and optionally SHAPE_C] — arranged in
[RELATIONSHIP: containment / intersection / overlap / displacement /
alignment / inversion], shape A in [ACCENT_HEX], shape B in
[NEUTRAL_HEX], background in [BACKGROUND_HEX], flat colours throughout
with no gradients, single hard cast shadow under [SHAPE], composition
weighted to [QUADRANT], golden-ratio asymmetric balance, risograph two-
colour print register with slight mis-registration, visible ink texture,
no symbolic icons, no light bulbs, no arrows, no question marks, no
gradient fills, no symmetry, no glow, no CGI.
```

**Sample prompt (Parallax issue: *The Orbit That Remembers* — space /
Kessler cascade):**

> Editorial cover art, three primary geometric shapes — a large circle, a
> single line, and a small offset arc — arranged in displacement: the
> arc breaking away from the circle's edge, the line bisecting the
> negative space at a low angle. Large circle in deep mission-cyan
> `#0085a1`, line in cool grey, arc in vivid cyan `#00d4ff`. Background
> in deep-navy `#0a1428`, flat colours throughout with no gradients,
> single hard cast shadow under the circle, composition weighted to the
> right, golden-ratio asymmetric balance, risograph two-colour print
> register with slight mis-registration, visible ink texture, no
> symbolic icons, no light bulbs, no arrows, no question marks, no
> gradient fills, no symmetry, no glow, no CGI.

---

## Quick-Reference Prompt Cards (runtime recipe)

Use these as the runtime recipes. Each card distills the mode to the
prompt-construction pattern, so the illustrator agent does not have to
re-read full mode cards each run.

### AERIAL DIAGRAM (QR)
- Subject: a system / mechanism / network / geography
- View: top-down OR isometric
- Medium: pen-and-ink technical drawing
- Palette: background tone + accent at one structural point
- Composition: focal off-axis, large negative space, no labels
- Negatives: perspective, photoreal, glow, dashboard-heatmap rendering

### SINGLE OBJECT STILL (QR)
- Subject: ONE physical artefact, cropped tight
- View: studio still-life at golden ratio
- Medium: 35mm film register, museum-catalogue framing
- Palette: background paper + object's natural tones + accent on one detail
- Composition: single light source, visible cast shadow, off-axis placement
- Negatives: multiple objects, floating-in-void, chrome, mirror finish

### ARCHIVAL DOCUMENT (QR)
- Subject: ONE document fragment, paper edge running off-frame
- View: photographed flat, slight 8° angle
- Medium: documentary photography of historical document
- Palette: aged paper + deep accent as ink + warm-grey shadow
- Composition: focal text/seal at right-third, foxing visible
- Negatives: gold leaf, wax seal, gothic ornament, modern typography

### TYPOGRAPHIC GRID (QR)
- Subject: ONE number / ratio / short word (≤8 chars)
- View: numeral fills 60% vertical, anchored off-centre
- Medium: letterpress register with ink bleed
- Palette: background + deep-accent numeral + accent rule line
- Composition: lower-left OR upper-right anchor, one tiny unit label
- Negatives: sentences, multiple lines, drop shadows, decorative ornament
- **NOTE.** This mode SUSPENDS the "no text in image" brand constant —
  typography IS the image. But: only numbers, ratios, or single words.

### MONOCHROME PORTRAIT (QR)
- Subject: ONE figure as silhouette / back-of-head / profile-from-behind
- View: documentary, single light source casting silhouette shadow
- Medium: high-contrast B&W photography with grain
- Palette: deep accent figure + background tone + accent sliver on one detail
- Composition: figure 60% of frame off-centre, optional context element
- Negatives: ANY facial feature, posed gesture, multiple figures, heroic framing
- **CRITICAL.** No facial detail at all — no eyes, no mouth, no
  recognisable likeness. Brand-bet defining rule.

### GEOMETRIC ABSTRACTION (QR)
- Subject: 2–3 primary shapes (circle / rectangle / triangle / arc / line)
- View: flat composition, golden-ratio asymmetric balance
- Medium: risograph two-colour print with mis-registration
- Palette: background + one neutral + one accent shape
- Composition: shapes encode argument by relationship (containment,
  intersection, displacement, inversion)
- Negatives: gradients, symbolic icons, symmetry, >3 shapes

---

## Versioning + change log

When updating this library:
1. Bump the `Last updated` date at the top.
2. Add a one-line entry below.

### 2026-05-20 — Initial version
First version of the visual mode library. Six modes (AERIAL DIAGRAM,
SINGLE OBJECT STILL, ARCHIVAL DOCUMENT, TYPOGRAPHIC GRID, MONOCHROME
PORTRAIT, GEOMETRIC ABSTRACTION) with Decision Tree, brand-wide
constants, eight-item visual AI-tell catalog, mode allocation table,
per-mode pattern cards with prompt scaffolds and worked samples, and
Quick-Reference Prompt Cards for runtime use. Mirrors the structure of
the prose mode library at `mode-library.md`.
