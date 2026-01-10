// Calculate initial skill scores from onboarding responses
// Scores are pessimistic: max ~50-55 (low "On track"), min ~25-35 (yellow "Watch closely")
// Most users should fall in the 30-45 range

interface OnboardingData {
  childPersonality: string[];
  primaryGoal: string[];
  parentingStyle: string;
  parentChallenges: string[];
  parentReaction: string;
  previousAttempts: string;
  struggleBehavior: string;
  triggerSituations: string[];
  struggleAreas: string[];
  struggleFrequency: string;
  moralScore: number;
}

interface SkillScores {
  empathy: { progress: number; subSkills: { perspective: number; compassion: number; kindness: number } };
  bravery: { progress: number; subSkills: { confidence: number; grit: number; riskTaking: number } };
  honesty: { progress: number; subSkills: { truthfulness: number; trust: number; integrity: number } };
  teamwork: { progress: number; subSkills: { cooperation: number; listening: number; support: number } };
  creativity: { progress: number; subSkills: { visualization: number; storytelling: number; wonder: number } };
  gratitude: { progress: number; subSkills: { thankfulness: number; positivity: number; appreciation: number } };
  problemSolving: { progress: number; subSkills: { logic: number; strategy: number; analysis: number } };
  responsibility: { progress: number; subSkills: { duty: number; reliability: number; ownership: number } };
  patience: { progress: number; subSkills: { waiting: number; calmness: number; selfControl: number } };
  curiosity: { progress: number; subSkills: { inquiry: number; exploration: number; discovery: number } };
}

// Base score range: 28-52 (pessimistic, mostly yellow/low blue)
const BASE_MIN = 28;
const BASE_MAX = 52;

// Clamp score to valid range
const clamp = (val: number, min: number = BASE_MIN, max: number = BASE_MAX) =>
  Math.max(min, Math.min(max, val));

// Calculate sub-skill with variance around main score
const subScore = (base: number, variance: number = 8) => {
  const offset = (Math.random() - 0.5) * variance;
  return clamp(Math.round(base + offset), BASE_MIN - 5, BASE_MAX + 5);
};

// Calculate main skill with small variance
const mainScore = (base: number, variance: number = 5) => {
  const offset = (Math.random() - 0.5) * variance;
  return clamp(Math.round(base + offset));
};

