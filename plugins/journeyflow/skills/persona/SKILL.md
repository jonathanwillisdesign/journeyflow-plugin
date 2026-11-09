---
name: persona
description: Create, review, evidence and update personas, mindsets, archetypes, user types, roles and jobs to be done (JTBD) in Journeyflow. Use when the user asks who the users are, wants a persona drafted from research, wants to check a persona is backed by evidence, compare personas or roles, write JTBD statements, or update persona goals, needs, frustrations or behaviours.
---

# Persona

Follow the `journeyflow-workspace` skill for finding the workspace, tool names and write confirmation.

## The model

Segments and storytelling:

- **`UserType`:** research segments (`Evidence.user_type_ids`, `Insight.user_type_ids`, `Study.user_type_ids`).
- **`UserVariant`:** finer segments under a user type when the workspace uses variants.
- **`Role`:** a named role on a user type (`user_type_id`, `description`, `jtbd_ids`, `session_ids`, `confidence` derived from sessions, `avatar_url`). Scenario-specific goals moved to `RoleInScenario`.
- **`RoleInScenario`:** how a role shows up in one scenario (`goal`, `success`, `constraints`, `is_primary`, handoffs to other roles, linked `insight_ids` / `opportunity_ids`).

Presentation records:

- **`Persona`:** `name`, `kind` (persona, mindset, archetype), `summary`, `quote`, `goals`, `needs`, `frustrations`, `behaviours`, `context`, `tags`, `image_url`, `colour`.
- **`JTBD`:** `situation`, `motivation`, `outcome`, `statement`, `role_ids`, `evidence_link_ids`.

Personas carry no direct evidence links. Ground them through the matching `UserType` or linked `Role`: query `Evidence` and `Insight` filtered by `user_type_ids`, and sessions tied to `Role.session_ids`.

## Drafting a persona from research

1. Agree the segment (user type, role, study or theme) and the `kind`. A mindset is behaviour-led and cuts across demographics; prefer it when the research shows attitudes rather than segments.
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

4. Only use real quotes, verbatim, from `Evidence` with `type: quote` (or `format: quote`). Never invent one. Check `Session.consent` is `recording_and_quotes` before quoting a named participant externally.
5. Create the `Persona` on approval; link roles and JTBD on the workspace role when the story is scenario-scoped.

## Reviewing a persona

For each goal, need and frustration: is there evidence for it? Report as supported, thin, or unsupported, and note evidence that contradicts it. Flag stereotypes and demographic detail that changes no design decision. Compare `Role` confidence (low/medium/high) with how much session data backs the role.

## JTBD

Write as: *When <situation>, I want to <motivation>, so I can <outcome>.* Keep the situation concrete, keep solutions out of the motivation, link `role_ids` and evidence. One job per record.
