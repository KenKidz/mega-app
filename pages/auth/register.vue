<template>
  <div>
    <div class="mb-6 text-center">
      <div class="user-icon mb-4">
        <UIcon
          name="i-lucide-user-plus"
          class="text-4xl sm:text-5xl"
        />
      </div>
      <h1
        id="register-heading"
        class="text-xl font-bold sm:text-2xl"
      >
        {{ t('registerTitle') }}
      </h1>
      <p class="text-subtle text-xs sm:text-sm">
        {{ t('registerDescription') }}
      </p>
    </div>

    <div class="space-y-3 sm:space-y-4">
      <!-- Social Register Buttons -->
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
        :state="state"
        :schema="schema"
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
            :placeholder="t('chooseUsername')"
          />
        </UFormField>

        <UFormField
          :label="t('emailLabel')"
          required
          name="email"
        >
          <UInput
            v-model="state.email"
            class="w-full"
            color="primary"
            :placeholder="t('emailPlaceholder')"
            type="email"
            autocomplete="email"
          />
        </UFormField>
        <UFormField
          :label="t('passwordLabel')"
          required
          name="password"
        >
          <UInput
            v-model="state.password"
            class="w-full"
            color="primary"
            :type="showPass ? 'text' : 'password'"
            :placeholder="t('passwordPlaceholder')"
            :trailing="true"
            @focus="passwordFocused = true"
            @blur="passwordFocused = false"
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
          <PasswordValidator
            ref="passwordValidatorRef"
            v-model="state.password"
            :show-validation="passwordFocused"
          />
        </UFormField>
        <UFormField
          :label="t('confirmPassword')"
          required
          name="confirmPassword"
        >
          <UInput
            v-model="state.confirmPassword"
            class="w-full"
            color="primary"
            :type="showConfirmPass ? 'text' : 'password'"
            :placeholder="t('confirmPassword')"
            :trailing="true"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="md"
                :icon="showConfirmPass ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="
                  showConfirmPass ? t('hidePassword') : t('showPassword')
                "
                :aria-pressed="showConfirmPass"
                aria-controls="confirmPassword"
                @click="showConfirmPass = !showConfirmPass"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField name="agreeTerms">
          <UCheckbox
            v-model="state.agreeTerms"
            :label="t('agreeTerms')"
          />
        </UFormField>
        <UButton
          type="submit"
          block
          class="mt-4"
          :loading="isLoading"
          :disabled="isLoading"
        >
          {{ t('register') }}
        </UButton>

        <div class="mt-4 text-center">
          <p class="text-subtle text-sm">
            {{ t('alreadyHaveAccount') }}
            <NuxtLink
              to="/auth/login"
              class="font-medium text-blue-600 hover:text-blue-800"
            >
              {{ t('login') }}
            </NuxtLink>
          </p>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuth } from '~/composables/useAuth'
import { SignUpStep } from '~/types/auth.type'

definePageMeta({
  layout: 'auth'
})

type Schema = z.output<typeof schema>

const showPass = ref<boolean>(false)
const showConfirmPass = ref<boolean>(false)
const passwordFocused = ref<boolean>(false)
const passwordValidatorRef = ref<any>(null)
const registeredUsername = ref<string>('')

const state = reactive<Partial<Schema>>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: undefined
})

const schema = z
  .object({
    username: z.string().min(1, t('required')),
    email: z.string().min(1, t('required')).email(t('invalidEmail')),
    password: z.string().min(1, t('required')),
    confirmPassword: z.string().min(1, t('required')),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: t('acceptTerms') })
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('passwordMismatch'),
    path: ['confirmPassword']
  })
  .refine(
    () => {
      if (!passwordValidatorRef.value) return true
      return passwordValidatorRef.value.isValid
    },
    {
      message: "Password doesn't meet all requirements",
      path: ['password']
    }
  )

// Use our auth composable
const { register, isLoading } = useAuth()
const toast = useToast()
const router = useRouter()

// Handle form submission for registration
async function onSubmit(event: FormSubmitEvent<any>) {
  try {
    const validData = schema.parse(state)

    const result = await register(
      validData.username,
      validData.password,
      validData.email
    )

    if (result.success) {
      registeredUsername.value = validData.username
      if (
        result.nextStep &&
        result.nextStep.signUpStep === SignUpStep.CONFIRM_SIGN_UP
      ) {
        toast.add({
          title: t('verificationRequired'),
          description: t('confirmationCodeSent'),
          color: 'info'
        })
        router.push({
          path: '/auth/confirm',
          query: { username: state.username }
        })
      } else {
        toast.add({
          title: t('success'),
          description: t('profileUpdated'),
          color: 'success'
        })

        // If auto sign-in worked, redirect to home
        router.push('/')
      }
    } else if (result.error) {
      toast.add({
        title: t('error'),
        description: result.error,
        color: 'error'
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      toast.add({
        title: t('error'),
        description: t('invalidCredentials'),
        color: 'error'
      })
    }
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
