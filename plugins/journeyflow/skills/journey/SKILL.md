---
name: journey
description: Read, brief, critique, build and update journey maps in Journeyflow, covering scenarios, stages, phases, steps, roles, pain points, emotions, touchpoints, channels and current vs future state. Use when the user asks to summarise or "catch me up on" a journey, review a map for gaps, draft a new or future-state journey, add or edit steps, or compare current and future journeys.
---

# Journey

Follow the `journeyflow-workspace` skill for finding the workspace, tool names and write confirmation.

## The model

Stories are organised at three levels:

- **`Scenario`:** the user story in the workspace (`name`, `situation`, `trigger`, `priority`, linked `evidence_ids` / `insight_ids`). Rank 1 drives the home screen.
- **`JourneyMap`:** one current or future map for that scenario (`scenario_id`, `state` current/future, `paired_journey_id`, `status` draft/in_review/final, `default_role_id` for new steps). List journeys via scenario, not as orphaned top-level maps.
- **`Role` / `RoleInScenario`:** workspace roles tied to a `UserType` (`Role.user_type_id`); scenario participation (`RoleInScenario`) holds swimlane order, primary role (emotion curve follows it), goals, constraints and handoffs between roles.

On the map:

- `Stage` (ordered columns) and `Phase` (coloured span from `start_stage_id` to `end_stage_id`).
- `Card` is a step. Key fields: `stage_id`, `row_id`, `order`, `type` (text, insight, question, decision, touchpoint, image, evidence), `perspective` (pain, opportunity, neutral), `severity` (low, med, high), `channel` (web, app, email, phone, in_person, other), `touchpoints`, `thinking`, `feeling`, `emotion_level`, `actors` (with `role_id` / `variant_id`), `handoff` / `handoff_to` / `handoff_note`, `change_status` (new, updated, unchanged, idea), `image_url` (thumbnail), `media` (structured items; may reference a `Place` via `place_id`), `journey_media_id`, and links: `linked_insight_ids`, `linked_evidence_ids`, `linked_study_ids`.
- `EmotionPoint`: curve points on a `row_id` per `stage_id` (`value` -2 to 2).
- `Actor` / `ActorPlacement`: legacy map-level actors; prefer role-based `Card.actors` where the map uses scenarios.

Read a whole map with `get_journey_context` (`journey_id`); for big maps go stage by stage with `stage_ids`.

## Briefing a journey

```
# <Journey>: briefing
<scenario, who, their goal, current/future, status, stage and step count>

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
- Handoffs between roles with no `handoff_note`: where things get dropped.
- Emotion curve missing or flat where pain is high (check primary `RoleInScenario` and `EmotionPoint` / step `emotion_level`).
- Open `ResearchQuestion` records tied to this map (`map_id` / `card_ids`).
- Future-state map: steps marked `new` or `updated` that don't trace to an opportunity, approach or insight.

## Building or editing

1. Confirm workspace, scenario, roles (`RoleInScenario`), and whether this is current or future state.
2. Draft stages and steps in chat as a table first (stage, step title, body, perspective, channel). Get agreement before writing.
3. Create in order: `Scenario` if needed, `JourneyMap` with `scenario_id`, then `Stage` with `order`, then `Card` with `stage_id` and `order`. Use `describe_entity` on `Card` first; required fields such as `row_id` can change.
4. For a future state, create a new map with `state: future`, set `paired_journey_id` both ways, and mark each step's `change_status`.
5. Never set `status: final` unless asked.
