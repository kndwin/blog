---
title: Resume
date: 2026-11-14
exclude: true
---

I ran the below script against the repos I've been working on and had an LLM (Claude / Gemini) summarise what I've done.
```bash
git log --author="$(git config user.name)" --since="1 year ago" --name-status --pretty=format:"%h - %an, %ar : %s" > my_commits_last_year.txt
```
## Toolbox

| Scope                      | Tech                                                                                                                                                                                     |
| :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**               | React (incl. React 19), TypeScript, Next.js, Vite, Tailwind CSS, shadcn/ui, Apollo Client, MDX, Web Extensions (WXT), TanStack Router, pdf.js                                                                     |
| **Backend**                | Node.js, Bun, Python, TypeScript, Postgres (OLTP), ClickHouse (OLAP), Redis, GraphQL, Prisma, Drizzle ORM, BullMQ, Effect 4 (GA) & Effect Schema, MySQL, DuckDB                                                              |
| **Cloud & Infrastructure** | **AWS:** ECS, ECR, RDS, ElastiCache, SQS, CloudFront, Route 53, S3, WAF, PrivateLink, IAM<br/>**Also:** EventBridge, Lambda (incl. container images)<br/>**IaC:** AWS CDK, Docker, Serverless, Pulumi, LocalStack<br/>**Platforms:** Vercel, Railway, Cloudflare, PlanetScale<br/>**Orchestration:** Kubernetes (EKS), Karpenter                |
| **AI & Data**              | **LLM Services:** Anthropic Claude, Google Gemini, Extend AI, OpenAI API, AWS Bedrock, OpenRouter<br/>**Techniques & Libraries:** OCR extraction, LLM evals, Clustering (HBDSCAN, K-Means), RAG, Dimension reduction (UMAP, PCA), Embedding (Tuning, Sentence-Transformers), Ensemble/consensus extraction, Shadow-mode rollout, Backtesting & replayable decisions, Entity resolution |
| **Observability & DevOps** | OpenTelemetry, Grafana, CloudWatch, GitHub Actions (OIDC), Blacksmith, Better Stack, Sentry, Nango                                                                                                                                |
| **Developer Tools**        | Nix, Vim, Tmux, Colima, Claude Code, Cursor, Opencode, WebMCP, tsgo/tsrs                                                                                                                                                                   |

