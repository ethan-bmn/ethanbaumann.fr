<script setup lang="ts">
const container = useTemplateRef('container')
const measure = useTemplateRef('measure')
const drawing = ref('')
let observer: ResizeObserver | undefined
let frame = 0
let startedAt: number | undefined
let motion: MediaQueryList | undefined
let draw: (() => void) | undefined

onMounted(() => {
  motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  draw = () => {
    if (!container.value || !measure.value) return
    cancelAnimationFrame(frame)
    const cell = measure.value.getBoundingClientRect()
    const width = container.value.clientWidth
    const height = container.value.clientHeight
    const columns = Math.max(2, Math.floor(width / cell.width))
    const rows = Math.max(2, Math.floor(height / cell.height))
    const perimeter: { row: number, column: number, character: string }[] = []

    for (let column = 0; column < columns; column++) {
      perimeter.push({ row: 0, column, character: column === 0 || column === columns - 1 ? '+' : '-' })
    }
    for (let row = 1; row < rows; row++) {
      perimeter.push({ row, column: columns - 1, character: row === rows - 1 ? '+' : '|' })
    }
    for (let column = columns - 2; column >= 0; column--) {
      perimeter.push({ row: rows - 1, column, character: column === 0 ? '+' : '-' })
    }
    for (let row = rows - 2; row > 0; row--) {
      perimeter.push({ row, column: 0, character: '|' })
    }

    const render = (count: number) => {
      const grid = Array.from({ length: rows }, () => Array<string>(columns).fill(' '))
      for (const cell of perimeter.slice(0, count)) grid[cell.row]![cell.column] = cell.character
      drawing.value = grid.map(row => row.join('')).join('\n')
    }
    const tick = (now: number) => {
      startedAt ??= now
      const progress = motion?.matches ? 1 : Math.min(1, (now - startedAt) / 1400)
      render(Math.ceil(perimeter.length * progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }
  observer = new ResizeObserver(draw)
  observer.observe(container.value!)
  motion.addEventListener('change', draw)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
  if (draw) motion?.removeEventListener('change', draw)
})
</script>

<template>
  <div ref="container" class="ascii-frame" aria-hidden="true">
    <span ref="measure" class="ascii-measure">+</span>
    <pre>{{ drawing }}</pre>
  </div>
</template>

<style scoped>
.ascii-frame {
  position: absolute;
  inset: 17px;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  color: #e5e5df;
  font-family: inherit;
  font-size: 12px;
  line-height: 16px;
}
.ascii-measure { position: absolute; visibility: hidden; display: block; }
pre { margin: 0; font: inherit; white-space: pre; letter-spacing: 0; }
@media (max-width: 700px) { .ascii-frame { inset: 9px; } }
</style>
