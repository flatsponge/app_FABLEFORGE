import { useEffect, useState } from "react";
import { CacheEnvelope, loadCache, saveCache } from "@/lib/queryCache";

type CachedState<T> = CacheEnvelope<T> | null;

export function useCachedValue<T>(key: string | null, liveValue: T | undefined) {
  const [cached, setCached] = useState<CachedState<T>>(null);
  const [cacheLoaded, setCacheLoaded] = useState(false);

  useEffect(() => {
    setCacheLoaded(false);

    if (!key) {
      setCached(null);
      setCacheLoaded(true);
      return;
    }

    let isMounted = true;

    loadCache<T>(key)
      .then((entry) => {
        if (isMounted) {
          setCached(entry);
        }
      })
      .finally(() => {
        if (isMounted) {
          setCacheLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [key]);

  useEffect(() => {
    if (!key || liveValue === undefined) {
      return;
    }

    const entry: CacheEnvelope<T> = {
      value: liveValue,
      updatedAt: Date.now(),
    };

    setCached(entry);
    saveCache(key, liveValue).catch(() => {
      // Ignore cache write errors.
    });
  }, [key, liveValue]);

  const data = liveValue !== undefined ? liveValue : cached?.value;
  const isCached = liveValue === undefined && cacheLoaded && cached !== null;

  return {
    data,
    isCached,
    cacheLoaded,
    cachedAt: cached?.updatedAt,
  };
}
