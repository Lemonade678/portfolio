# Portfolio hub — "Lemon's counter" (sub-project B)

**Status:** approved under the owner's overnight auto-approve ("ระหว่างนี้คือ auto approve") · built on branch `portfolio-hub` (from `ozzy-hub`) · nothing pushed

## 1. What the owner asked for, and what I assumed

**Said:**
- "ช่วยทำให้ของผม เป็น hub menu" — the portfolio should become a hub menu whose entries open their own windows, like the TheOzzy table.
- "ของผมเป็นแนว ขนม และ yolo สื่อถึงตัวผม" — the theme is snacks + YOLO, and it should say something about him.
- "ตอนนี้ผมมีแพชชั่น สามอย่าง ภาษา อาหารและเครื่องดื่ม tech" — three passions: language, food & drinks, tech.
- "ทำให้มันแบบดีกว่านี้หน่อย" — make it better than the current single long page.

**Assumed (owner can overturn in the morning):**
- "ขนม" points at his real shop already on the page (Kapimong — homemade butter tteok, pre-order Fridays), and "YOLO" at his computer-vision work (the YOLOv11 detector that already runs on his photo). The theme marries the two: a snack counter whose menu is *labelled like a detection dataset*.
- The site's audience is unchanged: recruiters and graduate labs first. The hub must not make the important facts harder to find.
- The palette stays. The four signal colours already read as snacks (butter yellow, strawberry pink, soda blue, cookie clay) and the README gives each one a job.
- Passions copy uses only facts already on the site. No invented feelings or hobbies.

**Success looks like:** a recruiter still sees name, roles, intro, the four headline numbers and the contact links without clicking; every section is one click away and has its own shareable URL; the LEMONADE easter egg still works and still reads down the right edge; the new "counter" makes someone smile.

## 2. Routes

The home page moves into a route group so the hub persists while windows open over it — the same pattern as `/ozzy`.

| Route | Content |
|---|---|
| `/` | Hub only |
| `/work` | 01 Selected work (the five project cards, unchanged) |
| `/proof` | 02 Proof you can check (credentials, unchanged) |
| `/stack` | 03 What I actually use (unchanged) |
| `/soft` | 04 How I work with people (unchanged) |
| `/path` | 05 Path so far (timeline + the TheOzzy "next run" card, unchanged) |
| `/passions` | 06 Language · Food & drinks · Tech (new) |

- `app/(home)/layout.tsx` renders `<HomeShell>`; `app/(home)/page.tsx` returns `null`; each window route wraps its section in `<HomeWindow id>`.
- `/ozzy` and `/playground` are untouched (they sit outside the group).
- **Language** lives in the URL like `/ozzy`: `?lang=th`, carried by every internal link. Default English.
- **Old anchors keep working:** on hub mount, `#work` `#proof` `#stack` `#soft` `#path` → `router.replace` to that window (keeping `?lang`). `#contact` scrolls to the outro on the hub, which keeps `id="contact"`.
- Each window route sets `metadata.title` (e.g. "Selected work · Nutt Bhanidch").

## 3. The hub (single column, top to bottom)

1. **Top bar** (sticky): NUTT. · secret **L** · desktop nav (now links to windows) · EN/TH.
2. **Cover art** (unchanged).
3. **Hero** (unchanged content): photo with the live YOLO button, name + secret **E**, roles, both intro paragraphs, the three destination buttons ("Selected work" now opens `/work`; Live demo; Shop), contact cards.
4. **Numbers**: secret **M** above the four metric cards (unchanged).
5. **The counter** (new, §4): six rows; secret letters **O N A D E** at the right end of rows 01–05.
6. **Outro** (`id="contact"`): heading, body, signature, contact cards — unchanged copy.

Single column on purpose: the easter egg's hint says "top to bottom" and the README says the letters read down the right edge. A grid would break both.

## 4. The counter — a menu board labelled like a training set

A glass display case (`.counter`) holding six shelves. Each shelf is one row:

```
┌ work · 5 ┐
│ [butter  │  01  Selected work                         5 projects  →   O
│  tteok]  │      Five projects, the numbers and the limits of each
└──────────┘
```

| Row | Window | Snack (inline SVG) | Pun | Count shown |
|---|---|---|---|---|
| 01 | work | butter tteok tray | his shop's product = his main work | `PROJECTS.length` projects |
| 02 | proof | proofed bread loaf | dough "proofs" | `CREDENTIALS.length` documents |
| 03 | stack | pancake stack | a stack | sum of `STACK` items tools |
| 04 | soft | dango (three mochi) | soft | `SOFT_SKILLS.length` stories |
| 05 | path | roll cake (spiral) | a path that winds | `TIMELINE.length` stops |
| 06 | passions | lemonade glass | Lemon | 3 passions |

