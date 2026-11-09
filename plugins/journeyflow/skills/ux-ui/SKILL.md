---
name: ux-ui
description: Turn Journeyflow research and journeys into UX and UI work, covering design needs, screen catalogue (pages, screens, modals), screenshots on journey steps, UX critique of screens, design system rules and the object model. Use when the user asks for design requirements or needs from research, a UX review or heuristic critique of a screen or flow, to attach Figma or screenshots to journey steps, to browse or organise the screen catalogue, or to check a design against the design system.
---

# UX/UI

Follow the `journeyflow-workspace` skill for finding the workspace, tool names and write confirmation.

## The model

- `DesignNeed`: requirement (`statement`, `category` information/guidance/efficiency/trust_reassurance/accessibility/control/feedback, `priority` must/should/could, `implication`). Scoped with **`role_id`** (applies in every scenario) or **`ris_id`** (one scenario only); link `step_ids` when scenario-scoped. Links: `insight_ids`, `evidence_link_ids`, `opportunity_ids`, `jtbd_ids`.
- `Place` / `PlaceFolder`: screen catalogue (`kind` page/screen/modal, `screenshot_uri`, `urls`, `affordances`, optional `object_ids` to `SystemObject`).
- `SystemObject`: named objects in the product model (`actions`, `relationships` to other objects) used when describing screens and flows.
- `Card` (journey step): `image_url` (thumbnail), `media` (images, screenshots, Figma, URLs; `place_id` links a catalogue screen without deleting the Place), `live_url`, `journey_media_id`, `channel`, `touchpoints`.
- `MediaAsset`: workspace image library (`url`, `contexts` where used: persona, step, insight, etc.).
- `DSSystem`, `DSSection`, `DSItem`, `DSEntry`, `DSLink`: design system. A `DSItem` is a rule: `level` (must, should, may, should-not, must-not), `statement`, `rationale`, examples, `token_refs`.
- `Comment`: team discussion on records (read for critique context; confirm before creating).

## Design needs from research

1. Start from a journey stage, scenario role (`RoleInScenario`), insights or opportunities.
2. Write each need as *Users need to … so that …*. It describes the need, not a UI solution ("needs to know how long approval takes", not "add a progress bar").
3. Pick one `category`. Set `priority` from insight severity and confidence: must for high-severity, well-evidenced pain.
4. Add an `implication`: what this means for design, and here a solution direction is fine.
5. Link the steps, insights and evidence it came from. Present as a table before creating.

## UX critique

For a screen (a `Place` screenshot, a step's `image_url` or `media`, a Figma frame or a URL):

- Anchor on the journey step and role: what is the user trying to do here?
- Check it against linked design needs and the research for that step, then against usability heuristics (status visibility, match to the user's language, control, consistency, error prevention and recovery, recognition over recall, accessibility).
- Check `DSItem` rules with `must` and `must-not` levels.
- Report issues worst first: what, why (evidence or rule), suggested fix. Separate evidence-backed issues from expert opinion.

## Screens and media

- Attach a screenshot: `upload_image`, then `attach_image` with entity `Card` (or `Insight`, `Persona`). Default **only-if-empty**; use `cover: true` on a card to set the step thumbnail. To replace existing media, pass `expected_updated_date` from the record you read.
- Prefer `media` items (and `MediaAsset` where reused) over only legacy `image_url`.
- Add to the catalogue: create a `Place` with `kind` and `urls`, inside the right `PlaceFolder`. Check for an existing `Place` with the same name first.
- With Figma available, export the frame and upload it rather than hot-linking.
