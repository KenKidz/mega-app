<template>
  <div>
    <div class="mb-6 text-center">
      <div class="user-icon mb-4">
        <UIcon
          name="i-lucide-circle-user"
          class="text-4xl sm:text-5xl"
        />
      </div>
      <h1
        id="login-heading"
        class="text-xl font-bold sm:text-2xl"
      >
        {{ t('loginTitle') }}
      </h1>
      <p class="text-subtle text-xs sm:text-sm">
        {{ t('credentials') }}
      </p>
    </div>
    <div class="space-y-3 sm:space-y-4">
      <!-- Social Login Buttons -->
      <UButton
        block
        color="neutral"
        class="text-xs shadow-sm sm:text-sm"
        variant="subtle"
        disabled
      >
        <template #leading>
          <UIcon name="i-logos-google-icon" />
        </template>
        {{ t('connectWithGoogle') }}
      </UButton>
      <UButton
        block
        color="neutral"
        class="text-xs shadow-sm sm:text-sm"
        variant="subtle"
        disabled
      >
        <template #leading>
          <UIcon name="i-logos-github-icon" />
        </template>
        {{ t('connectWithGithub') }}
      </UButton>

      <!-- Divider -->
      <div class="my-6 flex items-center">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="text-subtle px-3 text-sm">{{ t('or') }}</span>
        <div class="flex-grow border-t border-gray-300"></div>
      </div>
      <UForm
        :validate="validate"
        :state="state"
        class="space-y-3 sm:space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          :label="t('usernameLabel')"
          required
          name="username"
        >
          <UInput
            v-model="state.username"
            class="w-full"
            color="primary"
            :placeholder="t('enterUsername')"
          />
        </UFormField>

        <UFormField
          :label="t('passwordLabel')"
          name="password"
        >
          <UInput
            v-model="state.password"
            class="w-full"
            color="primary"
            :type="showPass ? 'text' : 'password'"
            placeholder="Enter your password"
            :trailing="true"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="md"
                :icon="showPass ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showPass ? t('hidePassword') : t('showPassword')"
                :aria-pressed="showPass"
                aria-controls="password"
                @click="showPass = !showPass"
              />
            </template>
          </UInput>
        </UFormField>
        <UCheckbox
          v-model="state.rememberMe"
          :label="t('rememberMe')"
          class="text-sm"
          name="rememberMe"
        />
        <UButton
          type="submit"
          block
          class="mt-4"
          :loading="isLoading"
          :disabled="isLoading"
        >
          {{ t('login') }}
        </UButton>
        <div class="mt-4 text-center">
          <p class="text-subtle text-sm">
            {{ t('dontHaveAccount') }}
            <NuxtLink
              to="/auth/register"
              class="font-medium text-blue-600 hover:text-blue-800"
            >
              {{ t('registerHere') }}
            </NuxtLink>
          </p>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { useAuth } from '~/composables/useAuth'
import { SignInStep } from '~/types/auth.type'
import { getRememberedCredentials } from '~/utils/useRememberMe'

definePageMeta({
  layout: 'auth'
})

const showPass = ref<boolean>(false)
const state = reactive({
  username: '',
  password: '',
  rememberMe: false
})

onMounted(async () => {
  if (import.meta.client) {
    const savedCredentials = getRememberedCredentials()
    if (savedCredentials) {
      state.username = savedCredentials.username
      state.rememberMe = savedCredentials.rememberMe
    }
  }
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ name: 'username', message: t('required') })
  if (!state.password) errors.push({ name: 'password', message: t('required') })
  return errors
}

const router = useRouter()
const toast = useToast()
const { login, isLoading } = useAuth()

async function onSubmit(event: FormSubmitEvent<typeof state>) {
  try {
    const result = await login(state.username, state.password, state.rememberMe)
    if (result.success) {
      toast.add({
        title: t('success'),
        description: t('loginSuccess'),
        color: 'success'
      })

      // Redirect to dashboard or home page
      router.push('/')
    } else if (result.error) {
      toast.add({
        title: t('error'),
        description: result.error,
        color: 'error'
      })
    } else if (result.nextStep?.signInStep === SignInStep.CONFIRM_SIGN_UP) {
      router.push({
        path: '/auth/confirm',
        query: { username: state.username }
      })
      toast.add({
        title: t('confirmationRequired'),
        description: t('confirmationCodeSent'),
        color: 'info'
      })
    } else {
      toast.add({
        title: t('unknownResponse'),
        description: t('unexpectedError'),
        color: 'warning'
      })
    }
  } catch (err: any) {
    console.log('Login error:', err)
    toast.add({
      title: t('error'),
      description: t('unexpectedError'),
      color: 'error'
    })
  }
}
</script>

<style scoped>
.user-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
