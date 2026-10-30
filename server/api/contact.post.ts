import nodemailer from 'nodemailer'
import {
  createError, defineEventHandler, getHeader, getRequestIP, getRequestURL, setHeader
} from 'h3'
import { useRuntimeConfig } from '#imports'
import { allowContactAttempt, emailPattern, readContactBody, validateContact } from '../utils/contact'
import { verifyTurnstile } from '../utils/turnstile'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  const config = useRuntimeConfig(event)
  const origin = getHeader(event, 'origin')
  const allowedOrigin = import.meta.dev ? getRequestURL(event).origin : config.contact.origin

  if (origin !== allowedOrigin) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden origin' })
  }
  if (getHeader(event, 'content-type')?.split(';')[0]?.trim() !== 'application/json') {
    throw createError({ statusCode: 415, statusMessage: 'Expected JSON' })
  }

  // Use the socket IP; do not trust client-supplied forwarding headers.
  if (!allowContactAttempt(getRequestIP(event) || 'unknown')) {
    setHeader(event, 'Retry-After', '600')
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }
  const body = await readContactBody(event)
  const { name, email, message, website } = validateContact(body)
  if (website) return { success: true }

  await verifyTurnstile((body as Record<string, unknown>).turnstileToken, config.turnstile.secretKey, allowedOrigin)

  const { host, user, password } = config.smtp
  const port = Number(config.smtp.port)
  const to = config.contact.to
  if (!host || !password || !emailPattern.test(user) || !emailPattern.test(to) || ![465, 587].includes(port)) {
    throw createError({ statusCode: 503, statusMessage: 'Contact service unavailable' })
  }

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: true,
    auth: { user, pass: password },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: { minVersion: 'TLSv1.2' }
  })

  try {
    const result = await transport.sendMail({
      from: { name: 'Portfolio Ethan Baumann', address: user },
      to: { address: to, name: 'Ethan Baumann' },
      replyTo: { name, address: email },
      subject: 'Nouveau contact - ethanbaumann.fr',
      text: `Nom : ${name}\nE-mail : ${email}\n\n${message}`,
      disableFileAccess: true,
      disableUrlAccess: true
    })
    if (!result.accepted?.length) throw new Error('Recipient rejected')
  } catch {
    // Do not expose SMTP responses, credentials, or submitted personal data.
    throw createError({ statusCode: 502, statusMessage: 'Message delivery failed' })
  } finally {
    transport.close()
  }

  return { success: true }
})
