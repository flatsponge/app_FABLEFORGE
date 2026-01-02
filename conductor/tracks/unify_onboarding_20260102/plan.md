# Implementation Plan - Unify Parent Onboarding Design

## Phase 1: Foundation & Layout [checkpoint: 5e30aec]
- [x] Task: Create `OnboardingTheme` constants (Colors, Typography, Spacing) based on "shocking pages" style a3db1c4
- [x] Task: Create `OnboardingLayout` component (Header, animated ProgressBar, Safe Area with `react-native-safe-area-context`, Sticky Footer) 77cf727
- [x] Task: Create `OnboardingTitle` and `OnboardingBody` typography components b2c563a
- [x] Task: Create `OnboardingButton` component (matching existing "shocking" style) f4ff488
- [x] Task: Create `OnboardingOptionCard` component for multiple-choice selections 5244a11
- [x] Task: Conductor - User Manual Verification 'Foundation & Layout' (Protocol in workflow.md)

## Phase 2: Quiz Section Migration
- [x] Task: Refactor `(onboarding)/index.tsx` (Welcome goal) c891350
- [x] Task: Refactor `quiz/child-name.tsx` to use new Layout & Components 7e694ab
- [x] Task: Refactor `quiz/child-age.tsx` to use new Layout & Components 3f6fc0f
- [x] Task: Refactor `quiz/goals-timeline.tsx` to use new Layout & Components f57c2d6
- [x] Task: Refactor `quiz/parenting-style.tsx` to use new Layout & Components ecb3a9d
- [x] Task: Refactor `quiz/child-personality.tsx` to use new Layout & Components 851edc6
- [x] Task: Refactor `quiz/daily-routine.tsx` to use new Layout & Components 113d4a5
- [x] Task: Refactor `quiz/reading-time.tsx` to use new Layout & Components 3f074e0
- [x] Task: Refactor `quiz/story-length.tsx` to use new Layout & Components 2cfddd9
- [x] Task: Refactor `quiz/story-themes.tsx` to use new Layout & Components 751c58d
- [x] Task: Refactor `quiz/previous-attempts.tsx` to use new Layout & Components 6856639
- [x] Task: Refactor `quiz/parent-challenges.tsx` to use new Layout & Components bab4141
- [x] Task: Refactor `quiz/diagnosis.tsx` to use new Layout & Components 4911072
- [x] Task: Refactor `quiz/aggression-details.tsx` to use new Layout & Components e1cfe40
- [x] Task: Refactor `quiz/aggression-frequency.tsx` to use new Layout & Components 209415d
- [x] Task: Refactor `quiz/trigger-situations.tsx` to use new Layout & Components e074c8a
- [x] Task: Refactor `quiz/struggle-areas.tsx` to use new Layout & Components a4927c8
- [x] Task: Refactor `quiz/struggle-frequency.tsx` to use new Layout & Components 70376f2
- [x] Task: Refactor `quiz/moral-baseline.tsx` to use new Layout & Components dd35000
- [x] Task: Refactor `quiz/parent-guilt.tsx` to use new Layout & Components d2239b9
- [x] Task: Refactor `quiz/commitment.tsx` to use new Layout & Components 9048700
- [x] Task: Refactor `quiz/softening.tsx` to use new Layout & Components f940cde
- [x] Task: Refactor `quiz/processing.tsx` to use new Layout & Components f62d84d

## Phase 3: Parent Results Migration
- [x] Task: Refactor `parent/results-intro.tsx` to use new Layout & Components aff0cb6
- [x] Task: Refactor `parent/stat-reveal-*.tsx` screens a3a3f01 c84596f 968785f bf34874
- [x] Task: Refactor `parent/reality-check.tsx` and `parent/positive-outlook.tsx` c1ee292 56b2a77
- [x] Task: Refactor `parent/trajectory.tsx` 3d0e013
- [x] Task: Refactor `parent/warning-*.tsx` screens f62d84d
- [x] Task: Refactor `(onboarding)/paywall.tsx` 7065488

## Phase 4: Polish & Consistency Check
- [x] Task: Audit all screens for vertical balance (empty vs dense screens)
- [x] Task: Verify smooth progress bar animation across the entire flow
- [x] Task: Final Design QA (Fonts, Spacing, Touch targets, Safe Areas)
- [x] Task: Conductor - User Manual Verification 'Polish & Consistency Check' (Protocol in workflow.md)