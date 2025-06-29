<template>
  <div class="analog-clock" :class="sizeClass">
    <svg :width="size" :height="size" viewBox="0 0 200 200">
      <!-- 時計の外枠 -->
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="white"
        stroke="#333"
        stroke-width="2"
      />
      
      <!-- 時間の目盛り -->
      <g v-for="hour in 12" :key="hour">
        <line
          :x1="100 + 80 * Math.sin((hour * 30) * Math.PI / 180)"
          :y1="100 - 80 * Math.cos((hour * 30) * Math.PI / 180)"
          :x2="100 + 90 * Math.sin((hour * 30) * Math.PI / 180)"
          :y2="100 - 90 * Math.cos((hour * 30) * Math.PI / 180)"
          stroke="#333"
          stroke-width="2"
        />
        <text
          :x="100 + 70 * Math.sin((hour * 30) * Math.PI / 180)"
          :y="100 - 70 * Math.cos((hour * 30) * Math.PI / 180) + 5"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="14"
          font-weight="bold"
          fill="#333"
        >
          {{ hour }}
        </text>
      </g>
      
      <!-- 分の目盛り -->
      <g v-for="minute in 60" :key="minute">
        <line
          v-if="minute % 5 !== 0"
          :x1="100 + 85 * Math.sin((minute * 6) * Math.PI / 180)"
          :y1="100 - 85 * Math.cos((minute * 6) * Math.PI / 180)"
          :x2="100 + 90 * Math.sin((minute * 6) * Math.PI / 180)"
          :y2="100 - 90 * Math.cos((minute * 6) * Math.PI / 180)"
          stroke="#666"
          stroke-width="1"
        />
      </g>
      
      <!-- 時針 -->
      <line
        :x1="100"
        :y1="100"
        :x2="100 + 50 * Math.sin(hourAngle * Math.PI / 180)"
        :y2="100 - 50 * Math.cos(hourAngle * Math.PI / 180)"
        stroke="#333"
        stroke-width="4"
        stroke-linecap="round"
      />
      
      <!-- 分針 -->
      <line
        :x1="100"
        :y1="100"
        :x2="100 + 70 * Math.sin(minuteAngle * Math.PI / 180)"
        :y2="100 - 70 * Math.cos(minuteAngle * Math.PI / 180)"
        stroke="#333"
        stroke-width="3"
        stroke-linecap="round"
      />
      
      <!-- 秒針 -->
      <line
        :x1="100"
        :y1="100"
        :x2="100 + 75 * Math.sin(secondAngle * Math.PI / 180)"
        :y2="100 - 75 * Math.cos(secondAngle * Math.PI / 180)"
        stroke="#e74c3c"
        stroke-width="1"
        stroke-linecap="round"
      />
      
      <!-- 中心の点 -->
      <circle cx="100" cy="100" r="4" fill="#333" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Dayjs } from 'dayjs'

interface Props {
  time: Dayjs
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

const sizeClass = computed(() => `analog-clock--${props.size}`)

const size = computed(() => {
  switch (props.size) {
    case 'small': return 120
    case 'medium': return 200
    case 'large': return 280
    default: return 200
  }
})

const hourAngle = computed(() => {
  const hours = props.time.hour() % 12
  const minutes = props.time.minute()
  return (hours * 30) + (minutes * 0.5)
})

const minuteAngle = computed(() => {
  const minutes = props.time.minute()
  const seconds = props.time.second()
  return (minutes * 6) + (seconds * 0.1)
})

const secondAngle = computed(() => {
  return props.time.second() * 6
})
</script>

<style scoped>
.analog-clock {
  display: flex;
  justify-content: center;
  align-items: center;
}

.analog-clock--small {
  width: 120px;
  height: 120px;
}

.analog-clock--medium {
  width: 200px;
  height: 200px;
}

.analog-clock--large {
  width: 280px;
  height: 280px;
}

svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}
</style>