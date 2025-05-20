<template>
  <div>
    <div class="text-center mb-6">
      <div class="user-icon mb-4">
        <UIcon name="i-heroicons-user-circle" class="text-4xl sm:text-5xl" />
      </div>
      <h1 class="text-xl sm:text-2xl font-bold" id="login-heading">Login</h1>
      <p class="text-gray-500 text-xs sm:text-sm">
        Enter your credentials to access your account.
      </p>
    </div>
    <div class="space-y-3 sm:space-y-4">
      <!-- Social Login Buttons -->
      <UButton
        block
        color="neutral"
        class="border shadow-sm text-xs sm:text-sm"
        variant="soft"
      >
        <template #leading>
          <UIcon name="i-logos-google-icon" />
        </template>
        Google
      </UButton>

      <UButton
        block
        color="neutral"
        class="border shadow-sm text-xs sm:text-sm"
        variant="soft"
      >
        <template #leading>
          <UIcon name="i-logos-github-icon" />
        </template>
        GitHub
      </UButton>

      <!-- Divider -->
      <div class="flex items-center my-6">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="px-3 text-gray-500 text-sm">or</span>
        <div class="flex-grow border-t border-gray-300"></div>
      </div>
      <UForm
        :validate="validate"
        :state="state"
        class="space-y-3 sm:space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Email" required name="email">
          <UInput
            v-model="state.email"
            class="w-full"
            color="primary"
            placeholder="Enter your email"
            type="email"
            autocomplete="email"
          />
        </UFormField>

        <UFormField label="Password" name="password">
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
                :aria-label="showPass ? 'Hide password' : 'Show password'"
                :aria-pressed="showPass"
                aria-controls="password"
                @click="showPass = !showPass"
              />
            </template>
          </UInput>
        </UFormField>
        <UCheckbox
          v-model="state.rememberMe"
          label="Remember me"
          class="text-sm"
        />

        <UButton type="submit" block class="mt-4">Login</UButton>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <NuxtLink
              to="/auth/register"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              Register here
            </NuxtLink>
          </p>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

import type { FormError, FormSubmitEvent } from "@nuxt/ui";

const showPass = ref<boolean>(false);
const state = reactive({
  email: undefined,
  password: undefined,
  rememberMe: false,
  showPassword: false,
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ name: "email", message: "Required" });
  if (!state.password) errors.push({ name: "password", message: "Required" });
  return errors;
};

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<typeof state>) {
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(event.data);
}
</script>

<style scoped>
.user-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
