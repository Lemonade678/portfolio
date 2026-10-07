# Portfolio Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the single long home page into a hub ("Lemon's counter") whose six rows open section windows at their own URLs.

**Architecture:** Route group `app/(home)` with a persistent client shell (`HomeShell`) that draws the hub and owns language + easter-egg state; each window route wraps one section component (lifted unchanged from `app/page.tsx`) in `HomeWindow`. Pure routing/count helpers live in `lib/home.ts` and are unit-tested.

**Tech Stack:** Next.js 16 App Router · React · Tailwind v4 · vitest (already installed) · inline SVG

**Spec:** `docs/superpowers/specs/2026-10-08-portfolio-hub-design.md`

**Execution:** inline (executing-plans), owner's overnight auto-approve covers the plan gate.

## Global Constraints

- No new dependencies. No TypeScript → JS changes. No `git push`.
- Palette unchanged; annotation boxes and clickable affordances use yellow (`--color-yellow`).
- Copy for existing sections, numbers and projects is untouched; new copy (counter, passions, window chrome) is EN + TH in `lib/content.ts`.
- Secret letters: L (top bar), E (name), M (above metrics), O N A D E (right end of counter rows 01–05), in DOM and visual order top → bottom.
- Language travels as `?lang=th`; default English.
- Thai comments explaining *why*, matching the repo's style.
- `/ozzy`, `/playground` untouched.

## Review Focus

1. **Old anchor links** (`/#work`, `/#contact`, `/?lang=th#proof`): land in the right window / scroll to outro, language kept — browser check in Task 3.
2. **Easter egg across the new layout**: L→E pressed in order on the hub unlocks `/playground`; pressing a letter doesn't also follow the row link — browser check in Task 4.
3. **Keyboard-only use**: Tab reaches every row link and secret letter; Esc closes; focus returns to the opener — browser check in Task 3/4.
4. **Window content that relied on page scroll** (Reveal animations, signature reveal, credential tabs) still appears inside a scrolling window — browser check in Task 3.
5. **Narrow screens** (375 px): no horizontal scroll on hub or any window; counter rows don't overflow with Thai copy — browser check in Task 6.

---

### Task 1: Window registry, helpers, and HOME copy

**Files:**
- Create: `lib/home.ts`, `tests/home/home.test.ts`
- Modify: `lib/content.ts` (append `HOME`), `vitest.config.mts` only if the include glob misses `tests/home` (it is `tests/**/*.test.ts` — no change expected)

**Interfaces:**
- Produces: `type WindowId = "work" | "proof" | "stack" | "soft" | "path" | "passions"`; `HOME_WINDOWS: readonly WindowId[]`; `windowFromHash(hash: string): WindowId | null`; `neighbours(id: WindowId): { prev: WindowId | null; next: WindowId | null }`; `counts(): Record<WindowId, number>`; `withLang(path: string, lang: Lang): string`
- Produces: `HOME` in `lib/content.ts` with `windows: Record<WindowId, { n: string; nav: L10n; title: L10n; note: L10n; unit: L10n; snack: SnackId; secret?: number }>`, `counter: { detecting, labelled, honesty, open }`, `window: { close, prev, next }`, `passions: { intro?, cards: { id, title, body, links: { href, label }[] }[], outro }`; `type SnackId = "tteok" | "bread" | "pancakes" | "dango" | "roll" | "lemonade"`

- [ ] **Step 1: Write the failing tests** — `tests/home/home.test.ts`:
  - `HOME_WINDOWS` equals `["work","proof","stack","soft","path","passions"]`
  - `windowFromHash("#work")` → `"work"`; `("work")` → `"work"`; `("#contact")` → `null`; `("#nope")` → `null`; `("")` → `null`; `("#Passions")` → `null` (case-sensitive, ids are lowercase)
  - `neighbours("work")` → `{ prev: null, next: "proof" }`; `neighbours("passions")` → `{ prev: "path", next: null }`
  - `counts()` → work `PROJECTS.length`, proof `CREDENTIALS.length`, stack = sum of the three `STACK` groups' items (26), soft `SOFT_SKILLS.length`, path `TIMELINE.length`, passions `3`
  - `withLang("/work","th")` → `"/work?lang=th"`; `withLang("/work","en")` → `"/work"`; `withLang("/","th")` → `"/?lang=th"`
  - every `HOME.windows[id]` has non-empty `en` and `th` for `title`, `note`, `unit`, `nav`; rows 01–05 carry `secret` 3,4,5,6,7 in order; passions has none
