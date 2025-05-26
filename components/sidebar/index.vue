<template>
  <div>
    <!-- Mobile overlay -->
    <div
      v-if="isMobileView && isMobileOpen"
      class="fixed inset-0 z-40 bg-black opacity-30"
      @click="closeMobileSidebar"
    ></div>

    <div
      class="sidebar-container"
      :class="{
        collapsed: !isExpanded && !isMobileView,
        mobile: isMobileView,
        'mobile-open': isMobileView && isMobileOpen,
        'mobile-closed': isMobileView && !isMobileOpen
      }"
    >
      <div
        class="sidebar fixed top-0 left-0 z-50 h-screen overflow-y-auto border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-900"
      >
        <div
          class="sidebar-header flex h-16 items-center justify-center px-4 max-md:justify-between"
        >
          <div
            v-if="isExpanded"
            class="flex items-center justify-between font-semibold"
          >
            <img
              src="/logo.png"
              alt="logo"
              class="h-8 w-auto"
            />
            <div class="text-xl font-semibold">Mega App</div>
          </div>
          <UButton
            v-if="isMobileView"
            icon="i-lucide-x"
            variant="ghost"
            size="xl"
            color="neutral"
            @click="closeMobileSidebar"
          />
        </div>
        <div class="p-4">
          <UNavigationMenu
            :items="navItems"
            orientation="vertical"
            :collapsed="!isExpanded && !isMobileView"
            highlight
            color="primary"
            variant="pill"
            :ui="{
              link: 'sidebar-item text-base py-2 rounded-md'
            }"
            class="space-y-3"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebarStore } from '~/stores/useSidebar'

const sidebarStore = useSidebarStore()

// Create navigation items with proper structure for UNavigationMenu
const navItems = computed(() => [
  {
    label: t('dashboard'),
    icon: 'i-heroicons-home',
    to: '/'
  },
  {
    label: t('profile'),
    icon: 'i-heroicons-user',
    to: '/profile'
  },
  {
    label: t('analytics'),
    icon: 'i-heroicons-chart-bar',
    collapsible: true,
    defaultOpen: false,
    children: [
      {
        label: t('reports'),
        to: '/analytics/reports',
        icon: 'i-heroicons-document-chart-bar'
      },
      {
        label: t('statistics'),
        to: '/analytics/statistics',
        icon: 'i-heroicons-presentation-chart-line'
      }
    ]
  },
  {
    label: t('settings'),
    icon: 'i-heroicons-cog-6-tooth',
    to: '/settings',
    badge: 'New'
  }
])

// Use computed properties for reactivity
const isExpanded = computed(() => sidebarStore.isExpanded)
const isMobileView = computed(() => sidebarStore.isMobileView)
const isMobileOpen = computed(() => sidebarStore.isMobileOpen)
const closeMobileSidebar = () => sidebarStore.closeMobileSidebar()
</script>

<style scoped>
.sidebar-container {
  transition: all 0.3s ease;
}

.sidebar {
  width: 240px;
  transition: all 0.3s ease;
}

.sidebar-container.collapsed .sidebar {
  width: 80px; /* Increased from 60px to 80px */
}

/* Mobile styles */
.sidebar-container.mobile .sidebar {
  transform: translateX(0);
  width: 280px; /* Slightly wider on mobile for better touch targets */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.sidebar-container.mobile-closed .sidebar {
  transform: translateX(-100%);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition:
    all 0.2s ease,
    background-color 0.15s ease-in-out;
}

.sidebar-item:hover {
  background-color: rgba(0, 0, 0, 0.075);
}

.dark .sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.075);
}

@media (max-width: 768px) {
  .sidebar-item {
    padding: 14px; /* Larger touch targets on mobile */
  }

  .icon-svg {
    height: 1.75rem; /* 28px */
    width: 1.75rem; /* 28px */
  }
}
</style>
