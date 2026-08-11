---
name: interview-followup-review
description: Review interview-ready project stories from resumes, project notes, and user recollections. Use when users ask to prepare for interviews, identify resume claims likely to be challenged, practice interviewer follow-up questions, clarify metrics and personal contributions, or turn real experience into concise structured spoken answers without inventing facts.
---

# Interview Follow-up Review

Help the user turn real experience into an answer that remains credible under follow-up. Do not write a polished “standard answer” before collecting enough evidence.

## Non-negotiable rules

- Never invent metrics, actions, business context, job titles, personal ownership, or causal claims.
- Treat missing information as `待核实` (needs verification), not a gap to fill.
- Do not upgrade “participated in” or “supported” to “led.” Separate personal work, team work, and decisions made by others.
- Distinguish a percentage increase from a percentage-point increase.
- Do not claim an intervention caused a result unless the evidence supports causality. Prefer “同期观察到” or “可能相关” when appropriate.
- Use natural spoken Chinese; avoid buzzwords and excessive certainty.

## Workflow

### 1. Establish the target

Collect the target role and, if available, the JD. Identify the role-specific focus:

| Role | Prioritize follow-ups on |
| --- | --- |
| 产品 / AI 产品运营 | user scenario, product flow, adoption, capability boundaries, feedback loop, cross-functional work |
| 增长运营 | funnel, acquisition channel, experiment design, segmentation, retention, attribution |
| 内容运营 | topic rationale, supply mechanism, distribution, content metrics, platform differences |
| 市场 / GTM | target market, localization, channel, launch cadence, validation, competitive context |

### 2. Map the claims

Extract each resume or project claim into this structure:

`Context → Goal → Personal role → Actions → Metric/result → Evidence → Caveats → Reflection`

Flag claims needing follow-up:

- Metrics without a baseline, definition, timeframe, source, or unit.
- Broad verbs such as “负责”, “推动”, “搭建”, “优化”, or “主导” without concrete delivery.
- Result claims with no explanation of other concurrent factors.
- Team outcomes described as individual outcomes.
- Claims that use terms the user cannot explain.

Summarize the map before questioning. State risks neutrally: “当前缺少数据口径，面试官可能难以判断提升幅度。”

### 3. Run a layered interview

Ask one essential question per turn. Begin with the highest-risk claim and adapt the next question to the response.

Question order:

1. **Context** — What problem existed? Why did it matter? What stage was the project in?
2. **Goal and metric** — What exactly was measured? What were the numerator, denominator, baseline, and observation window?
3. **Actions** — What did the user personally do first? What artifact, analysis, decision, or coordination did they deliver?
4. **Attribution** — What else changed at the same time? Was there an experiment or only observational evidence?
5. **Ownership** — Which pieces were individual, collaborative, and decided by someone else?
6. **Reflection** — What failed, what was adjusted, and what would the user verify or change next time?

If an answer is vague, request one concrete example rather than rephrasing it into a claim. If the user does not remember, offer: `稍后核实` / `删除该数据` / `降低表述强度` / `先复盘下一项`.

### 4. Check consistency

Before generating output, compare the collected facts for conflicts in:

- Numbers, units, baselines, and time windows.
- Metric definitions and data sources.
- Project dates and sequence of actions.
- Personal ownership versus team contribution.
- Strength of attribution versus available evidence.

List unresolved items explicitly. Do not hide uncertainty in the final answer.

### 5. Produce interview artifacts

Only after the evidence is sufficient, provide the requested format:

- **Risk map:** claim, risk reason, likely follow-ups, and information to verify.
- **30-second / 1-minute / 2-minute spoken answer:** conclusion first, then context, role, 2–3 concrete actions, evidence, caveat, and reflection.
- **Follow-up bank:** group into basic, deep-dive, pressure, reflection, and role-match questions.
- **Evidence checklist:** confirmed, needs verification, avoid using, and lower-strength wording.
- **Resume revision:** show original claim, safer revision, reason for change, and evidence still needed.

## Spoken-answer template

Use this structure but do not expose it mechanically as English STAR headings:

1. “当时我们要解决的是……，目标是……”
2. “我的角色主要是……，我实际负责……”
3. “基于……的判断，我重点做了……和……”
4. “数据上我们观察到……。这个数据的口径是……；同期还有……，所以我不会把结果完全归因于单一动作。”
5. “如果再做一次，我会优先……”

## Output quality bar

Use concise paragraphs and bullets only where they improve scanning. Mark any missing evidence with `待核实` and offer the next best question. The final answer must sound like a candidate explaining a real project, not a report or a memorized script.
