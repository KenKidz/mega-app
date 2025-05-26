<template>
  <div class="space-y-6">
    <p class="mb-4 text-center">
      {{ t('confirmationCodeSent') }}
    </p>

    <UFormField
      :label="t('verificationCode')"
      required
      name="confirmationCode"
    >
      <UPinInput
        v-model="confirmationCode"
        :length="6"
      />
    </UFormField>
    <UButton
      block
      :loading="isLoading"
      :disabled="isLoading || confirmationCode.length !== 6"
      @click="confirmSignUp"
    >
      {{ $t('verifyCode') }}
    </UButton>
    <div class="text-center">
      <p class="text-subtle text-sm">
        <span
          class="cursor-pointer font-medium text-blue-600 hover:text-blue-800"
          @click="() => router.go(-1)"
        >
          {{ t('back') }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
const confirmationCode = ref<any>([])
const { confirmRegistration, isLoading } = useAuth()
const toast = useToast()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  if (!route.query.username) {
    toast.add({
      title: t('error'),
      description: t('invalidCredentials'),
      color: 'error'
    })
    router.push('/auth/login')
  }
})

async function confirmSignUp() {
  if (!confirmationCode.value) {
    toast.add({
      title: t('error'),
      description: t('verificationRequired'),
      color: 'error'
    })
    return
  }
  const result = await confirmRegistration(
    route.query.username as string,
    confirmationCode.value.join('')
  )
  if (result.success) {
    toast.add({
      title: t('success'),
      description: t('profileUpdated'),
      color: 'success'
    })
    router.push('/')
  } else if (result.error) {
    toast.add({
      title: t('error'),
      description: result.error,
      color: 'error'
    })
  }
}
</script>

<style scoped></style>
