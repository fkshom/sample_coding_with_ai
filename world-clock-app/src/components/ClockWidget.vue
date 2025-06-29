<template>
  <div class="clock-widget" :class="sizeClass">
    <div class="widget-header">
      <h3 class="timezone-name">{{ widget.displayName }}</h3>
      <div class="widget-controls">
        <select 
          v-model="localType" 
          @change="updateType"
          class="type-selector"
        >
          <option value="analog">アナログ</option>
          <option value="digital">デジタル</option>
          <option value="both">両方</option>
        </select>
        
        <select 
          v-model="localSize" 
          @change="updateSize"
          class="size-selector"
        >
          <option value="small">小</option>
          <option value="medium">中</option>
          <option value="large">大</option>
        </select>
        
        <button 
          @click="toggleVisibility"
          class="visibility-btn"
          :title="widget.visible ? '非表示' : '表示'"
        >
          {{ widget.visible ? '👁️' : '👁️‍🗨️' }}
        </button>
        
        <button 
          @click="removeWidget"
          class="remove-btn"
          title="削除"
        >
          ❌
        </button>
      </div>
    </div>
    
    <div class="clock-container" v-if="widget.visible">
      <div v-if="widget.type === 'analog' || widget.type === 'both'" class="clock-section">
        <AnalogClock :time="currentTime" :size="widget.size" />
      </div>
      
      <div v-if="widget.type === 'digital' || widget.type === 'both'" class="clock-section">
        <DigitalClock :time="currentTime" :size="widget.size" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useClockStore, type ClockWidget } from '@/stores/clockStore'
import AnalogClock from './AnalogClock.vue'
import DigitalClock from './DigitalClock.vue'

interface Props {
  widget: ClockWidget
}

const props = defineProps<Props>()
const clockStore = useClockStore()

const localType = ref(props.widget.type)
const localSize = ref(props.widget.size)

const sizeClass = computed(() => `clock-widget--${props.widget.size}`)

const currentTime = computed(() => 
  clockStore.getTimeForTimezone(props.widget.timezone)
)

const updateType = () => {
  clockStore.updateWidgetType(props.widget.id, localType.value)
}

const updateSize = () => {
  clockStore.updateWidgetSize(props.widget.id, localSize.value)
}

const toggleVisibility = () => {
  clockStore.toggleWidgetVisibility(props.widget.id)
}

const removeWidget = () => {
  clockStore.removeWidget(props.widget.id)
}

// プロパティの変更を監視してローカル状態を更新
watch(() => props.widget.type, (newType) => {
  localType.value = newType
})

watch(() => props.widget.size, (newSize) => {
  localSize.value = newSize
})
</script>

<style scoped>
.clock-widget {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.clock-widget:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.clock-widget--small {
  min-width: 180px;
}

.clock-widget--medium {
  min-width: 260px;
}

.clock-widget--large {
  min-width: 340px;
}

.widget-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.timezone-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.widget-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
}

.type-selector,
.size-selector {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8rem;
  background: white;
}

.visibility-btn,
.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.visibility-btn:hover,
.remove-btn:hover {
  background-color: #f0f0f0;
}

.clock-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.clock-widget--small .clock-container {
  gap: 0.5rem;
}

.clock-widget--large .clock-container {
  gap: 1.5rem;
}

.clock-section {
  display: flex;
  justify-content: center;
}

/* ドラッグ中のスタイル */
.clock-widget.dragging {
  opacity: 0.7;
  transform: rotate(5deg);
  z-index: 1000;
}
</style>