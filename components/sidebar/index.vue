<template>
  <div>
    <!-- Mobile overlay -->
    <div
      v-if="isMobileView && isMobileOpen"
      class="fixed inset-0 bg-black opacity-30 z-40"
      @click="closeMobileSidebar"
    ></div>

    <div
      class="sidebar-container"
      :class="{
        collapsed: !isExpanded && !isMobileView,
        mobile: isMobileView,
        'mobile-open': isMobileView && isMobileOpen,
        'mobile-closed': isMobileView && !isMobileOpen,
      }"
    >
      <div
        class="sidebar bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen fixed top-0 left-0 z-50 overflow-y-auto transition-all duration-300 ease-in-out"
      >
        <div
          class="sidebar-header h-16 flex items-center justify-center max-md:justify-between px-4"
        >
          <div
          v-if="isExpanded"
            class="flex items-center justify-between font-semibold"
          >
            <img src="/logo.png" alt="logo" class="h-8 w-auto" />
            <div class="font-semibold text-xl">
              Mega App
            </div>
          </div>
          <UButton
            v-if="isMobileView"
            icon="i-lucide-x"
            variant="ghost"
            @click="closeMobileSidebar"
            size="xl"
            color="neutral"
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
              link: 'sidebar-item text-base py-2 rounded-md',
            }"
            class="space-y-3"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebarStore } from "~/stores/useSidebar";

const sidebarStore = useSidebarStore();

// Create navigation items with proper structure for UNavigationMenu
const navItems = computed(() => [
  {
    label: "Dashboard",
    icon: "i-heroicons-home",
    to: "/",
  },
  {
    label: "Profile",
    icon: "i-heroicons-user",
    to: "/profile",
  },
  {
    label: "Analytics",
    icon: "i-heroicons-chart-bar",
    collapsible: true,
    defaultOpen: false,
    children: [
      {
        label: "Reports",
        to: "/analytics/reports",
        icon: "i-heroicons-document-chart-bar",
      },
      {
        label: "Statistics",
        to: "/analytics/statistics",
        icon: "i-heroicons-presentation-chart-line",
      },
    ],
  },
  {
    label: "Settings",
    icon: "i-heroicons-cog-6-tooth",
    to: "/settings",
    badge: "New",
  },
]);

// Use computed properties for reactivity
const isExpanded = computed(() => sidebarStore.isExpanded);
const isMobileView = computed(() => sidebarStore.isMobileView);
const isMobileOpen = computed(() => sidebarStore.isMobileOpen);
const closeMobileSidebar = () => sidebarStore.closeMobileSidebar();
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
  transition: all 0.2s ease, background-color 0.15s ease-in-out;
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
