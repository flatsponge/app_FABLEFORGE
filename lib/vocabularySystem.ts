/**
 * Vocabulary System for Age-Appropriate Story Generation
 * 
 * This module handles:
 * - Calculating current age from birth month/year
 * - Detecting birthday month for age progression
 * - Mapping vocabulary levels based on age and preference
 * - Providing vocabulary descriptions for story prompts
 */

export type VocabularyPreference = "behind" | "average" | "advanced";
export type VocabularyLevel = "beginner" | "intermediate" | "advanced";

export interface AgeInfo {
  years: number;
  months: number;
  exactAge: number;
  isBirthdayMonth: boolean;
}

export interface VocabularyConfig {
  level: VocabularyLevel;
  ageYears: number;
  description: string;
  promptInstruction: string;
}

const VOCABULARY_DESCRIPTIONS: Record<VocabularyLevel, Record<string, string>> = {
  beginner: {
    ages: "2-4",
    characteristics: "simple words (1-2 syllables), very short sentences (5-8 words), concrete concepts, repetition for comfort, onomatopoeia welcome",
    promptInstruction: "Use simple words with 1-2 syllables. Keep sentences very short (5-8 words). Focus on concrete, tangible concepts. Include gentle repetition and fun sounds like 'swoosh!' and 'pop!'.",
  },
  intermediate: {
    ages: "4-6",
    characteristics: "moderate vocabulary with some new words to learn, sentences of 8-12 words, simple cause-and-effect, relatable emotions",
    promptInstruction: "Use moderate vocabulary with occasional new words to expand learning. Sentences can be 8-12 words. Include simple cause-and-effect relationships and relatable emotional moments.",
  },
  advanced: {
    ages: "6-8+",
    characteristics: "rich vocabulary that stretches understanding, longer flowing sentences, nuanced emotions, metaphors and similes appropriate for children",
    promptInstruction: "Use rich, varied vocabulary that gently stretches understanding. Sentences can flow longer and more complex. Include nuanced emotions and age-appropriate metaphors and similes.",
  },
};

const AGE_TO_BASE_VOCABULARY: Array<{ maxAge: number; level: VocabularyLevel }> = [
  { maxAge: 3, level: "beginner" },
  { maxAge: 4, level: "beginner" },
  { maxAge: 5, level: "intermediate" },
  { maxAge: 6, level: "intermediate" },
  { maxAge: 7, level: "advanced" },
  { maxAge: 12, level: "advanced" },
];

export function calculateAge(birthMonth: number, birthYear: number): AgeInfo {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let years = currentYear - birthYear;
  let months = currentMonth - birthMonth;

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const exactAge = years + months / 12;
  const isBirthdayMonth = currentMonth === birthMonth;

  return { years, months, exactAge, isBirthdayMonth };
}

export function getBaseVocabularyForAge(ageYears: number): VocabularyLevel {
  for (const { maxAge, level } of AGE_TO_BASE_VOCABULARY) {
    if (ageYears <= maxAge) {
      return level;
    }
  }
  return "advanced";
}

export function adjustVocabularyForPreference(
  baseLevel: VocabularyLevel,
  preference: VocabularyPreference | null | undefined
): VocabularyLevel {
  if (!preference || preference === "average") {
    return baseLevel;
  }

  const levels: VocabularyLevel[] = ["beginner", "intermediate", "advanced"];
  const currentIndex = levels.indexOf(baseLevel);

  if (preference === "behind") {
    return levels[Math.max(0, currentIndex - 1)];
  }

  if (preference === "advanced") {
    return levels[Math.min(levels.length - 1, currentIndex + 1)];
  }

  return baseLevel;
}

export function determineVocabularyLevel(
  birthMonth: number,
  birthYear: number,
  preference: VocabularyPreference | null | undefined,
  override: VocabularyLevel | null | undefined
): VocabularyConfig {
  if (override) {
    const ageInfo = calculateAge(birthMonth, birthYear);
    return {
      level: override,
      ageYears: ageInfo.years,
      description: VOCABULARY_DESCRIPTIONS[override].characteristics,
      promptInstruction: VOCABULARY_DESCRIPTIONS[override].promptInstruction,
    };
  }

  const ageInfo = calculateAge(birthMonth, birthYear);
  const baseLevel = getBaseVocabularyForAge(ageInfo.years);
  const finalLevel = adjustVocabularyForPreference(baseLevel, preference);

  return {
    level: finalLevel,
    ageYears: ageInfo.years,
    description: VOCABULARY_DESCRIPTIONS[finalLevel].characteristics,
    promptInstruction: VOCABULARY_DESCRIPTIONS[finalLevel].promptInstruction,
  };
}

export function buildVocabularyPromptSection(config: VocabularyConfig): string {
  return `CHILD'S AGE: ${config.ageYears} years old
VOCABULARY LEVEL: ${config.level.charAt(0).toUpperCase() + config.level.slice(1)} (${VOCABULARY_DESCRIPTIONS[config.level].ages})

LANGUAGE REQUIREMENTS:
${config.promptInstruction}`;
}

export function getVocabularyLevelDisplayName(level: VocabularyLevel): string {
  const displayNames: Record<VocabularyLevel, string> = {
    beginner: "Easy",
    intermediate: "Medium",
    advanced: "Advanced",
  };
  return displayNames[level];
}

export function getPreferenceDisplayInfo(preference: VocabularyPreference): {
  title: string;
  description: string;
  icon: string;
} {
  const info: Record<VocabularyPreference, { title: string; description: string; icon: string }> = {
    behind: {
      title: "Learning new words every day",
      description: "Stories will use simpler vocabulary to build confidence",
      icon: "leaf-outline",
    },
    average: {
      title: "Right on track for their age",
      description: "Stories will match typical vocabulary for their age",
      icon: "checkmark-circle-outline",
    },
    advanced: {
      title: "Loves big words and stories",
      description: "Stories will include richer vocabulary to challenge them",
      icon: "star-outline",
    },
  };
  return info[preference];
}
