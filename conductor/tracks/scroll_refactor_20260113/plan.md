# Plan: Onboarding Scroll Behavior Refactor

## Phase 1: Foundation & Component Refactor
- [x] Task: Create reproduction test case (manual or automated) demonstrating the "always scroll/bounce" issue. [41dbba6]
- [x] Task: Refactor `components/OnboardingScreen.tsx` to implement conditional scrolling. [eea7691]
    - [ ] Sub-task: Measure content height vs. container height (or use `contentContainerStyle={{ flexGrow: 1 }}` strategy with conditional bounce).
    - [ ] Sub-task: Add `bounces={contentHeight > viewportHeight}` logic (or similar standard RN approach).
    - [ ] Sub-task: Ensure `KeyboardAvoidingView` wraps the content correctly.
    - [ ] Sub-task: Add standard `paddingBottom` to `contentContainerStyle` to account for floating action buttons.
- [ ] Task: Conductor - User Manual Verification 'Foundation & Component Refactor' (Protocol in workflow.md)

## Phase 2: Audit & Apply to Onboarding Screens
- [ ] Task: Audit `app/(onboarding)/splash.tsx` and `app/(onboarding)/intro/*.tsx`.
    - [ ] Sub-task: Identify and remove any manual `scrollEnabled={false}` props or local `ScrollView` overrides.
    - [ ] Sub-task: Verify they use the refactored `OnboardingScreen`.
- [ ] Task: Audit `app/(onboarding)/auth/*.tsx`.
    - [ ] Sub-task: Remove manual scroll locks.
    - [ ] Sub-task: Verify input fields interact correctly with keyboard and scroll.
- [ ] Task: Audit `app/(onboarding)/child/*.tsx` (Identify and remove manual scroll locks).
- [ ] Task: Audit `app/(onboarding)/parent/*.tsx` (Identify and remove manual scroll locks).
- [ ] Task: Audit `app/(onboarding)/quiz/*.tsx` (Identify and remove manual scroll locks).
- [ ] Task: Conductor - User Manual Verification 'Audit & Apply to Onboarding Screens' (Protocol in workflow.md)

## Phase 3: Final Verification & Polish
- [ ] Task: Verify "Small Screen" behavior (simulate smaller height).
- [ ] Task: Verify "Large Screen" behavior.
- [ ] Task: Verify Keyboard interactions (inputs shouldn't be hidden).
- [ ] Task: Conductor - User Manual Verification 'Final Verification & Polish' (Protocol in workflow.md)
