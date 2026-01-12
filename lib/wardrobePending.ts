import AsyncStorage from "@react-native-async-storage/async-storage";

const PENDING_WARDROBE_KEY = "cache:wardrobePending";

export type PendingWardrobe = {
  type: "clothes" | "accessory";
  itemId: string;
  accessoryType?: "hat" | "toy";
  createdAt: number;
  status?: "queued" | "processing";
  statusAt?: number;
};

export async function loadPendingWardrobe(): Promise<PendingWardrobe | null> {
  try {
    const stored = await AsyncStorage.getItem(PENDING_WARDROBE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as PendingWardrobe;
  } catch {
    return null;
  }
}

export async function savePendingWardrobe(pending: PendingWardrobe): Promise<void> {
  try {
    await AsyncStorage.setItem(PENDING_WARDROBE_KEY, JSON.stringify(pending));
  } catch {
    // Ignore storage errors.
  }
}

export async function clearPendingWardrobe(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PENDING_WARDROBE_KEY);
  } catch {
    // Ignore storage errors.
  }
}
