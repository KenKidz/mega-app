<template>
  <div
    class="navbar fixed top-0 z-20 flex h-16 items-center bg-white shadow-sm transition-all duration-300 ease-in-out dark:bg-gray-900"
    :class="{
      expanded: isExpanded && !isMobileView,
      collapsed: !isExpanded && !isMobileView,
      mobile: isMobileView
    }"
  >
    <div class="navbar-left flex h-full items-center">
      <div
        class="mx-4 flex items-center rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <UIcon
          name="i-lucide-align-justify"
          size="25"
          class="transition-transform duration-300 ease-in-out"
          :class="isExpanded ? `` : `rotate-90`"
          @click="toggleSidebar"
        />
      </div>
    </div>
    <div class="navbar-right mr-5 ml-auto flex items-center">
      <div class="flex items-center space-x-4">
        <div
          v-if="isMobileView"
          class="flex items-center"
        >
          <span class="mr-2 text-sm text-gray-600 dark:text-gray-400">
            {{ $t('mobileView') }}
          </span>
          <span class="inline-block h-3 w-3 rounded-full bg-green-500"></span>
        </div>

        <ThemeToggle />

        <!-- Authentication buttons (when not authenticated) -->
        <div v-if="!isAuthenticated">
          <UButton
            variant="ghost"
            size="sm"
            @click="router.push('/auth/login')"
          >
            {{ $t('login') }}
          </UButton>
          <UButton
            variant="solid"
            color="primary"
            size="sm"
            @click="router.push('/auth/register')"
          >
            {{ $t('signUp') }}
          </UButton>
        </div>

        <!-- Avatar dropdown (when authenticated) -->
        <NavbarAvatarDropdown v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebarStore } from '~/stores/useSidebar'

const sidebarStore = useSidebarStore()
const { isAuthenticated } = useAuth()
const router = useRouter()

// Initialize store event listeners
onMounted(() => {
  sidebarStore.initializeListeners()
})

onUnmounted(() => {
  sidebarStore.removeListeners()
})

// Use computed properties for reactivity
const isExpanded = computed(() => sidebarStore.isExpanded)
const isMobileView = computed(() => sidebarStore.isMobileView)

const toggleSidebar = () => sidebarStore.toggleSidebar()
</script>

<style scoped>
.navbar {
  transition: all 0.3s ease;
  padding-left: 0;
  left: 0;
  right: 0;
}

.navbar.expanded {
  padding-left: 240px; /* Match expanded sidebar width */
  left: 0;
}

.navbar.collapsed {
  padding-left: 80px; /* Match collapsed sidebar width - updated from 60px to 80px */
  left: 0;
}

.navbar.mobile {
  padding-left: 0; /* No padding on mobile */
}

.navbar-left {
  width: 240px;
}

@media (max-width: 768px) {
  .navbar-left {
    width: auto;
  }
}
</style>
