import { afterAll, beforeAll, beforeEach, expect, mock, spyOn, test } from 'bun:test'
import { createServer, type Server } from 'node:http'
import { createApp, defineEventHandler, toNodeListener } from 'h3'
import { allowContactAttempt, readContactBody, validateContact } from '../server/utils/contact'
import { createContactEmailLimiter } from '../server/utils/contact-email-limit'

let clock = Date.now()
const clockSpy = spyOn(Date, 'now').mockImplementation(() => clock)
beforeEach(() => { clock += 3600001 })
afterAll(() => clockSpy.mockRestore())

const config = {
  smtp: { host: 'ssl0.ovh.net', port: 465, user: 'contact@ethanbaumann.fr', password: 'test-only' },
  contact: { to: 'contact@ethanbaumann.fr', origin: 'https://ethanbaumann.fr' },
  turnstile: { secretKey: 'test-secret' }
}
const siteverify = mock(async (_input: unknown, _options?: RequestInit) => Response.json({
  success: true, hostname: 'ethanbaumann.fr', action: 'contact'
}))
const originalFetch = globalThis.fetch
const fetchSpy = spyOn(globalThis, 'fetch').mockImplementation(((input: string | URL | Request, options?: RequestInit) => {
  if (String(input) === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') return siteverify(input, options)
  return originalFetch(input, options)
}) as typeof fetch)
const sendMail = mock(async (_message: unknown) => ({ accepted: ['contact@ethanbaumann.fr'] }))
const close = mock(() => {})
const createTransport = mock((_options: unknown) => ({ sendMail, close }))
mock.module('nodemailer', () => ({ default: { createTransport } }))
mock.module('#imports', () => ({ useRuntimeConfig: () => config }))
const { default: contact } = await import('../server/api/contact.post')

let server: Server
let base: string
const valid = { name: 'Alice Dupont', email: 'alice@example.com', message: 'Bonjour, un projet de site web.', website: '' }

beforeAll(async () => {
  const app = createApp()
  app.use('/api/contact', contact)
  app.use('/body', defineEventHandler(event => readContactBody(event)))
  server = createServer(toNodeListener(app))
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  base = `http://127.0.0.1:${(server.address() as { port: number }).port}`
})
afterAll(() => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())))
afterAll(() => fetchSpy.mockRestore())

function post(path: string, body: unknown, origin = config.contact.origin, contentType = 'application/json') {
  return fetch(`${base}${path}`, {
    method: 'POST',
    headers: { origin, 'content-type': contentType },
    body: typeof body === 'string' ? body : JSON.stringify({ turnstileToken: 'test-token', ...(body as object) })
  })
}

test('trims values and preserves message line breaks', () => {
  expect(validateContact({ ...valid, name: ' Alice ', message: ' First line\nSecond line ' }))
    .toEqual({ ...valid, name: 'Alice', message: 'First line\nSecond line' })
})

test('rejects invalid fields, oversized values and header injection', () => {
  for (const fields of [
    null, [], {}, { ...valid, name: 'A' }, { ...valid, name: 'Alice\r\nBcc: victim@example.com' },
    { ...valid, name: 'A'.repeat(101) }, { ...valid, email: 'alice@example.com\r\nBcc:x@example.com' },
    { ...valid, email: 'invalid' }, { ...valid, email: 'a@example.com,b@example.com' },
    { ...valid, message: 'short' }, { ...valid, message: 'a'.repeat(5001) }
  ]) expect(() => validateContact(fields)).toThrow()
})

test('limits attempts independently and expires the window', () => {
  const now = Date.now()
  for (let index = 0; index < 5; index++) expect(allowContactAttempt('unit-a', now)).toBe(true)
  expect(allowContactAttempt('unit-a', now)).toBe(false)
  expect(allowContactAttempt('unit-b', now)).toBe(true)
  expect(allowContactAttempt('unit-a', now + 600000)).toBe(true)
})

test('email quota uses a rolling hour per IP and releases failed delivery slots', () => {
  const reserve = createContactEmailLimiter()
  const first = reserve('a', 0)
  expect(first.allowed).toBe(true)
  expect(reserve('a', 600000).allowed).toBe(true)
  expect(reserve('a', 600001)).toEqual({ allowed: false, retryAfter: 3000 })
  expect(reserve('b', 600001).allowed).toBe(true)
  expect(reserve('a', 3599999)).toEqual({ allowed: false, retryAfter: 1 })
  expect(reserve('a', 3600000).allowed).toBe(true)
  // The second delivery is still in the rolling hour after the first expires.
  expect(reserve('a', 3600000)).toEqual({ allowed: false, retryAfter: 600 })
  if (first.allowed) first.release()
  expect(reserve('a', 3600000).allowed).toBe(false)

  const failed = reserve('failed', 0)
  expect(reserve('failed', 0).allowed).toBe(true)
  expect(reserve('failed', 0).allowed).toBe(false)
  if (failed.allowed) failed.release()
  expect(reserve('failed', 0).allowed).toBe(true)
})

test('bounds streamed body size and rejects malformed JSON', async () => {
  expect((await post('/body', '{')).status).toBe(400)
  expect((await post('/body', 'x'.repeat(25000))).status).toBe(413)
  expect(await (await post('/body', valid)).json()).toEqual({ ...valid, turnstileToken: 'test-token' })
})

