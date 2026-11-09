---
name: ux-ui
description: Turn Journeyflow research and journeys into UX and UI work, covering design needs, screen catalogue (pages, screens, modals), screenshots on journey steps, UX critique of screens, and design system rules. Use when the user asks for design requirements or needs from research, a UX review or heuristic critique of a screen or flow, to attach Figma or screenshots to journey steps, to browse or organise the screen catalogue, or to check a design against the design system.
---

# UX/UI

Follow the `journeyflow-workspace` skill for finding the workspace, tool names and write confirmation.

## The model

- `DesignNeed`: a requirement for design. `statement`, `category` (information, guidance, efficiency, trust_reassurance, accessibility, control, feedback), `priority` (must, should, could), `implication`, and links: `step_ids`, `insight_ids`, `evidence_link_ids`, `opportunity_ids`, `jtbd_ids`.
- `Place`: an entry in the screen catalogue. `name`, `kind` (page, screen, modal), `affordances`, `screenshot_uri`, `urls`, `folder_id` (`PlaceFolder`).
- `Card` (journey step): `image_url`, `media`, `live_url`, `channel`, `touchpoints`.
- `DSSystem`, `DSSection`, `DSItem`: the design system. A `DSItem` is a rule: `level` (must, should, may, should-not, must-not), `statement`, `rationale`, examples, `token_refs`.

## Design needs from research

1. Start from a journey stage, an insight set or opportunities.
2. Write each need as *Users need to … so that …*. It describes the need, not a UI solution ("needs to know how long approval takes", not "add a progress bar").
3. Pick one `category`. Set `priority` from insight severity and confidence: must for high-severity, well-evidenced pain.
4. Add an `implication`: what this means for design, and here a solution direction is fine.
5. Link the steps, insights and evidence it came from. Present as a table before creating.

## UX critique

For a screen (a `Place` screenshot, a step's `image_url`, a Figma frame or a URL):
- Anchor on the journey step and persona: what is the user trying to do here?
- Check it against linked design needs and the research for that step, then against usability heuristics (status visibility, match to the user's language, control, consistency, error prevention and recovery, recognition over recall, accessibility).
- Check `DSItem` rules with `must` and `must-not` levels.
- Report issues worst first: what, why (evidence or rule), suggested fix. Separate evidence-backed issues from expert opinion.

## Screens and media

- Attach a screenshot to a step: `upload_image`, then `attach_image` with the card ID. The first image becomes the step thumbnail.
- Add to the catalogue: create a `Place` with `kind` and `urls`, inside the right `PlaceFolder`. Check for an existing `Place` with the same name first.
- With Figma available, export the frame and upload it rather than hot-linking.
