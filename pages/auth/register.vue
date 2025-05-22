<template>
  <div>
    <div class="text-center mb-6">
      <div class="user-icon mb-4">
        <UIcon name="i-lucide-user-plus" class="text-4xl sm:text-5xl" />
      </div>
      <h1 class="text-xl sm:text-2xl font-bold" id="register-heading">
        Create Account
      </h1>
      <p class="text-subtle text-xs sm:text-sm">
        Register to access all features and services.
      </p>
    </div>
    <div class="space-y-3 sm:space-y-4">
      <!-- Social Register Buttons -->
      <UButton
        block
        color="neutral"
        class="shadow-sm text-xs sm:text-sm"
        variant="subtle"
      >
        <template #leading>
          <UIcon name="i-logos-google-icon" />
        </template>
        Google
      </UButton>

      <UButton
        block
        color="neutral"
        class="shadow-sm text-xs sm:text-sm"
        variant="subtle"
      >
        <template #leading>
          <UIcon name="i-logos-github-icon" />
        </template>
        GitHub
      </UButton>

      <!-- Divider -->
      <div class="flex items-center my-6">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="px-3 text-subtle text-sm">or</span>
        <div class="flex-grow border-t border-gray-300"></div>
      </div>
      <UForm
        :state="state"
        :schema="schema"
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
        <UFormField label="Password" required name="password">
          <UInput
            v-model="state.password"
            class="w-full"
            color="primary"
            :type="showPass ? 'text' : 'password'"
            placeholder="Create a password"
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
                :aria-label="showPass ? 'Hide password' : 'Show password'"
                :aria-pressed="showPass"
                aria-controls="password"
                @click="showPass = !showPass"
              />
            </template>
          </UInput>
          <PasswordValidator
            v-model="state.password"
            :show-validation="passwordFocused"
            ref="passwordValidatorRef"
          />
        </UFormField>
        <UFormField label="Confirm Password" required name="confirmPassword">
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
        <UFormField name="agreeTerms">
          <UCheckbox
            v-model="state.agreeTerms"
            label="I agree to the Terms of Service and Privacy Policy"
          />
        </UFormField>

        <UButton type="submit" block class="mt-4">Create Account</UButton>

        <div class="text-center mt-4">
          <p class="text-sm text-subtle">
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

import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

type Schema = z.output<typeof schema>;

const showPass = ref<boolean>(false);
const showConfirmPass = ref<boolean>(false);
const passwordFocused = ref<boolean>(false);
const passwordValidatorRef = ref<any>(null);

const state = reactive<Partial<Schema>>({
  fullname: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: undefined,
});

const schema = z
  .object({
    fullname: z.string().min(1, "Required"),
    email: z.string().min(1, "Required").email("Invalid email format"),
    password: z.string().min(1, "Required"),
    confirmPassword: z.string().min(1, "Required"),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (!passwordValidatorRef.value) return true;
      return passwordValidatorRef.value.isValid;
    },
    {
      message: "Password doesn't meet all requirements",
      path: ["password"],
    }
  );

// Hook into form submission event
const toast = useToast();
async function onSubmit(event: FormSubmitEvent<any>) {
  try {
    const validData = schema.parse(state);

    toast.add({
      title: "Success",
      description: "Your account has been created successfully!",
      color: "success",
    });
    console.log(validData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.format();
      console.error("Validation failed:", formattedErrors);
      toast.add({
        title: "Error",
        description: "Please fix the form errors",
        color: "error",
      });
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
