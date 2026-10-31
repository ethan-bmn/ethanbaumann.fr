const hourMs = 60 * 60 * 1000

// Per-process protection, like the request limiter. Reserve before awaiting SMTP.
export function createContactEmailLimiter() {
  const deliveries = new Map<string, { at: number }[]>()

  return function reserve(key: string, now = Date.now()) {
    for (const [ip, entries] of deliveries) {
      const active = entries.filter(entry => entry.at > now - hourMs)
      if (active.length) deliveries.set(ip, active)
      else deliveries.delete(ip)
    }

    const entries = deliveries.get(key) || []
    if (entries.length >= 2) {
      return { allowed: false as const, retryAfter: Math.max(1, Math.ceil((entries[0]!.at + hourMs - now) / 1000)) }
    }
    if (!entries.length && deliveries.size >= 10000) {
      return { allowed: false as const, retryAfter: 3600 }
    }

    const reservation = { at: now }
    entries.push(reservation)
    deliveries.set(key, entries)

    return {
      allowed: true as const,
      release() {
        const remaining = deliveries.get(key)?.filter(entry => entry !== reservation)
        if (remaining?.length) deliveries.set(key, remaining)
        else deliveries.delete(key)
      }
    }
  }
}

export const reserveContactEmail = createContactEmailLimiter()
