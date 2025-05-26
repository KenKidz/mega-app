<template>
  <UDropdownMenu :items="items">
    <UAvatar
      :src="avatar"
      :alt="username"
      size="lg"
    />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useAuth } from '~/composables/useAuth'

const { user, logout } = useAuth()
const router = useRouter()
const toast = useToast()

// Get user details from auth composable
const username = computed(() => {
  return user.value?.username || t('username')
})

// Avatar URL (we could use user's photo if available)
const avatar = ref('')

// Handle logout action
const handleLogout = async () => {
  const result = await logout()
  if (result.success) {
    toast.add({
      title: t('success'),
      description: t('logoutSuccess'),
      color: 'success'
    })
    router.push('/auth/login')
  } else {
    toast.add({
      title: t('error'),
      description: result.error || t('loginError'),
      color: 'error'
    })
  }
}

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: t('profile'),
      icon: 'i-lucide-user',
      to: '/profile'
    },
    {
      label: t('settings'),
      icon: 'i-lucide-cog'
    }
  ],
  [
    {
      label: t('logout'),
      icon: 'i-lucide-log-out',
      kbds: ['shift', 'meta', 'q'],
      onSelect: handleLogout
    }
  ]
])
</script>
