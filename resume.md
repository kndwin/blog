---
title: Resume
date: 2024-11-07
exclude: true
---

I ran the below script against the repo's I've been working on and asked Google Gemini 2.5 Pro to summarised what I've done.
```bash
git log --author="$(git config user.name)" --since="1 year ago" --name-status --pretty=format:"%h - %an, %ar : %s" > my_commits_last_year.txt
```
## Toolbox

| Scope                      | Tech                                                                                                                                                                                     |
| :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**               | React (incl. React 19), TypeScript, Next.js, Vite, Tailwind CSS, shadcn/ui, Apollo Client, MDX, Web Extensions (WXT)                                                                     |
| **Backend**                | Node.js, Python, TypeScript, Postgres (OLTP), ClickHouse (OLAP), Redis, GraphQL, Prisma, Drizzle ORM, BullMQ                                                                             |
| **Cloud & Infrastructure** | **AWS:** ECS, ECR, RDS, ElastiCache, SQS, CloudFront, Route 53, S3, WAF, PrivateLink, IAM<br/>**IaC:** AWS CDK, Docker, Serverless<br/>**Orchestration:** Kubernetes (EKS), Karpenter                |
| **AI & Data**              | **LLM Services:** OpenAI API, AWS Bedrock<br/>**Techniques & Libraries:** Clustering (HBDSCAN, K-Means), RAG, Dimension reduction (UMAP, PCA), Embedding (Tuning, Sentence-Transformers) |
| **Observability & DevOps** | OpenTelemetry, Grafana, CloudWatch, GitHub Actions, Nango                                                                                                                                |
| **Developer Tools**        | Nix, Vim, Tmux, Colima, Claude Code, Opencode                                                                                                                                                                   |

## Work experience

### Sucasa - Senior Product Engineer (Jan 2026 - Current)
- Own credit decisioning by harnessing AI to make financial decision.

### Sauce - Senior Software Engineer (Aug 2024 - Dec 2025)

#### **Infrastructure & Cloud Engineering (AWS CDK)**

- **Led a major infrastructure refactor using AWS CDK to provision a new, isolated "Recipe" microservice**, which included a new VPC, RDS database with a secure bastion host for debugging, and a full ECS deployment with an Application Load Balancer, ECR repositories, and CloudFront for content delivery.

- **Architected and implemented a robust, multi-stack CI/CD pipeline using GitHub Actions and AWS CDK**, enabling automated, environment-specific deployments for different services (e.g., recipe-app, application) and improving release velocity and reliability.

- **Engineered and integrated a production-ready ClickHouse cluster using AWS PrivateLink**, establishing secure, private connectivity between the ECS services and the OLAP database. Configured bastion hosts and security groups to allow for secure SSH and database connections.

- **Drove a significant architectural simplification by decommissioning the EKS cluster and removing Qdrant as a dependency**, reducing infrastructure complexity, operational overhead, and associated costs.

- **Enhanced system observability and alerting by integrating AWS Managed Grafana for monitoring and configuring AWS Chatbot** to send critical CloudWatch alarms directly to Slack, improving incident response times.

- **Scaled out the messaging and queueing infrastructure by provisioning multiple SQS queues via CDK** (e.g., FeedbackSyncIngestionQueue, CustomerSyncIngestionQueue, DeleteHighlightQueue), enabling more robust and decoupled asynchronous processing.

- **Implemented auto-scaling for the Kubernetes cluster by adding Karpenter to the Qdrant search service declaratively through AWS CDK**, optimizing resource utilization and cost-efficiency.

- **Assisted in enabling GPU instances for ECS to empower the machine learning service**, allowing the team to leverage more powerful models for data processing and analysis.

#### **Architecture & System Design**

- **Spearheaded the design and full-stack implementation of a "Graph of Thought" research agent**, a novel feature for complex, multi-step data analysis. This involved architecting new backend services, GraphQL APIs, database schemas with Drizzle ORM, and corresponding frontend components.

- **Drove a monorepo-wide refactoring to consolidate shared GraphQL schemas, types, and client configurations into a unified package**, significantly improving code reusability, type safety, and developer experience across the service, ui, and web-extension projects.

- **Designed a summary persistence system with MDX support**, allowing for the storage and retrieval of AI-generated summaries and enabling rich, formatted report rendering in the frontend.


#### **Backend Development & Performance Optimization**

