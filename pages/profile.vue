<template>
  <div class="max-w-2xl mx-auto px-4">
    <UCard>
      <!-- Avatar Upload Section -->
      <div class="flex flex-col items-center mb-6">
        <div class="relative mb-4">
          <UAvatar :src="avatarPreview" size="3xl" alt="Kenkid" class="w-32 h-32 object-cover border-4 border-primary-200" />
          <UButton
            icon="i-heroicons-pencil"
            color="primary"
            variant="soft"
            class="absolute bottom-0 right-0 rounded-full"
            size="sm"
            @click="triggerFileInput"
          />
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleAvatarChange" 
            accept="image/*" 
            class="hidden"
          />
        </div>
        <p v-if="avatarError" class="text-red-500 text-sm mt-1">{{ avatarError }}</p>
      </div>

      <!-- Profile Form -->
      <UForm :state="form" @submit="saveProfile" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="Full Name" name="fullName">
            <UInput v-model="form.fullName" class="w-full" placeholder="Enter your full name" />
          </UFormField>

          <UFormField label="Email" name="email">
            <UInput
                v-model="form.email"
                type="email"
                placeholder="Enter your email address"
                class="w-full"
            />
          </UFormField>

          <UFormField label="Phone Number" name="phoneNumber">
            <UInput
                v-model="form.phoneNumber"
                placeholder="Enter your phone number"
                class="w-full"
            />
          </UFormField>
        </div>

        <div class="flex justify-end mt-6">
          <UButton 
            type="submit" 
            color="primary" 
            :loading="loading"
          >
            Save Changes
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// Form state
const form = reactive({
  fullName: '',
  email: '',
  phoneNumber: ''
})

// Avatar handling
const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<any>('')
const avatarError = ref<string | null>(null)
const avatarFile = ref<File | null>(null)
const loading = ref(false)

// Mock initial data loading - in a real app, this would come from an API
onMounted(() => {
})

function triggerFileInput() {
  fileInput.value?.click()
}

function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      avatarError.value = 'Please select an image file'
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      avatarError.value = 'Image size should be less than 5MB'
      return
    }
    
    avatarError.value = null
    avatarFile.value = file
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

async function saveProfile() {
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Here you would normally send the form data and avatar to your API
    console.log('Profile data:', form)
    console.log('Avatar file:', avatarFile.value)
    
    // Show success message
    const toast = useToast()
    toast.add({ title: 'Success', description: 'Profile updated successfully', color: 'success' })
  } catch (error) {
    console.error('Error saving profile:', error)
    
    // Show error message
    const toast = useToast()
    toast.add({ title: 'Error', description: 'Failed to update profile', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

/* Add any additional custom styles here */
</style>