## Speaking & Presentations
- **AI Engineer Sydney, Web Directions (Dec 2026, upcoming):** *"How We Introduced LLMs into Credit Decisioning (Safely)"* [[Speaker page]](https://webdirections.org/ai-engineer/speakers/kevin-nguyen/) [Slides: pending] — a 25-minute conference talk on taking credit assessment from a two-hour manual process to 20–30 minutes without giving up control: high-quality input via ensemble extraction, deterministic and replayable outcomes, and confidence iteration through shadow mode, per-rule feedback and zero tolerance for false positives. Built the animated slide deck myself.
- **Codex For Founders Sydney (Jun 2026):** Presented on agentic coding workflows and codebase design for AI agents at the Codex community event, Stone & Chalk Tech Central. [[Event]](https://luma.com/mlai-nrn7) [[Slides]](https://demo.getcave.ai/s/agentic-codebase-todo)
- **AWS Startup Dev Day Sydney (Sep 2025):** Co-presented *"Real-time analytics with Sauce AI and ClickHouse"* alongside ClickHouse Solutions Architect Johnny Mirza. [[Slides]](https://docs.google.com/presentation/d/1G-uBXJaQa7yHk3tR47r79eQzaFjiIALdUDl8JBmm_H4/edit?usp=sharing)
<img src="./assets/aws-talk.jpeg" alt="AWS Startup Dev Day Sydney 2025 Banner" width="300" style="border-radius: 8px; margin-bottom: 12px;"/>

## Work experience

### Skip - Senior Product Engineer (Jan 2026 - Current)

- **Led the engineering behind LEAP (Loan Evaluation Application Process)**, cutting end-to-end credit assessment from **~1–2 hours to ~20–30 minutes per application** while keeping human judgment where it matters.
- **Built 80+ automated credit rules** across identity, credit file, liabilities, expenses, income and serviceability, each moved from shadow/testing into production through a formal business sign-off process.
- **Shipped ~960 commits across two repos in 2026** — the rules engine, the document AI pipeline, an Effect platform migration, a next-generation assessor workspace, and suburb-based eligibility.
- **One of the main people representing Skip engineering externally**, through the engineering blog and conference talks (including AI Engineer Sydney 2026).

#### **Credit Decisioning Engine (LEAP)**

- **Architected and implemented an Automated Credit Decisioning Engine** in TypeScript: a rule registry with schema-validated inputs ("pods"), credit-decision REST routes, and a human override so assessors can override any rule's outcome without bypassing the audit trail.
- **Designed tiered, replayable outcomes** — beyond `PASS / FAIL / SKIP`, rules can return gate passes and flagged states that route to assessor review. Deterministic checks may PASS; anything an LLM reasoned about returns REVIEW. Runs, rules and actions are persisted as first-class tables for a durable audit trail, and live serviceability runs are pinned to a calculator version so every decision replays exactly.
- **Introduced declared rule sources** — each rule declares the data it depends on and fails explicitly (with typed, per-source errors) if a source didn't load, instead of silently passing. Context is gathered once per workflow with batched document lookups.
- **Porting the rule engine to Effect**, with namespaced sources and fixtures, a source schema derived from DB tables, and an **agent-friendly evaluation CLI** that runs the engine end to end — used by both engineers and coding agents, and the basis for backtesting every change against past decisions.
- **Designed the rule lifecycle and calibration process** — per-rule assessor agree/disagree feedback, shadow mode, separate testing and production lifecycles with promotion after sign-off, QA sampling in production, and a zero-tolerance policy where any false positive demotes a rule back to testing as a P0. Calibrated thresholds directly with the Head of Credit and assessors.
- **Led a multi-repo migration from application-level to per-applicant rules** across ~20 rule families (credit score, enquiries, defaults, missed repayments, hardship, age of file, directorships, identity match, liability tolerances), published as versioned typed API contracts with zero-downtime deprecation of legacy rules.
- **Built identity verification rules** for passports (AU/NZ vs foreign, full-frame and signature checks), driver licences (both sides, per-state name rules, OCR-extracted condition codes), Medicare, photo cards, birth certificates, visas/VEVO and acceptable-ID combinations — enforcing a design principle in code: **match identity names strictly, never by LLM**.
- **Built credit file (CCR) rules against two bureau reports** — repayment-history review triggers, declared-liability matching with account-type mapping, liability tolerances and exposure limits evaluated against both the bureau report and a second, funder-side credit report.
- **Built liability statement rules for ~9 liability types** (HECS, BNPL, credit card, car loan, personal loan, mortgage, overdraft, line of credit, ATO debt) with extraction schemas, balance tolerances, monthly-normalised repayments and account-number matching, backed by a new **entity resolution service** for institution-name aliasing.
- **Built the expenses pillar** — benchmarking declared expenses against HEM from a live serviceability run, plus dependent, childcare, zero-expense and per-investment-property checks — and income rules such as payslip deduction analysis.
- **Integrated the Australian Business Register (ABR) API** to validate ABNs during identity and employment verification checks.

#### **Document AI Pipeline**

- **Engineered a multi-provider AI document pipeline** (Anthropic Claude, Google Gemini, Extend AI, OpenRouter) extracting structured data from financial documents with schema-validated outputs and `SCHEMA_MISMATCH` diagnostics.
- **Built ensemble classification and consensus extraction** — multiple models vote on a document's physical type; a value only counts as verified when independent approaches agree, and any disagreement demotes it to human review. Type tagging and reconciliation decisions are decoupled, and OCR is queued only after a successful tag commit.
- **Established canonical document types and a tagging system** with a reconciliation classifier, source tracking, and tag-first document resolution for credit decisions.
- **Reworked the extraction provider architecture** (7-part series) — text-input structured generation, explicit extraction modes, big-PDF text fallback with schema-mismatch substitutes, and parsed-text extraction for large contracts of sale.
- **Built OCR extraction modules for 15+ document types** — payslips, identity documents, liability statements, identity verification reports and more.
- **Hardened the pipeline for production** — tolerance for provider schema drift, oversized/corrupt PDF handling, idempotent workflow starts, DLQ requeueing, longer PDF-to-image Lambda timeouts, OCR backfill modes, and TFN redaction on partner uploads.
- **Developed an LLM evaluation framework** with per-document-type eval modules, tag-based setup selection, guards against reporting errors as results, and a cloud evaluation trigger in CI — later moved into Effect with dataset building and scoring.
- **Re-architected the extraction pipeline onto a durable workflow engine** (Effect Workflow on AWS Lambda) with independent stages, consensus handling across re-runs and DLQ poison-message handling.

#### **Serenity v3 — Assessor Workspace**

- **Started and am the main author of the next-generation credit assessor workspace** (~130 commits), built around LEAP in React with pdf.js, Auth0 and Vercel.
- **Modelled credit workflows end to end** — more-information requests (multi-item, threaded follow-ups), accept-on-conditions, escalations up delegated lending authority levels (including to the funder), and pre-approve/decline decisions.
- **Built the assessment UI** — application summary and checks, activity timeline with LEAP checks, saved views with AND/OR filters, rule chips and a docked action panel, a liabilities view for serviceability inclusion, and an identity section driven by a verification state machine.
- **Built a multi-pane document viewer** with draggable tabs, pop-out windows, a filing bar and document tagging.
- **Designed a contract-first API** — authored and published a typed HTTP contract package owned by the backend and consumed by the portal, served behind staff bearer auth with permission-based (not role-based) RBAC.
- **Testing**: ~18 numbered end-to-end scenarios (MIR loop, escalations, identity verification…), several driven by coding agents through **WebMCP**, against a mock server with seeded scenarios.

#### **Suburb-Based Eligibility**

- **Replaced postcode-based lending eligibility with a suburb (locality) classification system**, end to end — locality data and geo-code endpoints, admin/broker/consumer APIs, and a versioned eligibility decision recorded on each security property.
- **Rolled out behind feature-flag allowlists**, then enabled for everyone and retired the legacy postcode paths; added span attributes and Better Stack dashboards charting outcomes per check, plus a CI workflow that syncs postcode data and raises a companion PR in the portal.

#### **Identity Verification Onboarding**

- **Integrated a third-party verification-of-identity (VOI) provider into the broker flow** — brokers can create and trigger VOI, pre-submit VOI is required for all broker applicants (rolled out behind allowlists), and approval requires completed VOI.
- **Webhooks create identity document cases automatically**, falling back to the scanned document when a check never finalises, and redundant ID/biometrics requests are skipped for verified applicants.

#### **Platform & Architecture (Effect, DDD)**

- **Adopted Effect in a production monolith** — an Effect admin router rolled out from dev to all environments, a native MySQL client with every core table mirrored, and an upgrade from Effect 4 beta to **4.0.0 GA**.
- **Introduced a domain-driven layout** — documented layers and per-file-kind patterns, an entrypoints pattern enforced by lint rules, and custom Effect lint rails (no type assertions, wrap-not-fork) enforced in CI.
- **Built a value lineage / provenance package** recording where every applicant, expense and asset value came from (declared, OCR or verified).
- **Scaffolded a finance service** on EventBridge, SQS and Lambda with a daily financial report email and Xero/Snowflake syncs.
- **Fixed database deadlocks** in liability, expense and income updates by moving queries outside transactions.

#### **LEAP Assessment Dashboard**

- **Built the LEAP internal React/TypeScript dashboard** from the ground up, giving credit assessors a full view of automated decision runs, rule-by-rule outcomes and supporting documents.
- **Migrated the frontend to TanStack Router** for type-safe routing, and **enforced a feature-based folder architecture** with oxlint import rules.
- **Built typed rule output UI components** for every rule, consuming the `ts-rest` contract directly for end-to-end type safety.
- **Moved all Tailwind colours to shadcn design tokens** for consistent theming.

#### **Infrastructure & DevOps**

- **Built label-gated production deploys** — labelled PRs deploy to production automatically once UAT is green (first with a Slack countdown, business-hours window and stale-commit stand-down, later simplified so the label is the decision).
- **Replaced long-lived CI credentials with a GitHub Actions OIDC provider**, built and smoke-tested container Lambdas on ARM runners, and blocked new secrets at PR time.
- **Sped up CI** — typecheck on **tsrs** (a Rust port of tsc 7), 8-vCPU Blacksmith runners, CI-aware Vitest fork pools, and LLM integration tests moved to nightly; upgraded Node 20 → 24 LTS.
- **Improved local dev** — local telemetry via DuckDB OTLP, declarative seed builders shared between local and UAT, and offline CLI warm restarts with LocalStack.
- **Deployed a WAF-protected AWS CloudFront distribution** (Global Media Library) with signed URLs and IP whitelisting.
- **Hardened observability and security** — OpenTelemetry tracing, Better Stack dashboards for the document pipeline and eligibility, Sentry/tRPC noise reduction, SLA alerts for stuck loan workflows, PII/credential redaction across telemetry, constant-time secret comparison, and a stored-XSS fix.

#### **Open Source: effect-workflow-lambda**

- **Built and open-sourced [`effect-workflow-lambda`](https://github.com/sucasa-finance/effect-workflow-lambda)**, a durable workflow runtime running Effect's `@effect/workflow` on AWS Lambda with pluggable persistence backends (MySQL, Postgres, Redis over SQS), three levels of handler abstraction, and one-command local deployment via Pulumi + LocalStack — production-proven on Skip's document extraction pipeline.
- **Collaborating directly with the Effect core team** (including Effect's author) in a shared channel on the design of a serverless workflow/activity abstraction, contributing upstream feedback on `@effect/sql` dialect support along the way.

#### **AI-Native Engineering**

- **Designed the decision engine for coding agents** — one structured-output CLI that agents can run, read and iterate against — and contributed `AGENTS.md`, cloud-agent instructions and repo skills (local dev/login, Blacksmith Testbox).
- **Most 2026 output was produced with coding agents** (Claude Code, Cursor, OpenCode), including agent-driven end-to-end testing through WebMCP.

#### **AI Coding Agent Orchestration (SAO)**

- **Designed and built SAO (Session Orchestrator)**, a full-stack internal platform for managing concurrent AI coding agent sessions (Claude, OpenCode) across multiple repositories, built on the [Effect](https://effect.website) functional framework with Bun, Postgres, and a pnpm/Turborepo monorepo.
- **Implemented an end-to-end session lifecycle** — on session creation: syncs and rsyncs base repos, checks out feature branches, installs dependencies in parallel, writes agent instruction files (`AGENTS.md`), registers webhook hooks for agent notifications, persists to Postgres via Drizzle ORM, and spawns a tmux session with the agent pre-loaded with the Linear ticket as the prompt.
- **Built an agent inspection service** that introspects running tmux panes — parsing process trees, computing CPU activity, and detecting agent state (`active`, `idle`, `need input`) — feeding a 5-second state watcher that fires deduped SSE notifications (`agent-done`, `agent-needs-input`) to the web UI and CLI.
- **Integrated Linear GraphQL API** for full ticket lifecycle management: auto-transitioning issues to "In Progress" on session start, posting AI-generated progress summaries (`sync`) mid-session, and marking issues Done/Cancelled with a final summary on session close.
- **Built a PR review management system** using the GitHub CLI and GraphQL API to sync inbound review requests and outbound PRs across all repos, with an AI-powered reviewer suggestion engine (Gemini 2.5 Pro) that matches PRs to reviewers based on their commit history and persona descriptions.
- **Built a rate limit monitor** that reads OAuth tokens from macOS Keychain (Anthropic) and local auth stores (OpenAI) to poll live usage against 5-hour and 7-day rate limit windows, surfaced in the UI.
- **Implemented multi-provider transcript reading and cost tracking** — parses Claude's JSONL conversation logs and queries OpenCode's SQLite database, computing session cost in cents using pricing tables covering Claude Sonnet/Opus/Haiku, GPT-5, and Gemini 3 Pro.
- **Delivered a full-stack interface** — a Bun/Effect HTTP API (with SSE, Scalar API docs, structured request ID logging), a React/TanStack Router web UI, and a `sao` CLI — all sharing a single `api-contract` package as the source of truth for all types.

#### **Leadership & Team**

- **Wrote the LEAP PRDs** (e.g. a "reactions" primitive for MIRs and escalations); writing them surfaced wrong assumptions in the code, fixed with follow-up cleanup PRs.
- **Presented LEAP to company leadership**, adapting the material for non-technical audiences.
- **Shaped team process** — timed standups, shared standards for good PRs and high-signal reviews, and the DDD/BFF architecture direction.
- **Worked directly with the Head of Credit and credit assessors** on rule specifications, sign-off and QA.

#### **Developer Tooling & Code Quality**

- **Adopted `tsgo` and later `tsrs` for type checking**, providing near-instant TypeScript validation in pre-commit and CI.
- **Implemented custom lint rules** (ESLint and Effect lint rails) enforcing consistent observability instrumentation and architectural constraints.
- **Migrated all rule inputs/outputs to Zod and then Effect Schema**, enabling runtime validation, automatic TypeScript inference, and self-documenting contracts between the rules engine and its consumers.
- **Introduced oxlint** for fast linting with feature-based import enforcement across the backend service and the frontend dashboard.

### Sauce - Senior Software Engineer (Aug 2024 - Dec 2025)

#### **Infrastructure & Cloud Engineering (AWS CDK)**

- **Provisioned an isolated "Recipe" microservice with AWS CDK**, including a new VPC, RDS database with a secure bastion host, ECS deployment, Application Load Balancer, ECR repositories, and CloudFront delivery.

- **Architected a multi-stack CI/CD pipeline with GitHub Actions and AWS CDK**, enabling automated, environment-specific deployments for services including `recipe-app` and the main application.

- **Engineered and integrated a production-ready ClickHouse cluster using AWS PrivateLink**, establishing secure, private connectivity between the ECS services and the OLAP database. Configured bastion hosts and security groups to allow for secure SSH and database connections.

- **Simplified the platform by decommissioning the EKS cluster and removing Qdrant as a production dependency**, eliminating an operationally separate vector database.

- **Integrated AWS Managed Grafana and AWS Chatbot**, routing critical CloudWatch alarms to Slack for operational visibility.

- **Provisioned decoupled SQS workflows through CDK**, including feedback-sync, customer-sync, and highlight-deletion queues.

- **Added declarative Karpenter auto-scaling for the Kubernetes-hosted Qdrant search service through AWS CDK.**

- **Assisted in enabling GPU instances for ECS to empower the machine learning service**, allowing the team to leverage more powerful models for data processing and analysis.

#### **Architecture & System Design**

- **Designed and implemented a full-stack "Graph of Thought" research agent** for multi-step data analysis, spanning backend services, GraphQL APIs, Drizzle schemas, and frontend components.

- **Consolidated shared GraphQL schemas, types, and client configuration into a monorepo package**, aligning the service, UI, and web-extension projects around shared contracts.

- **Designed summary persistence with MDX support** for storing, retrieving, and rendering richly formatted AI-generated reports in the frontend.


#### **Python Machine Learning Service**

- **Owned and re-architected the Python machine-learning service** (keyphrase extraction, embeddings, topic clustering), restructuring it from flat scripts into a modular FastAPI service with layered `api/service` modules and OpenAPI schemas consumed by the TypeScript backend via a generated client.
- **Reduced ML infrastructure complexity by replacing GPU-hosted sentence-transformer models with OpenAI embedding API calls**, right-sizing ECS task definitions across US/EU staging and production and removing the torch/CUDA dependency chain.
- **Led the decommissioning of Qdrant and the top-down trend clustering pipeline** — deleting the SQS/S3-driven HDBSCAN/UMAP cluster generation system for highlight and keyphrase trends in favour of ClickHouse-backed queries, removing an entire vector database from production.
- **Built a custom KeyBERT-based keyphrase extractor** with curated stopwords, text cleaning, and full-text-search variants, tuned via high-load tests and lean generation paths to survive production volumes.
- **Hardened the ML service for production**: direct Postgres/ClickHouse connection pooling (replacing Prisma-python), dedicated health-check threads, graceful empty-input handling, queue throttling, and a Pipfile→uv migration.

#### **Backend Development & Performance Optimization**

- **Improved keyphrase-trend query performance with ClickHouse materialized views**, moving intensive analytical work off the primary Postgres database.
- **Introduced ClickHouse as the OLAP filtering engine end-to-end** — client, migrations, denormalised filterable-highlights tables, an advanced-filter query builder, and refreshable/materialized views — and led the multi-tenancy hardening effort adding indexed `orgId` scoping across all relational tables with batched backfill migrations.
- **Bootstrapped a greenfield "Recipe" agent browser-testing service** on Stagehand: GraphQL API with Drizzle/Postgres, auth, S3 image storage, OpenTelemetry, and staging/prod ECS deploy pipelines via GitHub Actions.

- **Improved Postgres performance by analyzing queries with `EXPLAIN`**, leading to targeted query and schema optimizations for critical data retrieval operations.

- **Implemented Redis caching for frequently accessed data**, including highlight counts and trend-run results, to reduce repeated database work.

- **Developed and secured a new API module with a comprehensive authentication and authorization layer**, enforcing user-specific data access through database migrations and service-level logic.

- **Enhanced the backend research agent by adding a dedicated post-processing step for formatting reports**, improving the quality, structure, and consistency of AI-generated output.

#### **DevOps & CI/CD**

- **Rolled out a semver release process using Git tags and GitHub Actions**, automatically generating and publishing detailed release notes to Slack.

- **Integrated the Claude AI into the CI/CD pipeline for automated code reviews**, helping to enforce coding standards, catch potential bugs, and improve overall code quality.

- **Configured and deployed OpenTelemetry across backend services**, enabling distributed tracing and providing deep insights into application performance and request lifecycles.

#### **Frontend Development**

- **Led a significant frontend modernization effort by upgrading the main UI to React 19**, refactoring numerous components to align with the new version's features while ensuring application stability and performance.

- **Adopted shadcn/ui and compositional patterns in the React codebase**, improving consistency and maintainability while retaining tree-shakeable components.

- **Built and launched a new "Personal Feed" UI**, providing users with a customized, dynamic, and engaging view of their data, complete with activity logs and trend visualizations.

- **Developed a feature-flagged, table-based view for browsing highlights**, offering users an alternative to the existing list view with enhanced sorting, filtering, and bulk-action capabilities.

- **Upgraded the Chrome extension to Manifest V3**, enhancing its functionality with new features and ensuring compliance with the latest browser standards.

### Mirvac - Senior Front-end Engineer (Jan 2022 - Aug 2024)
- Achieved "Employee of the Quarter" for delivering mobile of allowing users digital access through the app.
- Led and implemented marketing website for a new building roll out, generating $500K in converted leads.
- Improved upgrade efforts of mobile app by moving to Expo prebuilds, reducing upgrade migrations from hours of manual diff checking to an automated 10 seconds CLI command.
- Improved React/code base by refactoring home-made solutions to industry libraries (react-query, react-table, and shadcn/ui).
- Improved React build time by 80% by switching from CRA to Vite and using Bun for Github Actions, reducing an average of 5 mins down to 1 in our CI/CD.
- Mentored new engineers through to their first PRs and provided detailed comments on best practices.
- Managed internal engineer scaling issues by automating several manual processes and providing documentation.
- Built a live retro feedback tool for other teams and initiated a company-wide hackathon.

### Atelier - Full-stack Developer (Aug 2021 - Jan 2022)
- Enhanced the front-end by developing reusable components using SASS and Apollo Client, resulting in improved code maintainability and enhanced user experience.
- Implemented a robust backend infrastructure using Prisma, Nexus, and Apollo Server, ensuring seamless CRUD operations and optimal performance.
- Established a comprehensive end-to-end testing framework using Cypress and integrated it with Circle CI, enabling automated testing on every branch push and enhancing code quality.
- Designed and developed a sophisticated messaging system with GraphQL subscriptions and a Postgres pub/sub system, delivering real-time communication capabilities similar to Slack.
- Led the migration of the existing Postgres database to AWS, leveraging the cloud platform's capabilities to enhance control, scalability, and uptime, ensuring a more robust and reliable database infrastructure.

### Appian - Solution Engineer (Jan 2020 - Jul 2021)
- Demonstrated expertise in supporting various components of the Appian stack, including application servers (Tomcat, JBoss), web servers (IIS, Apache), RDBMS (MySQL/Mariadb), Apache Kafka, Elasticsearch, and integrations with Appian.
- Proficiently handled additional technologies such as AWS Cloud architecture, networking/VPN (IPsec), Linux (SSH/busybox tools), accessibility compliance (WCAG), and resource contention management (CPU/Memory/Threads).

## Contract work

### Patch - Senior Software Engineer (Contract) (Aug 2026 - Current)

- **Building a full-stack geospatial platform serving NSW cadastre (property parcel) data** — lot lookup API, Mapbox Vector Tile streaming, and an ArcGIS REST compatibility layer.
- **Designed a zero-downtime snapshot sync flow** that imports ESRI FileGeoDatabase exports via GDAL into PostGIS staging tables, validates the snapshot, and atomically promotes it while existing API routes continue serving the previous data.
- **Implemented geospatial delivery integrations** for Mapbox Vector Tiles, PMTiles served from Cloudflare R2, and a constrained ArcGIS REST-compatible query endpoint.
- **Stack**: Bun, Effect v4 `HttpApi` with schema-derived OpenAPI docs, Drizzle, PostgreSQL 16 + PostGIS (GiST spatial indexing), React 19/Mapbox GL dashboard, and Railway infrastructure-as-code.

### Fullsuite - Senior Software Engineer (Contract) (Sep 2023 - Nov 2024)
- Implemented POC with encryption using libsodium CHACHA20-POLY1305 and exposed through Expo Modules.
- Building Auth, Mobile (Expo), Web app (react), back-end (HonoJS, Turso) for a new startup.

### Pitbull BSC - Front-end Developer (Contract) (Mar 2021 - Jan 2022)
- Implemented a Telegram price bot using Node.js, AWS Gateway, AWS Lambda, and Serverless (SLS).
- Developed PitStop, a Next.js application utilizing ethers.js and web3modal for future application efforts.
- Built PitChart, a GraphQL-powered data visualization tool displaying OLHC data over time using react-financial-chart.

## Education and Certifications

### University of New South Wales (UNSW) - Bachelor of Engineering (Honours) / Commerce (2014 - 2020)
- Major: Mechatronics and Information Systems (Credit average).
- Honours thesis (Distinction): Integration of communication platforms across different operating systems.

### Amazon Web Services
- AWS Developer Associate Certification (Score: 905/1000)


## Open source contributions and Blog
- **["You should build your own agentic harness"](https://blog.skiploans.com.au/you-should-build-your-own-agentic-harness-db19fa16272b)** (Skip engineering blog, Mar 2026) — eleven practical principles for making codebases and workflows agent-friendly: operational frameworks like Effect, predictable code patterns, custom linting for architectural constraints, and session-type-aware model/token budgeting.
- effect-workflow-lambda (Durable Effect workflows on AWS Lambda) - Author/maintainer, developed in collaboration with the Effect core team ([repo](https://github.com/sucasa-finance/effect-workflow-lambda))
- Honojs (Lightweight Express) - docs: update typo and add warning to #url() to use absolute URL ([#203](https://github.com/honojs/website/pull/203))
- Outstatic (Git-based CMS) - fix: author name check ([#169](https://github.com/avitorio/outstatic/pull/169))
- borabaloglu/cmdk-base - [core] Update useId dependency ([#3](https://github.com/borabaloglu/cmdk-base/pull/3))
- NangoHQ/nango - docs: update rate limit code snippet ([#3066](https://github.com/NangoHQ/nango/pull/3966))
- NangoHQ/nango - fix: update error message for provider key missing ([#2622](https://github.com/NangoHQ/nango/pull/2622))

## Projects
### Cave — Founder & Engineer (2026 - Current)
- Link: [getcave.ai](https://getcave.ai)
- Side project and stealth startup with an early user base, building real-time collaborative messaging with channels, threads, task boards, and AI agent integration across web, desktop (Electron), and mobile (React Native/Expo).
- Local-first architecture using TanStack Electric with client-side SQLite, backed by a Hono/tRPC/Drizzle/Postgres API built on Effect.
- Cloudflare and Railway infrastructure with GitHub Actions CI/CD, shared web/Electron/mobile packages, and deterministic scene-based QA for seeded environments.

### Hayom
- Link: [Hayom](https://hayom.pages.dev/) - Source: [GitHub - Linear clone](https://github.com/kndwin/hayom)
- Used Evolu for sync engine layer.
- Utilized `xstate/store` for efficient keyboard shortcut handling.
### Linear Clone
- Link: [Linear clone](https://linear-clone-with-dexiejs.vercel.app) - Source: [GitHub - Linear clone](https://github.com/kndwin/solaces)
- Implemented browser-based database technology with <100ms write and read speeds (eliminating network round trips).
- Utilized `xstate`  for efficient keyboard shortcut handling.

### Real-time Retro
- Link: [Real-time retro](https://teamstro.vercel.app) - Source: [GitHub - Real-time retro](https://github.com/kndwin/teamstro)
- Implemented a pub/sub architecture using Ably and established a leader-follower distributed network between browsers.

### PDF Highlighter
- Link: [PDF highlighter](https://higher-up.vercel.app) - Source: [GitHub - PDF highlighter](https://github.com/kndwin/higher)
- Developed a recursive file structure with drag-and-drop functionality using dnd-kit.
- Implemented a PDF annotator using `pdf.js`.
