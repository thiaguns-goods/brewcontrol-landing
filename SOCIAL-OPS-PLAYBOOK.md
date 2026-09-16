# BrewControl Social Ops Playbook

**Status:** canonical working document  
**Scope:** Instagram + Facebook Social Ops for BrewControl  
**Source of truth:** this file + Issue #43 for experiment execution/history  
**Last consolidated:** 2026-09-16

---

## 1. Purpose

This document exists so Social Ops does **not depend on chat memory, local notes, or one-off decisions**.

It records:

- what we have learned from real posts and real metrics;
- what must be done before publishing;
- what must not be done;
- current editorial logic;
- metrics that must be tracked;
- hypotheses still under test;
- mistakes already made so they are not repeated;
- the weekly operating cycle.

When a new lesson is validated, update this file. When a lesson is only a hypothesis, label it as such.

---

## 2. Core principle

### Content must feel like it came from someone who knows brewery operations, not from an agency generating SaaS ads.

The product is a consequence of the operational problem. The content should start from the problem, context, people, product proof or real brewery routine.

**Priority order:**

1. recognizable brewery problem;
2. real visual proof;
3. clear point;
4. human language;
5. BrewControl as the solution/context;
6. CTA only when useful.

---

## 3. What we learned from Week 1

### 3.1 Initial quantitative baseline

Period consolidated: 2026-09-08 to 2026-09-16.

#### Feed posts / carousels

| Date | Theme | Views | Reach | Interactions | Likes | Comments | Shares | Saves | Follows | Metricool engagement |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 08/09 | Goods → BrewControl transition | 244 | 87 | 11 | 7 | 3 | 1 | 0 | 0 | 12.64 |
| 10/09 | 5 operational pains | 68 | 29 | 2 | 2 | 0 | 0 | 0 | 0 | 6.90 |
| 11/09 | Integrated operation | 44 | 14 | 1 | 1 | 0 | 0 | 0 | 0 | 7.14 |

#### Reels

| Date | Theme | Views | Reach | Interactions | Likes | Comments | Shares | Saves | Avg watch time | Retention |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 09/09 | “Isso não começou como uma startup de software” | 39 | 25 | 6 | 5 | 1 | 0 | 0 | 8.846 s | 48.1% |
| 13/09 | “Onde está esse barril?” | 24 | 12 | 0 | 0 | 0 | 0 | 0 | 4.841 s | 14.3% |

#### Stories — 12/09

Metricool returned navigation signals for the three stories:

- taps forward: 68 / 52 / 37;
- taps back: 3 / 3 / 4;
- exits: 7 / 9 / 4.

The connector returned `0` for reach/impressions on these rows, so those two fields are **not considered reliable for this specific snapshot**. Do not infer performance from them until the data is reconciled.

### 3.2 Interpretations that are currently supported

- The first transition post clearly outperformed the next institutional carousels in reach, views and interactions.
- Repeating a polished institutional format did **not** sustain performance.
- The 09/09 Reel retained viewers substantially better than the 13/09 Reel.
- The 13/09 “Onde está esse barril?” execution had weak retention and zero interactions.
- Saves and follows were effectively absent in the observed pieces, which means the content is not yet proving itself as highly reference-worthy or account-growth content.
- Founder/history/origin content can work, but should not become the whole editorial strategy.

### 3.3 What is still only a hypothesis

Do **not** treat the following as proven yet:

- carousels are bad;
- Reels are always better;
- founder content is always best;
- 17:00–18:00 is permanently the best posting time;
- 3 posts/week is the optimal cadence;
- humor will always outperform educational content.

These are testable hypotheses, not permanent rules.

---

## 4. Critical lesson: semantic coherence

### Hard rule

> **THE OBJECT OF THE MESSAGE MUST MATCH THE DOMINANT VISUAL OBJECT.**

If the hook says **“Onde está esse barril?”**, the dominant visual must be a barrel, barrel fleet, barrel state/location, or a real BrewControl screen where that barrel is visibly the subject.

A beer glass is not an acceptable dominant visual for a barrel-tracking message.

### Examples

- talks about **barrel** → show barrel / barrel UI;
- talks about **draft machine** → show draft machine;
- talks about **tank** → show tank / production screen;
- talks about **route** → show delivery / route / logistics screen;
- talks about **inventory** → show ingredient stock / warehouse / relevant UI;
- talks about **financial flow** → show financial context, not generic beer imagery.