test('endpoint enforces origin, content type, delivery and spam controls', async () => {
  expect((await post('/api/contact', valid, 'https://elsewhere.example')).status).toBe(403)
  expect((await post('/api/contact', valid, config.contact.origin, 'text/plain')).status).toBe(415)

  const success = await post('/api/contact', valid)
  expect(success.status).toBe(200)
  expect(await success.json()).toEqual({ success: true })
  expect(success.headers.get('cache-control')).toBe('no-store')
  expect(createTransport.mock.calls[0]?.[0]).toMatchObject({
    host: 'ssl0.ovh.net', port: 465, secure: true, requireTLS: true,
    auth: { user: config.smtp.user, pass: config.smtp.password }
  })
  expect(sendMail.mock.calls[0]?.[0]).toMatchObject({
    from: { address: config.smtp.user }, to: { address: config.contact.to },
    replyTo: { name: valid.name, address: valid.email }
  })
  expect(close).toHaveBeenCalledTimes(1)
  expect(siteverify).toHaveBeenCalledTimes(1)
  const verification = siteverify.mock.calls[0]?.[1]
  expect(JSON.parse(verification?.body as string)).toEqual({ secret: 'test-secret', response: 'test-token' })

  expect((await post('/api/contact', { ...valid, website: 'spam.example' })).status).toBe(200)
  expect(sendMail).toHaveBeenCalledTimes(1)
  expect(siteverify).toHaveBeenCalledTimes(1)
  expect((await post('/api/contact', { ...valid, email: 'bad' })).status).toBe(400)

  sendMail.mockImplementationOnce(async () => { throw new Error('SMTP secret response') })
  const failure = await post('/api/contact', valid)
  expect(failure.status).toBe(502)
  expect(await failure.text()).not.toContain('SMTP secret response')
  expect(close).toHaveBeenCalledTimes(2)

  config.smtp.password = ''
  expect((await post('/api/contact', valid)).status).toBe(503)
  const limited = await post('/api/contact', valid)
  expect(limited.status).toBe(429)
  expect(limited.headers.get('retry-after')).toBe('600')
})

test('blocks absent, oversized, rejected, replayed and mismatched Turnstile tokens before SMTP', async () => {
  config.smtp.password = 'test-only'
  const sentBefore = sendMail.mock.calls.length
  const cases = [
    { token: undefined, result: undefined },
    { token: null, result: undefined },
    { token: 42, result: undefined },
    { token: '', result: undefined },
    { token: 'x'.repeat(2049), result: undefined },
    { token: 'forged', result: { success: false, 'error-codes': ['invalid-input-response'] } },
    { token: 'replayed', result: { success: false, 'error-codes': ['timeout-or-duplicate'] } },
    { token: 'wrong-host', result: { success: true, hostname: 'attacker.example', action: 'contact' } },
    { token: 'wrong-action', result: { success: true, hostname: 'ethanbaumann.fr', action: 'login' } }
  ]
  for (const entry of cases) {
    allowContactAttempt('reset-turnstile-tests', Date.now() + 600001)
    const calls = siteverify.mock.calls.length
    if (entry.result) siteverify.mockImplementationOnce(async () => Response.json(entry.result))
    expect((await post('/api/contact', { ...valid, turnstileToken: entry.token })).status).toBe(403)
    expect(siteverify.mock.calls.length - calls).toBe(entry.result ? 1 : 0)
  }
  expect(sendMail.mock.calls.length).toBe(sentBefore)
})

test('endpoint sends at most two emails per hour even with concurrent requests', async () => {
  const before = sendMail.mock.calls.length
  const responses = await Promise.all(Array.from({ length: 3 }, () => post('/api/contact', valid)))
  expect(responses.map(response => response.status).sort()).toEqual([200, 200, 429])
  expect(sendMail.mock.calls.length - before).toBe(2)
  expect(responses.find(response => response.status === 429)?.headers.get('retry-after')).toBe('3600')

  // A forged forwarding header cannot give the same socket a fresh quota.
  const spoofed = await fetch(`${base}/api/contact`, {
    method: 'POST',
    headers: { origin: config.contact.origin, 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.25' },
    body: JSON.stringify({ ...valid, turnstileToken: 'test-token' })
  })
  expect(spoofed.status).toBe(429)
  clock += 3600000
  expect((await post('/api/contact', valid)).status).toBe(200)
})

test('failed email delivery does not consume the hourly quota', async () => {
  sendMail.mockImplementationOnce(async () => { throw new Error('SMTP unavailable') })
  expect((await post('/api/contact', valid)).status).toBe(502)
  expect((await post('/api/contact', valid)).status).toBe(200)
  expect((await post('/api/contact', valid)).status).toBe(200)
  const blocked = await post('/api/contact', valid)
  expect(blocked.status).toBe(429)
  expect(blocked.headers.get('retry-after')).toBe('3600')
})

test('fails closed when verification is unavailable or unconfigured without exposing secrets', async () => {
  const sentBefore = sendMail.mock.calls.length
  for (const failure of ['network', 'http', 'json', 'null', 'config']) {
    allowContactAttempt('reset-turnstile-tests', Date.now() + 600001)
    if (failure === 'network') siteverify.mockImplementationOnce(async () => { throw new Error('private Cloudflare error') })
    if (failure === 'http') siteverify.mockImplementationOnce(async () => new Response('private Cloudflare error', { status: 500 }))
    if (failure === 'json') siteverify.mockImplementationOnce(async () => new Response('not JSON'))
    if (failure === 'null') siteverify.mockImplementationOnce(async () => Response.json(null))
    if (failure === 'config') config.turnstile.secretKey = ''
    const response = await post('/api/contact', valid)
    expect(response.status).toBe(503)
    const text = await response.text()
    expect(text).not.toContain('private Cloudflare error')
    expect(text).not.toContain('test-secret')
  }
  config.turnstile.secretKey = 'test-secret'
  expect(sendMail.mock.calls.length).toBe(sentBefore)
})
