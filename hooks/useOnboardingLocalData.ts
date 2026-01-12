import { useEffect, useState } from "react";
import { loadPersistedOnboardingData } from "@/lib/onboardingStorage";

type OnboardingLocalData = {
  avatarId?: string;
  gender?: string;
};

export function useOnboardingLocalData() {
  const [data, setData] = useState<OnboardingLocalData | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const stored = await loadPersistedOnboardingData();
      if (!stored) {
        if (isMounted) {
          setData(null);
        }
        return;
      }

      try {
        const parsed = JSON.parse(stored) as Partial<OnboardingLocalData>;
        if (isMounted) {
          setData({
            avatarId: parsed.avatarId,
            gender: parsed.gender,
          });
        }
      } catch {
        if (isMounted) {
          setData(null);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
}
