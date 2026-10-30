interface TurnstileOptions {
  sitekey: string
  action: string
  theme: string
  size: string
  language: string
  'response-field': boolean
  callback: (token: string) => void
  'expired-callback': () => void
  'error-callback': () => void
  'timeout-callback': () => void
}

export interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileOptions) => string
  reset: (id: string) => void
  remove: (id: string) => void
  ready: (callback: () => void) => void
}

let pending: Promise<TurnstileApi> | undefined

export function loadTurnstile() {
  if (pending) return pending
  pending = new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script')
    const fail = () => {
      clearTimeout(timer)
      script.remove()
      reject(new Error('Unable to load Turnstile'))
    }
    const timer = window.setTimeout(fail, 15000)
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onerror = fail
    script.onload = () => {
      const api = (window as Window & { turnstile?: TurnstileApi }).turnstile
      if (!api) return fail()
      api.ready(() => {
        clearTimeout(timer)
        resolve(api)
      })
    }
    document.head.appendChild(script)
  }).catch(error => {
    pending = undefined
    throw error
  })
  return pending
}
