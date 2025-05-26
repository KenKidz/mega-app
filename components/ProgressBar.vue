<template>
  <div
    class="progress-bar-wrapper"
    :class="{ 'in-card': inCard }"
  >
    <div
      v-if="label"
      class="progress-label"
    >
      {{ label }}
    </div>
    <div class="progress-container">
      <div
        class="progress-indicator"
        :class="{ indeterminate: !value }"
        :style="value ? { width: `${value}%` } : {}"
      ></div>
    </div>
    <div
      v-if="showPercentage && value"
      class="progress-percentage"
    >
      {{ Math.round(value) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  value: {
    type: Number,
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  showPercentage: {
    type: Boolean,
    default: false
  },
  inCard: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.progress-bar-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.progress-container {
  height: 0.5rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.progress-indicator {
  height: 100%;
  background-color: var(--color-primary-500, #3b82f6);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-indicator.indeterminate {
  width: 30%;
  position: absolute;
  animation: progress-indeterminate 1.5s ease-in-out infinite;
}

.progress-label {
  font-size: 0.875rem;
  color: var(--color-gray-700, #374151);
}

.progress-percentage {
  font-size: 0.75rem;
  color: var(--color-gray-600, #4b5563);
  text-align: right;
}

.in-card .progress-container {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark .progress-container {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark .progress-label {
  color: var(--color-gray-300, #d1d5db);
}

.dark .progress-percentage {
  color: var(--color-gray-400, #9ca3af);
}

@keyframes progress-indeterminate {
  0% {
    left: -30%;
  }
  100% {
    left: 100%;
  }
}
</style>
