# Parallax Mode Library

> Canonical voice reference. The **stylist** agent reads this at runtime
> on every issue. Editors maintain it. Last updated 2026-05-04.

---

## What this document is

Every Parallax issue is a structural argument that needs to land. The
analytical scaffolding is the work of the **researcher** and **drafter**.
The **stylist** agent's job is to make that scaffolding read in the right
register for each section's rhetorical work — not in one homogenous
"Parallax voice," but in eight specific modes that the article moves
between as the reader travels through it.

This library defines those eight modes. Each is a **pattern**, not a
person — a recipe of sentence rhythms, opening moves, lexical preferences,
and signature structural moves. The named figures (Sagan, Ravish Kumar,
Oliver, etc.) are reference exemplars whose work was studied to extract
the pattern; the goal is *not* to imitate them but to channel the system
they use when their work is doing a particular kind of rhetorical work.

A single Parallax issue might use:

- **AWE** to open (establish scale)
- **FORENSIC** to explain the mechanism
- **SATIRICAL EXPOSURE** to expose the institutional contradiction
- **CALM-STRUCTURAL** to name what it means
- **LYRICAL COMPRESSION** for the closer

Five voices, one piece, blended at the seams. That is the goal.

---

## Voice rules — what to avoid

These are production-observed AI-tell patterns. The stylist agent checks
every prose field against this list as a final pass before returning its
summary. The drafter agent keeps this list open while writing every section.

### AI-tell catalog

**1. Em-dash overload**
*Pattern:* more than one em-dash per paragraph; em-dashes used as a
substitute for subordinate clauses.
*Why it happens:* Mode 2 (Conversational Explainer) lists em-dashes as
welcome — correct, but not as the primary rhythm tool.
*Fix:* maximum **one em-dash per paragraph**, across all modes. If a
second em-dash would appear, restructure the clause. Commas and periods
do the same work 90% of the time.

**2. Binary reframe as default closer**
*Pattern:* "It is not X. It is Y." — the neat inversion that announces
itself as a revelation.
*Why it happens:* AWE mode's closer template ("This is [plain noun]") and
FORENSIC mode's short-landing instruction both nudge toward two-sentence
reversals.
*Fix:* use binary reframe at most **once per issue**, and only when the
reversal is the actual structural argument — not decorative punctuation. If
the reversal is just re-stating the intro in inverted form, cut it entirely.

**3. Triple-fragment closer**
*Pattern:* three consecutive short sentences (5–8 words each) at the end
of a prose section — a rhythmic tic that reads as "and now the AI is
doing its closing move."
*Why it happens:* LYRICAL COMPRESSION's "fragment + long breath + fragment"
pattern gets applied at the end of FORENSIC sections by mistake.
*Fix:* maximum **one triple-fragment close per issue**. If you have more,
expand at least one of the fragments into a full clause.

**4. Abstract noun jargon**
*Pattern:* "structural argument," "rhetorical work," "energy imbalance as
a concept," "the mechanism that drives X" — using technical register to
describe what should be shown.
*Why it happens:* FORENSIC mode trusts the reader and avoids glossing, which
can slip into using technical labels as shorthand.
*Fix:* if it can't be said in the kitchen, rewrite. "The structural argument"
→ "the point." "The mechanism" → describe the mechanism in one clause. Never
use a technical term as a substitute for the explanation.

**5. Numbered-manifesto rhythm in prose**
*Pattern:* three-point prose structures that read as bullet points in
flowing-text disguise: "First, X. Second, Y. Third, Z." / "The timeline.
The numbers. The forecast." / "One mechanism. One question. One direction."
*Why it happens:* FORENSIC mode's "scene-setting → analysis → landing"
paragraph structure gets mis-read as a permission to list three things.
*Fix:* the three-movement paragraph structure describes *weight*, not *list*.
Each movement must contain a full scene or claim, not a label.

**6. The "not X / it is Y" binary used on the same concept twice**
*Pattern:* a piece has both "This is not an oscillation. It is a staircase."
and "The surface is not the cause. The reservoir is." — parallel reversals
stacked across sections.
*Fix:* one binary reframe per issue, applied once. If a second reversal
seems necessary, it means the first wasn't placed correctly.

### Quick correction table

| AI tell found | Rewrite move |
|---|---|
| 2+ em-dashes in a paragraph | Replace second with comma, colon, or full stop |
| "It is not X. It is Y." | Either merge into one clause or cut the first half |
| 3× short sentences closing a section | Expand one fragment into a full clause |
| "structural argument" / "rhetorical work" | Replace with the actual claim |
| "First… Second… Third…" structure | Interleave; remove the ordinal labels |

---

## How to use this library

**Step 1: Tag each section with a mode.** Look at what rhetorical work
the section is doing. Match it to one of the eight modes using the
**Decision Tree** at the bottom of this document.

**Step 2: Apply the pattern.** Open the mode card, follow the recipe —
opening move, sentence rhythm, lexical defaults, transitions, signature
moves, what to avoid. Rewrite the section's prose in the mode.

**Step 3: Blend at section seams.** Modes do not switch mid-paragraph.
Use a transition sentence at the section break — usually shorter, more
declarative, in the new mode's register.

**Step 4: Check against failure modes.** Every mode has documented ways
it goes wrong when imitators try it. Re-read the failure list before
calling the section done.

---

# THE EIGHT MODES

## Mode 1 — AWE

