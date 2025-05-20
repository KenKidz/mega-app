<template>
  <div class="space-y-8">
    <div class="space-y-4">
      <div class="text-2xl font-medium">Card</div>
      <UCard>
        <template #header>
          <div>Header</div>
        </template>

        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi
          cupiditate veritatis sunt esse debitis iusto! Maiores, nostrum
          deleniti? Aperiam odit est provident, blanditiis omnis hic deserunt
          repellat eos beatae similique!
        </div>

        <template #footer>
          <div>footer</div>
        </template>
      </UCard>
    </div>

    <div class="space-y-4">
      <div class="text-2xl font-medium">Breadcrumb</div>
      <UBreadcrumb :items="breadcrumb" />
    </div>

    <div class="space-y-4">
      <div class="text-2xl font-medium">Button</div>
      <UButton>Button</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const breadcrumb = ref<BreadcrumbItem[]>([
  {
    label: 'Home',
    icon: 'i-lucide-house'
  },
  {
    label: 'Components',
    icon: 'i-lucide-box',
    to: '/components'
  },
  {
    label: 'Breadcrumb',
    icon: 'i-lucide-link',
    to: '/components/breadcrumb'
  }
])
</script>

<style scoped></style>