- [ ] **Step 2: Run** `npx vitest run tests/home` — Expected: FAIL (module `@/lib/home` not found)
- [ ] **Step 3: Implement** `lib/home.ts` and the `HOME` block (titles reuse `UI.sections.*`, nav reuses `UI.nav.*`; passions title "Passions"/"สิ่งที่ผมหลงใหล", nav "Passions"/"แพชชั่น"; units: projects/โปรเจกต์, documents/เอกสาร, tools/เครื่องมือ, stories/เรื่อง, stops/จุด, passions/อย่าง)
- [ ] **Step 4: Run** `npm test` — Expected: PASS, previous 50 + new tests
- [ ] **Step 5: Commit** `Add the home window registry and hub copy`

### Task 2: Lift sections out of `app/page.tsx` (no visual change)

**Files:**
- Create: `components/home/ui.tsx` (`t`, `accentVar`, `useReveal`, `Reveal`, `CHIP`, `SOFT_ACCENTS`, `CardLink`, `Field`, `SectionHead`), `components/home/sections/{Work,Proof,Stack,Soft,Path,Outro}.tsx`, `components/home/Hero.tsx` (hero + metrics), `components/home/ContactCards.tsx`, `components/home/Signature.tsx`
- Modify: `app/page.tsx` → composes the lifted pieces in the same order

**Interfaces:**
- Produces: every section as `({ lang }: { lang: Lang }) => JSX`; `SectionHead({ n, secret?, title })` unchanged; `Hero({ lang, menuHref?: (href: string) => string })`
- [ ] **Step 1:** Move code verbatim (markup and classes unchanged; imports adjusted). `SectionHead` keeps its `secret` prop for now.
- [ ] **Step 2: Verify** `npx tsc --noEmit -p .` clean · `npm run build` PASS · browser: `/` looks identical (spot-check hero, project card, credentials tabs, timeline, signature) and LEMONADE still unlocks
- [ ] **Step 3: Commit** `Split the home page into section components`

### Task 3: Route group, shell, window, and window routes

**Files:**
- Create: `app/(home)/layout.tsx` (server, renders `HomeShell`), `app/(home)/page.tsx` (`return null`), `app/(home)/{work,proof,stack,soft,path,passions}/page.tsx` (metadata title + `<HomeWindow id>` + section), `components/home/HomeShell.tsx`, `components/home/HomeWindow.tsx`
- Delete: `app/page.tsx`
- Modify: `app/globals.css` (window + backdrop styles, `.home-*` names)

**Interfaces:**
- Consumes: Task 1 helpers + `HOME`; Task 2 sections
- Produces: `useHome(): { lang; setLang; href(path): string; setOpener(id: string | null) }`; `<HomeWindow id: WindowId>{children}</HomeWindow>`
- Shell behaviour: lang from `?lang` on mount (replaceState on toggle, like `/ozzy`); `document.documentElement.lang`; hub wrapper `inert` when pathname ≠ `/`; hash redirect (`windowFromHash(location.hash)` → `router.replace(withLang("/"+id, lang))`; `#contact` → scroll to `#contact`); focus returns to opener on open→closed transition.
- Window: dialog/aria-modal, heading focused, Esc (unless `defaultPrevented`) / ✕ / backdrop mousedown → `router.push(href("/"))`; footer prev/next from `neighbours`; title bar = `Snack` placeholder (emoji until Task 4) + `HOME.windows[id].n` + title.
- Passions route renders a temporary one-line placeholder until Task 5 (ledger it).
- [ ] **Step 1:** Implement; hub temporarily shows the counter as a plain list of six links (real counter in Task 4); secret letters O N A D E move from `SectionHead` to that list's rows (`SectionHead` inside windows no longer renders letters).
- [ ] **Step 2: Verify** build lists `/`, `/work` … `/passions`; browser: each window by link and by deep link; Esc/✕/backdrop/Back; focus returns; `?lang=th` survives open/close/prev/next; `/#proof` and `/?lang=th#stack` redirect; `/#contact` scrolls; Reveal content, credential tabs and signature visible inside windows / on hub
- [ ] **Step 3: Commit** `Open home sections as windows over the hub`