- **Dramatically improved query performance for keyphrase trends by designing and implementing ClickHouse materialized views**, reducing query latency from minutes to seconds and offloading intensive analytical work from the primary Postgres database.

- **Improved Postgres performance by analyzing queries with EXPLAIN**, leading to targeted optimizations and schema adjustments that reduced query timeouts from over 60 seconds to under 5 seconds for critical data retrieval operations.

- **Implemented a Redis caching layer for frequently accessed data**, including highlight counts and trend run results, which reduced database load and improved API response times for key application features.

- **Refactored the Python-based machine learning services for improved performance and cost-efficiency**, transitioning from GPU-heavy sentence-transformer models to optimized OpenAI API calls for keyphrase extraction and topic generation.

- **Developed and secured a new API module with a comprehensive authentication and authorization layer**, enforcing user-specific data access through database migrations and service-level logic.

- **Enhanced the backend research agent by adding a dedicated post-processing step for formatting reports**, improving the quality, structure, and consistency of AI-generated output.

#### **DevOps & CI/CD**

- **Rolled out a semver release process using git tagging and GitHub Actions**, which automatically generated and published detailed release notes to Slack, improving transparency and communication across the organization.

- **Integrated the Claude AI into the CI/CD pipeline for automated code reviews**, helping to enforce coding standards, catch potential bugs, and improve overall code quality.

- **Configured and deployed OpenTelemetry across backend services**, enabling distributed tracing and providing deep insights into application performance and request lifecycles.

#### **Frontend Development**

- **Led a significant frontend modernization effort by upgrading the main UI to React 19**, refactoring numerous components to align with the new version's features while ensuring application stability and performance.

- **Championed the adoption of shadcn/ui and compositional patterns in the React codebase**, which reduced bundle size through tree-shaking and improved the maintainability and consistency of the user interface.

- **Built and launched a new "Personal Feed" UI**, providing users with a customized, dynamic, and engaging view of their data, complete with activity logs and trend visualizations.

- **Developed a feature-flagged, table-based view for browsing highlights**, offering users an alternative to the existing list view with enhanced sorting, filtering, and bulk-action capabilities.

- **Upgraded the Chrome extension to Manifest V3**, enhancing its functionality with new features and ensuring compliance with the latest browser standards.
### Mirvac - Senior Front-end Engineer (Jan 2022 - Current)
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

## Other experience
### Fullsuite - Senior Software Engineer | Sep 2023 - Current
- Implemented POC with encryption using libsodium CHACHA20-POLY1305 and exposed through Expo Modules.
- Building Auth, Mobile (Expo), Web app (react), back-end (HonoJS, Turso) for a new startup.
### Pitbull BSC - Front-end Developer (Mar 2021 - Jan 2022)
- Implemented a Telegram price bot using Node.js, AWS Gateway, AWS Lambda, and Serverless (SLS).
- Developed PitStop, a Next.js application utilizing ethers.js and web3modal for future application efforts.
- Built PitChart, a GraphQL-powered data visualization tool displaying OLHC data over time using react-financial-chart.
## Open source contributions and Blog
- Honojs (Lightweight Express) - docs: update typo and add warning to #url() to use absolute URL ([#203](https://github.com/honojs/website/pull/203))
- Outstatic (Git-based CMS) - fix: author name check ([#169](https://github.com/avitorio/outstatic/pull/169))
- borabaloglu/cmdk-base - [core] Update useId dependency ([#3](https://github.com/borabaloglu/cmdk-base/pull/3))
- NangoHQ/nango - docs: update rate limit code snippet ([#3066](https://github.com/NangoHQ/nango/pull/3966))
- NangoHQ/nango - fix: update error message for provider key missing ([#2622](https://github.com/NangoHQ/nango/pull/2622))
## Education and Certifications

### University of New South Wales (UNSW) - Bachelor of Engineering (Honours) / Commerce (2014 - 2020)
- Major: Mechatronics and Information Systems (Credit average).
- Honours thesis (Distinction): Integration of communication platforms across different operating systems.

### Amazon Web Services
- AWS Developer Associate Certification (Score: 905/1000)

### FreeCodeCamp (2020-2021)
- Completed 4 certificates, each representing 300 hours of coursework:
  - Responsive Web Design
  - JavaScript Algorithms and Data Structures
  - Front End Libraries
  - APIs & Microservices

## Projects
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
