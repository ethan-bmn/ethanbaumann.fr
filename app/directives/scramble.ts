import type { ObjectDirective } from 'vue'

export interface ScrambleOptions {
  enabled?: boolean
  text?: string
  duration?: number
  delay?: number
  characters?: string
  direction?: 'linear' | 'diagonal'
}

type ScrambleValue = string | ScrambleOptions | undefined

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/\\_[]{}<>!?#%+='
const cleanups = new WeakMap<HTMLElement, () => void>()

function animate(el: HTMLElement, value: ScrambleValue) {
  cleanups.get(el)?.()
  el.removeAttribute('data-scramble-complete')
  const options = typeof value === 'string' ? { text: value } : value ?? {}
  // Preserve line breaks from templates before replacing the text node.
  const readText = () => Array.from(el.childNodes).map(node =>
    node.nodeName === 'BR' ? '\n' : node.textContent ?? ''
  ).join('')
  const target = options.text ?? el.dataset.scrambleText ?? readText()
  el.dataset.scrambleText = target
  // Keep a stable accessible text node; never announce the random characters.
  const accessible = document.createElement('span')
  accessible.textContent = target
  accessible.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0'
  const visual = document.createElement('span')
  visual.setAttribute('aria-hidden', 'true')
  visual.style.whiteSpace = 'inherit'
  el.replaceChildren(accessible, visual)

  // Keep the readable SSR layout reserved until a preceding animation finishes.
  if (options.enabled === false) {
    visual.textContent = target
    return
  }

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const characters = Array.from(options.characters || alphabet)
  const letters = Array.from(target)
  const rows = target.split('\n')
  const width = Math.max(1, ...rows.map(row => Array.from(row).length))
  const diagonalSize = Math.max(1, width + rows.length - 2)
  let row = 0
  let column = 0
  const positions = letters.map(letter => {
    const position = (row + column) / diagonalSize
    if (letter === '\n') {
      row++
      column = 0
    } else {
      column++
    }
    return position
  })
  const duration = Math.max(0, options.duration ?? 1600)
  const delay = Math.max(0, options.delay ?? 0)
  let frame = 0
  let start: number | undefined
  let lastTick = -1

  const finish = () => {
    cancelAnimationFrame(frame)
    visual.textContent = target
    el.setAttribute('data-scramble-complete', '')
  }
  const onMotionChange = () => { if (motion.matches) finish() }
  motion.addEventListener('change', onMotionChange)
  cleanups.set(el, () => {
    cancelAnimationFrame(frame)
    motion.removeEventListener('change', onMotionChange)
  })
  if (motion.matches || duration === 0) {
    finish()
    el.removeAttribute('data-scramble-pending')
    return
  }

  const render = (progress: number) => {
    visual.textContent = letters.map((letter, index) => {
      if (/\s/.test(letter)) return letter
      if (progress <= 0) return ' '
      if (options.direction === 'diagonal') {
        // A moving band of noise builds each glyph along its diagonals.
        const beginsAt = positions[index]! * .65
        if (progress <= beginsAt) return ' '
        if (progress >= beginsAt + .35) return letter
        return characters[Math.floor(Math.random() * characters.length)]
      }
      // Reveal a short band of scrambling letters in reading order.
      const beginsAt = (index / Math.max(1, letters.length - 1)) * .75
      if (progress <= beginsAt) return ' '
      if (progress >= beginsAt + .25) return letter
      return characters[Math.floor(Math.random() * characters.length)]
    }).join('')
  }
  render(0)
  // Reveal the reserved layout only after the original text has been masked.
  el.removeAttribute('data-scramble-pending')
  const tick = (now: number) => {
    start ??= now
    const elapsed = now - start - delay
    if (elapsed >= duration) {
      finish()
      return
    }
    // Limit character changes to 24 fps while keeping animation timing smooth.
    const step = Math.floor(Math.max(0, elapsed) / (1000 / 24))
    if (elapsed >= 0 && step !== lastTick) {
      render(elapsed / duration)
      lastTick = step
    }
    frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
}

export const vScramble: ObjectDirective<HTMLElement, ScrambleValue> = {
  created: el => el.setAttribute('data-scramble-pending', ''),
  mounted: (el, binding) => animate(el, binding.value),
  updated(el, binding) {
    if (JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue)) {
      animate(el, binding.value)
    }
  },
  beforeUnmount(el) {
    cleanups.get(el)?.()
    cleanups.delete(el)
  },
  getSSRProps: () => ({ 'data-scramble-pending': '' })
}
