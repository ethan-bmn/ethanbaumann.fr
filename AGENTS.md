# Repository Guidelines

## Project Structure & Module Organization

This portfolio uses Nuxt 4, Vue 3, and TypeScript. `app/app.vue` defines the terminal hero and global styles. Reusable components live in `app/components/`; `AsciiFrame.vue` owns the animated border. `app/directives/scramble.ts` implements the text animation, registered globally by `app/plugins/scramble.ts`. Place static files in `public/`. Root configuration lives in `nuxt.config.ts` and `tsconfig.json`. Treat `.nuxt/`, `.output/`, and `node_modules/` as generated directories.

## Build, Test, and Development Commands

Use Bun to match the committed `bun.lock`:

- `bun install`: install dependencies and run Nuxt preparation through `postinstall`.
- `bun run dev`: start the development server, normally at `http://localhost:3000`.
- `bun run build`: create the production server and client bundles.
- `bun run preview`: serve the production build locally.
- `bun run generate`: prerender the site for static hosting.

## Coding Style & Naming Conventions

Follow existing code: two-space indentation, single-quoted TypeScript strings, and no semicolons. Use Vue single-file components with `<script setup lang="ts">`. Name components in PascalCase, such as `AsciiFrame.vue`; use descriptive lowercase filenames for directives and plugins. Keep browser APIs inside lifecycle hooks or directive hooks so server rendering remains safe. No formatter or linter is configured.

## Testing Guidelines

No test framework, test script, or coverage threshold is configured. Run `bun run build` for changes and manually verify desktop and mobile layouts, resizing, replay behavior, and reduced-motion preferences. Keep readable server-rendered content and stable screen-reader text during animation. Clean up animation frames, observers, and listeners when components unmount.

## Commit & Pull Request Guidelines

The repository has no commits yet, so no established message convention exists. Use concise, imperative subjects, for example `Add reusable text scramble directive`. Pull requests should describe the user-visible change, list verification performed, link relevant issues when available, and include desktop/mobile screenshots for visual changes. Do not commit generated outputs or secrets; document required environment variables in `.env.example`.