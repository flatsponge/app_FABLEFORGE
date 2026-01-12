import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_PREFIX = "cache:";

export type CacheEnvelope<T> = {
  value: T;
  updatedAt: number;
};

export const CACHE_KEYS = {
  userBooks: "userBooks",
  userSkills: "userSkills",
  skillContributions: "skillContributions",
  userProgress: "userProgress",
  mascotOutfit: "mascotOutfit",
  userActiveJobs: "userActiveJobs",
  userCredits: "userCredits",
  storyJob: (id: string) => `storyJob:${id}`,
  book: (id: string) => `book:${id}`,
  bookPage: (id: string, pageIndex: number) => `book:${id}:page:${pageIndex}`,
} as const;

const buildStorageKey = (key: string) => `${CACHE_PREFIX}${key}`;

export async function loadCache<T>(key: string): Promise<CacheEnvelope<T> | null> {
  try {
    const stored = await AsyncStorage.getItem(buildStorageKey(key));
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as CacheEnvelope<T>;
  } catch {
    return null;
  }
}

export async function saveCache<T>(key: string, value: T): Promise<void> {
  const payload: CacheEnvelope<T> = {
    value,
    updatedAt: Date.now(),
  };
  try {
    await AsyncStorage.setItem(buildStorageKey(key), JSON.stringify(payload));
  } catch {
    // Ignore cache write errors.
  }
}

export async function seedBookCaches<T extends { _id: string }>(
  books: Array<T>
): Promise<void> {
  if (books.length === 0) {
    return;
  }

  try {
    await Promise.all(
      books.map((book) => saveCache(CACHE_KEYS.book(book._id), book))
    );
  } catch {
    // Ignore cache seed errors.
  }
}

export async function clearAllDataCaches(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
  } catch {
    // Ignore cache cleanup errors.
  }
}
