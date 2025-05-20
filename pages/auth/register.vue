<template>
  <div>
    <div class="text-center mb-6">
      <div class="user-icon mb-4">
        <UIcon name="i-heroicons-user-plus" class="text-4xl sm:text-5xl" />
      </div>
      <h1 class="text-xl sm:text-2xl font-bold" id="register-heading">
        Create Account
      </h1>
      <p class="text-gray-500 text-xs sm:text-sm">
        Register to access all features and services.
      </p>
    </div>
    <div class="space-y-3 sm:space-y-4">
      <!-- Social Register Buttons -->
      <UButton
        block
        color="neutral"
        class="border shadow-sm text-xs sm:text-sm"
        variant="soft"
      >
        <template #leading>
          <UIcon name="i-logos-google-icon" />
        </template>
        Sign up with Google
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
        Sign up with GitHub
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
        <UFormField label="Full Name" required name="fullname">
          <UInput
            v-model="state.fullname"
            class="w-full"
            color="primary"
            placeholder="Enter your full name"
          />
        </UFormField>

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
            placeholder="Create a password"
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

        <UFormField label="Confirm Password" name="confirmPassword">
          <UInput
            v-model="state.confirmPassword"
            class="w-full"
            color="primary"
            :type="showConfirmPass ? 'text' : 'password'"
            placeholder="Confirm your password"
            :trailing="true"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="md"
                :icon="showConfirmPass ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="
                  showConfirmPass ? 'Hide password' : 'Show password'
                "
                :aria-pressed="showConfirmPass"
                aria-controls="confirmPassword"
                @click="showConfirmPass = !showConfirmPass"
              />
            </template>
          </UInput>
        </UFormField>
        <UCheckbox
          v-model="state.agreeTerms"
          label="I agree to the Terms of Service and Privacy Policy"
        />

        <UButton type="submit" block class="mt-4">Create Account</UButton>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Already have an account?
            <NuxtLink
              to="/auth/login"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login here
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
const showConfirmPass = ref<boolean>(false);
const state = reactive({
  fullname: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
  agreeTerms: false,
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.fullname) errors.push({ name: "fullname", message: "Required" });
  if (!state.email) errors.push({ name: "email", message: "Required" });
  else if (!/^\S+@\S+\.\S+$/.test(state.email))
    errors.push({ name: "email", message: "Invalid email format" });

  if (!state.password) errors.push({ name: "password", message: "Required" });
  else if (state.password.length < 8)
    errors.push({
      name: "password",
      message: "Password must be at least 8 characters",
    });

  if (!state.confirmPassword)
    errors.push({ name: "confirmPassword", message: "Required" });
  else if (state.password !== state.confirmPassword)
    errors.push({ name: "confirmPassword", message: "Passwords do not match" });

  if (!state.agreeTerms)
    errors.push({ name: "agreeTerms", message: "You must agree to the terms" });

  return errors;
};

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<typeof state>) {
  toast.add({
    title: "Success",
    description: "Your account has been created successfully!",
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
