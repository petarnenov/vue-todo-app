# Vue Todo App + Arguslog

This project is not just a demo todo app. Its main purpose is to validate a **real Arguslog integration** in a small, easy-to-understand Vue application: from onboarding and SDK setup to day-to-day error monitoring workflow, triage, and iteration.

## What this project validates

- **Fast onboarding** with `@arguslog/sdk-vue`
- **Real error ingestion** from a working front-end application
- **Global error handlers and breadcrumbs** that add useful debugging context
- **UI-level error boundary behavior**
- **A practical workflow** for detection, investigation, triage, regression checks, and follow-up fixes

In other words, this repository acts as a sandbox for validating whether Arguslog fits naturally into a real Vue development workflow, not just whether the SDK can technically send events.

## Why Arguslog is the right choice

Arguslog is the right fit here because it addresses the parts of front-end monitoring that actually matter in practice:

- **Straightforward onboarding** - the Vue integration is short, clear, and easy to reason about
- **Useful signal over noise** - the goal is not only to collect exceptions, but to surface issues worth acting on
- **Better operational context** - breadcrumbs, environment metadata, and boundary-based capture are more useful than an isolated stack trace
- **Built for iteration** - it supports the full cycle of reproduce, triage, fix, and verify
- **Well suited for small and mid-sized front-end apps** - you can validate a meaningful observability workflow without heavy setup

## Where the integration lives

The main Arguslog integration points are:

- `src/main.ts` - initializes `createArguslog(...)`
- `src/App.vue` - wraps the main UI with `ArguslogErrorBoundary`

The current setup includes:

- `globalHandlers`
- `autoBreadcrumbs`
- `environment: 'production'`

## Run locally

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run lint
npm run test
```

## How to use this project for Arguslog onboarding

1. Run the app locally.
2. Review `src/main.ts` to see the minimal SDK setup.
3. Replace the DSN with your own Arguslog project DSN if you are testing in your own workspace.
4. Trigger controlled errors or boundary failures.
5. Follow the events in Arguslog and inspect how the triage workflow behaves end to end.

## Who this project is for

This repository is useful if you want to:

- validate how quickly Arguslog can be onboarded into a Vue app
- demonstrate a real error monitoring workflow
- show why observability has value even in a small project
- test SDK integration before a broader rollout

## Stack

- Vue 3
- TypeScript
- Pinia
- Vite
- Vitest
- Arguslog Vue SDK
