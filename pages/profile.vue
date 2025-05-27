<template>
  <div>
    <MainHeaderSection :title="t('profile')" />
    <div class="mx-auto max-w-2xl px-4">
      <UCard>
        <div class="mb-6 flex flex-col items-center">
          <div class="relative mb-4">
            <UAvatar
              :src="avatarPreview"
              size="3xl"
              :alt="form.fullName || t('username')"
              class="border-primary-200 h-32 w-32 border-4 object-cover"
            />
            <UButton
              icon="i-lucide-pencil"
              color="primary"
              variant="soft"
              class="absolute right-0 bottom-0 rounded-full"
              size="sm"
              @click="triggerFileInput"
            />
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
            />
            <div
              v-if="isUploading"
              class="bg-opacity-50 absolute inset-0 flex flex-col items-center justify-center rounded-full bg-gray-800"
            >
              <UProgress
                :value="progress"
                :max="100"
                class="w-16"
                color="primary"
              />
              <span class="mt-1 text-xs text-white">{{ progress }}%</span>
            </div>
          </div>
          <p
            v-if="avatarError"
            class="mt-1 text-sm text-red-500"
          >
            {{ avatarError }}
          </p>
        </div>
        <UForm
          :state="form"
          class="space-y-6"
          @submit="saveProfile"
        >
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UFormField
              :label="t('usernameLabel')"
              name="username"
            >
              <UInput
                v-model="form.username"
                class="w-full"
                readonly
                disabled
              />
            </UFormField>

            <UFormField
              :label="t('emailLabel')"
              name="email"
            >
              <UInput
                v-model="form.email"
                type="email"
                :placeholder="t('enterEmailAddress')"
                class="w-full"
              />
            </UFormField>

            <UFormField
              :label="t('fullName')"
              name="fullName"
            >
              <UInput
                v-model="form.fullName"
                class="w-full"
                :placeholder="t('enterFullName')"
              />
            </UFormField>
            <UFormField
              :label="t('phoneNumber')"
              name="phoneNumber"
            >
              <UInput
                v-model="form.phoneNumber"
                :placeholder="t('enterPhoneNumber')"
                class="w-full"
                @input="handlePhoneNumberChange"
              />
              <p
                v-if="phoneNumberError"
                class="mt-1 text-sm text-red-500"
              >
                {{ phoneNumberError }}
              </p>
            </UFormField>
          </div>
          <div class="mt-6 flex justify-end">
            <UButton
              type="submit"
              color="primary"
              :loading="isLoading || loading"
            >
              {{ t('saveChanges') }}
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useStorage } from '~/composables/useStorage'

// Get auth composable
const { user, isLoading, updateAttributes } = useAuth()
// Get storage composable
const { uploadFile, isUploading, progress } = useStorage()

// Form state
const form = reactive({
  username: '',
  email: '',
  fullName: '',
  phoneNumber: ''
})

// Form validation
const phoneNumberError = ref<string | null>(null)

// Avatar handling
const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<any>('')
const avatarError = ref<string | null>(null)
const avatarFile = ref<File | null>(null)
const loading = ref(false)
const avatarKey = ref<string | null>(null)
const loadingStore = useLoadingStore()

