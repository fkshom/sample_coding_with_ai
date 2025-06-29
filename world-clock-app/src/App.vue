<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useClockStore } from '@/stores/clockStore'
import ClockWidget from '@/components/ClockWidget.vue'
import TimezoneSelector from '@/components/TimezoneSelector.vue'

const clockStore = useClockStore()
const showAddForm = ref(false)

let timeInterval: number | null = null

onMounted(() => {
  // ローカルストレージから設定を読み込み
  clockStore.loadFromStorage()
  
  // 時刻を定期的に更新
  clockStore.updateCurrentTime()
  timeInterval = setInterval(() => {
    clockStore.updateCurrentTime()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

const handleDragEnd = () => {
  // VueDraggableが既にwidgets配列を更新しているので、
  // 各ウィジェットのpositionプロパティを現在のインデックスに更新
  clockStore.widgets.forEach((widget, index) => {
    widget.position = index
  })
  clockStore.saveToStorage()
}

const handleDragMove = (evt: any) => {
  // ドラッグ中のリアルタイム更新を許可
  return true
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>🌍 世界時計</h1>
      <button 
        @click="showAddForm = !showAddForm" 
        class="add-clock-btn"
        :class="{ active: showAddForm }"
      >
        {{ showAddForm ? '閉じる' : '時計を追加' }}
      </button>
    </header>

    <main class="app-main">
      <div v-if="showAddForm" class="add-form-container">
        <TimezoneSelector />
      </div>

      <div class="clocks-container">
        <div v-if="clockStore.widgets.length === 0" class="empty-state">
          <h2>時計がありません</h2>
          <p>「時計を追加」ボタンをクリックして、最初の時計を追加してください。</p>
        </div>

        <VueDraggable
          v-else
          v-model="clockStore.widgets"
          @end="handleDragEnd"
          @move="handleDragMove"
          class="draggable-container"
          :animation="300"
          :force-fallback="false"
          :fallback-tolerance="0"
          ghost-class="ghost"
          chosen-class="chosen"
          drag-class="drag"
          :group="{ name: 'clocks', pull: true, put: true }"
          item-key="id"
        >
          <template #item="{ element: widget }">
            <ClockWidget
              :key="widget.id"
              :widget="widget"
            />
          </template>
        </VueDraggable>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.add-clock-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.add-clock-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.add-clock-btn.active {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.app-main {
  padding: 2rem;
}

.add-form-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.clocks-container {
  max-width: 1400px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-state h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
  opacity: 0.8;
}

.draggable-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  justify-items: center;
}

/* ドラッグアンドドロップのスタイル */
.ghost {
  opacity: 0.3;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px dashed #667eea;
  border-radius: 16px;
  transform: scale(0.95);
}

.chosen {
  opacity: 0.9;
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  transition: all 0.2s ease;
}

.drag {
  transform: scale(1.05) rotate(2deg);
  z-index: 1000;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .app-header h1 {
    font-size: 1.5rem;
  }

  .app-main {
    padding: 1rem;
  }

  .draggable-container {
    grid-template-columns: 1fr;
  }
}
</style>
