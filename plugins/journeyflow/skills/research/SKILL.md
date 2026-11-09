---
name: research
description: Plan studies, synthesise sessions, manage evidence and themes, and write evidence-backed insights in Journeyflow, including Dovetail imports and research questions. Use when the user asks to plan research, write a discussion guide, synthesise interviews or usability tests, turn evidence into insights, check how strong an insight is, find what we know about a topic, track research questions, or sync Dovetail.
---

# Research

Follow the `journeyflow-workspace` skill for finding the workspace, tool names and write confirmation.

## The model

- `Study`: `name`, `method` (interview, usability_test, survey, analytics, competitor, desk_research, other), `goal`, `status` (planning, fieldwork, synthesis, closed), `research_questions` / `question_ids`, `user_type_ids`.
- `Session`: one participant session in a study. `participant`, `segment`, `consent`, `summary`, `notes`, `transcript`, `highlights`, `synthesised`.
- `Evidence`: one observation. `type` (quote, observation, metric, clip, artefact), `kind` (quote, observation, friction, win, wish), `content`, `so_what`, `session_id`, `study_id`, `theme_ids`. AI-suggested evidence has `origin: ai` and `ai_status` (suggested, kept, dismissed).
- `Insight`: `title`, `description`, `polarity`, `severity`, `confidence`, `status` (draft, validated, actioned, archived…). Linked to evidence by `EvidenceLink` (`role`: supports or contradicts, `strength`: weak, moderate or strong).
- `Theme`: a cluster of insights within a study.
- `ResearchQuestion`: `question`, `why_it_matters`, `status` (open, in_study, partly_answered, answered), `answer`, `priority`, `map_id` / `stage_id`.

## Planning a study

Start from open `ResearchQuestion` records (by priority, or tied to a journey). Propose: goal, method and why, who (user types, number of participants), and a discussion guide grouped by research question, with open, non-leading prompts. Create the `Study` with `status: planning` on approval.

## Synthesising

1. Read sessions with `synthesised: false` for the study. Work from `notes`, `highlights` and `summary`; read `transcript` only when needed.
2. Extract evidence: one observation per record, verbatim for quotes, with `kind` and a one-line `so_what`. Link `session_id` and `study_id`.
3. Group into themes, then write insights. An insight is a "so what" that would change a decision, not a restatement of a quote.
4. Link each insight to evidence with `EvidenceLink`, including contradicting evidence. Set `strength` honestly.
5. Set `confidence`: high means several sessions with strong support and no serious contradiction; low means one or two sources. Leave new insights at `status: draft` for the team to validate.
6. Mark sessions `synthesised: true` only after the user agrees.

## Answering "what do we know about X?"

`search_workspace` across insights and evidence, then `get_insight_context` on the best hits. Answer with insights first, each with its confidence and evidence count, then gaps. Separate what the evidence says from your interpretation. If an open `ResearchQuestion` covers it, say so.

## Dovetail

`list_dovetail_projects`, then `sync_dovetail_project` (`workspace_id`, `dovetail_project_id`, optional `study_id`). Re-syncing is safe.

## Rules

- Never fabricate or paraphrase quotes into quotation marks.
- Respect `Session.consent` and `delete_by`; don't surface participant names outside the team.
- Prefer marking evidence `ai_status: dismissed` over deleting it.