### Mandatory 1-second test

Before publishing, answer all four with **YES**:

1. Without reading the caption, can someone identify the subject in one second?
2. Is the main noun of the hook visible in the image/video or clearly represented in the UI?
3. Does the visual reinforce the message rather than merely decorate it?
4. Is there zero contradiction between copy and image?

Any **NO = publication blocked**.

---

## 5. Visual direction — what to do

### Prefer

- real BrewControl screens;
- real brewery environments;
- real barrels, tanks, ingredients, draft machines, warehouse, deliveries;
- real people when available;
- phone-shot footage when it helps authenticity;
- simple typography;
- direct visual hierarchy;
- one idea per piece;
- deliberate imperfection when the real scene is more credible than a synthetic polished scene;
- real screenshots and real recordings from the DEMO tenant when product proof is the goal.

### AI role

AI should primarily work **backstage**:

- research;
- hook ideation;
- script variants;
- caption editing;
- analytics;
- experiment design;
- cut suggestions;
- subtitles;
- planning.

If AI significantly alters or generates the public visual, declare it correctly in the platform metadata and apply a higher visual-review bar.

---

## 6. Visual direction — what not to do

Avoid by default:

- generic AI brewery scenes;
- fake industrial environments;
- visual metaphors that replace the actual subject;
- repetitive dark/copper/gold cinematic treatment on every post;
- excessive glow, glassmorphism and decorative atmosphere;
- stock-like beer glass imagery when the subject is operational;
- invented dashboards or fake product screens;
- logo flying in/out;
- artificial opening/closing sequences with no information value;
- dense layouts that look like campaign key art when a real product screen would explain more;
- using “beautiful” imagery that is semantically wrong;
- repeating the same visual template only because it is already available.

### Anti-“AI look” rule

If the first reaction is “this looks generated/designed” before “I understand the problem”, simplify the piece.

---

## 7. Editorial mix — current working model

This is the **V2 working allocation**, subject to weekly revision:

| Content family | Target share | Purpose |
|---|---:|---|
| Operational pain / POV / brewery humor | 35% | recognition + shares |
| Real product in use | 30% | proof + clarity |
| Human backstage / building in public | 20% | trust + narrative |
| Verified proof / case / result | 10% | credibility |
| Institutional / founder story | 5% | context, not repetition |

### Principle

The profile should not behave like a product brochure.

A useful test is:

> **Would a brewer send this post to another brewer even if BrewControl did not exist?**

If the answer is no, the piece needs a stronger idea.

---

## 8. Copy rules

### Do

- start with the operational tension;
- use the vocabulary of brewery routine;
- write like a person, not a SaaS landing page;
- keep one central idea;
- use specific nouns: barrel, batch, route, tank, delivery, warehouse, return;
- end with a real question when conversation is useful;
- make the BrewControl connection only after the problem is understood.

### Do not

- over-explain the product in every caption;
- repeat “integrated operation”, “single system”, “traceability” in identical structures;
- use generic claims such as “revolutionize your management”;
- make unverifiable performance claims;
- use long captions only because previous posts used long captions;
- force a link/CTA into every post;
- write a corporate conclusion after a good human hook.

### Preferred post structure

1. Hook / tension.
2. One short explanation.
3. Real proof or consequence.
4. Optional BrewControl connection.
5. One question or CTA.

---

## 9. Reels playbook

### Current preferred test format

- 6–12 seconds for single-problem product proof;
- 9:16;
- hook visible in the first 0–2 seconds;
- one action or one visual story;
- real interface or real physical context;
- no unnecessary intro;
- no artificial ending;
- readable without audio;
- audio can help, but the message must survive muted playback.

### Product Reel example

0–2 s: `Onde está esse barril?`  
2–8 s: real BrewControl navigation / barrel state / location / detail  
8–10 s: `A resposta não deveria estar no WhatsApp.`

### Reel metrics that matter

Primary:

- retention;
- average watch time;
- reach;
- views;
- shares;
- saves;
- interactions.

Secondary:

- likes;
- comments;
- reposts;
- >3-second view rate when available;
- follows generated by Reel when available.

---

## 10. Feed / carousel playbook

Carousels are **not banned**. The old repetitive institutional format is what is under review.

### Use a carousel when

- sequence adds meaning;
- comparison is useful;
- there is a process to unfold;
- the user benefits from saving/reference;
- multiple real screenshots are needed.

