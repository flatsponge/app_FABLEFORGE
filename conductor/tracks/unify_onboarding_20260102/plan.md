# Implementation Plan - Unify Parent Onboarding Design

## Phase 1: Foundation & Layout
- [x] Task: Create `OnboardingTheme` constants (Colors, Typography, Spacing) based on "shocking pages" style a3db1c4
- [x] Task: Create `OnboardingLayout` component (Header, animated ProgressBar, Safe Area with `react-native-safe-area-context`, Sticky Footer) 77cf727
- [x] Task: Create `OnboardingTitle` and `OnboardingBody` typography components b2c563a
- [x] Task: Create `OnboardingButton` component (matching existing "shocking" style) f4ff488
- [x] Task: Create `OnboardingOptionCard` component for multiple-choice selections 5244a11
- [x] Task: Conductor - User Manual Verification 'Foundation & Layout' (Protocol in workflow.md)

## Phase 2: Quiz Section Migration
- [ ] Task: Refactor `quiz/child-name.tsx` to use new Layout & Components (Verify Safe Area & Button Position)
- [ ] Task: Refactor `quiz/child-age.tsx` to use new Layout & Components
- [ ] Task: Refactor `quiz/child-personality.tsx` to use new Layout & Components
- [ ] Task: Refactor `quiz/reading-time.tsx` to use new Layout & Components
- [ ] Task: Refactor `quiz/story-themes.tsx` to use new Layout & Components
- [ ] Task: Refactor remaining `quiz/*.tsx` screens (batch 1: struggle/aggression/diagnosis)
- [ ] Task: Refactor remaining `quiz/*.tsx` screens (batch 2: goals/parenting/routine)
- [ ] Task: Conductor - User Manual Verification 'Quiz Section Migration' (Protocol in workflow.md)

## Phase 3: Parent Results Migration
- [ ] Task: Refactor `parent/processing.tsx` (or equivalent transition screen) to use new Layout
- [ ] Task: Refactor `parent/results-intro.tsx` to use new Layout & Components
- [ ] Task: Refactor `parent/reality-check.tsx` & `parent/parent-warning.tsx` (ensure button style is preserved/reused)
- [ ] Task: Refactor `parent/stat-reveal-*.tsx` screens to use new Layout (Verify Safe Area & Button Position)
- [ ] Task: Refactor `parent/positive-outlook.tsx` & `parent/final-warning.tsx`
- [ ] Task: Conductor - User Manual Verification 'Parent Results Migration' (Protocol in workflow.md)

## Phase 4: Polish & Consistency Check
- [ ] Task: Audit all screens for vertical balance (empty vs dense screens)
- [ ] Task: Verify smooth progress bar animation across the entire flow
- [ ] Task: Final Design QA (Fonts, Spacing, Touch targets, Safe Areas)
- [ ] Task: Conductor - User Manual Verification 'Polish & Consistency Check' (Protocol in workflow.md)