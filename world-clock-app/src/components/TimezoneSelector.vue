<template>
  <div class="timezone-selector">
    <div class="selector-header">
      <h2>新しい時計を追加</h2>
    </div>
    
    <form @submit.prevent="addClock" class="add-form">
      <div class="form-group">
        <label for="timezone">タイムゾーン:</label>
        <select v-model="selectedTimezone" id="timezone" required>
          <option value="">タイムゾーンを選択してください</option>
          <optgroup v-for="region in timezoneGroups" :key="region.name" :label="region.name">
            <option 
              v-for="tz in region.timezones" 
              :key="tz.value" 
              :value="tz.value"
            >
              {{ tz.label }}
            </option>
          </optgroup>
        </select>
      </div>
      
      <div class="form-group">
        <label for="displayName">表示名:</label>
        <input 
          v-model="displayName" 
          id="displayName" 
          type="text" 
          placeholder="例: 東京, ニューヨーク"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="clockType">時計タイプ:</label>
        <select v-model="clockType" id="clockType">
          <option value="both">アナログ + デジタル</option>
          <option value="analog">アナログのみ</option>
          <option value="digital">デジタルのみ</option>
        </select>
      </div>
      
      <button type="submit" class="add-btn" :disabled="!selectedTimezone || !displayName">
        時計を追加
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useClockStore, type ClockWidget } from '@/stores/clockStore'

const clockStore = useClockStore()

const selectedTimezone = ref('')
const displayName = ref('')
const clockType = ref<ClockWidget['type']>('both')

// 主要なタイムゾーンのリスト
const timezoneGroups = [
  {
    name: 'アジア',
    timezones: [
      { value: 'Asia/Tokyo', label: '東京 (JST)' },
      { value: 'Asia/Seoul', label: 'ソウル (KST)' },
      { value: 'Asia/Shanghai', label: '上海 (CST)' },
      { value: 'Asia/Hong_Kong', label: '香港 (HKT)' },
      { value: 'Asia/Singapore', label: 'シンガポール (SGT)' },
      { value: 'Asia/Bangkok', label: 'バンコク (ICT)' },
      { value: 'Asia/Jakarta', label: 'ジャカルタ (WIB)' },
      { value: 'Asia/Manila', label: 'マニラ (PST)' },
      { value: 'Asia/Kolkata', label: 'ムンバイ (IST)' },
      { value: 'Asia/Dubai', label: 'ドバイ (GST)' },
    ]
  },
  {
    name: 'ヨーロッパ',
    timezones: [
      { value: 'Europe/London', label: 'ロンドン (GMT/BST)' },
      { value: 'Europe/Paris', label: 'パリ (CET/CEST)' },
      { value: 'Europe/Berlin', label: 'ベルリン (CET/CEST)' },
      { value: 'Europe/Rome', label: 'ローマ (CET/CEST)' },
      { value: 'Europe/Madrid', label: 'マドリード (CET/CEST)' },
      { value: 'Europe/Amsterdam', label: 'アムステルダム (CET/CEST)' },
      { value: 'Europe/Zurich', label: 'チューリッヒ (CET/CEST)' },
      { value: 'Europe/Moscow', label: 'モスクワ (MSK)' },
    ]
  },
  {
    name: '北アメリカ',
    timezones: [
      { value: 'America/New_York', label: 'ニューヨーク (EST/EDT)' },
      { value: 'America/Chicago', label: 'シカゴ (CST/CDT)' },
      { value: 'America/Denver', label: 'デンバー (MST/MDT)' },
      { value: 'America/Los_Angeles', label: 'ロサンゼルス (PST/PDT)' },
      { value: 'America/Toronto', label: 'トロント (EST/EDT)' },
      { value: 'America/Vancouver', label: 'バンクーバー (PST/PDT)' },
      { value: 'America/Mexico_City', label: 'メキシコシティ (CST/CDT)' },
    ]
  },
  {
    name: '南アメリカ',
    timezones: [
      { value: 'America/Sao_Paulo', label: 'サンパウロ (BRT)' },
      { value: 'America/Argentina/Buenos_Aires', label: 'ブエノスアイレス (ART)' },
      { value: 'America/Lima', label: 'リマ (PET)' },
      { value: 'America/Bogota', label: 'ボゴタ (COT)' },
    ]
  },
  {
    name: 'オセアニア',
    timezones: [
      { value: 'Australia/Sydney', label: 'シドニー (AEST/AEDT)' },
      { value: 'Australia/Melbourne', label: 'メルボルン (AEST/AEDT)' },
      { value: 'Australia/Perth', label: 'パース (AWST)' },
      { value: 'Pacific/Auckland', label: 'オークランド (NZST/NZDT)' },
    ]
  },
  {
    name: 'アフリカ',
    timezones: [
      { value: 'Africa/Cairo', label: 'カイロ (EET)' },
      { value: 'Africa/Johannesburg', label: 'ヨハネスブルグ (SAST)' },
      { value: 'Africa/Lagos', label: 'ラゴス (WAT)' },
      { value: 'Africa/Nairobi', label: 'ナイロビ (EAT)' },
    ]
  }
]

// タイムゾーンが選択されたときに自動的に表示名を設定
watch(selectedTimezone, (newTimezone) => {
  if (newTimezone && !displayName.value) {
    const timezone = timezoneGroups
      .flatMap(group => group.timezones)
      .find(tz => tz.value === newTimezone)
    
    if (timezone) {
      displayName.value = timezone.label.split(' (')[0]
    }
  }
})

const addClock = () => {
  if (selectedTimezone.value && displayName.value) {
    clockStore.addWidget(selectedTimezone.value, displayName.value, clockType.value)
    
    // フォームをリセット
    selectedTimezone.value = ''
    displayName.value = ''
    clockType.value = 'both'
  }
}
</script>

<style scoped>
.timezone-selector {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 1rem;
  max-width: 500px;
}

.selector-header h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
}

.form-group select,
.form-group input {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group select:focus,
.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.add-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

optgroup {
  font-weight: bold;
  color: #333;
}

option {
  font-weight: normal;
  color: #666;
}
</style>