# Plan: Onboarding Scroll Behavior Refactor

## Phase 1: Foundation & Component Refactor [checkpoint: f9a946a]
- [x] Task: Create reproduction test case (manual or automated) demonstrating the "always scroll/bounce" issue. [41dbba6]
- [x] Task: Refactor `components/OnboardingScreen.tsx` to implement conditional scrolling. [eea7691]
    - [ ] Sub-task: Measure content height vs. container height (or use `contentContainerStyle={{ flexGrow: 1 }}` strategy with conditional bounce).
    - [ ] Sub-task: Add `bounces={contentHeight > viewportHeight}` logic (or similar standard RN approach).
    - [ ] Sub-task: Ensure `KeyboardAvoidingView` wraps the content correctly.
    - [ ] Sub-task: Add standard `paddingBottom` to `contentContainerStyle` to account for floating action buttons.
- [ ] Task: Conductor - User Manual Verification 'Foundation & Component Refactor' (Protocol in workflow.md)

## Phase 2: Audit & Apply to Onboarding Screens [checkpoint: a21eced]



- [x] Task: Audit `app/(onboarding)/splash.tsx` and `app/(onboarding)/intro/*.tsx`. [8624589]

    - [x] Sub-task: Refactor `components/OnboardingLayout.tsx` to implement conditional scrolling (replacing manual `isScrollable`).

    - [x] Sub-task: Identify and remove any manual `scrollEnabled={false}` props or local `ScrollView` overrides.

    - [x] Sub-task: Verify they use the refactored `OnboardingLayout` (or `OnboardingScreen`).



- [x] Task: Audit `app/(onboarding)/auth/*.tsx`.

    - [x] Sub-task: Remove manual scroll locks.

    - [x] Sub-task: Verify input fields interact correctly with keyboard and scroll.



- [x] Task: Audit `app/(onboarding)/child/*.tsx` (Identify and remove manual scroll locks). [a21eced]

    - [x] Sub-task: Refactor `avatar.tsx` to use auto-scroll pattern (replace manual ScrollView).

    - [x] Sub-task: Refactor `setup.tsx` to use auto-scroll pattern (add ScrollView).

    - [x] Sub-task: Refactor `mascot-name.tsx` to use auto-scroll pattern (add ScrollView).

    - [x] Sub-task: Refactor `magic-moment.tsx` to use auto-scroll pattern (add ScrollView/KeyboardAvoidingView to input phase).



- [x] Task: Audit `app/(onboarding)/parent/*.tsx` (Identify and remove manual scroll locks). [a21eced]

    - [x] Sub-task: Refactor `results-intro.tsx` to use auto-scroll pattern (add ScrollView).



- [x] Task: Audit `app/(onboarding)/quiz/*.tsx` (Identify and remove manual scroll locks).
- [ ] Task: Conductor - User Manual Verification 'Audit & Apply to Onboarding Screens' (Protocol in workflow.md)

## Phase 3: Final Verification & Polish

- [ ] Task: Execute full onboarding flow test plan.
- [ ] Task: Verify no regressions in other scroll views (Library, etc. if shared components used).
- [ ] Task: Clean up any temporary code or logs.
- [ ] Task: Final commit and merge.
