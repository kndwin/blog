---
title: Resume
date: 2024-11-07
---
 
## Toolbox
 
 | Scope | Tech |
 | --- | --- |
 | Frontend |  React, Expo, Nextjs |
 | Backend | Node, Hono, Postgres, GraphQL |
 | Infra | AWS , K8S, Docker |
 | AI | Qdrant, UMAP , RAG |
 | Tools | Vim, Tmux, Git |

## Work experience
### Sauce - Senior Software Engineer (Aug 2024 - Current)
- Implemented auto scaling for k8s cluster by adding karpenter to qdrant search service declaratively through AWS CDK.
- Improved Postgres performance by analysing queries with EXPLAIN and implemented several performance tweaks that reduce queries that were timing out (60 seconds) to load in 5 seconds.
- Extended React codebase to adopt composition patterns with shadcn-ui, reduce bundle size with tree-shaking imports and implement product features.
- Assisted in enabling GPU instances for ECS to enable our machine learning service to leverage GPU instances.
- Rolled out semver releases with tagging and hooked up to Slack to print release notes.
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
- Honojs (Lightweight Express) - docs: update typo and add warning to #url() to use absolute URL (#203)
- Outstatic (Git-based CMS) - fix: author name check (#169)
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

### Linear Clone
- Link: [Linear clone](https://linear-clone-with-dexiejs.vercel.app) - Source: [GitHub - Linear clone](https://github.com/kndwin/solaces)
- Implemented browser-based database technology with <100ms write and read speeds (eliminating network round trips).
- Utilized `xstate` extensively for efficient keyboard shortcut handling.

### Real-time Retro
- Link: [Real-time retro](https://teamstro.vercel.app) - Source: [GitHub - Real-time retro](https://github.com/kndwin/teamstro)
- Implemented a pub/sub architecture using Ably and established a leader-follower distributed network between browsers.

### PDF Highlighter
- Link: [PDF highlighter](https://higher-up.vercel.app) - Source: [GitHub - PDF highlighter](https://github.com/kndwin/higher)
- Developed a recursive file structure with drag-and-drop functionality using dnd-kit.
- Implemented a PDF annotator using `pdf.js`.


::: details WIP


:::

