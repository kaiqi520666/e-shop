<template>
  <div class="relative">
    <svg :viewBox="`0 0 ${width} ${height}`" class="w-full h-full">
      <!-- 渐变定义 -->
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00FFA3" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#00FFA3" stop-opacity="1" />
        </linearGradient>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#00FFA3" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#00FFA3" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- 网格线 -->
      <g class="grid-lines">
        <line
          v-for="i in 4"
          :key="`grid-${i}`"
          :x1="padding"
          :y1="padding + ((height - 2 * padding) / 4) * i"
          :x2="width - padding"
          :y2="padding + ((height - 2 * padding) / 4) * i"
          stroke="#334155"
          stroke-width="1"
          stroke-dasharray="4,4"
          opacity="0.5"
        />
      </g>

      <!-- 面积填充 -->
      <path
        :d="areaPath"
        fill="url(#areaGradient)"
        class="transition-all duration-500"
      />

      <!-- 折线 -->
      <path
        :d="linePath"
        fill="none"
        stroke="#00FFA3"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="transition-all duration-500"
        style="filter: drop-shadow(0 0 6px rgba(0, 255, 163, 0.5));"
      />

      <!-- 数据点 -->
      <g>
        <circle
          v-for="(point, index) in normalizedPoints"
          :key="`point-${index}`"
          :cx="point.x"
          :cy="point.y"
          r="4"
          fill="#121212"
          stroke="#00FFA3"
          stroke-width="2"
          class="transition-all duration-300 hover:r-6 cursor-pointer"
        >
          <title>{{ data[index] }}</title>
        </circle>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [10, 25, 18, 32, 28, 45, 40, 55, 50, 65, 60, 75],
  },
  width: {
    type: Number,
    default: 300,
  },
  height: {
    type: Number,
    default: 120,
  },
})

const padding = 10

const minValue = computed(() => Math.min(...props.data) * 0.9)
const maxValue = computed(() => Math.max(...props.data) * 1.1)
const range = computed(() => maxValue.value - minValue.value)

const normalizedPoints = computed(() => {
  const pointWidth = (props.width - 2 * padding) / (props.data.length - 1)
  return props.data.map((value, index) => ({
    x: padding + index * pointWidth,
    y: props.height - padding - ((value - minValue.value) / range.value) * (props.height - 2 * padding),
  }))
})

const linePath = computed(() => {
  if (normalizedPoints.value.length === 0) return ''
  return normalizedPoints.value
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
})

const areaPath = computed(() => {
  if (normalizedPoints.value.length === 0) return ''
  const line = linePath.value
  const lastX = normalizedPoints.value[normalizedPoints.value.length - 1].x
  const firstX = normalizedPoints.value[0].x
  const bottomY = props.height - padding
  return `${line} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`
})
</script>