### Task 4: The counter and the snacks

**Files:**
- Create: `components/home/Counter.tsx`, `components/home/Snack.tsx`
- Modify: `components/home/HomeShell.tsx` (use `Counter`), `components/home/HomeWindow.tsx` (title-bar icon = `Snack`), `app/globals.css` (`.counter`, `.counter-row`, `.anno-box`, `.anno-tag`, scan keyframes, reduced-motion overrides)

**Interfaces:**
- Consumes: `HOME.windows`, `counts()`, `withLang`
- Produces: `<Snack id: SnackId className? />` (decorative, `aria-hidden`), `<Counter />`
- Row = `div.counter-row` > stretched `<a>` (row title is the link text; `::after` covers row) + `SecretLetter` with `position: relative; z-index: 2` at right end (rows 01–05).
- Scan: IntersectionObserver sets `data-scanned` once; CSS sweeps a line and reveals `.anno-box` with per-row `--i` delay; `prefers-reduced-motion` → boxes visible, no sweep. Caption switches "detecting…" → "6 items · hand-labelled" after the sweep (or immediately under reduced motion).
- [ ] **Step 1:** Draw six snacks (64×64, `#1a1310` 3px outlines, flat fills + one highlight): tteok (two golden blocks + butter pat), bread (scored loaf), pancakes (four discs + syrup + butter), dango (pink/white/green on a stick), roll (spiral cross-section), lemonade (glass + lemon slice + straw).
- [ ] **Step 2:** Build the counter rows, honesty line, and wire them into the hub.
- [ ] **Step 3: Verify** build · browser: hover/focus box goes solid; scan runs once; reduced motion (matchMedia override) shows boxes immediately; clicking a secret letter doesn't navigate; L E M O N A D E in order unlocks `/playground`; keyboard Tab order = row link then its letter
- [ ] **Step 4: Commit** `Add the snack counter menu with hand-labelled boxes`

### Task 5: Passions window and window-chrome polish

**Files:**
- Create: `components/home/sections/Passions.tsx`
- Modify: `app/(home)/passions/page.tsx`, `components/home/HomeShell.tsx` (desktop nav → window links incl. passions)

**Interfaces:**
- Consumes: `HOME.passions`
- [ ] **Step 1:** Three cards (Language / Food & drinks / Tech) with the spec's facts and links (internal links via `href()`; external with `CardLink`), closing line.
- [ ] **Step 2: Verify** build · browser EN + TH; links go where the spec says; prev/next from Path → Passions → (none)
- [ ] **Step 3: Commit** `Add the passions window`

### Task 6: Docs and full verification

**Files:**
- Modify: `README.md` (structure table, new "หน้าหลักแบบ hub" section: routes, counter, honesty line, snack/pun table, easter-egg positions, preview-file note), `components/SecretCode.tsx` header comment (letter positions), `lib/content.ts` `PLAYGROUND.locked` only if the hint stops being true (expected: still true)
- [ ] **Step 1:** Write docs.
- [ ] **Step 2: Verify** `npm test` · `npx tsc --noEmit -p .` · `npm run build` · browser 375 px over hub + six windows (no horizontal scroll) · PhotoDetect runs · `/ozzy` and `/playground` still fine
- [ ] **Step 3: Commit** `Document the home hub`
