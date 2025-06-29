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
          @click="toggleFavorite"
          class="favorite-btn"
          :class="{ 'is-favorite': isFavorite }"
          :title="isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'"
        >
          {{ isFavorite ? '⭐' : '☆' }}
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
    
    <div class="clock-container">
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

const isFavorite = computed(() => 
  clockStore.isFavoriteTimezone(props.widget.timezone)
)

const updateType = () => {
  clockStore.updateWidgetType(props.widget.id, localType.value)
}

const updateSize = () => {
  clockStore.updateWidgetSize(props.widget.id, localSize.value)
}

const toggleFavorite = () => {
  if (isFavorite.value) {
    clockStore.removeFavoriteTimezone(props.widget.timezone)
  } else {
    clockStore.addFavoriteTimezone(props.widget.timezone, props.widget.displayName)
  }
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
  cursor: grab;
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

.favorite-btn,
.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 1rem;
}

.favorite-btn:hover,
.remove-btn:hover {
  background-color: #f0f0f0;
  transform: scale(1.1);
}

.favorite-btn.is-favorite {
  color: #ffd700;
  text-shadow: 0 0 4px rgba(255, 215, 0, 0.5);
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

.clock-widget:active {
  cursor: grabbing;
}

/* ドラッグアンドドロップ時のアニメーション改善 */
.clock-widget.sortable-chosen {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
}

.clock-widget.sortable-drag {
  transform: scale(1.05) rotate(2deg);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  cursor: grabbing;
}
</style>