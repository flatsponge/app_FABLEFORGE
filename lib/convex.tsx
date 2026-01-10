import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import * as SecureStore from "expo-secure-store";
import { ReactNode, useMemo } from "react";
import { Platform } from "react-native";

// Convex deployment URL
const CONVEX_URL = "https://good-bat-852.convex.cloud";

// Secure storage for auth tokens (React Native)
const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === "web") {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Silently fail in case of storage errors
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Silently fail in case of storage errors
    }
  },
};

// Singleton client instance
let convexClient: ConvexReactClient | null = null;

function getConvexClient(): ConvexReactClient {
  if (!convexClient) {
    convexClient = new ConvexReactClient(CONVEX_URL, {
      unsavedChangesWarning: false,
    });
  }
  return convexClient;
}

interface ConvexProviderProps {
  children: ReactNode;
}

export function ConvexProvider({ children }: ConvexProviderProps) {
  // Create client lazily after polyfills are loaded
  const client = useMemo(() => getConvexClient(), []);

  return (
    <ConvexAuthProvider client={client} storage={secureStorage}>
      {children}
    </ConvexAuthProvider>
  );
}

// Export getter function instead of direct client
export function getConvex(): ConvexReactClient {
  return getConvexClient();
}
