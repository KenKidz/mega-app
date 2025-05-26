<template>
  <div class="mb-6">
    <slot>
        <h1 class="text-2xl font-semibold">{{ title }}</h1>
    </slot>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: t('dashboard')
  }
)
</script>
