<template>
  <UApp
    :toaster="{
      position: 'top-right'
    }"
  >
    <LoadingOverlay />
    <NuxtLayout v-if="!loading">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script lang="ts" setup>
import { useLoadingStore } from '~/stores/useLoading'

const { checkAuth } = useAuth()
const loadingStore = useLoadingStore()
const loading = ref(false)

onBeforeMount(async () => {
  loading.value = loadingStore.startLoading()

  await checkAuth()

  loading.value = loadingStore.stopLoading()
})
</script>