**When to use.** Establishing scale, deep time, vastness, the marvel of
a mechanism. Section openers in earth and space issues. Closers where
contemplation lands the piece. Transitions out of dense data into
significance. The reader must feel small without feeling lost.

**Reference figures.** Carl Sagan (Cosmos, Pale Blue Dot); David
Attenborough (Life on Earth, Blue Planet); Neil deGrasse Tyson (Cosmos:
A Spacetime Odyssey — distinct from his StarTalk register).

### The pattern

**Sentence rhythm.** Long setup, short revelation. Multi-clause paragraphs
breathe outward, then close on a clipped 5–8 word sentence that lands on
a noun ("home"; "we"; "newcomers"). Sagan's ratio is most extreme; Tyson
keeps shorter sentences throughout but the same descent-to-landing
pattern.

**Opening templates.**
- *Inventory then collapse:* list the parts of a thing (elements, eras,
  beings), then point out they share one origin or fate.
- *Scale-anchor:* a quietly factual statement of size, distance, or time,
  delivered without italics or emphasis. The number does the work.
- *Plural-pronoun frame:* "we," "our," "us" installed in the first
  sentence — the stance is set before the argument.
- *Imperative-of-imagination:* "Imagine." "Picture." "Look." A directive
  to the reader's inner camera (Tyson-mode).

**Lexical defaults.**
- Prefer: *dust, ash, water, ice, breath, light, dark, home, voyage,
  ocean, star, calendar, ancestor, newcomer, sea, ground.*
- Avoid: *truly, incredibly, mind-blowing, breathtaking, magnificent.*
  No exclamation points. No italics for emphasis on awe-words. No
  rhetorical questions ("Can you believe..."). Awe doesn't ask.

**Pronoun policy.** "We" / "our" / "us." Never "I." "You" only at
moments of direct address (Tyson allows more direct address than Sagan).

**Signature moves.**
- *Chemistry-to-poetry:* name the element, locate it in the body,
  locate it in the star.
- *Shrinking-Earth move:* a pulled-back camera in prose form.
- *Closing benediction:* a short, almost liturgical sentence landing
  on a plain noun.
- *Scale conversion (Tyson):* state the real number, then translate
  it to a body-scale analog in the next sentence.
- *The downshift (Attenborough):* after a dramatic image, a flatly
  factual sentence, often containing a number.

**Reference quotes (≤15w each, attributed).**
- "We are made of star-stuff." — Sagan, *Cosmos* ep. 1, 1980.
- "Look again at that dot. That's here. That's home. That's us." — Sagan, *Pale Blue Dot*, 1994.
- "Our solar system forms August 31." — Tyson, *Cosmos: A Spacetime Odyssey*, 2014.

### Variations

- **Sagan** — most willing to sound liturgical; paragraphs breathe like psalms.
- **Attenborough** — most withholding; awe by *under*-stating, letting facts ring.
- **Tyson (Cosmos register)** — most kinetic; awe by *moving the reader through scale*.

### Failure modes