// Load user data when component mounts
onMounted(async () => {
  if (user.value) {
    loadingStore.startLoading('profile')
    // Extract user data from Cognito user
    form.username = user.value.username || ''
    form.email = user.value.attributes?.email || ''

    // Other attributes might be available depending on your Cognito setup
    form.fullName = user.value.attributes?.name || ''
    form.phoneNumber = user.value.attributes?.phone_number || '' // Load user avatar from S3 if available
    if (user.value.attributes && user.value.attributes['custom:avatar_key']) {
      try {
        const key = user.value.attributes['custom:avatar_key'] as string
        avatarKey.value = key
        const { getFileUrl } = useStorage()

        // Handle key format - remove 'protected/' prefix if present
        const keyToUse = key.startsWith('protected/')
          ? key.replace('protected/', '')
          : key

        const url = await getFileUrl(keyToUse, {
          accessLevel: 'protected',
          username: user.value.username
        })

        if (url) {
          avatarPreview.value = url
        }
      } catch (error) {
        console.error('Error loading avatar:', error)
        // If we can't load the avatar, use default
        avatarPreview.value = ''
      }
    }
    loadingStore.stopLoading()
  }
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

// Validate phone number format for AWS Cognito (E.164 format)
function validatePhoneNumber(phoneNumber: string): boolean {
  // E.164 format: +[country code][number], e.g., +12065550100
  const e164Regex = /^\+[1-9]\d{1,14}$/
  return e164Regex.test(phoneNumber)
}

// Format phone number to E.164 format if needed
function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters except the plus sign
  let formattedNumber = phoneNumber.replace(/[^\d+]/g, '')

  // Ensure it starts with a plus sign
  if (!formattedNumber.startsWith('+')) {
    formattedNumber = '+' + formattedNumber
  }

  return formattedNumber
}

// Handle phone number input change
function handlePhoneNumberChange(event: Event) {
  const target = event.target as HTMLInputElement
  phoneNumberError.value = null

  // Format the phone number
  form.phoneNumber = formatPhoneNumber(target.value)
}

// Handle success messages
function showSuccessMessage() {
  const toast = useToast()
  toast.add({
    title: t('success') || 'Success',
    description: t('profileUpdated') || 'Profile updated successfully',
    color: 'success'
  })
}

// Handle error messages
function showErrorMessage(error?: string) {
  const toast = useToast()
  toast.add({
    title: t('error') || 'Error',
    description: error || t('errorUpdatingProfile') || 'Error updating profile',
    color: 'error'
  })
}

// Create user attributes object for updates
function createUserAttributes(
  includeAvatar: boolean = false,
  avatarKeyValue?: string
): Record<string, string> {
  const userAttributes: Record<string, string> = {
    email: form.email,
    name: form.fullName
  }

  // Only add phone number if it's valid
  if (form.phoneNumber) {
    userAttributes.phone_number = form.phoneNumber
  }
  // Add avatar key if provided
  if (includeAvatar && avatarKeyValue) {
    userAttributes['custom:avatar_key'] = avatarKeyValue
  }
  return userAttributes
}

// Update user profile with attributes
async function updateUserProfile(attributes: Record<string, string>) {
  const result = await updateAttributes(attributes)
  if (result.success) {
    showSuccessMessage()
  } else if (result.error) {
    showErrorMessage(result.error)
  }
  return result.success
}

// Upload avatar to S3
async function uploadAvatar(): Promise<{ success: boolean; key?: string }> {
  if (!avatarFile.value) {
    return { success: false }
  }

  // Reset progress and set uploading state
  progress.value = 0
  isUploading.value = true

  try {
    // Generate a unique filename with timestamp and username
    const timestamp = new Date().getTime()
    const fileExtension = avatarFile.value.name.split('.').pop() || 'jpg'
    const fileName = `avatar-${form.username}-${timestamp}.${fileExtension}` // Upload the file to S3
    const uploadResult = await uploadFile(avatarFile.value, fileName, {
      path: 'avatars',
      accessLevel: 'protected',
      username: form.username,
      onProgress: (progressEvent: { loaded: number; total: number }) => {
        progress.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
      }
    })

    if (!uploadResult.success) {
      showErrorMessage('Failed to upload avatar')
      return { success: false }
    }

    // Store the full key with the correct path format for future retrieval
    const fullKey = `${form.username}/avatars/${fileName}`

    return {
      success: true,
      key: fullKey
    }
  } catch (error) {
    console.error('Error uploading avatar:', error)
    showErrorMessage('An unexpected error occurred while uploading avatar')
    return { success: false }
  } finally {
    // Reset uploading state when done
    isUploading.value = false
  }
}

// Main profile save function
async function saveProfile() {
  loading.value = true

  // Validate phone number before saving
  if (form.phoneNumber && !validatePhoneNumber(form.phoneNumber)) {
    phoneNumberError.value =
      t('invalidPhoneNumber') || 'Invalid phone number format'
    loading.value = false
    return
  }

  try {
    // If avatar file exists, upload it first
    if (avatarFile.value) {
      const avatarUploadResult = await uploadAvatar()

      if (avatarUploadResult.success && avatarUploadResult.key) {
        // Update profile with avatar
        const updateSuccess = await updateUserProfile(
          createUserAttributes(true, avatarUploadResult.key)
        )

        // Clear the file reference if update was successful
        if (updateSuccess) {
          avatarFile.value = null
        }
      }
    } else {
      // Just update profile without avatar
      await updateUserProfile(createUserAttributes())
    }
  } catch (error) {
    console.log('Error updating profile:', error)
    showErrorMessage()
  } finally {
    loading.value = false
  }
}
</script>
