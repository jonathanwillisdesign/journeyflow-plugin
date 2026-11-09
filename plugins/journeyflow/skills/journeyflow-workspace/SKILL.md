---
name: journeyflow-workspace
description: How to find, read and safely change data in Journeyflow through its MCP tools. Use whenever the user mentions Journeyflow, a journey map, journey steps or stages, insights, evidence, opportunities, personas, studies or a Journeyflow workspace, or asks to look something up in, add something to, or update Journeyflow.
---

# Working in Journeyflow

Journeyflow is Big Motive's journey-mapping and research tool. The `journeyflow` MCP server gives you its data, always as the signed-in user, with their permissions enforced. If its tools are missing or return an auth error, tell the user to connect **journeyflow** in their agent's MCP settings and sign in with their own Journeyflow account (per-user OAuth through Base44).

Tool names below are short forms: the server exposes them with an `invoke_` prefix (e.g. `get_journey_context` is `invoke_get_journey_context`).

## Orient before you act

1. **Find the workspace.** Almost everything is scoped to a workspace. If the user hasn't named one, query `Workspace` with `query_records` (fields `id`, `name`) and confirm which one they mean. Don't guess between several.
2. **Search before you query.** For a topic or phrase, use `search_workspace` (journeys, insights, evidence, opportunities) with the `workspace_id`. It returns IDs you can then read in full.
3. **Read context in one call where you can.**
   - A journey and its stages, steps and related records: `get_journey_context` with `journey_id`; narrow with `stage_ids` or `step_ids` for big maps.
   - Insights with their supporting and contradicting evidence: `get_insight_context` with up to 10 `insight_ids`.
4. **Fall back to records.** `list_entity_types` shows what is exposed; `describe_entity` gives fields and enums; `query_records` filters (default limit 50, maximum 5000, offset pagination with **no total count**). Ask for only the fields you need.

## Vocabulary

| User says | Entity |
|---|---|
| scenario, user story | `Scenario` |
| journey, journey map | `JourneyMap` (linked to a `Scenario` via `scenario_id`) |
| stage / phase | `Stage`, `Phase` |
| step, card | `Card` |
| role, swimlane | `Role`, `RoleInScenario` |
| insight | `Insight` |
| evidence, quote, highlight | `Evidence` (linked via `EvidenceLink` or insight arrays) |
| opportunity, HMW | `Opportunity`, `OpportunityApproach` |
| dev handoff | `DevSpec` |
| idea, solution (legacy) | `Solution` (being replaced by approaches) |
| persona, user type | `Persona`, `UserType`, `UserVariant` |
| study, research session | `Study`, `Session` |
| tag | `Tag`, `TagGroup` |
| screen catalogue | `Place`, `PlaceFolder` |
| system object | `SystemObject` |
| comment | `Comment` |

Check with `describe_entity` if a field you need isn't obvious; the schema evolves.

## Changing data

- Writes are real and visible to the whole team. Before `create_record`, `update_record`, `delete_record`, `attach_image`, `upload_image`, or `sync_dovetail_project`, state what you'll change (entity, record, fields) and get a yes, unless the user has just asked for exactly that change.
- Read the record first, then update only the fields that change.
- `update_record` supports guarded writes with `expected_updated_date`; if the record changed since you read it, the edit is refused. Never "work around" that by blind overwrites.
- Never delete without explicit confirmation naming the record.
- **Images:** `upload_image` (max 10MB), then `attach_image` on `Insight`, `Card` or `Persona`. Default is only-if-empty; set `cover: true` on a `Card` to set the step thumbnail as well as appending to `media`.
- **Dovetail:** `list_dovetail_projects`, then `sync_dovetail_project` with `workspace_id` and the project ID (optionally a `study_id`). Dovetail itself is read-only; sync **writes** evidence into the library. Re-syncing is safe; it upserts.

## Reporting back

Quote record names, not just IDs. When you summarise research, keep the line between what the evidence says and your own interpretation clear, and cite the evidence.
