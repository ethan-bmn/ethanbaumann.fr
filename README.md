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

## Docker Compose

Create `.env` from `.env.example` if it does not already exist, then fill in the
SMTP mailbox credentials and Turnstile keys (see below). Compose passes the contact settings to the running
container; `.env` files are excluded from the Docker build context.

```bash
docker compose up -d --build
docker compose logs -f app
```

The app is available on port `3000`. `HOST` and `PORT` in `.env` control the
published interface and port; the container always listens on `0.0.0.0:3000`.
For local form submissions, set `NUXT_CONTACT_ORIGIN=http://localhost:3000`
(adjust the port if needed). For deployment behind an HTTPS reverse proxy, set
it to `https://ethanbaumann.fr` and forward traffic to the published app port.

The image builds with Bun 1.3.14 and Node.js 24, then runs only the production
output as an unprivileged user. No source mounts or persistent volumes are needed.
After changing runtime settings, run `docker compose up -d` to recreate the
container. Use `docker compose down` to stop and remove it.

See the [Compose environment documentation](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)
for variable handling.

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

For local development, create the ignored `.env` file before starting Nuxt:

```bash
cp .env.example .env
```

Set `NUXT_SMTP_USER` and `NUXT_SMTP_PASSWORD` in `.env`, then start (or restart)
`bun run dev`. Nuxt does not load `.env.example`; keep it free of credentials.
In production, configure these variables in the hosting platform:

| Variable | Value |
| --- | --- |
| `NUXT_SMTP_HOST` | `ssl0.ovh.net` for OVH MX Plan, or your product's SMTP host |
| `NUXT_SMTP_PORT` | `465` (implicit TLS); `587` uses mandatory STARTTLS if your service supports it |
| `NUXT_SMTP_USER` | Full mailbox address, e.g. `contact@ethanbaumann.fr` |
| `NUXT_SMTP_PASSWORD` | Mailbox password, not the OVH account password |
| `NUXT_CONTACT_TO` | Recipient address; defaults to `contact@ethanbaumann.fr` |
| `NUXT_CONTACT_ORIGIN` | Public origin without a trailing slash; defaults to `https://ethanbaumann.fr` |
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | Public site key for your Cloudflare Turnstile widget |
| `NUXT_TURNSTILE_SECRET_KEY` | Private secret key for the same widget |

SMTP settings and the Turnstile secret are private runtime configuration and
never sent to the browser. Only the Turnstile site key is public.
Nuxt dev uses the local request origin. For a local production preview, set
`NUXT_CONTACT_ORIGIN=http://localhost:3000` in the process environment. Restart
the server after changing variables. The authenticated mailbox is always the
sender; the visitor is the Reply-To address. No automatic visitor email is sent.
If submission returns `503 Contact service unavailable`, the server has missing
or invalid SMTP configuration: check the host, mailbox address, password,
recipient address, and port (`465` or `587`). This check runs before any SMTP
connection, so this error does not indicate that the mail server rejected delivery.
See [OVH's MX Plan settings](https://docs.ovhcloud.com/en/guides/web-cloud/email-and-collaborative-solutions/mx-plan/landing-page-mx-plan)
for product-specific connection details. Hosting must allow outbound SMTP traffic.

The home page ends with the contact form at `/#contact`; the header and quote
buttons scroll to it. `/contact` also uses the same form.

### Cloudflare Turnstile

In the [Cloudflare dashboard](https://dash.cloudflare.com/), open Turnstile and
create a **Managed** widget. Add `ethanbaumann.fr` to its allowed hostnames (and
any other hostname you actually serve). Put the site key in
`NUXT_PUBLIC_TURNSTILE_SITE_KEY` and the secret key in
`NUXT_TURNSTILE_SECRET_KEY` in `.env` or the hosting platform's environment.
Restart Nuxt or recreate the Compose container after changing them. The secret
stays on the server. Pages are server-rendered so the public site key can be
changed at runtime without rebuilding the Docker image.

Submission stays disabled until the challenge supplies a token. The server
validates it with Cloudflare before sending email, including its hostname
against `NUXT_CONTACT_ORIGIN` and its `contact` action. Missing keys, failed
verification, and Cloudflare outages never allow email delivery. Tokens are
reset after every submission attempt. Visitors can still use the email link
if the widget cannot load.

For local development with real keys, use a separate widget allowing your local
hostname, and set the production-preview origin to match. Automated tests mock
Cloudflare and SMTP; no challenge or email delivery is required. Cloudflare also
provides [dummy keys for isolated testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/);
never deploy those keys publicly. Our hostname and action checks still apply.

The endpoint validates fields and JSON size, checks the request origin, verifies
the [Turnstile token on the server](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/),
includes a honeypot, and allows five submissions per ten minutes per socket IP. This limit
is in memory, resets on restart, and is separate on each instance. Behind a proxy,
the socket IP may be shared by visitors; configure a trusted proxy/CDN rate limit
for `/api/contact` when deploying multiple replicas or needing per-visitor limits.
Forwarded IP headers are intentionally not trusted by the application.

Run `bun test` for contact endpoint tests (SMTP is mocked; no email is sent).
After setting the real credentials, submit one message and confirm receipt and
Reply-To behavior in the destination mailbox. An SMTP acceptance confirms the
server accepted the email, but does not guarantee inbox delivery.
