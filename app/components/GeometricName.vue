<script setup lang="ts">
const props = withDefaults(defineProps<{ word: string, delay?: number }>(), { delay: 0 })
const emit = defineEmits<{ complete: [] }>()
const displayedWord = ref(props.word)
const complete = ref(false)
const ready = ref(false)

// Broad strokes and rounded bowls echo the supplied EB monogram.
// These outlines keep the display lettering identical across platforms.
const glyphs: Record<string, { width: number, path: string }> = {
  E: { width: 56, path: 'M0 0H56V13H14V32H49V45H14V65H56V78H0Z' },
  T: { width: 62, path: 'M0 0H62V14H38V78H24V14H0Z' },
  H: { width: 62, path: 'M0 0H14V32H48V0H62V78H48V46H14V78H0Z' },
  A: { width: 66, path: 'M0 78L25 0H41L66 78H51L46 61H20L15 78ZM24 48H42L33 17Z' },
  N: { width: 64, path: 'M0 78V0H14L50 53V0H64V78H50L14 25V78Z' },
  B: { width: 62, path: 'M0 0H36Q60 0 60 21Q60 33 50 38Q62 43 62 57Q62 78 37 78H0ZM14 13V32H34Q46 32 46 22Q46 13 34 13ZM14 45V65H35Q48 65 48 55Q48 45 35 45Z' },
  U: { width: 64, path: 'M0 0H14V48Q14 65 32 65Q50 65 50 48V0H64V49Q64 79 32 79Q0 79 0 49Z' },
  M: { width: 76, path: 'M0 78V0H15L38 39L61 0H76V78H62V25L38 64L14 25V78Z' }
}

const letters = computed(() => {
  let offset = 0
  return Array.from(props.word).map(letter => {
    const glyph = glyphs[letter]!
    const result = { ...glyph, offset }
    offset += glyph.width + 9
    return result
  })
})
const width = computed(() => letters.value.reduce((total, letter) => total + letter.width + 9, -9))
const displayedLetters = computed(() => letters.value.map((letter, index) => {
  const character = displayedWord.value[index]!
  const glyph = glyphs[character] ?? letter
  return { path: glyph.path, offset: letter.offset, scale: letter.width / glyph.width, visible: character !== ' ' }
}))

let frame = 0
let motion: MediaQueryList | undefined
const finish = () => {
  cancelAnimationFrame(frame)
  displayedWord.value = props.word
  complete.value = true
  emit('complete')
}
const onMotionChange = () => { if (motion?.matches) finish() }

onMounted(() => {
  motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  motion.addEventListener('change', onMotionChange)
  if (motion.matches) {
    finish()
    return
  }

  // Mask every letter before revealing the SVG after hydration.
  displayedWord.value = ' '.repeat(props.word.length)
  ready.value = true
  const alphabet = Object.keys(glyphs)
  const stagger = 110
  const scrambleDuration = 300
  const duration = (props.word.length - 1) * stagger + scrambleDuration
  const start = performance.now()
  let lastTick = -1
  const tick = (now: number) => {
    const elapsed = now - start - props.delay
    if (elapsed >= duration) {
      finish()
      return
    }
    const step = Math.floor(Math.max(0, elapsed) / (1000 / 24))
    if (step !== lastTick) {
      displayedWord.value = Array.from(props.word).map((letter, index) => {
        const beginsAt = index * stagger
        if (elapsed < beginsAt) return ' '
        return elapsed >= beginsAt + scrambleDuration ? letter : alphabet[Math.floor(Math.random() * alphabet.length)]!
      }).join('')
      lastTick = step
    }
    frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  motion?.removeEventListener('change', onMotionChange)
})
</script>

<template>
  <svg :viewBox="`0 0 ${width} 80`" :style="{ '--word-width': width }" :data-scramble-pending="!ready && !complete ? '' : undefined" :data-scramble-complete="complete ? '' : undefined" class="name-word" aria-hidden="true" focusable="false">
    <path v-for="(letter, index) in displayedLetters" :key="index" :d="letter.path" :visibility="letter.visible ? undefined : 'hidden'" :transform="`translate(${letter.offset} 0) scale(${letter.scale} 1)`" fill="currentColor" fill-rule="evenodd" />
  </svg>
</template>
