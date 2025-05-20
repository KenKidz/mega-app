<template>
  <div class="layout" :class="{ mobile: isMobileView }">
    <Sidebar />
    <Navbar />
    <main
      class="main-content"
      :class="{
        'sidebar-expanded': isExpanded && !isMobileView,
        'sidebar-collapsed': !isExpanded && !isMobileView,
        mobile: isMobileView,
        'with-overlay': isMobileView && isMobileOpen,
      }"
    >
      <div class="page-container">
        <div class="mb-6">
          <h1 class="text-2xl font-semibold">Dashboard</h1>
        </div>
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useSidebarStore } from '~/stores/useSidebar';

const sidebarStore = useSidebarStore();

// Use computed properties for reactivity
const isExpanded = computed(() => sidebarStore.isExpanded);
const isMobileView = computed(() => sidebarStore.isMobileView);
const isMobileOpen = computed(() => sidebarStore.isMobileOpen);
</script>

<style scoped>
.page-container {
  min-height: calc(100vh - 84px); /* Accounting for navbar height and padding */
}

@media (max-width: 640px) {
  .page-container {
    min-height: calc(100vh - 76px); /* Adjusted for smaller padding on mobile */
  }
}

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  margin-top: 64px; /* navbar height */
  padding: 20px;
  transition: all 0.3s ease;
}

.main-content.sidebar-expanded {
  margin-left: 240px; /* expanded sidebar width */
}

.main-content.sidebar-collapsed {
  margin-left: 80px; /* collapsed sidebar width - updated from 60px to 80px */
}

.main-content.mobile {
  margin-left: 0;
  width: 100%;
}

.main-content.with-overlay {
  position: relative;
}

/* Make the page responsive */
@media (max-width: 992px) {
  .main-content {
    padding: 16px;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 12px;
  }
}
</style>
