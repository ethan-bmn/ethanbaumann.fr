# Ethan Baumann Portfolio

## Project Overview

This is Ethan Baumann’s personal portfolio, built with Nuxt 4, Vue 3, TypeScript, and Tailwind CSS 4. The home page is a minimal black-and-white terminal-inspired hero: geometric name lettering on the left, an EB logo on the right, a colored ZSH prompt, a Contact button in the header, and a centered copyright footer. Keep the design simple and preserve the side-by-side name/logo layout on small screens.

## Project Structure & Module Organization

- The canonical website domain is `ethanbaumann.fr`. Use `.fr` in visible branding, links, and metadata.

- `app/app.vue` wraps `NuxtPage` in `NuxtLayout`; `app/layouts/default.vue` owns the shared page shell, header, and footer. `app/pages/index.vue` owns the hero and page metadata.
- `app/assets/css/main.css` contains Tailwind’s import, global styles, responsive hero layout, terminal colors, and subtitle cursor. The small-screen breakpoint is 700px.
- `app/components/GeometricName.vue` renders custom SVG letter outlines. Letters start hidden, scramble into view from left to right, and emit `complete` when finished. The second name row follows the first. Its glyph set currently covers the letters in Ethan’s name.
- `app/components/ContactButton.vue` is a reusable link with a required `href` prop, a label slot, and an SVG arrow. Its white pixel fill moves diagonally from top left to bottom right with ease-out timing on hover and keyboard focus. The shared header uses `mailto:contact@ethanbaumann.fr`.
- The home page includes French service copy targeting web and software development in Lyon, canonical and sharing metadata, and Person/Service/WebSite JSON-LD. Keep structured data consistent with visible content. `public/sitemap.xml` lists indexable pages and is referenced by `public/robots.txt`; update it when adding public pages.
- `app/directives/scramble.ts` implements `v-scramble`, registered globally in `app/plugins/scramble.ts`. It supports text, delay, duration, character sets, direction, and an `enabled` flag. The subtitle waits for the final name row’s `complete` event before starting.
- `app/assets/img/EB_LOGO_SOURCE.svg` is the supplied logo. Its left face uses a vector gradient to prevent the thin light edge caused by the original bitmap mask. Preserve the artwork and fix rendering at the SVG level.
- `public/favicon.ico` contains multiple icon sizes derived from the logo; `nuxt.config.ts` registers it. Place other directly served static files in `public/`.
- `app/components/AsciiFrame.vue` and `app/utils/name-art.ts` are legacy artwork utilities, currently unused by the hero.
- Root configuration lives in `nuxt.config.ts` and `tsconfig.json`. Treat `.nuxt/`, `.output/`, and `node_modules/` as generated directories.

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

No test framework, test script, or coverage threshold is configured. Run `bun run build` for code changes and manually verify relevant behavior:

- Check narrow mobile screens (including 320px), medium widths, desktop, and resizing. The logo stays to the right of the name without horizontal overflow.
- On reload, name letters remain invisible until their individual scramble starts. Reveal the first row before the second; start the subtitle only after the name finishes.
- Keep the subtitle cursor inline so it follows line wraps. Preserve the subtitle’s line breaks through the directive.
- Verify the Contact button’s pixel fill, complete white coverage, keyboard focus, and reduced-motion behavior.
- Keep readable server-rendered content and stable screen-reader text during animation. With JavaScript disabled or reduced motion enabled, content must remain readable.
- Clean up animation frames, observers, and listeners when components unmount.

## Commit & Pull Request Guidelines

Always commit your changes as part of completing each task, after the relevant verification passes. Split changes into small, focused commits, each covering one purpose. Commit only files belonging to the task; preserve unrelated working-tree and staged changes. Do not push unless requested.

Always use Conventional Commits. This is an explicit user preference and applies to every new commit. Format subjects as `type(scope): imperative description`, with an optional scope. Use lowercase types such as `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, or `test`.

Examples:

- `feat(hero): add sequential name animation`
- `fix(logo): replace the left-edge bitmap mask`
- `docs: document project conventions`

Keep commits small and focused on one purpose. Do not rewrite published commits just to change their messages. Pull requests should describe the user-visible change, list verification performed, link relevant issues when available, and include desktop/mobile screenshots for visual changes. Do not commit generated outputs or secrets; document required environment variables in `.env.example`.
