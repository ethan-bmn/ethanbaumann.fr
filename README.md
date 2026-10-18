# Ethan Baumann

A minimal terminal-inspired portfolio built with Nuxt 4 and Vue 3. The full-window
ASCII frame draws itself clockwise, followed by a character-scramble introduction
that resolves into large ASCII lettering.

The home page lives in `app/pages/index.vue`; `app/app.vue` renders `NuxtPage`.
Tailwind CSS is integrated through `@tailwindcss/vite` in `nuxt.config.ts`.
Use utilities for page and component styling; shared theme and base rules live
in `app/assets/css/main.css`.

## Reusable text animation

`v-scramble` is registered globally in `app/plugins/scramble.ts`. Apply it to a
text-only element (line breaks are supported; nested markup is replaced):

```vue
<h1 v-scramble>Ethan Baumann</h1>
<p v-scramble="{ text: 'Bonjour', duration: 1600, delay: 400 }">Bonjour</p>
<span v-scramble="{ text: label, characters: '01/#_' }">{{ label }}</span>
<pre v-scramble="{ text: asciiArt, direction: 'diagonal' }">{{ asciiArt }}</pre>
```

`duration` and `delay` are milliseconds; defaults are `1600` and `0`. A string
binding also works: `v-scramble="label"`. Bind `text` or a string when updating
the content dynamically. Keep the same readable text in the template for server
rendering and visitors without JavaScript. Animation is skipped for reduced-motion
preferences, and pending frames and listeners are cleaned up on unmount.

`direction: 'diagonal'` reveals a band of scrambled characters from top left to
bottom right. Apply it separately to each ASCII letter for individual glyph
animations; `direction: 'linear'` (the default) resolves text in reading order.

`app/components/AsciiFrame.vue` measures its container with `ResizeObserver` and
recalculates the character grid on resize. Reload the page to replay the intro.
The directive inherits `white-space` from its element; use `white-space: pre`
when animating ASCII art to preserve its spacing and line breaks.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
