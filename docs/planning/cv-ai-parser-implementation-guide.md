# CV AI Parser – Implementation Guide

**Codename:** **JobFit Tailor**  
*A succinct name that conveys aligning a CV (“JobFit”) and the action of refining it (“Tailor”).*

---

## Overview
This guide breaks the delivery of the **JobFit Tailor** feature into practical, incremental phases that map directly to the architecture & performance docs. Each phase is deploy-able and keeps production stable.

---

## Phase 0 – Preparation & Feature Flags
| Step | Action | Owner |
|------|--------|-------|
| 0.1 | Create `IS_JOB_TAILORING_ENABLED` env flag in `lib/config.ts`. | BE |
| 0.2 | Branch off `feature/jobfit-tailor` & enable CI checks. | DevOps |
| 0.3 | Draft DB migration script (Phase 1) and open PR for review. | BE |

---

## Phase 1 – Data Layer
| Step | Task | File / Tool |
|------|------|-------------|
| 1.1 | Add `additional_context` **JSONB** column to `resumes` _(or new table `resume_contexts` with FK)_ | Supabase migration SQL |
| 1.2 | Extend `ResumeDatabase.saveResume()` / `updateResume()` to accept & persist the new object. | `lib/database.ts` |
| 1.3 | Create TypeScript type `UserAdditionalContext` & export in new `lib/types/jobfit.ts`. | — |
| 1.4 | Add seed data & migration tests. | Jest + Supabase CLI |

Rollback: migration wrapped in transaction; feature flag keeps code path unused until Phase 3.

---

## Phase 2 – Services
| Step | Task | Notes |
|------|------|-------|
| 2.1 | Implement **`jobSpecSchema`** in `lib/resume-parser/spec-schema.ts`. | Copy from architecture doc. |
| 2.2 | Build `jobSpecExtractor.ts` using `generateObject()` with Gemini, fallback regex. | Include Zod validation + retry. |
| 2.3 | Build `dynamicPromptGenerator.ts` – pure function that assembles prompt #3. | Unit-test with fixtures. |
| 2.4 | Build `tailorResume.ts` (LLM call for rewriting). | Respect streaming flag. |

All functions exported under `lib/jobfit/` for clarity.

---

## Phase 3 – API Orchestration
| Step | Task | File |
|------|------|------|
| 3.1 | Duplicate existing route → `app/api/parse-resume/legacy.ts` (no changes). | — |
| 3.2 | Create `app/api/parse-resume-enhanced/route.ts`. | Import services from Phase 2. |
| 3.3 | Accept multipart form fields: `jobSpecFile`, `jobSpecText`, `tone`, `extraPrompt`. | Validate lengths. |
| 3.4 | Run resume parsing & job-spec extraction **in parallel** (`Promise.all`). | — |
| 3.5 | Call `tailorResume` with streaming support. | SEE Performance Appendix §2. |
| 3.6 | Persist all artefacts & return streamed tailored output. | `ResumeDatabase` |

Feature flag guards route export: `export const dynamic = IS_JOB_TAILORING_ENABLED ? 'auto' : 'force-static'`.

---

## Phase 4 – Front-End Touchpoints (Minimal)
| Step | Task | Component |
|------|------|-----------|
| 4.1 | Update uploader form to add Job Spec file/text, tone radio, extraPrompt textarea. | `resume-uploader/` |
| 4.2 | Switch fetch URL based on flag (`/api/parse-resume-enhanced`). | `useResumeUploader` hook |
| 4.3 | Handle streaming response → display progress bar. | `resume-editor` |

No Tailwind additions; follow CSS Modules rule.

---

## Phase 5 – Observability & Performance
| Ref | Action |
|-----|--------|
| PA-1 | Wrap every LLM call with OpenTelemetry span: `llm.parseResume`, `llm.extractSpec`, `llm.tailor`. |
| PA-2 | Integrate **Redis KV** for caching (`quick-lru` fallback) as in Performance Appendix §3. |
| PA-3 | Add rate-limit middleware (e.g. `@upstash/ratelimit`) keyed by user. |
| PA-4 | Stress-test streaming via k6 script. |

---

## Phase 6 – QA & Roll-out
| Step | Task |
|------|------|
| 6.1 | Write E2E tests (Playwright) uploading fixtures for resume + job-spec. |
| 6.2 | Canary deploy with flag **off** – ensure nothing breaks. |
| 6.3 | Turn flag **on** for internal testers → monitor latency & cost. |
| 6.4 | Gradual % rollout → 100 %. Remove legacy route after 2 weeks of stability. |

---

## Phase 7 – Post-Launch Improvements (Backlog)
1. **Skill Gap Highlighting** – colour-code missing skills for user review.  
2. **Multi-Spec Tailoring** – allow batch generation for multiple roles.  
3. **Prompt Marketplace** – user-saved tone templates.

---

### Responsibility Matrix (RACI)
| Task | BE | FE | DevOps | QA |
|------|----|----|--------|----|
| Phases 1–3 | R | A/C | C | C |
| Phase 4 | C | R | C | C |
| Phase 5 | R | C | R | C |
| Phase 6 | C | C | R | R |

*(R = Responsible, A = Accountable, C = Consulted)*

---

## Done-Definition Checklist
- [ ] Tests (unit, integration, E2E) pass.  
- [ ] LLM output 100 % Zod-validated.  
- [ ] Streaming response < 1 s first byte.  
- [ ] Cache hit-rate ≥ 40 % after 1 week.  
- [ ] Docs updated & diagrams render on GitHub.

---

**JobFit Tailor** brings intelligent, role-aligned resume rewriting to our platform while respecting robustness, performance, and developer ergonomics.