### Avoid a carousel when

- one real image communicates the point;
- slides merely restate the caption;
- the layout exists only to look polished;
- nine slides are being used because nine slides were used before.

### Feed metrics that matter

- reach;
- views;
- interactions;
- shares;
- saves;
- comments;
- likes;
- follows generated by post;
- Metricool engagement.

**Shares and saves carry more learning value than likes when the goal is useful industry content.**

---

## 11. Stories playbook

Stories should be used for:

- raw backstage;
- polls/questions;
- progress;
- quick product detail;
- before/after;
- real brewery context;
- directing attention to a new post without reproducing the whole post.

### Story metrics

- reach;
- impressions;
- replies;
- exits;
- taps back;
- taps forward.

### Interpretation

- high taps forward can mean normal progression **or** low interest; read alongside exits/replies/reach;
- taps back can signal interest or confusion;
- replies are high-value qualitative feedback;
- do not draw conclusions from broken/missing reach/impression rows.

---

## 12. Account-level metrics

Track weekly:

- followers total;
- followers gained;
- followers lost;
- account reach;
- account views;
- accounts engaged;
- average reach per post;
- average reach per Reel;
- aggregated post engagement;
- aggregated Reel engagement;
- total interactions;
- post shares;
- Reel shares.

Do not optimize only for follower count. A small niche B2B account can create business value with relatively small reach if the right brewery operators are interacting.

---

## 13. Cross-channel measurement

Social does not end inside Instagram.

Use GA4 / website data to track:

- sessions by source / medium;
- landing page;
- engagement rate;
- conversions;
- campaign/UTM when used;
- identifiable AI-assistant referrals;
- organic search traffic;
- social traffic to product/module/blog pages.

Initial cross-channel signal already observed in the SEO/GA4 work:

- identifiable ChatGPT referral sessions exist;
- Google organic and Bing organic sessions also exist.

Do not assume Instagram caused a website session without source/UTM evidence.

---

## 14. Metrics we do NOT rely on

Metricool currently marks some legacy fields as deprecated. Do not build the weekly scorecard around deprecated metrics such as old Instagram post impressions/video-view fields or deprecated profile/website click fields.

When a connector returns an anomalous zero or null, log the anomaly instead of converting it into a performance conclusion.

---

## 15. Publication gate — mandatory checklist

No post is auto-published until the gate passes.

### A. Semantic gate

- [ ] Main hook and dominant visual describe the same subject.
- [ ] Someone understands the topic in ~1 second.
- [ ] No decorative image contradicts the copy.

### B. Authenticity gate

- [ ] Real product / real brewery / real object used when available.
- [ ] No fake product screen.
- [ ] No fabricated customer/result.
- [ ] AI-generated/altered public visual is declared when required.

### C. Visual gate

- [ ] Mobile-readable.
- [ ] No unnecessary visual effects.
- [ ] Main subject is obvious.
- [ ] Branding does not overpower the content.
- [ ] No text collision with Instagram UI safe zones.

### D. Copy gate

- [ ] One central idea.
- [ ] No generic SaaS language.
- [ ] No unverified claim.
- [ ] Caption length justified by content.
- [ ] CTA/question is relevant, not forced.

### E. Product/privacy gate

- [ ] No real customer personal data.
- [ ] No secret/credential/internal-only data.
- [ ] Product state shown is real and safe.
- [ ] DEMO tenant preferred for product captures.

### F. Platform gate

- [ ] Correct format selected (POST / REEL / STORY).
- [ ] Correct cover/frame.
- [ ] Alt text where applicable.
- [ ] Correct timezone.
- [ ] Draft first when the format/strategy is new.
- [ ] No duplicate scheduled copy.

Any hard-gate failure blocks publication.

---

## 16. Weekly operating cycle

### Step 1 — Measure

Review the previous 7 days using Metricool + GA4.

Capture:

- best/worst content by reach;
- best/worst content by retention;
- shares/saves;
- comments/replies;
- follower movement;
- website sessions/conversions;
- unusual anomalies;
- qualitative feedback.

### Step 2 — Diagnose

For each piece, record:

- hook;
- format;
- dominant visual;
- content family;
- length;
- posting time;
- real vs synthetic visual;
- CTA;
- metrics.

Do not diagnose from one metric alone.

### Step 3 — Choose 2–3 hypotheses

Examples:

