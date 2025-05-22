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
    
    <div v-if="registrationStep === 'confirmation'" class="space-y-4">
      <p class="text-center mb-4">
        We've sent a verification code to your email address. Please enter it below to confirm your account.
      </p>
      
      <UFormField label="Verification Code" required name="confirmationCode">
        <UInput
          v-model="confirmationCode"
          class="w-full"
          color="primary"
          placeholder="Enter verification code"
        />
      </UFormField>        <UButton 
        block 
        @click="confirmSignUp"
        :loading="isLoading"
        :disabled="isLoading || !confirmationCode"
      >
        Verify Account
      </UButton>
      
      <div class="text-center mt-4">
        <p class="text-sm text-subtle">
          <span class="cursor-pointer text-blue-600 hover:text-blue-800 font-medium" @click="registrationStep = 'registration'">
            Go back
          </span>
        </p>
      </div>
    </div>
    
    <div v-else class="space-y-3 sm:space-y-4">
      <!-- Social Register Buttons -->
      <UButton
        block
        color="neutral"
        class="shadow-sm text-xs sm:text-sm"
        variant="subtle"
        disabled
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
        disabled
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
            v-model="state.username"
            class="w-full"
            color="primary"
            placeholder="Choose a username"
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
        </UFormField>        <UButton 
          type="submit" 
          block 
          class="mt-4"          :loading="isLoading"
          :disabled="isLoading"
        >
          Create Account
        </UButton>

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
  layout: "auth"
});

import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useAuth } from '~/composables/useAuth';

type Schema = z.output<typeof schema>;

const showPass = ref<boolean>(false);
const showConfirmPass = ref<boolean>(false);
const passwordFocused = ref<boolean>(false);
const passwordValidatorRef = ref<any>(null);
const registrationStep = ref<'registration' | 'confirmation'>('registration');
const confirmationCode = ref<string>('');
const registeredUsername = ref<string>('');

const state = reactive<Partial<Schema>>({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeTerms: undefined,
});

const schema = z
  .object({
    username: z.string().min(1, "Required"),
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
    }  );

// Use our auth composable
const { register, confirmRegistration, isLoading } = useAuth();
const toast = useToast();
const router = useRouter();

// Handle form submission for registration
async function onSubmit(event: FormSubmitEvent<any>) {  try {
    const validData = schema.parse(state);
    
    const result = await register(
      validData.username,
      validData.password,
      validData.email
    );
    
    if (result.success) {
      registeredUsername.value = validData.username;
      
      if (result.nextStep && result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        toast.add({
          title: "Verification Required",
          description: "Please check your email for a verification code.",
          color: "info",
        });
        
        registrationStep.value = 'confirmation';
      } else {
        toast.add({
          title: "Success",
          description: "Your account has been created successfully!",
          color: "success",
        });
        
        // If auto sign-in worked, redirect to home
        router.push('/');
      }
    } else if (result.error) {
      toast.add({
        title: "Error",
        description: result.error,
        color: "error",
      });
    }  } catch (error) {
    if (error instanceof z.ZodError) {
      toast.add({
        title: "Error",
        description: "Please fix the form errors",
        color: "error",
      });
    }
  }
}

// Handle confirmation code submission
async function confirmSignUp() {
  if (!confirmationCode.value) {
    toast.add({
      title: "Error",
      description: "Please enter the verification code",
      color: "error",
    });
    return;
  }    const result = await confirmRegistration(
    registeredUsername.value || state.username!, 
    confirmationCode.value
  );
  
  if (result.success) {
    toast.add({
      title: "Success",
      description: "Your account has been verified successfully!",
      color: "success",
    });
    
    // Redirect to home page
    router.push('/');
  } else if (result.error) {
    toast.add({
      title: "Error",
      description: result.error,
      color: "error",
    });
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
