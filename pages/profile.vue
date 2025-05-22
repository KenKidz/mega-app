<template>
  <div class="max-w-2xl mx-auto px-4">
    <UCard>
      <div class="flex flex-col items-center mb-6">
        <div class="relative mb-4">
          <UAvatar
            :src="avatarPreview"
            size="3xl"
            :alt="form.fullName || 'User'"
            class="w-32 h-32 object-cover border-4 border-primary-200"
          />
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
        <p v-if="avatarError" class="text-red-500 text-sm mt-1">
          {{ avatarError }}
        </p>
      </div>

      <!-- Profile Form -->
      <UForm :state="form" @submit="saveProfile" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="Username" name="username">
            <UInput v-model="form.username" class="w-full" readonly disabled />
          </UFormField>

          <UFormField label="Email" name="email">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="Enter your email address"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Full Name" name="fullName">
            <UInput
              v-model="form.fullName"
              class="w-full"
              placeholder="Enter your full name"
            />
          </UFormField>

          <UFormField label="Phone Number" name="phoneNumber">
            <UInput
              v-model="form.phoneNumber"
              placeholder="Enter your phone number (e.g., +12065550100)"
              class="w-full"
              @input="handlePhoneNumberChange"
            />
            <p v-if="phoneNumberError" class="text-red-500 text-sm mt-1">
              {{ phoneNumberError }}
            </p>
          </UFormField>
        </div>
        <div class="flex justify-end mt-6">
          <UButton
            type="submit"
            color="primary"
            :loading="isLoading || loading"
          >
            Save Changes
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";

// Get auth composable
const { user, isLoading, updateAttributes } = useAuth();

// Form state
const form = reactive({
  username: "",
  email: "",
  fullName: "",
  phoneNumber: "",
});

// Form validation
const phoneNumberError = ref<string | null>(null);

// Avatar handling
const fileInput = ref<HTMLInputElement | null>(null);
const avatarPreview = ref<any>("");
const avatarError = ref<string | null>(null);
const avatarFile = ref<File | null>(null);
const loading = ref(false);

// Load user data when component mounts
onMounted(async () => {
  if (user.value) {
    // Extract user data from Cognito user
    form.username = user.value.username || "";
    form.email = user.value.attributes?.email || "";

    // Other attributes might be available depending on your Cognito setup
    form.fullName = user.value.attributes?.name || "";
    form.phoneNumber = user.value.attributes?.phone_number || "";
  }
});

function triggerFileInput() {
  fileInput.value?.click();
}

function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement;

  if (target.files && target.files.length > 0) {
    const file = target.files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      avatarError.value = "Please select an image file";
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      avatarError.value = "Image size should be less than 5MB";
      return;
    }

    avatarError.value = null;
    avatarFile.value = file;

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

// Validate phone number format for AWS Cognito (E.164 format)
function validatePhoneNumber(phoneNumber: string): boolean {
  // E.164 format: +[country code][number], e.g., +12065550100
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}

// Format phone number to E.164 format if needed
function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters except the plus sign
  let formattedNumber = phoneNumber.replace(/[^\d+]/g, "");

  // Ensure it starts with a plus sign
  if (!formattedNumber.startsWith("+")) {
    formattedNumber = "+" + formattedNumber;
  }

  return formattedNumber;
}

// Handle phone number input change
function handlePhoneNumberChange(event: Event) {
  const target = event.target as HTMLInputElement;
  phoneNumberError.value = null;

  // Format the phone number
  form.phoneNumber = formatPhoneNumber(target.value);
}

async function saveProfile() {
  loading.value = true;
  const toast = useToast();

  // Validate phone number before saving
  if (form.phoneNumber && !validatePhoneNumber(form.phoneNumber)) {
    phoneNumberError.value =
      "Please enter a valid phone number in international format (e.g., +12065550100)";
    loading.value = false;
    return;
  }

  try {
    const result = await updateAttributes({
      email: form.email,
      name: form.fullName,
      phone_number: form.phoneNumber,
    });

    if (result.success) {
      toast.add({
        title: "Success",
        description: "Profile updated successfully",
        color: "success",
      });
    } else if (result.error) {
      toast.add({ title: "Error", description: result.error, color: "error" });
    }

    if (avatarFile.value) {
      toast.add({
        title: "Info",
        description: "Avatar uploaded (simulated)",
        color: "info",
      });
    }
  } catch (error) {
    console.log("Error updating profile:", error);
    toast.add({
      title: "Error",
      description: "Failed to update profile",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>
