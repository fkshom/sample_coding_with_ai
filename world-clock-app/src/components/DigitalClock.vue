<template>
  <div class="digital-clock" :class="sizeClass">
    <div class="time-display">
      {{ formattedTime }}
    </div>
    <div class="date-display">
      {{ formattedDate }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Dayjs } from 'dayjs'

interface Props {
  time: Dayjs
  size?: 'small' | 'medium' | 'large'
  format24h?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  format24h: true
})

const sizeClass = computed(() => `digital-clock--${props.size}`)

const formattedTime = computed(() => {
  if (props.format24h) {
    return props.time.format('HH:mm:ss')
  } else {
    return props.time.format('h:mm:ss A')
  }
})

const formattedDate = computed(() => {
  return props.time.format('YYYY/MM/DD (ddd)')
})
</script>

<style scoped>
.digital-clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: 'Courier New', monospace;
}

.digital-clock--small {
  width: 120px;
  height: 80px;
  padding: 0.5rem;
}

.digital-clock--small .time-display {
  font-size: 1rem;
  font-weight: bold;
}

.digital-clock--small .date-display {
  font-size: 0.6rem;
  margin-top: 0.2rem;
}

.digital-clock--medium {
  width: 200px;
  height: 120px;
  padding: 1rem;
}

.digital-clock--medium .time-display {
  font-size: 1.5rem;
  font-weight: bold;
}

.digital-clock--medium .date-display {
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.digital-clock--large {
  width: 280px;
  height: 160px;
  padding: 1.5rem;
}

.digital-clock--large .time-display {
  font-size: 2.2rem;
  font-weight: bold;
}

.digital-clock--large .date-display {
  font-size: 1rem;
  margin-top: 0.8rem;
}

.time-display {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
}

.date-display {
  opacity: 0.9;
  text-align: center;
}
</style>