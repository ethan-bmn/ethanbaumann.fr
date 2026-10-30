# Ethan Baumann

A minimal terminal-inspired portfolio for **ethanbaumann.fr**, built with Nuxt 4,
Vue 3, Tailwind CSS 4, and Three.js. The hero combines animated geometric name
lettering with an interactive 3D EB logo.

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

Use Node.js 24 and Bun 1.3.14, as declared in `package.json`:

```bash
bun install --frozen-lockfile
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

## Production

Build the application for production:

```bash
bun run build
bun run start
```

The production server runs the standalone Nitro Node entry point in
`.output/server/index.mjs`. It listens on `0.0.0.0` and uses the platform's `PORT`
(default `3000`). `NITRO_HOST` and `NITRO_PORT`, if set, take precedence over
`HOST` and `PORT`. `.env.example` lists server settings and the SMTP variables
required by the contact form. Set deployment variables in the hosting platform, since
the built server does not automatically load `.env` files.

## Railpack deployment

Select Railpack as the builder and use the repository root as the application
directory. It detects the toolchain from `package.json` and `bun.lock`:

| Setting | Value |
| --- | --- |
| Package manager | Bun 1.3.14 |
| Node runtime | Node.js 24 |
| Install | `bun install --frozen-lockfile` |
| Build | `bun run build` |
| Start | `bun run start` |
| Health check | `/` |

Leave command overrides empty to use automatic detection. The explicit
`node-server` Nitro preset produces a portable server. The committed
`railpack.json` builds and deploys `.output` and starts the Node server.

Let the platform supply `PORT`; if it requires a fixed target port, configure
that port and `PORT` to the same value. Keep the host set to `0.0.0.0`. Configure
the public domain as `ethanbaumann.fr` and enable HTTPS through the hosting
platform. No persistent volume or database is needed.

Commit `bun.lock` and the source assets, including `app/assets/models/EB_LOGO.obj`.
Generated `.nuxt/`, `.output/`, `.cache/`, and `node_modules/` directories are
ignored and should not be committed. The 3D model is bundled at build time, so
model updates require a rebuild and redeploy.

See the [Railpack Node.js documentation](https://railpack.com/languages/node/)
and [Bun support](https://railpack.com/languages/bun/) for detection and toolchain
configuration.

## Contact form and OVH SMTP

`/contact` submits to the server-only `POST /api/contact` endpoint. Static hosting
and `bun run generate` cannot deliver form messages; deploy with `bun run build`
and `bun run start` using the included Railpack configuration.

Copy `.env.example` to `.env` for local development. In production, configure:

| Variable | Value |
| --- | --- |
| `NUXT_SMTP_HOST` | `ssl0.ovh.net` for OVH MX Plan, or your product's SMTP host |
| `NUXT_SMTP_PORT` | `465` (implicit TLS); `587` uses mandatory STARTTLS if your service supports it |
| `NUXT_SMTP_USER` | Full mailbox address, e.g. `contact@ethanbaumann.fr` |
| `NUXT_SMTP_PASSWORD` | Mailbox password, not the OVH account password |
| `NUXT_CONTACT_TO` | Recipient address; defaults to `contact@ethanbaumann.fr` |
| `NUXT_CONTACT_ORIGIN` | Public origin without a trailing slash; defaults to `https://ethanbaumann.fr` |

These variables are private runtime configuration and never sent to the browser.
Nuxt dev uses the local request origin. For a local production preview, set
`NUXT_CONTACT_ORIGIN=http://localhost:3000` in the process environment. Restart
the server after changing variables. The authenticated mailbox is always the
sender; the visitor is the Reply-To address. No automatic visitor email is sent.
See [OVH's MX Plan settings](https://docs.ovhcloud.com/en/guides/web-cloud/email-and-collaborative-solutions/mx-plan/landing-page-mx-plan)
for product-specific connection details. Hosting must allow outbound SMTP traffic.

The endpoint validates fields and JSON size, checks the request origin, includes
a honeypot, and allows five submissions per ten minutes per socket IP. This limit
is in memory, resets on restart, and is separate on each instance. Behind a proxy,
the socket IP may be shared by visitors; configure a trusted proxy/CDN rate limit
for `/api/contact` when deploying multiple replicas or needing per-visitor limits.
Forwarded IP headers are intentionally not trusted by the application.

Run `bun test` for contact endpoint tests (SMTP is mocked; no email is sent).
After setting the real credentials, submit one message and confirm receipt and
Reply-To behavior in the destination mailbox. An SMTP acceptance confirms the
server accepted the email, but does not guarantee inbox delivery.
