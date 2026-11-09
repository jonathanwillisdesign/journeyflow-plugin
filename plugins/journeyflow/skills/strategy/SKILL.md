---
name: strategy
description: Turn Journeyflow insights into strategy, covering opportunities, prioritisation, solutions, initiatives, key metrics, experiments and roadmap-style summaries. Use when the user asks what to do about the research, wants opportunities identified or prioritised, impact vs effort, How Might We statements, solution ideas, initiative or roadmap updates, success metrics, experiment design or results, or a strategic recommendation for a client.
---

# Strategy

Follow the `journeyflow-workspace` skill for finding the workspace, tool names and write confirmation.

## The model (insight → opportunity → solution → initiative)

- `Opportunity`: `title`, `so_what`, `insight_ids`, `source_insight_id`, `map_id` / `stage_id` / `card_id`, `impact`, `reach`, `confidence` (each low, medium or high), `status` (open, exploring, addressed, parked), `priority_score`.
- `Solution`: `title`, `opportunity_ids`, `status` (idea, concept, exploring, in_design, in_progress, tested, shipped, parked), `impact`, `effort`, `target_metric_id`, `target_direction`.
- `Initiative`: a body of work on a map. `status` values are client-specific, so read existing initiatives to learn them before setting one. Linked to cards, insights and tags.
- `KeyMetric`: a measure on a journey, with `is_goal`, `goal_value`, `goal_direction`, `unit`.
- `TestCard`: an experiment. `hypothesis`, `change_made`, `primary_metric_id`, `result` (running, win, loss, inconclusive).
- `Placement`: where an insight, opportunity, solution or evidence sits on a map.

## Finding opportunities

1. Start from validated or high-confidence insights, pain-point steps or a journey stage.
2. Write each opportunity as a How Might We framed by the user need, with a `so_what` saying why it matters to the user and the business.
3. Link `insight_ids` and place it on the map (`map_id`, `stage_id`, `card_id`). Check for existing similar opportunities first; suggest merging over duplicating.

## Prioritising

Score on `impact`, `reach` and `confidence`; confidence comes from the insights' evidence, not from enthusiasm. Present a table sorted by priority with one-line reasoning for each, and call out quick wins (high impact, low effort solutions) and big bets separately. Only write `priority_score` or `status` changes on approval.

## Solutions and experiments

- Generate several solution directions per opportunity, at different effort levels. Link `opportunity_ids` and a `target_metric_id`.
- For uncertain solutions, propose a `TestCard`: *We believe <change> will <move metric> for <persona> because <insight>.* Name the primary metric and the baseline.

## Strategic summary

For a client-ready recommendation:

```
## The situation   – 2–3 sentences grounded in the journey and research
## What matters most – top 3–5 opportunities, each with its evidence and confidence
## What we recommend – solutions and initiatives, sequenced (now / next / later)
## How we'll know – key metrics and goals
## Risks and unknowns – low-confidence areas and open research questions
```

Every claim traces back to an insight or metric in Journeyflow. Say where the evidence is thin.
