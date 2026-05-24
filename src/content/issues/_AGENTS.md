# Issues — agent guide

> Local rules for `src/content/issues/<slug>/index.mdx` files. Read the
> root `AGENTS.md` first for project-level context.

---

## 1. The schema (source of truth: `src/content/config.ts`)

Every issue has frontmatter validated by Zod at build time. The full
shape:

```ts
{
  id: string;
  topic: 'politics' | 'space' | 'earth' | 'tech' | 'travel' | 'sports';
  title: string;                         // *italic* for one accent word
  hook: string;                          // social/SEO description
  dek: string;                           // sub-headline shown under hero
  publishedAt: Date;                     // YYYY-MM-DD
  status: 'draft' | 'review' | 'published';   // default 'draft'
  author?: string;                       // optional, no default; do not hardcode
  tags: string[];                        // default []
  readTimeMinutes?: number;
  primer?: string;                       // 80–420 chars (Zod-enforced)
  ogImage?: string;
  sections: Section[];                   // see §2
  sources: Source[];                     // see §3
}
```

**Only `status !== 'draft'` shows in the public archive and RSS feed.** Draft
issues still build into HTML routes at `/issues/<slug>/` (visible if you know
the URL), but are excluded from the index and feed.

---

## 2. Section schema

Every section conforms to:

```ts
{
  kind: SectionKind;          // must be one of SECTION_KINDS in config.ts
  number?: string;            // optional; auto-formatted via formatSectionLabel
  title?: string;             // *italic* for one accent word
  eyebrow?: string;           // ALL CAPS short label
  intro?: string;             // 1–3 sentences setting up the section
  skimCaption?: string;       // 90-sec-skim mode caption (PROSE sections only)
  data?: unknown;             // section-kind-specific shape; see src/components/AGENTS.md
  sourceRefs: string[];       // ids that must exist in this issue's sources[]
}
```

`SECTION_KINDS` is the source of truth for valid `kind` values. Current
list (33 kinds) is exported from `src/content/config.ts`. Each maps to a
component dispatched by `src/components/SectionRenderer.astro` — see
`src/components/AGENTS.md` for the full table.

---

## 3. Source schema

```ts
{
  id: string;                            // e.g. 'src-01'; referenced by sourceRefs
  title: string;
  publisher: string;
  url: string;                           // MUST be a valid URL (Zod URL check)
  accessedAt: string;                    // YYYY-MM-DD
  kind: 'primary' | 'secondary' | 'analysis';
  quote?: string;
}
```

**Build will fail if:** a source `url` is missing or malformed, or any
section's `sourceRefs[]` includes an id that isn't in `sources[]`.

---

## 4. Primer rules (80–420 chars, Zod-enforced)

The primer renders between Hero and the first section via `src/components/core/Primer.astro`.
It's the plain-English on-ramp for a reader who knows nothing about the
topic.

**Hard rules:**
- **Length: 80 ≤ chars ≤ 420.** Astro build fails on either side. Count
  characters before writing; do not estimate.
- **No acronyms.** First mention spelled out (e.g. "balance of payments,"
  not "BoP"). Even SEO-common acronyms.
- **No jargon.** If the word wouldn't appear in a kitchen conversation,
  reword.
- **No em-dashes.** Use commas and full stops only. The primer is a
  bridge into the issue, not part of the rhetorical voice.
- **Ends with a forward gesture.** Examples that work: *"This piece asks
  why."* / *"Here is what the data shows."* / *"This is the system underneath."*

The drafter agent has the primer step at Step 2.5 of its instructions
(`.claude/agents/drafter.md`). It estimates length poorly; verify before
finalising.

---

## 5. SkimCaption rules

The site has two reading modes (`SkimToggle.astro` toggles
`#px-article[data-mode]` between `full` and `skim`).

In skim mode:
- Prose sections are hidden (their `.px-prose-full` div has `display: none`).
- Their `skimCaption` shows instead, in a `.px-skim-caption-block`.
- All other section kinds (timeline, data-readout, paradox, etc.) stay
  visible — those *are* the skimmable structural surface.

**Rules:**
- `skimCaption` only applies to `kind: prose` sections. On any other kind
  it is ignored (the schema allows it but no component reads it).
- 1–3 sentences. The job: "if someone reads only the skim view, what does
  this section's prose contribute structurally?"
- Should be readable as a standalone caption, not a paraphrase of the
  prose paragraphs.

---

## 6. The `*italic*` and `**bold**` markers

Used inside `title`, `intro`, paragraph text, and some structured fields:

- `*text*` renders as `<em>` (italic accent). Used for one accent word in
  titles: `The *Architecture* of Every Crisis`.
- `**text**` renders as `<strong>` (bold). Used in timeline event labels,
  paradox statements, occasional paragraph emphasis.

Renderers: `renderEmphasis` and `renderInline` in `src/lib/text.ts`. Do
not paste literal `<em>` / `<strong>` tags into MDX frontmatter — use the
markdown markers.

---

## 7. Common build errors (and the fix)

| Error | Cause | Fix |
|---|---|---|
| `String must contain at most 420 character(s) at "primer"` | Primer over 420 chars | Tighten the primer. Count actual chars; do not estimate from word count. |
| `Invalid url at "sources.N.url"` | Mock or malformed URL | Use real URLs only, even in drafts. |
| `Invalid enum value at "sections.N.kind"` | Unregistered section kind | Use only kinds in `SECTION_KINDS` (config.ts). |
| `Expected ")" but found "{"` in build | Sibling JSX returned from `.map()` without a Fragment wrapper | Wrap siblings in `<>...</>`. |
| Climate strip renders as 3-column flex | Used `.px-strip` instead of `.px-cstrip` | `px-strip` is owned by TopicStrip; ClimateStrip must use `px-cstrip`. |
| Author "By Shikhar Sharma" appears | Hardcoded name | Remove. Set `author:` in frontmatter only if you want the byline. |

---

## 8. The `# EDITOR:` flag convention

When the drafter or researcher encounters a claim that can't be fully
verified from primary sources, it inserts an inline comment:

```yaml
note: "Indira Gandhi reportedly donates 367 grams. # EDITOR: 367g figure
       traces to a 2009 MoD book via non-allowlisted source — verify
       before publish or remove specific figure."
```

These are YAML comments — they don't affect the build but they're visible
to the next human reader. **Every `# EDITOR:` flag must be resolved
before flipping `status: draft → published`.** Either verify and remove
the flag, or remove the specific claim.

---

## 9. New-issue scaffolding

```bash
npm run new-issue       # scripts/new-issue.mjs
```

Creates a dated slug folder under `src/content/issues/` with the
`_template/index.mdx` frontmatter pre-filled. Edit from there.

Naming: `YYYY-MM-DD-kebab-slug` (date prefix + 2–6 word slug). The slug
becomes the public URL: `/issues/<slug>/`.

---

## 10. Existing issues (voice reference)

The drafter agent reads these two for voice calibration:

1. `2026-04-24-delimitation/index.mdx` — primary reference (politics,
   bill-defeat structural argument).
2. `2026-04-24-kessler-cascade/index.mdx` — secondary reference (space,
   data-driven scale and consequence).

If you're writing a new issue manually (not via the drafter agent), open
both before starting. Voice consistency matters more than feature parity.

---

## Change log

### 2026-05-20 — File created
Initial version. Captures schema, primer + skimCaption rules, source
constraints, common build errors, EDITOR-flag convention.
