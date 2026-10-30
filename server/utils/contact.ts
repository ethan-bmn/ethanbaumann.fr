import { createError, type H3Event } from 'h3'

export async function readContactBody(event: H3Event) {
  const raw = await new Promise<string>((resolve, reject) => {
    const request = event.node.req
    const chunks: Buffer[] = []
    let size = 0
    const cleanup = () => {
      request.off('data', onData)
      request.off('end', onEnd)
      request.off('error', onError)
      request.off('aborted', onAbort)
    }
    const onError = () => {
      cleanup()
      reject(createError({ statusCode: 400, statusMessage: 'Unable to read contact form' }))
    }
    const onAbort = () => onError()
    const onEnd = () => {
      cleanup()
      resolve(Buffer.concat(chunks).toString('utf8'))
    }
    const onData = (chunk: Buffer) => {
      size += chunk.length
      if (size > 24 * 1024) {
        cleanup()
        request.resume()
        reject(createError({ statusCode: 413, statusMessage: 'Contact form too large' }))
      } else {
        chunks.push(chunk)
      }
    }
    request.on('data', onData)
    request.on('end', onEnd)
    request.on('error', onError)
    request.on('aborted', onAbort)
  })

  try {
    return JSON.parse(raw) as unknown
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid JSON' })
  }
}

export const emailPattern = /^[^\s<>@,;:]+@[^\s<>@,;:]+\.[^\s<>@,;:]+$/

export function validateContact(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid contact form' })
  }

  const fields = body as Record<string, unknown>
  const name = typeof fields.name === 'string' ? fields.name.trim() : ''
  const email = typeof fields.email === 'string' ? fields.email.trim() : ''
  const message = typeof fields.message === 'string' ? fields.message.trim() : ''
  const website = typeof fields.website === 'string' ? fields.website.trim() : ''

  if (
    name.length < 2 || name.length > 100 || /[\r\n\x00-\x1f\x7f]/.test(name)
    || email.length > 254 || !emailPattern.test(email) || /[\x00-\x1f\x7f]/.test(email)
    || message.length < 10 || message.length > 5000 || message.includes('\0')
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid contact form' })
  }

  return { name, email, message, website }
}

// Bounded, per-process protection. A shared edge limit is needed for multiple replicas.
const attempts = new Map<string, { count: number, expires: number }>()
const windowMs = 10 * 60 * 1000

export function allowContactAttempt(key: string, now = Date.now()) {
  for (const [ip, attempt] of attempts) {
    if (attempt.expires <= now) attempts.delete(ip)
  }

  const attempt = attempts.get(key)
  if (attempt) {
    if (attempt.count >= 5) return false
    attempt.count++
  } else {
    if (attempts.size >= 10000) return false
    attempts.set(key, { count: 1, expires: now + windowMs })
  }

  return true
}
