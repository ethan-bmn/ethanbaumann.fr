import { afterAll, beforeAll, expect, mock, test } from 'bun:test'
import { createServer, type Server } from 'node:http'
import { createApp, defineEventHandler, toNodeListener } from 'h3'
import { allowContactAttempt, readContactBody, validateContact } from '../server/utils/contact'

const config = {
  smtp: { host: 'ssl0.ovh.net', port: 465, user: 'contact@ethanbaumann.fr', password: 'test-only' },
  contact: { to: 'contact@ethanbaumann.fr', origin: 'https://ethanbaumann.fr' }
}
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

function post(path: string, body: unknown, origin = config.contact.origin, contentType = 'application/json') {
  return fetch(`${base}${path}`, {
    method: 'POST',
    headers: { origin, 'content-type': contentType },
    body: typeof body === 'string' ? body : JSON.stringify(body)
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

test('bounds streamed body size and rejects malformed JSON', async () => {
  expect((await post('/body', '{')).status).toBe(400)
  expect((await post('/body', 'x'.repeat(25000))).status).toBe(413)
  expect(await (await post('/body', valid)).json()).toEqual(valid)
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

  expect((await post('/api/contact', { ...valid, website: 'spam.example' })).status).toBe(200)
  expect(sendMail).toHaveBeenCalledTimes(1)
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
