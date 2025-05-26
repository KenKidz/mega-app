<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="loadingStore.isLoading"
        class="loading-overlay"
      >
        <div class="loading-content">
          <div class="spinner-container">
            <div class="spinner-circle"></div>
            <UIcon
              name="i-lucide-loader"
              class="loading-icon"
            />
          </div>
          <p class="loading-text">{{ loadingStore.loadingMessage }}</p>

          <!-- Progress bar for determinate operations -->
          <div
            v-if="loadingStore.progressMode === 'determinate'"
            class="progress-container"
          >
            <div
              class="progress-bar"
              :style="{ width: `${loadingStore.progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useLoadingStore } from '~/stores/useLoading'

const loadingStore = useLoadingStore()
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text);
  background-color: transparent;
  padding: 2rem;
  max-width: 90%;
  width: 30rem;
}

.spinner-container {
  position: relative;
  width: 5rem;
  height: 5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: #38bdf8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.loading-text {
  font-size: 1.25rem;
  font-weight: 500;
  text-align: center;
  max-width: 20rem;
  margin-bottom: 1rem;
}

.progress-container {
  width: 100%;
  height: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #38bdf8;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.loading-fact {
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  max-width: 100%;
  display: flex;
  align-items: flex-start;
}

.loading-fact-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  color: #fbbf24;
  flex-shrink: 0;
}

.loading-fact-text {
  font-size: 0.875rem;
  line-height: 1.4;
  opacity: 0.9;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition:
    opacity 0.5s,
    transform 0.5s;
}

.fade-slide-up-enter-from,
.fade-slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
