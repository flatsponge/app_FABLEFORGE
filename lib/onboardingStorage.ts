import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const ONBOARDING_STORAGE_KEY = "onboarding_progress";
export const ONBOARDING_RESUME_KEY = "onboarding_resume_path";
export const ONBOARDING_STATUS_KEY = "onboarding_status_cache";
export const AUTH_SEEN_KEY = "auth_has_seen";

export type CachedOnboardingStatus = {
  hasOnboardingData: boolean;
  hasMascotName: boolean;
  hasMascotImage: boolean;
  isComplete: boolean;
  updatedAt: number;
};

export async function loadPersistedOnboardingData(): Promise<string | null> {
  try {
    const stored = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (stored) {
      return stored;
    }
  } catch {
    // Ignore storage read errors and fall back to legacy store.
  }

  try {
    const legacy = await SecureStore.getItemAsync(ONBOARDING_STORAGE_KEY);
    if (legacy) {
      try {
        await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, legacy);
      } catch {
        return legacy;
      }
      await SecureStore.deleteItemAsync(ONBOARDING_STORAGE_KEY).catch(() => {});
      return legacy;
    }
  } catch {
    // Ignore legacy store errors.
  }

  return null;
}

export async function loadResumePath(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(ONBOARDING_RESUME_KEY);
  } catch {
    return null;
  }
}

export async function saveResumePath(path: string): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_RESUME_KEY, path);
  } catch {
    // Ignore storage write errors.
  }
}

export async function loadCachedOnboardingStatus(): Promise<CachedOnboardingStatus | null> {
  try {
    const stored = await AsyncStorage.getItem(ONBOARDING_STATUS_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as CachedOnboardingStatus;
  } catch {
    return null;
  }
}

export async function saveCachedOnboardingStatus(
  status: CachedOnboardingStatus
): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_STATUS_KEY, JSON.stringify(status));
  } catch {
    // Ignore cache write errors.
  }
}

export async function loadAuthSeen(): Promise<boolean> {
  try {
    const stored = await AsyncStorage.getItem(AUTH_SEEN_KEY);
    return stored === "true";
  } catch {
    return false;
  }
}

export async function markAuthSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(AUTH_SEEN_KEY, "true");
  } catch {
    // Ignore storage write errors.
  }
}

export async function clearPersistedOnboardingData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([ONBOARDING_STORAGE_KEY, ONBOARDING_RESUME_KEY]);
  } catch {
    // Ignore storage cleanup errors.
  }

  try {
    await SecureStore.deleteItemAsync(ONBOARDING_STORAGE_KEY);
  } catch {
    // Ignore legacy cleanup errors.
  }
}

export async function clearAuthOptimisticCache(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([ONBOARDING_STATUS_KEY, AUTH_SEEN_KEY]);
  } catch {
    // Ignore storage cleanup errors.
  }
}
