---
name: journey-briefing
description: Produce a concise briefing on a Journeyflow journey map, covering its stages, key pain points, the insights and evidence behind them, and open opportunities. Use when the user asks to summarise, brief, explain, review or "catch me up on" a journey, or to prepare for a client session about one.
---

# Journey briefing

Use the `journeyflow-workspace` skill's conventions for finding the workspace and journey.

## Steps

1. **Pin down the journey.** If the user gave a name, find it with `search_workspace` (content type journeys) or `query_records` on `JourneyMap`. If several match, ask.
2. **Read the graph.** `get_journey_context` with the `journey_id`. For large maps, read stage by stage with `stage_ids`.
3. **Pull the research.** Collect insight IDs referenced by steps and read them with `get_insight_context` (batches of 10). Note where evidence contradicts an insight.
4. **Write the briefing** in this shape:

```
# <Journey name>: briefing
<one-paragraph overview: who, what goal, how many stages/steps>

## Stages at a glance
- <Stage>: <what happens, 1 line>, <biggest pain point if any>

## What the research says
- <Insight>: <so what>. Evidence: <n supporting, n contradicting, best quote>

## Opportunities
- <Opportunity>: <status / linked steps>

## Gaps
- Steps with no evidence, insights with thin or conflicting evidence, stages with no opportunities
```

Keep it under a page unless the user asks for more. Say plainly when a stage has no research behind it rather than filling the gap.
