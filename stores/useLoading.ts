// Loading state management store
import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false);
  const loadingMessage = ref('');
  const progress = ref(0);
  const progressMode = ref<'indeterminate' | 'determinate'>('indeterminate');
  
  // Timer reference to handle sequential loading messages
  let messageTimer: NodeJS.Timeout | null = null;
  
  function startLoading(message = 'Loading...') {
    isLoading.value = true;
    loadingMessage.value = message;
    progress.value = 0;
    progressMode.value = 'indeterminate';
    return true
  }
  
  function stopLoading() {
    isLoading.value = false;
    loadingMessage.value = '';
    progress.value = 0;
    
    // Clear any pending message updates
    if (messageTimer) {
      clearTimeout(messageTimer);
      messageTimer = null;
    }
    return false
  }
  
  function updateProgress(newProgress: number, message?: string) {
    if (newProgress >= 0 && newProgress <= 100) {
      progress.value = newProgress;
      progressMode.value = 'determinate';
      
      if (message) {
        loadingMessage.value = message;
      }
    }
  }
  
  function updateMessage(message: string, delayNext?: number) {
    loadingMessage.value = message;
    
    // Schedule next message if delayNext is provided
    if (delayNext && delayNext > 0) {
      if (messageTimer) {
        clearTimeout(messageTimer);
      }
      
      return new Promise<void>((resolve) => {
        messageTimer = setTimeout(() => {
          resolve();
        }, delayNext);
      });
    }
    
    return Promise.resolve();
  }
  
  return {
    isLoading,
    loadingMessage,
    progress,
    progressMode,
    startLoading,
    stopLoading,
    updateProgress,
    updateMessage
  };
});
