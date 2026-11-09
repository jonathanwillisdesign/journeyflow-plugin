---
name: persona
description: Create, review, evidence and update personas, mindsets, archetypes, user types and jobs to be done (JTBD) in Journeyflow. Use when the user asks who the users are, wants a persona drafted from research, wants to check a persona is backed by evidence, compare personas, write JTBD statements, or update persona goals, needs, frustrations or behaviours.
---

# Persona

Follow the `journeyflow-workspace` skill for finding the workspace, tool names and write confirmation.

## The model

- `Persona`: `name`, `kind` (persona, mindset, archetype), `summary`, `quote`, `goals`, `needs`, `frustrations`, `behaviours`, `context`, `tags`, `image_url`.
- `UserType`: the segments research is tagged by (`Evidence.user_type_ids`, `Insight.user_type_ids`, `Study.user_type_ids`).
- `JTBD`: `situation`, `motivation`, `outcome`, `statement`, `evidence_link_ids`.

Personas carry no direct evidence links. Ground them through the matching `UserType`: query `Evidence` and `Insight` filtered by that `user_type_ids`.

## Drafting a persona from research

1. Agree the segment (user type, study or theme) and the `kind`. A mindset is behaviour-led and cuts across demographics; prefer it when the research shows attitudes rather than segments.
2. Pull evidence for that segment (quotes, frictions, wins, wishes) and the insights it supports.
3. Draft in chat:

```
**<Name>** (<kind>)
<summary, 2 sentences>
> "<real quote from Evidence, verbatim>"
Goals / Needs / Frustrations / Behaviours: 3 to 5 bullets each, each traceable to evidence
Context: <when and where they meet the service>
Sources: <evidence titles or IDs>
```

4. Only use real quotes, verbatim, from `Evidence` with `type: quote`. Never invent one. Check `Session.consent` is `recording_and_quotes` before quoting a named participant externally.
5. Create the `Persona` on approval.

## Reviewing a persona

For each goal, need and frustration: is there evidence for it? Report as supported, thin, or unsupported, and note evidence that contradicts it. Flag stereotypes and demographic detail that changes no design decision.

## JTBD

Write as: *When <situation>, I want to <motivation>, so I can <outcome>.* Keep the situation concrete, keep solutions out of the motivation, and link the evidence. One job per record.
