<template>
  <div>
    <MainHeaderSection :title="t('dashboard')" />
    <div class="space-y-8">
      <UCard>
        <template #header>
          <div class="text-xl font-semibold">
            {{ t('welcome') }} {{ welcomeMessage }}
          </div>
        </template>

        <div>
          <p class="mb-4">
            {{ t('appDescription') }}
          </p>
          <p
            v-if="isLoading"
            class="text-gray-500"
          >
            {{ t('loading') }}
          </p>

          <div
            v-else
            class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
          >
            <h3 class="mb-2 font-medium">{{ t('userAccountInfo') }}</h3>
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <span class="text-gray-500">{{ t('username') }}:</span>
                <span class="ml-2 font-medium">
                  {{ userData?.username || t('notAvailable') }}
                </span>
              </div>
              <div>
                <span class="text-gray-500">{{ t('email') }}:</span>
                <span class="ml-2 font-medium">
                  {{ userData?.attributes?.email || t('notAvailable') }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">
              {{ t('lastLogin') }}: {{ new Date().toLocaleString() }}
            </span>
            <UButton
              to="/profile"
              color="primary"
              variant="soft"
            >
              {{ t('manageProfile') }}
            </UButton>
          </div>
        </template>
      </UCard>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <UCard>
          <template #header>
            <div class="flex items-center">
              <UIcon
                name="i-lucide-shield"
                class="text-primary mr-2"
              />
              <span class="font-medium">{{ t('account') }}</span>
            </div>
          </template>
          <p>{{ t('securityAuth') }}</p>
        </UCard>
        <UCard>
          <template #header>
            <div class="flex items-center">
              <UIcon
                name="i-lucide-layout-dashboard"
                class="mr-2 text-amber-500"
              />
              <span class="font-medium">{{ t('dashboard') }}</span>
            </div>
          </template>
          <p>
            {{ t('dashboardDescription') }}
          </p>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center">
              <UIcon
                name="i-lucide-settings"
                class="mr-2 text-teal-500"
              />
              <span class="font-medium">{{ t('configuration') }}</span>
            </div>
          </template>
          <p>{{ t('settingsDescription') }}</p>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user, isLoading } = useAuth()

const userData = computed(() => user.value)

const welcomeMessage = computed(() => {
  if (!userData.value) return 'to your dashboard'

  if (userData.value.attributes?.name) {
    return userData.value.attributes.name
  } else if (userData.value.attributes?.email) {
    return userData.value.attributes.email.split('@')[0]
  } else {
    return userData.value.username || 'to your dashboard'
  }
})
</script>
