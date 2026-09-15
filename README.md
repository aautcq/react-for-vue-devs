# React for Vue Devs

A personalized, in-app course that teaches the React ecosystem to a Vue/Nuxt developer. There's no
separate slide deck or docs site — **the app itself is the course**: running it locally renders the
lessons as live, interactive pages.

Each lesson combines prose, a live-rendered demo, its visible source code, a callout mapping the
concept to its closest Vue/Nuxt equivalent (e.g. "useState ≈ ref()"), and a closing exercise.

> **Note:** This repo intentionally targets a "future/breaking-changes" version of React, Next.js,
> and friends, so APIs and conventions may differ from what you'd expect. See `AGENTS.md` if you're
> an AI agent working in this codebase.

## Tracks

The curriculum is organized into six Tracks, completed in order:

1. **React** — fundamentals
2. **Next.js** — App Router, server/client model, data
3. **TanStack Query**
4. **Redux**
5. **tRPC**
6. **Motion** (`motion`, formerly `framer-motion`)

One small "Running Example" app (a todo list) is built up incrementally across every Track, layering
on new concepts as they're introduced.

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to start the course.

## Tech Stack

Built with Next.js (App Router), React, TypeScript, Tailwind CSS, TanStack Query, Redux Toolkit,
tRPC, Zod, and Motion.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