- Purple prose. Reaching for grandeur in vocabulary instead of structure.
- Adjective stacking. Italics doing work the syntax should do.
- More than one cosmic-scale claim per paragraph (the awe accumulates;
  it doesn't compound).
- Awe over a thing the reader can't picture — empty awe.
- The presenter voice ("wow," "amazing"). Awe at its weakest sounds
  like a TV host; at its strongest sounds like a guide who has stopped
  walking to point.

---

## Mode 2 — CONVERSATIONAL EXPLAINER

**When to use.** Unpacking something complex the reader could grasp if
walked through carefully. Mechanism explainers. Sections that unpack a
counterintuitive finding. The body of an issue, between an AWE-mode
opener and a FORENSIC-mode close. Anywhere the reader has to be carried
across an inferential gap.

**Reference figures.** Neil deGrasse Tyson (StarTalk / public-lecture
register, distinct from his Cosmos register); Bill Bryson (*A Short
History of Nearly Everything*); Robert Krulwich and Jad Abumrad
(Radiolab).

### The pattern

**Sentence rhythm.** Variable — long explanatory sentences with frequent
interrupters (em-dashes, parentheticals, asides), broken by short
reset sentences. At least one short sentence per paragraph. The page
breathes.

**Opening templates.**
- *Everyday object as portal:* a dot of ink, a sugar cube, a teaspoon —
  the thing in front of the reader becomes the way into the cosmos
  (Bryson signature).
- *Lay-question, then complicate it:* start with the question the
  audience would ask, then make it harder before making it easier.
- *Self-deprecating confession:* admit the writer didn't know this
  either, which licenses the reader to not know.
- *"Here's what's wild about this."* (Tyson StarTalk move)

**Lexical defaults.**
- Prefer: casual + technical, rapid switching. *Thing, stuff, kind of,
  sort of, basically, anyway, here's the thing, the point is, weird,
  strange, snug, dollop, dot, lump, teaspoon.* Contractions allowed.
- Avoid: throat-clearing past the second sentence. Fake confusion.
  Analogies that require *another* analogy to land. Exclamation points.
  "As you might know" without a real expansion.

**Pronoun policy.** Direct "you" to the reader. "We" when sharing the
discovery. Occasional "I" for honest confession (used sparingly in
Parallax — the magazine has no implicit narrator).

**Signature moves.**
- *Domesticated scale (Bryson):* convert cosmic numbers into household
  objects (sugar cubes, peas, cricket pitches).
- *Parenthetical wonder:* the awed beat tucked inside parentheses,
  almost dismissed, where a less skilled writer would italicize.
- *Retroactive setup (Tyson):* tell a casual anecdote, then reveal it
  was the explanation.
- *The reset sentence:* every paragraph contains one short sentence
  that re-anchors the reader.
- *Confused-aloud pedagogy (Radiolab):* model the moment of not-getting-
  it before the moment of getting it.

**Reference quote (≤15w, attributed).**
- "Protons give an atom its identity, electrons its personality." — Bryson,
  *A Short History of Nearly Everything*, 2003.

### Variations

- **Tyson (StarTalk)** — most performative; built for an audience laughing along.
- **Bryson** — most readerly; built for one person on a sofa.
- **Radiolab** — most procedural; the *process* of figuring it out is the content.

### Failure modes

- Condescension. The "well, actually" tone.
- Folksy tedium. The "aw shucks" mask becoming the whole performance.
- Manufactured confusion. Performed naïveté.
- More than one digression per paragraph.
- Bryson without information density — only the cosiness, which is unbearable.

---

## Mode 3 — CALM-STRUCTURAL

**When to use.** Politics issues. Climate-as-policy issues. Any moment
where the structural argument needs to land without the prose performing
its own outrage. Especially: pieces where the reader is already inundated
with hot takes on the same subject — this is the antidote-to-the-timeline
register.

**Reference figures.** Ravish Kumar (Hindi NDTV broadcasts and *The Free
Voice*); Pankaj Mishra (LRB essays, *Bland Fanatics*, *From the Ruins of
Empire*); Arundhati Roy (*Capitalism: A Ghost Story*, *Walking with the
Comrades*, *The End of Imagination*).

### The pattern

**Sentence rhythm.** Short to medium clauses, comma-joined, paced for
breath. Declarative + slow restatement: say a thing, then say it again
with one word changed, so the reader registers the second version as
deepening rather than repetition. Roy adds extreme range — one-word
sentences sit beside long enumerations.

**Opening templates.**
- *Specific date/place + ordinary object* — Ravish's signature. Place
  the reader in a real room before any structural claim.
- *Named figure + specific year + small gesture* — Mishra's move.
  Historical specificity is the entry; the civilizational claim follows.
- *Glossy quote from state/corporation, then paragraph break, then the
  physical consequence* — Roy's juxtaposition.
- *Sensory specific* — a typewritten note slipped under a door, a
  password, a tika. The politics arrive only after the reader has
  accepted the room.

**Lexical defaults.**
- Prefer: *citizen, lie, voice, neighbour, contingent, mask, camera,
  river, fear, silence, ingratiating, obliged, mask, camera.*
- Avoid: *monstrous, devastating, fascist, neoliberal, subaltern,
  narrative, problematic.* No expletive-political adjectives. No
  rhetorical flourish that shifts register from speech-like to
  speech-making.

**Pronoun policy.** "We" of shared citizenship — the writer is one
of the implicated. Direct "you" sparingly (Ravish's *aap*). Never the
detached third person of academic critique.

**Signature moves.**
- *The doubled question (Ravish):* ask the same question twice with a
  beat between. The second iteration is not emphasis; it's a refusal
  to let the question pass.
- *Scene-to-civilization pivot (Mishra):* specific person, specific
  year, specific gesture, then a short structural clause that lifts
  the reading into broader scale.
- *Polished/brutal juxtaposition (Roy):* place a state phrase next to
  the physical fact it produced. Do not editorialize. The juxtaposition
  is the argument.
- *"Consider —" / "Look —"* as a procedural transition, not an
  argumentative one. Move the reader's gaze; don't bend their conclusion.

**Reference quotes (≤15w each, attributed).**
- "Not all battles are fought for victory." — Ravish Kumar, Magsaysay speech, 2019.
- "Provided, of course, we have a future." — Roy, *The End of Imagination*, 1998.
- "Cold War liberalism reincarnated itself as neoliberalism." — Mishra, *Bland Fanatics*, LRB, 2015.

### Variations

- **Ravish** — broadcast cadence; doubled questions; second-person address.
- **Mishra** — essayistic cadence; subordinated periods; lateral pattern-
  matching across regions.
- **Roy** — citizen-as-accomplice frame; one-word sentences; juxtaposition
  without connective tissue.

### Failure modes

- Flat earnestness. Restraint must be felt as restraint — that requires
  occasional breaches (a single stark image, a named injury) that prove
  the calm is a choice.
- Academic distance. Mishra at his weakest is references without scenes;
  the named room is what keeps it alive.
- Editorialized juxtaposition. If the writer adds the moral connective
  the reader was meant to supply, the form collapses. Place the two
  things; leave the verb out.
- Operatic adjective. Trust the noun.
- Loading with jargon. The structural point should be sayable in the
  kitchen.

---

## Mode 4 — SATIRICAL EXPOSURE

**When to use.** Section-level: any moment where an issue requires
showing that an official action contradicts an official mission. The
ratchet-mechanism sections where the body's chart says one thing and
the underlying data says another. Issue-opener: usually too aggressive
— save for the section that turns the screw.

**Reference figures.** John Oliver (Last Week Tonight); Jon Stewart
(Daily Show, both eras); Dave Chappelle (specials).

### The pattern

**Sentence rhythm.** Three-step escalation: (1) flat factual setup,
(2) a slightly absurd specific detail, (3) a punchline that is itself
a *further* fact, not a joke. The third beat lands on a proper noun,
a dollar figure, or a date. Reader generates the laugh by realizing
the absurd thing is real.

**Opening templates.**
- *Quote the official line straight*, with a beat of feigned credulity.
  Only then let the evidence do its work.
- *News-clip-played-straight + reaction sentence* (Stewart): "That is
  a press release. About a war."
- *Setup that appears to agree with the position the audience expects
  you to attack* (Chappelle): the misdirection is the trap.

**Lexical defaults.**
- Prefer: bureaucratic precision (full titles, exact figures). Working-
  register clarity. Concrete nouns over abstract — "money" not "wealth,"
  "the cops" not "law enforcement" (Chappelle).
- Sudden register-crash for relief, used sparingly: "which is, frankly,
  insane" — Oliver only deploys this once or twice per segment.
- Avoid: visible outrage. The form requires faux-credulous deadpan.
  Never write the conclusion the reader will draw.

**Pronoun policy.** Implicit "we" of co-conspirators who already know
the system is rigged. The setup assumes ambient cynicism and shows
something even worse.

**Signature moves.**
- *Specific-data-point-as-punchline (Oliver):* segment builds for
  paragraphs through escalating context, then closes not on a one-liner
  but on a single number. The number is funnier than any joke.
- *The false concession (Stewart):* "Now, in fairness..." followed by
  something that is *not* a fairness — sharpens, not softens.
- *Setup–misdirection–reveal triad (Chappelle):* misdirection is itself
  a credible-sounding statement that the reveal then exposes as load-
  bearing fiction.
- *Embedded artefact:* the chart, screenshot, or regulation paragraph
  quoted in original form, briefly described, allowed to indict itself.

**Reference quote (≤15w, attributed).**
- "The presidency is supposed to age the president, not the country." — Stewart, *Daily Show*, 2025.

### Variations

- **Oliver** — investigator. Long, evidence-stacked, cumulative. Best
  when the contradiction needs documentary proof.
- **Stewart** — witness. Shorter takes, reaction-shot energy. Best when
  the contradiction is already obvious and exhaustion is the register.
- **Chappelle** — parable-teller. Narrative misdirection. Best when the
  structural point is buried in a story that has to be earned.

### Failure modes

- Satirising voters, demographics, or vibes — the form is built to
  expose a documented gap; aim it at a vibe and it becomes smug-liberal-
  pose.
- Visible outrage. The form requires faux-credulous deadpan in the setup.
- Punchlines funnier than the underlying fact. If your line is funnier
  than what actually happened, you're using the wrong fact.
- Stacking more than three escalation beats. The form fatigues fast.
- Glibness without the structural point — Chappelle-mode dies if the
  reveal is "gotcha" and not "here is a real fact about the world."
- World-weariness. Stewart-mode collapses when the writer signals
  "I'm tired of having to point this out." The energy required is
  incredulity that the thing is happening *now*.

---

## Mode 5 — DRY WIT

**When to use.** Issue openers and closers. Sections where the material
is dense and the reader needs ironic distance to keep going. Any moment
where institutional language is at its most pompous — dry wit lets you
reproduce the cant without comment and the cant indicts itself.
Particularly good for short biographical sketches inside an issue.

**Reference figures.** Tom Standage and the Economist house style
(especially the obituary column); P.G. Wodehouse (Jeeves, Blandings);
Craig Brown (Private Eye diaries); James Wood (New Yorker, sustained
long-form).

### The pattern

**Sentence rhythm.** Measured cadence — long, paratactic, comma-rich —
that lulls the reader, then a needle. The needle is *never* the loudest
word in the sentence; it's a small, accurate verb or modifier that
retroactively recolors everything before it. Wodehouse builds across
multiple subordinate clauses until the qualifications themselves become
the joke.

**Opening templates.**
- *Mismatch register and subject:* grand terms for a small thing, or
  workaday terms for a grand thing. The pivot is the entire register
  joke.
- *State an absurd premise as flat fact*, with no acknowledgement that
  it is absurd (Wodehouse).
- *Open with a deflating workaday detail* about an ostensibly grand
  subject (Economist obituary).

**Lexical defaults.**
- Prefer: stiff-collar vocabulary deployed against itself. Latinate
  verbs (*disport, repair to, contrive, oblige*) sit next to small
  concrete nouns. Mock-elevated formality colliding with the everyday.
- Avoid: italics on the funny word. Exclamation marks. "Of course."
  "Naturally" used naturally. Any signal that the writer is being witty.

**Pronoun policy.** Treats the reader as a peer in a club. There is
*no explanation of context*; the reader is assumed to know. This is
the opposite of Mode 2 (Conversational Explainer), which scaffolds
relentlessly. Dry wit assumes the framework and only slots in the new
fact.

**Signature moves.**
- *The parenthetical aside-as-stiletto:* a clause inserted in dashes
  or parentheses that contains the actual judgment, while the main
  clause stays neutral. "The minister (who has a long-standing interest
  in the matter) announced..."
- *Specific-detail-against-grand-narrative:* the Inderbinen obituary
  inverting Mallory's famous line and landing on a small domestic fact.
  The grand inverts to the domestic.
- *Casual sub-clause containing the real claim* (Wodehouse): the absurd
  qualification arrives mid-sentence as if uncontroversial.
- *Exaggerated fidelity (Brown):* quote institutional language at length
  and let its own rhythms expose it. No editorial framing.

**Reference quotes (≤15w each, attributed).**
- "He died gently, in his bed." — *The Economist*, obituary of Ulrich Inderbinen, 2004.
- "Ice was forming on the upper slopes of the mountains." — Wodehouse, "Extricating Young Tuppy."

### Variations

- **Standage / Economist** — measured cadence, then needle. Peer-of-the-reader.
- **Wodehouse** — narrator less aware than reader; absurd premise stated as fact.
- **Brown** — parody-as-quotation; exaggerated fidelity to the target.
- **Wood** — long-form sustained. Cumulative effect over thousands of words.

### Failure modes

- Winking. If the writer signals "watch this," the bit collapses. The
  Economist register depends on the writer never breaking.
- Explaining the irony. If the reader needs the irony explained, the
  sentence is already broken.
- Sustained dry wit without fact-anchor. Becomes airy.
- Mixing modes mid-section. An Oliver-style escalation inside a Standage-
  style paragraph reads as panic.
- Punching down. Dry wit on the powerless reads as cruelty; it requires
  a target with enough armour to deserve the small needle.

---

## Mode 6 — INVESTIGATION

**When to use.** Issue openings where the surprise is the argument.
Sections where the reader needs to walk to the conclusion, not be
handed it. Whenever the *path* is more persuasive than the conclusion
stated baldly. Especially valuable when the reader starts with no
opinion and needs to develop one through observation.

**Reference figures.** Johnny Harris (YouTube journalism); Anthony
Bourdain (*Kitchen Confidential*, *No Reservations*, *Parts Unknown*);
Errol Morris (*The Thin Blue Line*, NYT "Believing is Seeing").

### The pattern

**Sentence rhythm.** Alternates short curiosity-jabs with longer reasoning
sentences. Roughly 1:2 ratio — one short stab of attention, two longer
beats of cognitive lifting. Bourdain adds punchy sensory bursts. Morris
uses repetition that looks redundant but is actually reframing.

**Opening templates.**
- *Visual anchor before contextual bridge (Harris):* point at the weird
  thing on the map / in the chart / in the data, *before* you tell the
  reader why they should care.
- *Sensory shock (Bourdain):* what it smelled like, what was on the wall,
  what the cook said before he turned around. Establish texture before
  fact.
- *A question that re-frames a known event (Morris):* don't tell the
  reader what happened; ask what we think we know about it.

**Lexical defaults.**
- Prefer: accessible-curiosity. Smallest word that does the job. First-
  person allowed (in Parallax, the implicit narrator stance — "Look at
  this. Notice the gap.").
- Avoid: jargon unannounced. Manufactured suspense. Self-awareness that
  becomes self-regard.

**Pronoun policy.** "I" is permitted in this mode, more than any other —
but for Parallax, translate into the implicit narrator: "Look." "Notice."
The reader is brought into the *noticing*.

**Signature moves.**
- *"But the more I looked at it, the stranger it got"* (Harris). Each
  section ends having created a new question; the next section answers
  it and creates the next.
- *Wall-of-evidence assembly (Harris):* stack artifacts (a map, a clip,
  a document, a date) until the conclusion is forced rather than asserted.
- *Gentle self-undermining (Bourdain):* just when authority is being
  established, puncture it ("I had no idea what I was doing"). This
  buys the right to make the next assertion.
- *Questions-that-rephrase (Morris):* each question is a slightly tilted
  version of the previous one. The angle change is what makes the picture
  come into focus.
- *Tonal pivot from external description into internal reflection*
  (Bourdain) — usually mid-paragraph, almost never with a connective phrase.

**Reference quotes (≤15w each, attributed).**
- "Good food, good eating, is all about blood and organs, cruelty and decay." — Bourdain, "Don't Eat Before Reading This," New Yorker, 1999.
- "Who was driving? Who pulled the gun out from underneath the seat?" — Morris, *The Thin Blue Line*, 1988.

### Variations

- **Harris** — visual-led. Anomaly first, mechanism second, artifact stack
  as proof.
- **Bourdain** — sensory-led. Body first, place second, meaning third —
  and meaning is allowed to remain partial.
- **Morris** — epistemic. Interrogates the question before the answer;
  reader as co-investigator of evidence.

### Failure modes

- Narrator becomes the story. The narrator's confusion is a tool to
  model the *reader's* confusion; once it stops doing that, it's vanity.
- Faked discovery. If the writer already knew the answer, the reader
  smells it. Discover something genuine — a mechanism, a contradiction,
  a quote that complicates the easy reading.
- Questions that never resolve. Mystery without progress is theater.
  Each section must deliver a partial answer alongside the next question.
- Breaking the fourth wall too often. One self-aware aside per section
  is plenty.

---

## Mode 7 — FORENSIC

**When to use.** Sections explaining a mechanism whose stakes are
human (atmospheric coupling, orbital decay, demographic ratchet,
electoral math). Whenever a flat technical paragraph would lose the
reader, but a hand-wavy paragraph would lose the argument. Usually
the *middle* of an issue, after Investigation has earned curiosity
and now needs to reward it with explanatory weight.

**Reference figures.** Wright Thompson (ESPN long-form, *Pappyland*);
Hugh McIlvanney (Sunday Times sports column); David Foster Wallace
(tennis writing — "Roger Federer as Religious Experience").

### The pattern

**Sentence rhythm.** Symphonic paragraphs. Short scene-setting front-
loads specificity. Longer rolling sentences carry analysis. Final
short sentence lands meaning. The whole paragraph behaves like a
movement. McIlvanney uses classical periodic sentences — multiple
subordinate clauses landing weight on the final phrase. DFW nests
clauses and trusts the reader to track three thoughts at once.

**Opening templates.**
- *A single specific moment that will accrue meaning across the piece*
  (Thompson). The desk, the date, the parking garage — all return.
- *The elegant general observation, then the specific case as evidence*
  (McIlvanney). General-to-specific direction is reversed from American
  long-form — that reversal is the signature.
- *Experience-as-sensation* (DFW). Open in second-person witness — what
  the reader has felt — then announce that this is the subject.

**Lexical defaults.**
- Prefer: spare baseline; sudden lyric or technical precision when
  earned. The technical fact deployed at full specificity, because the
  precision *is* the beauty.
- Avoid: lecture register. Decoration without argumentative work. The
  metaphor that doesn't tighten the technical claim.

**Pronoun policy.** Trust the reader's intelligence absolutely. No
glossing of vocabulary. No apology for the metaphor. The reader is
assumed to be the writer's equal, and rises to meet it.

**Signature moves.**
- *Pair every technical fact with a human stake in the same sentence
  or paragraph.* Never a "mechanism paragraph" followed by a "stakes
  paragraph" — interleave or fuse.
- *Structural call-back (Thompson):* whatever the section opens on
  returns at the close, transformed in meaning. The transformation
  *is* the argument.
- *Specific detail as moral stake (McIlvanney):* the cut over an eye,
  the size of a purse, the weight discrepancy. These are not color.
  They are the ethical content.
- *Periodic sentences for judgment, short sentences for landings.*
  Long sentence builds the case; short sentence seals it.
- *Footnotes-as-counter-narrative (DFW):* the main text makes the public
  case; the parenthetical / footnote makes the private one. The friction
  is the meaning. (For Parallax: parentheticals can do this work; we
  don't render footnotes.)

**Reference quotes (≤15w each, attributed).**
- "Five weeks before his 50th birthday, Michael Jordan sits behind his desk." — Thompson, ESPN, 2013.
- "Federer's movements are lithe, unhurried, and yet impossibly fast." — Wallace, NYT *Play*, 2006.

### Variations

- **Thompson** — narrative-forensic. Mechanism revealed scene by scene;
  call-back locks meaning into structure. Best when the issue's argument
  is human-driven and the technical content is the substrate.
- **McIlvanney** — classical-forensic. Mechanism articulated as moral
  cause-and-effect in periodic sentences. Best when the issue's argument
  requires *judgment* — when the structure is also an ethics.
- **DFW** — experimental-forensic. Technical precision experienced as
  wonder. Best when the *precision itself* is the point — Kessler shells,
  ENSO coupling, electoral arithmetic where the math is the drama.

### Failure modes

- Lecture. If a paragraph could appear in a textbook unchanged, it
  isn't forensic — it's pedagogy. The voice has to be present.
- Decoration. If the metaphor doesn't tighten the technical claim, cut.
- Showing off. Virtuosity for its own sake.
- Bolted-on stakes paragraph at the end.
- Call-back without genuine transformation. Returning to the opening
  image without earning a new reading is sentiment, not architecture.

---

## Mode 8 — LYRICAL COMPRESSION

**When to use.** Closing paragraphs. Transitions between modes (especially
between Calm-Structural sections and the next argument). Single-paragraph
emotional landings inside a longer issue. Epigraph-equivalents at section
heads. **Never the bulk of an issue** — Lyrical Compression is a register,
not a length.

**Reference figures.** Javed Akhtar (ghazals, *Tarkash*, *Talking Films*);
Pico Iyer (*The Art of Stillness*, "The Joy of Quiet"); Michael Ondaatje
(*The English Patient*, *Running in the Family*) — for English-prose
compression patterns.

### The pattern

**Sentence rhythm.** Fragment + long breath + fragment. The comma is a
rest, the way it is in music. Each unit is built to stand alone — Akhtar's
ghazal logic where each *sher* is self-sufficient and the whole accumulates.
Ondaatje fractures further: a sentence may be four words; the next may
unfurl across half a page.

**Opening templates.**
- *An image already in motion.* A clock. A road. A face in a window.
  Never open with thesis; open with a frame the reader has to step into.
- *A body in a specific physical posture* (Ondaatje).
- *A small concrete journey, philosophical implication held back* (Iyer).

**Lexical defaults.**
- Prefer: time-words (*moment, instant, minute*), light-words (*lamp,
  shadow, glass*), road-words (*road, journey, doorway*), body-words
  (*wrist, throat, palm*).
- Avoid: spiritual / therapeutic jargon (*mindful, presence, healing,
  awakening*). Adjective stacks. Naming the feeling — describe the
  conditions under which the reader would feel it.

**Pronoun policy.** "We" / "our" earned by including the writer in the
predicament. Never "I" in Parallax's voice. Reader is co-conspirator
in feeling, not addressed directly.

**Signature moves.**
- *Image, image, twist (Akhtar):* two concrete pictures; a third clause
  that reframes both. The twist is shorter than the setups.
- *Stillness-in-motion paradox (Iyer):* setup movement; resolve in
  stillness, or vice versa. Form: "in an age of X, nothing is more Y
  than not-X."
- *Timed silence (Ondaatje):* fragment, long sentence, fragment. The
  pause is engineered into the prose.
- *White space carries the "however."* Section break = volta. Reader
  becomes the bridge.
- *Polished/brutal juxtaposition without connective.* Place two things;
  leave the verb out.

**Reference quote (≤15w, attributed).**
- "Nowhere is magical unless you can bring the right eyes to it." — Iyer, *The Art of Stillness*, 2014.

### Variations

- **Akhtar** — ghazal volta. Image, image, twist, finished.
- **Iyer** — monastic stillness. Long breath, pause, paradox-resolution.
- **Ondaatje** — lyric fragmentation. Body in space, white space, body
  in different space.

### Failure modes

- Decorative metaphor. Image-stacking with no twist; prose that wants
  to be admired rather than to land.
- Greeting-card serenity. The paradox too neat. Fix: keep the specific
  scene that anchors the philosophy.
- Mannered fragmentation. Ondaatje at the wrong intensity becomes
  precious. For Parallax: borrow the rhythm, not the obscurity.
- Naming the feeling. *Sadness* / *longing* / *regret* — replace with
  the conditions.
- Using this mode for argumentative work. It cannot carry a structural
  claim; it can only land one.

---

# MODE-BLENDING RULES

A Parallax issue moves through 4–6 modes in 7–9 sections. Blending is
where the craft lives.

## Rule 1 — Mode = section, not paragraph

Within a single section, commit to one primary mode. The stylist may
pull a *device* from another mode (a single dry-wit parenthetical inside
a forensic section, a one-line satirical aside inside a calm-structural
section) but the dominant register of any section must be readable as
one mode.

## Rule 2 — Section seams need transition sentences

When the next section is in a different mode, the current section's
final sentence and the next section's first sentence together do the
hand-off. Patterns that work:

- **Awe → Forensic.** End awe with a noun-landing closer ("This is the
  reservoir."). Open forensic with a specific moment that contains the
  mechanism in miniature.
- **Forensic → Satirical.** End forensic with the technical fact at full
  weight. Open satirical by quoting the official line that contradicts
  it. The reader hears the contradiction in the silence between sections.
- **Satirical → Calm-Structural.** End satire on the punchline-fact.
  Open calm-structural with a plain sentence naming what the contradiction
  costs. The drop in temperature is the move.
- **Calm-Structural → Lyrical Compression.** End calm-structural on a
  clean declarative ("This was the law."). Open lyrical with a single
  image. The reader lands.
- **Conversational → Forensic.** End conversational with a reset
  sentence. Open forensic with the specific moment.
- **Investigation → Forensic.** End investigation with the question
  sharpened. Open forensic with the partial answer made fully precise.
- **Investigation → Awe.** End investigation with the conclusion forced.
  Open awe with the scale that conclusion implies.
- **Investigation → Satirical.** End investigation with a documented
  gap. Open satirical with the official line that should have closed
  the gap.

## Rule 3 — Mode allocation across an issue

A typical 7–9 section issue uses these modes in roughly these slots:

| Slot | Default mode | Alt |
|---|---|---|
| Hook / opener | Investigation OR Awe | Calm-Structural |
| First explanation section | Conversational Explainer OR Forensic | — |
| Mechanism / data section | Forensic | — |
| Centerpiece visual section | Awe (if scale) OR Forensic (if precision) | — |
| Contradiction / paradox section | Satirical Exposure | Calm-Structural |
| Quote / framing section | Calm-Structural | Dry Wit |
| Closer | Lyrical Compression | Calm-Structural |

No issue should use all eight modes. 4–6 is the working range.

## Rule 4 — Comedic and lyrical modes are seasoning, not staple

Satirical Exposure and Lyrical Compression are the two most distinctive
modes. They are also the two easiest to overuse. Hard rule: at most
**one Satirical section** per issue. At most **two Lyrical paragraphs
per issue** (typically one closer + one transition).

## Rule 5 — Mode should match the section's rhetorical work, not the topic

A space issue is not always Awe-mode. The Kessler-cascade story has
sections that are forensic (the altitude shells), investigation (the
historical incidents), and satirical (the FCC's rule-vs-action gap).
A politics issue is not always Calm-Structural. A delimitation piece
might open in Investigation, explain the mechanism in Forensic, expose
the contradiction in Satirical, and close in Calm-Structural. The mode
follows the rhetorical work, not the topic banner.

---

# DECISION TREE — "Which mode does this section need?"

```
Q1: Is this section establishing scale, deep time, or marvel?
    → AWE
    
Q2: Is this section explaining a mechanism the reader needs to grasp?
    Q2a: Stakes are human and structural?     → FORENSIC
    Q2b: Stakes are inferential, walk-through? → CONVERSATIONAL EXPLAINER

Q3: Is this section exposing an institutional contradiction?
    Q3a: Documented, fact-stacked?        → SATIRICAL EXPOSURE
    Q3b: Pompous language exposing itself? → DRY WIT

Q4: Is this section naming a structural wrong?
    → CALM-STRUCTURAL

Q5: Is this section discovering / observing an anomaly?
    → INVESTIGATION

Q6: Is this section a closer / transition / single emotional landing?
    → LYRICAL COMPRESSION
```

If two modes seem to apply: pick the one whose **failure mode** is least
likely to be triggered by the section's content. (Example: a section
exposing a contradiction *could* be Satirical or Calm-Structural — pick
Calm-Structural if the topic is sensitive enough that satire's failure
mode of "smug-liberal-pose" would damage the piece.)

---

# QUICK-REFERENCE PATTERN CARDS

For agent runtime use. Each card is a one-page recipe.

## AWE
- **Cadence:** long setup → short revelation. Closer 5–8 words landing on a noun.
- **Open:** inventory + collapse / scale-anchor / "we" frame / "imagine" imperative.
- **Vocab:** dust, ash, water, ice, light, dark, home, ocean, calendar.
- **Avoid:** truly, incredibly, mind-blowing, exclamation points, italics on awe-words.
- **Closer template:** *This is [plain noun].* / *We are [plain noun].*
- **Calibration:** if the awe lives in the *adjectives*, rewrite. It lives in cadence and fact.

## CONVERSATIONAL EXPLAINER
- **Cadence:** mixed lengths; at least one short reset per paragraph; em-dashes welcome.
- **Open:** everyday object as portal / lay-question to complicate / "here's the thing."
- **Vocab:** thing, stuff, basically, anyway, weird, dollop, dot, teaspoon. Contractions OK.
- **Avoid:** condescension, fake confusion, more than one digression per paragraph.
- **Closer template:** *And that's why [plain claim].* / *Which is [punchline-shaped sentence].*
- **Calibration:** read aloud without performance — if it works, it's working.

## CALM-STRUCTURAL
- **Cadence:** short-medium clauses, comma-joined, paced for breath.
- **Open:** specific date/place + ordinary object / named figure + year + gesture / glossy quote next to physical fact.
- **Vocab:** citizen, lie, voice, neighbour, mask, river, fear, silence.
- **Avoid:** monstrous, devastating, fascist, neoliberal. No expletive-political adjectives.
- **Signature:** doubled question / scene-to-civilization pivot / juxtaposition without connective.
- **Calibration:** at least one image must prove the writer feels what they're describing.

## SATIRICAL EXPOSURE
- **Cadence:** three-step escalation. Setup → absurd specific → harder fact as punchline.
- **Open:** quote the official line straight, with feigned credulity.
- **Voice rules:** faux-credulous deadpan in setup. Bureaucratic precision (full titles, exact figures).
- **Avoid:** satirizing groups/vibes, visible outrage, punchlines funnier than the underlying fact.
- **Signature:** specific-data-point as punchline / false concession ("In fairness...") / setup-misdirection-reveal.
- **Calibration:** the laugh is the reader's recognition of a *real fact*, not appreciation of your line.

## DRY WIT
- **Cadence:** measured cadence — comma-rich, paratactic — then small needle late.
- **Open:** mismatch register and subject. Grand for small, or workaday for grand.
- **Vocab:** stiff-collar formality (*disport, repair to, contrive*) against concrete nouns.
- **Avoid:** italics on the joke, exclamation marks, "of course," winking.
- **Signature:** parenthetical aside-as-stiletto / specific detail against grand narrative.
- **Calibration:** if the reader needs the irony explained, the sentence is broken.

## INVESTIGATION
- **Cadence:** alternating short curiosity / longer reasoning. ~1:2 ratio.
- **Open:** anomaly the reader can see (visual / scene / question) before any context.
- **Voice rules:** curiosity permitted, certainty not yet earned. Implicit narrator stance ("Look. Notice.").
- **Avoid:** narrator-becoming-the-story, faked discovery, manufactured suspense.
- **Signature:** "the more I looked, the stranger it got" / wall-of-evidence assembly / questions-that-rephrase.
- **Calibration:** each section ends on a sharper question; each delivers a partial answer.

## FORENSIC
- **Cadence:** symphonic paragraphs. Scene-setting → analysis → landing. Periodic sentences for judgment, short for landings.
- **Open:** single specific moment that will accrue meaning / general observation then specific case / experience-as-sensation.
- **Voice rules:** trust reader absolutely. No glossing. Pair technical fact + human stake in same paragraph.
- **Avoid:** lecture, decoration, showing off, bolted-on stakes paragraph.
- **Signature:** structural call-back / specific detail as moral stake / footnote-as-counter-narrative.
- **Calibration:** if you can lift the technical part out without damaging the stakes part, you wrote two paragraphs, not one.

## LYRICAL COMPRESSION
- **Cadence:** fragment + long breath + fragment. Comma as rest. Volta on the third clause.
- **Open:** image already in motion / body in specific posture / small journey with implication held back.
- **Vocab:** moment, lamp, road, shadow, glass, wrist, doorway, comma, breath.
- **Avoid:** mindful, presence, healing. Adjective stacks. Naming the feeling.
- **Signature:** image-image-twist / stillness-in-motion paradox / timed silence / paragraph break as volta.
- **Calibration:** at most one image per paragraph, used precisely. Never argument-bearing.

---

# MAINTENANCE

This document is the canonical voice reference. It is updated as the
editor learns from production runs of the stylist agent. Changes:

- 2026-05-04 — Initial library: 8 modes researched and synthesized from
  20+ reference figures across 4 parallel research agent runs.

When updating: keep the **pattern** as the unit of analysis. Add new
reference figures only when they expand the pattern (a new opening move,
a new failure mode, a new signature). Resist the urge to add modes —
8 is a working set; 12 is a thicket.