- **Annotation box:** a yellow dashed rectangle around each snack with a class tag in the corner (`work · 5`), styled like a labelling tool. Yellow because the site's yellow means "clickable". Hover/focus: box turns solid, row lifts.
- **Scan on first view:** when the counter scrolls into view, a scan line sweeps the case once and boxes snap on row by row (≈1.2 s total). Caption "detecting… → 6 items · hand-labelled". Reduced motion: boxes shown immediately, no sweep.
- **Honesty line** under the case: EN "These boxes are hand-labelled, like a training set. The real model runs on my photo up top." / TH "กล่องพวกนี้ผมตีเองแบบ label ชุดเทรน — โมเดลจริงรันบนรูปผมข้างบน".
- **Markup:** each row is a `<div>` with one stretched `<a>` (its `::after` covers the row) so the secret `<button>` can sit above it — a button inside a link is invalid HTML.
- Snack art: one `Snack` component, six hand-drawn SVGs, 64×64 viewBox, thick `#1a1310` outlines, flat fills + one highlight. No images, no new dependencies.

## 5. Windows

Behaviour mirrors `/ozzy` (already tested there):
- `role="dialog"` + `aria-modal`, heading focused on open, hub behind is `inert`, focus returns to the row (or nav link) that opened it.
- Close: Esc · ✕ · backdrop click · browser Back. Close goes to `/` (keeping `?lang`).
- Window = fixed height (`100dvh − top bar − margin`) with a scrolling body; full screen under 640 px.
- Title bar: snack icon · section number · title · ✕.
- **Footer: previous / next window** ("← 02 Proof · 04 People →") so a reader can go through everything in order without returning to the hub — this replaces the long scroll's "just keep going".
- Max width 920 px (project cards are wide). Sticky top bar stays usable above the backdrop (language toggle works inside a window).

## 6. Passions window (new content, facts only)

Three cards, each built from facts already on the site:

| Passion | Body | Links |
|---|---|---|
| Language · ภาษา | Thai (native), English (TOEIC 885). Every line of this site exists in both. The LLM I fine-tuned interviews people in Thai. | `/proof` (TOEIC), live demo |
| Food & drinks · อาหารและเครื่องดื่ม | Kapimong — homemade butter tteok, pre-order Fridays. And yes, the nickname is Lemon. | the shop's Instagram |
| Tech | Computer vision, LLM fine-tuning, data pipelines — the three roles at the top of the page. | `/work`, `/stack` |

Closing line: "Where the three meet: a bilingual site, about a snack counter, labelled like a dataset." Copy lives in `content.ts` (EN + TH) so the owner can rewrite it in his own words.

## 7. Code structure

- `lib/home.ts` — window registry and pure helpers (tested):
  - `HOME_WINDOWS: readonly WindowId[]` in order `work proof stack soft path passions`
  - `windowFromHash(hash: string): WindowId | null`
  - `neighbours(id): { prev: WindowId | null; next: WindowId | null }`
  - `counts(): Record<WindowId, number>` from the content arrays
  - `withLang(path, lang)` → appends `?lang=th` for Thai
- `lib/content.ts` — new `HOME` block: per-window number, nav label, title (reuse `UI.sections` / `UI.nav`), one-line note, count unit (EN/TH), counter copy, passions copy, window close/prev/next labels.
- `components/home/` — `HomeShell.tsx` (lang, SecretProvider, opener focus, hash redirect, hub layout), `HomeWindow.tsx`, `Counter.tsx`, `Snack.tsx`, `ui.tsx` (shared helpers moved from `app/page.tsx`: `t`, `accentVar`, `Reveal`, `CHIP`, `CardLink`, `Field`, `SectionHead`), and `sections/` (`Work`, `Proof`, `Stack`, `Soft`, `Path`, `Passions`, `Outro`) — each lifted from `app/page.tsx` without changing its markup.
- `app/page.tsx` is deleted once its pieces live in `components/home/`.

## 8. Wording rules

- No claim the owner didn't make. Passions copy = recombined facts from the existing page.
- Boxes are called hand-labelled; the page never implies the counter was detected by a model.
- Section titles, numbers, project copy: untouched.

## 9. Testing

- **vitest** `tests/home/home.test.ts`: window order; `windowFromHash` (`#work` → work, `#contact` → null, `#nope` → null, empty → null, `work` without `#` → work); `neighbours` at both ends; `counts` equal the content array lengths; `withLang`; every window has EN+TH title, note and unit.
- **Build:** `npm run build` lists `/`, six window routes, `/ozzy/*`, `/playground`.
- **Browser:** each window via card, nav and deep link; Esc/✕/backdrop/Back; focus return; `?lang=th` survives; `/#proof` lands in the Proof window; LEMONADE unlocks the playground pressing L→E in order across hub; 375 px no horizontal scroll; reduced motion (no sweep); PhotoDetect still runs; signature still reveals.

## 10. Out of scope

- Redesigning `portfolio-preview.html` (stays the long single-file preview; README notes the difference).
- Sharing one `Window` component between `/` and `/ozzy` (possible later; different palettes and contexts now).
- Running the real detector on the counter (SVG snacks are not COCO photos; it would be unreliable — the photo already shows the real thing).
- New project content, new numbers, new photos.

## 11. Risks, said plainly

- **One more click for recruiters.** Mitigated by keeping hero + numbers + contacts on the hub, direct nav links, and prev/next inside windows. If the owner prefers the long page, `main` still has it — this branch is opt-in.
- **Hand-drawn SVG snacks** can look amateur. Kept simple and consistent (one outline weight, flat fills); worst case they're swapped for the owner's photos of real butter tteok later.
- **SEO:** section text moves to sub-URLs. Each window is server-rendered at its own URL with its own title, so it stays indexable.