- real screen beats designed key art;
- brewery POV humor generates more shares;
- shorter Reel improves retention;
- question-led post generates more comments;
- one-object visual improves comprehension.

### Step 4 — Produce

Prefer three distinct experiments over three visual variations of the same idea.

### Step 5 — Draft

New format/creative direction starts in Metricool as:

`draft=true`  
`autoPublish=false`

### Step 6 — QA

Run the publication gate above.

### Step 7 — Publish

Use Metricool timing recommendations as an input, not an immutable rule.

### Step 8 — Review after publication

Check early signal and final weekly signal. Do not delete or redesign a strategy based only on the first few hours unless there is a factual/brand error.

### Step 9 — Update this book

Only promote a hypothesis to a rule when evidence is repeated enough to justify it.

---

## 17. Current cadence — working hypothesis

Until more data exists:

- 3 primary pieces per week is the working test cadence;
- Stories can run between them;
- avoid consecutive posts with the same creative grammar;
- avoid consecutive founder/institutional pieces;
- alternate pain / product proof / human or humor.

This is not a permanent frequency rule.

---

## 18. Benchmarking other brands

We can copy **mechanics**, not literal creative assets or text.

Benchmark:

- hook structure;
- pacing;
- framing;
- meme grammar;
- content category;
- shot type;
- CTA style;
- edit rhythm;
- proof format.

Do not copy:

- exact copy;
- exact visual asset;
- trademarked creative execution;
- customer story/results we cannot verify;
- another brand’s product claim.

The goal is to adapt proven content mechanics to brewery operations.

---

## 19. Error log / lessons learned

| Date | Error / observation | Lesson | Permanent action |
|---|---|---|---|
| 08–11/09 | Repeated polished institutional carousel language lost momentum after the first post | novelty/history may work; repetition creates fatigue | diversify content grammar and reduce institutional frequency |
| 09–13/09 | Reel retention fell from 48.1% to 14.3% | a Reel is not automatically engaging; hook + visual execution matter | track retention and average watch time, not just views |
| 13/09 | “Onde está esse barril?” had weak response | subject must be immediately legible and operational | real object/product proof preferred |
| 16/09 | “Onde está esse barril?” creative used a beer glass as dominant object | visual-message mismatch damages credibility | **OBJECT OF MESSAGE = DOMINANT VISUAL OBJECT** hard gate |
| Week 1 | Several pieces shared dark/copper/cinematic/AI-like visual grammar | visual repetition makes the feed feel synthetic and tiring | real footage/screens become default; AI works backstage |
| Week 1 | Very low saves/follows | content is not yet consistently reference-worthy | create more utility, proof and shareable operational POV |
| 12/09 | Story connector returned 0 reach/impressions but navigation data | analytics connectors can be incomplete | log anomalies; do not invent conclusions |

---

## 20. Experiment log template

For every meaningful test, add an entry to Issue #43 or the successor experiment issue:

```md
### Experiment: <name>
Date:
Format:
Content family:
Hypothesis:
Hook:
Dominant visual:
Real/synthetic:
Duration/slides:
Publish time:

Results after weekly window:
- Views:
- Reach:
- Interactions:
- Shares:
- Saves:
- Comments:
- Follows:
- Avg watch time:
- Retention:
- Website sessions/conversions if attributable:

Decision:
- KEEP / ITERATE / DROP / INCONCLUSIVE

Lesson to promote to playbook:
```

---

## 21. Governance

- GitHub is the source of truth for this playbook.
- Issue #43 stores campaign/experiment execution history.
- Metricool is the scheduling + social analytics source.
- GA4 is the website behavior/conversion source.
- Content publication remains subject to human review when required by the active campaign gate.
- No artificial engagement, fake traffic, fake testimonials or fabricated customer data.
- No auto-publishing of a new creative pattern before its first QA pass.

---

## 22. Next learning priorities

1. Test real product screen vs designed key art on the same type of operational problem.
2. Test short operational POV/humor for shares.
3. Test 6–12 s real-product Reel for retention.
4. Increase save-worthy utility content without returning to long institutional carousels.
5. Establish reliable UTM/source attribution from social to landing/blog/module pages.
6. Recover/persist real DEMO video assets so product Reels do not depend on static screenshots.
7. Track whether V2 improves retention, shares, saves and profile/site intent over the Week 1 baseline.

---

## 23. One-line rule

> **Real problem. Real object. Real product. One clear idea. Measure the result. Learn. Update the book.**
