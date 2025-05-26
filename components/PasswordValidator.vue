<template>
  <div
    v-if="modelValue && showValidation"
    class="password-validator"
  >
    <div
      class="validator-popup bg-base rounded-lg border border-gray-200 p-3 shadow-lg dark:border-gray-700"
    >
      <p class="mb-2 text-base font-medium">{{ t('passwordRequirements') }}</p>
      <ul class="space-y-1 text-sm">
        <li
          v-for="(rule, index) in passwordRules"
          :key="index"
          class="flex items-center gap-2"
          :class="{
            'text-green': rule.isValid,
            'text-red': !rule.isValid
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
    default: ''
  },
  showValidation: {
    type: Boolean,
    default: false
  }
})

// Define individual validation rules
const hasMinLength = computed(() => props.modelValue?.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(props.modelValue || ''))
const hasLowercase = computed(() => /[a-z]/.test(props.modelValue || ''))
const hasNumber = computed(() => /\d/.test(props.modelValue || ''))
const hasSpecialChar = computed(() =>
  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(props.modelValue || '')
)

// Create a reactive rules array for v-for rendering
const passwordRules = computed(() => [
  { text: t('passwordRequiresMinLength'), isValid: hasMinLength.value },
  { text: t('passwordRequiresUppercase'), isValid: hasUppercase.value },
  { text: t('passwordRequiresLowercase'), isValid: hasLowercase.value },
  { text: t('passwordRequiresNumber'), isValid: hasNumber.value },
  { text: t('passwordRequiresSpecialChar'), isValid: hasSpecialChar.value }
])

// Determine if all rules are satisfied
const isValid = computed(() => {
  return (
    hasMinLength.value &&
    hasUppercase.value &&
    hasLowercase.value &&
    hasNumber.value &&
    hasSpecialChar.value
  )
})

// Expose validation state to parent components
defineExpose({
  isValid,
  hasMinLength,
  hasUppercase,
  hasLowercase,
  hasNumber,
  hasSpecialChar
})
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
