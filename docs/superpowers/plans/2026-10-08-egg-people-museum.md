# Hidden letters · YOLO lab · People · YOLO museum — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Hide LEMONADE inside words, add a snack-detecting YOLO lab to `/playground`, extend People (04) with a photo wall + the TheOzzy card, and put a five-exhibit YOLO museum inside `/stack`.

**Architecture:** Shared model code moves to `lib/yolo.ts` (pure parts tested); secret spots are data + a pure splitter (`lib/secret.ts`) rendered by `SecretText`; new copy lives in `content.ts` (`PEOPLE`, `YOLO_MUSEUM`, `LAB` inside `PLAYGROUND`); museum exhibits are small client components under `components/home/museum/`.

**Tech Stack:** Next.js 16 · React · Tailwind v4 · vitest · onnxruntime-web (CDN, existing) · Pillow for the photo script

**Spec:** `docs/superpowers/specs/2026-10-08-egg-people-museum-design.md`

## Global Constraints

- No new npm dependencies. No push. Thai comments explaining *why*.
- Copy EN + TH in `lib/content.ts`; numbers on the page must be true (exhibits label synthetic vs real data).
- Secret spots identical in EN and TH, top → bottom: roles `LLM`[0], roles `Fine`[3], intro-1 `LLM`[2], metric-4 `Generation`[8], `Generation`[9], `Thailand`[2], `Thailand`[7], honesty `label`[3].
- Secret characters: no role, no tabIndex, look exactly like their text; only `cursor: pointer`; lit = yellow glow.
- Photos: EXIF dropped, sources stay in gitignored `tools/source/people/`.
- PhotoDetect must keep running live after the model-code move.

## Review Focus

1. **Secret letter inside a link-covered row** (honesty line sits under the counter, outside rows) — clicking a letter must never trigger navigation — browser check Task 2.
2. **Copy edits breaking the egg** — `splitSecret` throws on a missing word; tests cover both languages — Task 2.
3. **Huge or odd photos in the lab** (12 MP phone shots, PNG with alpha, non-image file) — letterbox handles any size; non-image → error message; object URLs revoked — Task 4.
4. **Esc inside the People lightbox** closes the photo, not the window — Task 3.
5. **Museum live exhibit before the model loads / if it fails** — sliders disabled until run; failure shows a message, no crash — Task 5.

---

### Task 1: `lib/yolo.ts`
- Create `lib/yolo.ts` (`COCO`, `loadOrt`, `getSession`, `letterboxGeometry`, `letterbox`, `iou`, `nms`, `decodeRaw`, `decode`), `tests/yolo.test.ts`; modify `components/PhotoDetect.tsx` to import.
- Tests first: `iou` identical 1 / disjoint 0 / half 1/3; `nms` keeps different classes, drops same-class overlap; `letterboxGeometry(284,459,640)` scale 640/459, dx centred; `(1000,500,640)` dy centred; `decodeRaw` on a 1×(4+80)×2 tensor returns candidates above floor with boxes mapped back; `decode` = decodeRaw → conf filter → nms.
- Verify: `npm test`, build, PhotoDetect live run in browser. Commit `Move the YOLO model code into lib/yolo`.

### Task 2: Letters inside words
- Create `lib/secret.ts` (`SECRET_SPOTS`, `splitSecret`), `components/SecretText.tsx`, `tests/home/secret.test.ts`; modify `SecretCode.tsx` (drop `SecretLetter`, keep provider + `useSecret`), `HomeShell.tsx` (drop L), `Hero.tsx` (roles, intro, metric 4), `Counter.tsx` (drop letters, honesty via SecretText), `globals.css` (`.secret-char`), `content.ts` locked hint.
- Tests first: both languages spell LEMONADE; join(segments) === text; missing word throws.
- Verify: unlock end to end in EN and TH; letter click doesn't navigate; screen-reader text intact (no extra buttons). Commit `Hide the LEMONADE letters inside the words`.

### Task 3: People photo wall + TheOzzy card
- Create `tools/people_assets.py`, `public/people/*.webp`, `components/home/PeopleWall.tsx`, `tests/home/content.test.ts` (People part); modify `content.ts` (`PEOPLE`, counter notes), `sections/Soft.tsx`, `sections/Path.tsx`.
- Verify: build; lightbox Esc closes photo only; 375 px. Commit `Add the people photo wall and move the TheOzzy card to People`.

### Task 4: YOLO lab in `/playground`
- Create `components/YoloLab.tsx`; modify `app/playground/page.tsx`, `content.ts` (`PLAYGROUND.lab`), tests for the verdict map (`labVerdict(dets)` pure in `lib/yolo.ts` or `lib/lab.ts`).
- Verify: real photo → boxes + verdict; non-image → error. Commit `Add the YOLO snack lab to the playground`.

### Task 5: YOLO museum in `/stack`
- Create `components/home/museum/{Museum,GridExhibit,IouExhibit,LetterboxExhibit,LiveExhibit,Timeline}.tsx`; modify `sections/Stack.tsx`, `content.ts` (`YOLO_MUSEUM`, stack note), content tests (timeline order, YOLO11 highlighted, EN/TH).
- Verify: each slider; live run; reduced motion; 375 px. Commit `Add a small YOLO museum to the stack window`.

### Task 6: Docs + full verification
- README (egg positions, People, lab, museum, `lib/yolo.ts`), SecretCode header comment.
- Verify everything in Global Constraints + Review Focus. Commit `Document the hidden letters, people wall, lab and museum`.
