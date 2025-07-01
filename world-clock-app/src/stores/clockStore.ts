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
  position: number
}

export interface FavoriteTimezone {
  timezone: string
  displayName: string
}

export const useClockStore = defineStore('clock', () => {
  const widgets = ref<ClockWidget[]>([])
  const favoriteTimezones = ref<FavoriteTimezone[]>([])
  const currentTime = ref(dayjs())

  // ローカルストレージから設定を読み込み
  const loadFromStorage = () => {
    const storedWidgets = localStorage.getItem('world-clock-widgets')
    if (storedWidgets) {
      try {
        const loadedWidgets = JSON.parse(storedWidgets)
        // positionでソートして格納
        widgets.value = loadedWidgets.sort((a: ClockWidget, b: ClockWidget) => a.position - b.position)
      } catch (error) {
        console.error('Failed to load widgets from storage:', error)
      }
    }

    const storedFavorites = localStorage.getItem('world-clock-favorites')
    if (storedFavorites) {
      try {
        favoriteTimezones.value = JSON.parse(storedFavorites)
      } catch (error) {
        console.error('Failed to load favorites from storage:', error)
      }
    }
  }

  // ローカルストレージに設定を保存
  const saveToStorage = () => {
    localStorage.setItem('world-clock-widgets', JSON.stringify(widgets.value))
    localStorage.setItem('world-clock-favorites', JSON.stringify(favoriteTimezones.value))
  }

  // ウィジェットを追加
  const addWidget = (timezone: string, displayName: string, type: ClockWidget['type'] = 'both') => {
    const newWidget: ClockWidget = {
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timezone,
      displayName,
      type,
      size: 'medium',
      position: widgets.value.length
    }
    
    // 配列を直接変更せず新しい配列を作成
    widgets.value = [...widgets.value, newWidget]
    
    // ストレージ保存を確実に実行
    try {
      saveToStorage()
      return true // 成功時はtrueを返す
    } catch (error) {
      console.error('保存に失敗しました:', error)
      return false
    }
  }

  // お気に入りタイムゾーンを追加
  const addFavoriteTimezone = (timezone: string, displayName: string) => {
    const exists = favoriteTimezones.value.some(fav => fav.timezone === timezone)
    if (!exists) {
      favoriteTimezones.value.push({ timezone, displayName })
      saveToStorage()
    }
  }

  // お気に入りタイムゾーンを削除
  const removeFavoriteTimezone = (timezone: string) => {
    const index = favoriteTimezones.value.findIndex(fav => fav.timezone === timezone)
    if (index !== -1) {
      favoriteTimezones.value.splice(index, 1)
      saveToStorage()
    }
  }

  // タイムゾーンがお気に入りかどうかチェック
  const isFavoriteTimezone = (timezone: string) => {
    return favoriteTimezones.value.some(fav => fav.timezone === timezone)
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

  // 全てのウィジェットを位置順で取得
  const sortedWidgets = computed(() => 
    widgets.value.sort((a, b) => a.position - b.position)
  )

  // 表示可能なウィジェットを取得（現在は全て表示）
  const visibleWidgets = computed(() => sortedWidgets.value)

  // 特定のタイムゾーンの現在時刻を取得
  const getTimeForTimezone = (timezone: string) => {
    return currentTime.value.tz(timezone)
  }

  return {
    widgets,
    favoriteTimezones,
    currentTime,
    sortedWidgets,
    visibleWidgets,
    loadFromStorage,
    saveToStorage,
    addWidget,
    removeWidget,
    addFavoriteTimezone,
    removeFavoriteTimezone,
    isFavoriteTimezone,
    updateWidgetSize,
    updateWidgetType,
    reorderWidgets,
    updateCurrentTime,
    getTimeForTimezone
  }
})