export function calculateInitialScores(data: OnboardingData): SkillScores {
  // Start with base scores derived from moralScore (already 0-100 from onboarding)
  // Scale it down to our pessimistic range
  const moralBase = (data.moralScore / 100) * (BASE_MAX - BASE_MIN) + BASE_MIN;

  // Penalty factors based on struggle frequency
  const frequencyPenalty: Record<string, number> = {
    'multiple_daily': -12,
    'daily': -8,
    'few_weekly': -4,
    'weekly': -2,
    'rarely': 0,
  };
  const freqPen = frequencyPenalty[data.struggleFrequency] || -4;

  // Penalty for parent reaction (pessimistic view)
  const reactionPenalty: Record<string, number> = {
    'calm': 0,
    'yell': -6,
    'give_in': -4,
    'time_out': -2,
    'distract': -3,
  };
  const reactPen = reactionPenalty[data.parentReaction] || -3;

  // Bonus for good parenting style
  const styleBonus: Record<string, number> = {
    'authoritative': 4,
    'permissive': -2,
    'strict': 0,
    'helicopter': -3,
    'unsure': -1,
  };
  const styleBon = styleBonus[data.parentingStyle] || 0;

  // Previous attempts bonus
  const attemptBonus: Record<string, number> = {
    'professional': 5,
    'tried_all': 2,
    'tried_some': 0,
    'first_time': -2,
  };
  const attemptBon = attemptBonus[data.previousAttempts] || 0;

  // Calculate base modifier
  const baseModifier = freqPen + reactPen + styleBon + attemptBon;

  // Struggle areas directly affect specific skills
  const struggleSet = new Set(data.struggleAreas);
  const challengeSet = new Set(data.parentChallenges);
  const personalitySet = new Set(data.childPersonality);

  // Calculate each skill
  const calcSkill = (
    baseAdjust: number,
    penalties: string[],
    bonuses: string[]
  ): number => {
    let score = moralBase + baseModifier + baseAdjust;
    penalties.forEach(p => {
      if (struggleSet.has(p) || challengeSet.has(p)) score -= 5;
    });
    bonuses.forEach(b => {
      if (personalitySet.has(b)) score += 3;
    });
    return clamp(Math.round(score));
  };

  // Empathy - affected by sharing, teamwork struggles
  const empathyScore = mainScore(calcSkill(
    0,
    ['sharing', 'teamwork'],
    ['sensitive', 'social']
  ));

  // Bravery - affected by trying new things
  const braveryScore = mainScore(calcSkill(
    -2,
    ['bravery'],
    ['energetic', 'strong_willed']
  ));

  // Honesty
  const honestyScore = mainScore(calcSkill(
    -3,
    ['honesty'],
    ['cautious']
  ));

  // Teamwork
  const teamworkScore = mainScore(calcSkill(
    0,
    ['teamwork', 'sharing'],
    ['social']
  ));

  // Creativity
  const creativityScore = mainScore(calcSkill(
    2,
    [],
    ['imaginative', 'curious']
  ));

  // Gratitude
  const gratitudeScore = mainScore(calcSkill(
    -4,
    ['gratitude'],
    ['sensitive']
  ));

  // Problem Solving
  const problemSolvingScore = mainScore(calcSkill(
    -1,
    ['problem_solving'],
    ['curious', 'strong_willed']
  ));

  // Responsibility
  const responsibilityScore = mainScore(calcSkill(
    -5,
    ['responsibility'],
    ['cautious']
  ));

  // Patience - heavily affected by tantrums, aggression
  let patienceBase = calcSkill(
    -3,
    ['patience'],
    ['cautious']
  );
  if (data.struggleBehavior === 'tantrums' || data.struggleBehavior === 'aggression') {
    patienceBase = clamp(patienceBase - 8);
  }
  const patienceScore = mainScore(patienceBase);

  // Curiosity - usually higher
  const curiosityScore = mainScore(calcSkill(
    4,
    [],
    ['curious', 'imaginative']
  ));

  return {
    empathy: {
      progress: empathyScore,
      subSkills: {
        perspective: subScore(empathyScore),
        compassion: subScore(empathyScore - 3),
        kindness: subScore(empathyScore + 2),
      },
    },
    bravery: {
      progress: braveryScore,
      subSkills: {
        confidence: subScore(braveryScore + 2),
        grit: subScore(braveryScore - 4),
        riskTaking: subScore(braveryScore),
      },
    },
    honesty: {
      progress: honestyScore,
      subSkills: {
        truthfulness: subScore(honestyScore),
        trust: subScore(honestyScore - 2),
        integrity: subScore(honestyScore + 1),
      },
    },
    teamwork: {
      progress: teamworkScore,
      subSkills: {
        cooperation: subScore(teamworkScore + 3),
        listening: subScore(teamworkScore - 2),
        support: subScore(teamworkScore),
      },
    },
    creativity: {
      progress: creativityScore,
      subSkills: {
        visualization: subScore(creativityScore + 4),
        storytelling: subScore(creativityScore),
        wonder: subScore(creativityScore + 2),
      },
    },
    gratitude: {
      progress: gratitudeScore,
      subSkills: {
        thankfulness: subScore(gratitudeScore),
        positivity: subScore(gratitudeScore - 2),
        appreciation: subScore(gratitudeScore - 3),
      },
    },
    problemSolving: {
      progress: problemSolvingScore,
      subSkills: {
        logic: subScore(problemSolvingScore + 2),
        strategy: subScore(problemSolvingScore - 2),
        analysis: subScore(problemSolvingScore),
      },
    },
    responsibility: {
      progress: responsibilityScore,
      subSkills: {
        duty: subScore(responsibilityScore - 2),
        reliability: subScore(responsibilityScore + 2),
        ownership: subScore(responsibilityScore - 4),
      },
    },
    patience: {
      progress: patienceScore,
      subSkills: {
        waiting: subScore(patienceScore),
        calmness: subScore(patienceScore - 3),
        selfControl: subScore(patienceScore - 5),
      },
    },
    curiosity: {
      progress: curiosityScore,
      subSkills: {
        inquiry: subScore(curiosityScore + 2),
        exploration: subScore(curiosityScore),
        discovery: subScore(curiosityScore + 3),
      },
    },
  };
}

// Calculate overall growth score from all skills (for the main meter)
export function calculateOverallScore(skills: SkillScores): number {
  const values = [
    skills.empathy.progress,
    skills.bravery.progress,
    skills.honesty.progress,
    skills.teamwork.progress,
    skills.creativity.progress,
    skills.gratitude.progress,
    skills.problemSolving.progress,
    skills.responsibility.progress,
    skills.patience.progress,
    skills.curiosity.progress,
  ];
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}
