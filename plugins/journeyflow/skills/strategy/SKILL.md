---
name: strategy
description: Turn Journeyflow insights into strategy, covering opportunities, approaches, dev specs, prioritisation, solutions, initiatives, key metrics, funnels, experiments and roadmap-style summaries. Use when the user asks what to do about the research, wants opportunities identified or prioritised, impact vs effort, How Might We statements, solution or approach ideas, dev specs, initiative or roadmap updates, success metrics, experiment design or results, or a strategic recommendation for a client.
---

# Strategy

Follow the `journeyflow-workspace` skill for finding the workspace, tool names and write confirmation.

## The model (research → delivery)

End-to-end chain to keep aligned:

`ResearchQuestion` → `Study` / `Insight` (with `polarity`) → `Opportunity` (HMW) → `OpportunityApproach` (explore/design directions) → `DevSpec` (build-ready spec) → updated `JourneyMap` / future state.

Core entities:

- `Opportunity`: `title`, `so_what`, `insight_ids`, `map_id` / `stage_id` / `card_id`, `impact`/`reach`/`confidence` (low, medium, high), `status` (open, exploring, addressed, parked), `priority_score`, `selected_approach_id`, `design_stage` (identified, exploring, designed).
- `OpportunityApproach`: concrete direction for an opportunity (`opportunity_id`, `title`, `description`, `design_notes`, `impact`/`effort`, `target_metric_id`, linked insights/cards). One opportunity may have several approaches; the opportunity can mark a `selected_approach_id`.
- `DevSpec`: handoff from strategy to build (`initiative_id`, `opportunity_id`, `source_approach_id`, `scope`, `out_of_scope`, `expected_behaviour`, `acceptance_criteria`, `status` draft/ready_for_dev/in_progress/delivered/parked).
- `Solution`: legacy/alternate idea record (`opportunity_ids`, `status` idea/concept/exploring/in_design/in_progress/tested/shipped/parked, `impact`/`effort`). Prefer `OpportunityApproach` for new work unless the user points at existing solutions.
- `Initiative`: body of work on a map; `status` values are client-specific — read existing initiatives before setting one. Links to cards, insights, tags.
- `KeyMetric`: journey-level measure (`map_id`, `is_goal`, `goal_value`, `goal_direction` up/down, `unit`, time series in `values`).
- `Metric` / `MetricValue` / `Funnel` / `FunnelStep`: initiative- and workspace-level measurement; link opportunities and approaches via `target_metric_id` where relevant.
- `TestCard`: experiment (`hypothesis`, `change_made`, `primary_metric_id`, `result` running/win/loss/inconclusive).
- `Placement`: where an insight, opportunity, solution or evidence sits on a map.
- `Tag` / `TagGroup`: cross-cutting labels on initiatives, insights and cards.

## Finding opportunities

1. Start from validated or high-confidence insights (especially `polarity: pain_point`), pain-point steps or a journey stage.
2. Write each opportunity as a How Might We framed by the user need, with a `so_what` saying why it matters to the user and the business.
3. Link `insight_ids` and place it on the map (`map_id`, `stage_id`, `card_id`). Check for existing similar opportunities first; suggest merging over duplicating.

## Prioritising

Score on `impact`, `reach` and `confidence`; confidence comes from the insights' evidence, not from enthusiasm. Present a table sorted by priority with one-line reasoning for each, and call out quick wins (high impact, low effort approaches) and big bets separately. Only write `priority_score` or `status` changes on approval.

## Approaches, specs and experiments

- Generate several `OpportunityApproach` records per opportunity at different effort levels. Link insights and target metrics.
- When an approach is chosen, set `selected_approach_id` on the opportunity and draft a `DevSpec` with acceptance criteria.
- For uncertain bets, propose a `TestCard`: *We believe <change> will <move metric> for <role/persona> because <insight>.* Name the primary metric and the baseline.

## Strategic summary

For a client-ready recommendation:

```
## The situation   – 2–3 sentences grounded in the journey and research
## What matters most – top 3–5 opportunities, each with its evidence and confidence
## What we recommend – approaches, dev specs and initiatives, sequenced (now / next / later)
## How we'll know – key metrics and goals
## Risks and unknowns – low-confidence areas and open research questions
```

Every claim traces back to an insight or metric in Journeyflow. Say where the evidence is thin.
