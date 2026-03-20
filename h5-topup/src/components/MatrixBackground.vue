<!-- components/MatrixBackground.vue -->
<template>
  <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-99">
    <canvas ref="matrixCanvas" class="absolute inset-0" :style="{ opacity }"></canvas>
    <div class="scan-line-vertical"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  opacity: {
    type: Number,
    default: 0.15,
  },
  color: {
    type: String,
    default: '#00FFA3',
  },
  fontSize: {
    type: Number,
    default: 12,
  },
  chars: {
    type: String,
    default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*',
  },
  speed: {
    type: Number,
    default: 50, // ms interval
  },
  bgColor: {
    type: String,
    default: 'rgba(18, 18, 18, 0.05)',
  },
})

const matrixCanvas = ref(null)
let matrixInterval = null
let resizeObserver = null

const startMatrixEffect = () => {
  const canvas = matrixCanvas.value
  if (!canvas) return

  if (matrixInterval) clearInterval(matrixInterval)

  const parent = canvas.parentElement
  const rect = parent?.getBoundingClientRect()
  canvas.width = rect?.width || parent?.clientWidth || 300
  canvas.height = rect?.height || parent?.clientHeight || 200

  if (!canvas.width || !canvas.height) return

  const ctx = canvas.getContext('2d')
  const columns = Math.floor(canvas.width / props.fontSize)
  const drops = Array(columns).fill(1)

  const draw = () => {
    ctx.fillStyle = props.bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = props.color
    ctx.font = `${props.fontSize}px monospace`

    for (let i = 0; i < drops.length; i++) {
      const char = props.chars[Math.floor(Math.random() * props.chars.length)]
      ctx.fillText(char, i * props.fontSize, drops[i] * props.fontSize)
      if (drops[i] * props.fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }
  }

  matrixInterval = setInterval(draw, props.speed)
}

onMounted(async () => {
  await nextTick()
  await new Promise((r) => setTimeout(r, 150))
  startMatrixEffect()

  resizeObserver = new ResizeObserver(() => startMatrixEffect())
  if (matrixCanvas.value?.parentElement) {
    resizeObserver.observe(matrixCanvas.value.parentElement)
  }
})

onUnmounted(() => {
  if (matrixInterval) clearInterval(matrixInterval)
  if (resizeObserver) resizeObserver.disconnect()
})
</script>
