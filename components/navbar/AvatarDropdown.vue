<template>
  <UDropdownMenu :items="items">
    <UAvatar :src="avatar" :alt="username" size="lg" />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useAuth } from "~/composables/useAuth";

const { user, logout } = useAuth();
const router = useRouter();
const toast = useToast();

// Get user details from auth composable
const username = computed(() => {
  return user.value?.username || "User";
});

// Avatar URL (we could use user's photo if available)
const avatar = ref("");

// Handle logout action
const handleLogout = async () => {
  const result = await logout();

  if (result.success) {
    toast.add({
      title: "Success",
      description: "You have been logged out successfully",
      color: "success",
    });
    router.push("/auth/login");
  } else {
    toast.add({
      title: "Error",
      description: result.error || "Logout failed",
      color: "error",
    });
  }
};

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Profile",
      icon: "i-lucide-user",
      to: "/profile",
    },
    {
      label: "Settings",
      icon: "i-lucide-cog",
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-lucide-log-out",
      kbds: ["shift", "meta", "q"],
      onSelect: handleLogout,
    },
  ],
]);
</script>
