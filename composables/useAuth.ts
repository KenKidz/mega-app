import { ref, reactive } from "vue";
import {
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  getCurrentUser,
  fetchUserAttributes,
  autoSignIn,
  updateUserAttributes,
} from "aws-amplify/auth";
import { useLoadingStore } from "~/stores/useLoading";

const user = ref<AuthUser | null>(null);
const isAuthenticated = ref(false);
const isLoading = ref(false);
const error = ref<string | null>(null);

interface UserAttributes {
  email?: string;
  name?: string;
  phone_number?: string;
  [key: string]: any;
}

interface AuthUser {
  username: string;
  userId: string;
  signInDetails?: {
    loginId?: string;
  };
  attributes?: UserAttributes;
}

// Result interfaces for better type safety
interface AuthResult {
  success: boolean;
  error?: string;
  nextStep?: any;
  userId?: string;
}

export function useAuth() {
  const loadingStore = useLoadingStore();

  async function checkAuth(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    // Create a new promise for this check
    try {
      const currentUser = await getCurrentUser();
      user.value = currentUser as AuthUser;
      isAuthenticated.value = true;

      // Get user attributes (like email, name, etc.)
      try {
        const attributes = await fetchUserAttributes();
        user.value = {
          ...currentUser,
          attributes,
        } as AuthUser;
      } catch (attrError) {
        // Error fetching user attributes
      }
    } catch (err: any) {
      // User is not authenticated
      user.value = null;
      isAuthenticated.value = false;
      // Don't show error for this case, it's expected
    } finally {
      isLoading.value = false;
    }
  }

  async function login(
    username: string,
    password: string
  ): Promise<AuthResult> {
    isLoading.value = true;
    error.value = null;
    loadingStore.startLoading("Logging in...");

    try {
      const result = await signIn({
        username,
        password,
      });

      if (result.isSignedIn) {
        await checkAuth(); // Force refresh after login
        return { success: true };
      } else {
        return {
          success: false,
          nextStep: result.nextStep,
        };
      }
    } catch (err: any) {
      const errorMessage = err.message ?? "Login failed";
      error.value = errorMessage;
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      isLoading.value = false;
      loadingStore.stopLoading();
    }
  }

  async function register(
    username: string,
    password: string,
    email: string
  ): Promise<AuthResult> {
    isLoading.value = true;
    error.value = null;
    loadingStore.startLoading("Creating account...");

    try {
      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true,
        },
      });

      return {
        success: true,
        userId: result.userId,
        nextStep: result.nextStep,
      };
    } catch (err: any) {
      const errorMessage = err.message ?? "Registration failed";
      error.value = errorMessage;
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      isLoading.value = false;
      loadingStore.stopLoading();
    }
  }

  // Confirm registration with verification code
  async function confirmRegistration(
    username: string,
    confirmationCode: string
  ): Promise<any> {
    isLoading.value = true;
    error.value = null;
    loadingStore.startLoading("Verifying account...");

    try {
      await confirmSignUp({
        username,
        confirmationCode,
      });
      await autoSignIn();
      await checkAuth();
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message ?? "Confirmation failed";
      error.value = errorMessage;
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      isLoading.value = false;
      loadingStore.stopLoading();
    }
  }

  // Logout
  async function logout(): Promise<AuthResult> {
    isLoading.value = true;
    error.value = null;
    loadingStore.startLoading("Logging out...");

    try {
      await signOut();
      user.value = null;
      isAuthenticated.value = false;
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message ?? "Logout failed";
      error.value = errorMessage;
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      isLoading.value = false;
      loadingStore.stopLoading();
    }
  }
  // Update user attributes
  async function updateAttributes(
    attributes: Record<string, string>
  ): Promise<AuthResult> {
    isLoading.value = true;
    error.value = null;

    try {
      await updateUserAttributes({
        userAttributes: attributes,
      });
      // Refresh user data after update
      await checkAuth(); // Force refresh after profile update

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message ?? "Failed to update user attributes";
      error.value = errorMessage;
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    checkAuth,
    login,
    register,
    confirmRegistration,
    logout,
    updateAttributes,
  };
}
