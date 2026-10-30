import { createError } from 'h3'

interface TurnstileResult {
  success?: boolean
  hostname?: string
  action?: string
}

export async function verifyTurnstile(token: unknown, secret: string, origin: string) {
  if (!secret) {
    throw createError({ statusCode: 503, statusMessage: 'Contact verification unavailable' })
  }
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) {
    throw createError({ statusCode: 403, statusMessage: 'Contact verification required' })
  }

  let result: TurnstileResult
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(10000)
    })
    if (!response.ok) throw new Error('Verification request failed')
    result = await response.json() as TurnstileResult
    if (!result || typeof result !== 'object') throw new Error('Invalid verification response')
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'Contact verification unavailable' })
  }

  if (result.success !== true || result.hostname !== new URL(origin).hostname || result.action !== 'contact') {
    throw createError({ statusCode: 403, statusMessage: 'Contact verification failed' })
  }
}
