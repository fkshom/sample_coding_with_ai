import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export interface ClockWidget {
  id: string
  timezone: string
  displayName: string
  type: 'analog' | 'digital' | 'both'
  size: 'small' | 'medium' | 'large'
  visible: boolean
  position: number
}

export const useClockStore = defineStore('clock', () => {
  const widgets = ref<ClockWidget[]>([])
  const currentTime = ref(dayjs())

  // ローカルストレージから設定を読み込み
  const loadFromStorage = () => {
    const stored = localStorage.getItem('world-clock-widgets')
    if (stored) {
      try {
        widgets.value = JSON.parse(stored)
      } catch (error) {
        console.error('Failed to load widgets from storage:', error)
      }
    }
  }

  // ローカルストレージに設定を保存
  const saveToStorage = () => {
    localStorage.setItem('world-clock-widgets', JSON.stringify(widgets.value))
  }

  // ウィジェットを追加
  const addWidget = (timezone: string, displayName: string, type: ClockWidget['type'] = 'both') => {
    const newWidget: ClockWidget = {
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timezone,
      displayName,
      type,
      size: 'medium',
      visible: true,
      position: widgets.value.length
    }
    widgets.value.push(newWidget)
    saveToStorage()
  }

  // ウィジェットを削除
  const removeWidget = (id: string) => {
    const index = widgets.value.findIndex(w => w.id === id)
    if (index !== -1) {
      widgets.value.splice(index, 1)
      // 位置を再調整
      widgets.value.forEach((widget, idx) => {
        widget.position = idx
      })
      saveToStorage()
    }
  }

  // ウィジェットの表示/非表示を切り替え
  const toggleWidgetVisibility = (id: string) => {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      widget.visible = !widget.visible
      saveToStorage()
    }
  }

  // ウィジェットのサイズを変更
  const updateWidgetSize = (id: string, size: ClockWidget['size']) => {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      widget.size = size
      saveToStorage()
    }
  }

  // ウィジェットのタイプを変更
  const updateWidgetType = (id: string, type: ClockWidget['type']) => {
    const widget = widgets.value.find(w => w.id === id)
    if (widget) {
      widget.type = type
      saveToStorage()
    }
  }

  // ウィジェットの順序を変更
  const reorderWidgets = (newOrder: ClockWidget[]) => {
    widgets.value = newOrder.map((widget, index) => ({
      ...widget,
      position: index
    }))
    saveToStorage()
  }

  // 現在時刻を更新
  const updateCurrentTime = () => {
    currentTime.value = dayjs()
  }

  // 表示されているウィジェットのみを取得
  const visibleWidgets = computed(() => 
    widgets.value
      .filter(w => w.visible)
      .sort((a, b) => a.position - b.position)
  )

  // 特定のタイムゾーンの現在時刻を取得
  const getTimeForTimezone = (timezone: string) => {
    return currentTime.value.tz(timezone)
  }

  return {
    widgets,
    currentTime,
    visibleWidgets,
    loadFromStorage,
    saveToStorage,
    addWidget,
    removeWidget,
    toggleWidgetVisibility,
    updateWidgetSize,
    updateWidgetType,
    reorderWidgets,
    updateCurrentTime,
    getTimeForTimezone
  }
})