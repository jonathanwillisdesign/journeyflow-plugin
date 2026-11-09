---
name: journey
description: Read, brief, critique, build and update journey maps in Journeyflow, covering stages, phases, steps, pain points, emotions, touchpoints, channels and current vs future state. Use when the user asks to summarise or "catch me up on" a journey, review a map for gaps, draft a new or future-state journey, add or edit steps, or compare current and future journeys.
---

# Journey

Follow the `journeyflow-workspace` skill for finding the workspace, tool names and write confirmation.

## The model

- `JourneyMap`: `title`, `status` (draft, in_review, final), `state` (current, future), `paired_journey_id` (its current/future twin), `scenario_id`, `archived`.
- `Stage` (ordered columns, `order`) and `Phase` (a coloured span from `start_stage_id` to `end_stage_id`).
- `Card` is a step or note on the map. Key fields: `stage_id`, `row_id`, `order`, `type` (text, insight, question, decision, touchpoint, image, evidence), `perspective` (pain, opportunity, neutral), `severity`, `channel`, `touchpoints`, `thinking`, `feeling`, `emotion_level`, `actors`, `handoff` / `handoff_to`, `change_status` (new, updated, unchanged, idea for future-state), and links: `linked_insight_ids`, `linked_evidence_ids`, `linked_study_ids`.
- `EmotionPoint`: the emotion curve, a `value` per stage.

Read a whole map with `get_journey_context` (`journey_id`); for big maps go stage by stage with `stage_ids`.

## Briefing a journey

```
# <Journey>: briefing
<who, their goal, current/future, status, stage and step count>

## Stages at a glance
- <Stage>: <what happens>. Biggest pain: <step, severity>

## Emotional low points
## What the research says
- <Insight>: <so what>. Evidence: <n supporting / n contradicting>, best quote
## Opportunities
## Gaps
```

Keep to a page. Say plainly when a stage has no research behind it.

## Critiquing a journey

Check and report, worst first:
- Pain steps (`perspective: pain`, high `severity`) with no `linked_insight_ids` or `linked_evidence_ids`: assertions without evidence.
- Stages with no steps, or steps with no `channel` or touchpoint.
- Handoffs between actors with no `handoff_note`: where things get dropped.
- Emotion curve missing or flat where pain is high.
- Open `ResearchQuestion` records tied to this `map_id`.
- Future-state map: steps marked `new` or `updated` that don't trace to an opportunity or insight.

## Building or editing

1. Confirm workspace, persona or scenario, and whether this is current or future state.
2. Draft the stages and steps in chat as a table first (stage, step title, body, perspective, channel). Get agreement before writing.
3. Create in order: `JourneyMap`, then `Stage` records with `order`, then `Card` records with `stage_id` and `order`. Use `describe_entity` on `Card` first; required fields such as `row_id` can change.
4. For a future state, create a new map with `state: future`, set `paired_journey_id` both ways, and mark each step's `change_status`.
5. Never set `status: final` unless asked.
