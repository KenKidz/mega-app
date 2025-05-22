<template>
  <div class="space-y-8">
    <UCard>
      <template #header>
        <div class="text-xl font-semibold">Welcome {{ welcomeMessage }}</div>
      </template>

      <div>        <p class="mb-4">
          This is your application dashboard. You're now authenticated with AWS Cognito via Amplify Gen 2.
        </p>
          <p v-if="isLoading" class="text-gray-500">
          Loading user data...
        </p>
        
        <div v-else class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 class="font-medium mb-2">Your Account Information:</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span class="text-gray-500">Username:</span>
              <span class="font-medium ml-2">{{ userData?.username || 'Not available' }}</span>
            </div>
            <div>
              <span class="text-gray-500">Email:</span>
              <span class="font-medium ml-2">{{ userData?.attributes?.email || 'Not available' }}</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">Last login: {{ new Date().toLocaleString() }}</span>
          <UButton to="/profile" color="primary" variant="soft">
            Manage Profile
          </UButton>
        </div>
      </template>
    </UCard>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-lucide-shield" class="mr-2 text-primary" />
            <span class="font-medium">Authentication</span>
          </div>
        </template>
        <p>Your application is secured with AWS Cognito authentication.</p>
      </UCard>
      
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-lucide-layout-dashboard" class="mr-2 text-amber-500" />
            <span class="font-medium">Dashboard</span>
          </div>
        </template>
        <p>Customize this dashboard to display your application's key metrics.</p>
      </UCard>
      
      <UCard>
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-lucide-settings" class="mr-2 text-teal-500" />
            <span class="font-medium">Configuration</span>
          </div>
        </template>
        <p>Configure application settings and user preferences.</p>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { user, isLoading } = useAuth();

// Get user data for display
const userData = computed(() => user.value);

// Format a welcome message with the user's name or email
const welcomeMessage = computed(() => {
  if (!userData.value) return 'to your dashboard';
  
  if (userData.value.attributes?.name) {
    return userData.value.attributes.name;
  } else if (userData.value.attributes?.email) {
    // Use the part before @ in the email as a name
    return userData.value.attributes.email.split('@')[0];
  } else {
    return userData.value.username || 'to your dashboard';
  }
});
</script>
