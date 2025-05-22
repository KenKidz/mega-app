<template>
  <div class="password-validator" v-if="modelValue && showValidation">
    <div
      class="validator-popup p-3 bg-base rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <p class="text-base font-medium mb-2">Password must:</p>
      <ul class="space-y-1 text-sm">
        <li
          v-for="(rule, index) in passwordRules"
          :key="index"
          class="flex items-center gap-2"
          :class="{
            'text-green': rule.isValid,
            'text-red': !rule.isValid,
          }"
        >
          <UIcon
            :name="rule.isValid ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
            class="flex-shrink-0"
          />
          <span>{{ rule.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  showValidation: {
    type: Boolean,
    default: false,
  },
});

// Define individual validation rules
const hasMinLength = computed(() => props.modelValue?.length >= 8);
const hasUppercase = computed(() => /[A-Z]/.test(props.modelValue || ""));
const hasLowercase = computed(() => /[a-z]/.test(props.modelValue || ""));
const hasNumber = computed(() => /\d/.test(props.modelValue || ""));
const hasSpecialChar = computed(() =>
  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(props.modelValue || "")
);

// Create a reactive rules array for v-for rendering
const passwordRules = computed(() => [
  { text: 'Be at least 8 characters', isValid: hasMinLength.value },
  { text: 'Contain at least one uppercase letter', isValid: hasUppercase.value },
  { text: 'Contain at least one lowercase letter', isValid: hasLowercase.value },
  { text: 'Contain at least one number', isValid: hasNumber.value },
  { text: 'Contain at least one special character', isValid: hasSpecialChar.value }
]);

// Determine if all rules are satisfied
const isValid = computed(() => {
  return (
    hasMinLength.value &&
    hasUppercase.value &&
    hasLowercase.value &&
    hasNumber.value &&
    hasSpecialChar.value
  );
});

// Expose validation state to parent components
defineExpose({
  isValid,
  hasMinLength,
  hasUppercase,
  hasLowercase,
  hasNumber,
  hasSpecialChar,
});
</script>

<style scoped>
.password-validator {
  position: relative;
  margin-top: 5px;
}

.validator-popup {
  position: absolute;
  width: 100%;
  z-index: 10;
}
</style>
