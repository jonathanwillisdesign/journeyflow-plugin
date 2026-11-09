---
name: research
description: Plan studies, synthesise sessions, manage evidence and themes, and write evidence-backed insights in Journeyflow, including Dovetail imports and research questions. Use when the user asks to plan research, write a discussion guide, synthesise interviews or usability tests, turn evidence into insights, check how strong an insight is, find what we know about a topic, track research questions, or sync Dovetail.
---

# Research

Follow the `journeyflow-workspace` skill for finding the workspace, tool names and write confirmation.

## The model

- `ResearchQuestion`: backlog item (`question`, `why_it_matters`, `status` open/partly_answered/answered, `priority`, `study_ids`, `map_id`, `card_ids`, `in_study` flag). Workflow starts here, then studies, then insights.
- `Study`: `name`, `method` (interview, usability_test, survey, analytics, competitor, desk_research, other), `goal`, `status` (planning, fieldwork, synthesis, reporting, closed), `mode` (question_led, freeform), `question_ids`, `user_type_ids`, `variant_ids`, `guide_sections`.
- `Session`: participant session (`consent` none/recording/recording_and_quotes, `delete_by`, `summary`, `note_items`, `highlights`, `transcript` / `transcript_uri`, `synthesised`).
- `Evidence`: observation (`type` quote/observation/metric/clip/artefact; `format` quote/observation; `category` for synthesis). Legacy `kind` (quote, observation, friction, win, wish) may still appear. AI suggestions: `origin: ai`, `ai_status` suggested/kept/dismissed. Link `theme_ids` (preferred) not legacy string `themes`.
- `Insight`: `title`, `description`, `polarity` (pain_point, delighter, neutral), `confidence` (low, medium, high), `status` (draft, validated, actioned, archived, plus legacy backlog/in_progress/completed), `supporting_evidence_ids` / `contradictory_evidence_ids` and/or `EvidenceLink` (`role` supports/contradicts, `strength` weak/moderate/strong).
- `Theme`: study-scoped cluster (`study_id`, `name`, `evidence_ids`, `insight_ids`, `status` suggested/active/merged/archived).

## Planning a study

Start from open `ResearchQuestion` records (by priority, or tied to a journey). Propose: goal, method and why, who (user types and variants, number of participants), and a discussion guide grouped by research question, with open, non-leading prompts. Create the `Study` with `status: planning` on approval and link `question_ids`.

## Synthesising

1. Read sessions with `synthesised: false` for the study. Work from `note_items`, `highlights` and `summary`; read `transcript` only when needed.
2. Extract evidence: one observation per record, verbatim for quotes, with `format`/`category` and a one-line `so_what`. Link `session_id` and `study_id`.
3. Group into `Theme` records, then write insights. An insight is a "so what" that would change a decision, not a restatement of a quote. Set `polarity` honestly.
4. Link each insight to evidence (arrays and/or `EvidenceLink`), including contradicting evidence. Set `strength` honestly.
5. Set `confidence`: high means several sessions with strong support and no serious contradiction; low means one or two sources. Leave new insights at `status: draft` for the team to validate.
6. Mark sessions `synthesised: true` only after the user agrees.

## Answering "what do we know about X?"

`search_workspace` across insights and evidence, then `get_insight_context` on the best hits. Answer with insights first, each with its confidence and evidence count, then gaps. Separate what the evidence says from your interpretation. If an open `ResearchQuestion` covers it, say so.

## Dovetail

`list_dovetail_projects`, then `sync_dovetail_project` (`workspace_id`, `dovetail_project_id`, optional `study_id`). Confirm before sync: it writes into the evidence library. Re-syncing is safe.

## Rules

- Never fabricate or paraphrase quotes into quotation marks.
- Respect `Session.consent` and `delete_by`; don't surface participant names outside the team.
- Prefer marking evidence `ai_status: dismissed` over deleting it.
