# Specification: Unify Parent Onboarding Design

## 1. Overview
The current parent onboarding flow (quiz and result screens) suffers from inconsistent design, varying fonts, disjointed navigation elements, and unbalanced content density. This track aims to unify the visual identity of the entire "pre-child" experience (`app/(onboarding)/quiz/` and `app/(onboarding)/parent/`) into a sleek, cohesive system. The design should feel premium and smooth (inspired by Cal.ai/Duolingo) but remain appropriate for adults/parents.

## 2. Functional Requirements

### 2.1 Standardized Layout Component
*   Create a reusable `OnboardingLayout` component that wraps all parent onboarding screens.
*   **Safe Area Handling:**
    *   MUST use `react-native-safe-area-context` to correctly handle notches, dynamic islands, and home bars on all devices.
    *   Content must never be clipped or obscured by system UI.
*   **Sticky Action Footer:**
    *   The primary action button (e.g., "Next", "Continue") MUST be fixed at the bottom of the screen (above the safe area).
    *   **Crucial:** The button's position must be **pixel-perfectly consistent** across all screens. This ensures users don't have to "hunt" for the button; their thumb can stay in one spot.
*   **Header:**
    *   Includes a standardized "Back" button (icon + hit slop).
    *   Includes a standardized Progress Bar.
*   **Content Area:**
    *   Handles consistent padding/margins for all screens.
    *   **Content Balancing:** Automatically handles vertical alignment. Screens with minimal text should feel visually balanced (e.g., vertically centered or consistently spaced) compared to denser screens.

### 2.2 Navigation & Progress
*   **Progress Bar:**
    *   Smooth, fluid animation when the value changes using `react-native-reanimated`.
    *   Visually integrated into the header.
    *   Style: Sleek, rounded caps, restrained color usage.
*   **Interaction:**
    *   Progression to the next screen is triggered PRIMARILY by pressing the fixed action button in the footer.
*   **Back Button:**
    *   Consistent icon, size, and position across all screens.

### 2.3 Visual Style & Theming
*   **Aesthetic:** "Sleek and smooth."
    *   **Typography:** Unify font usage. Define and enforce a strict hierarchy (e.g., `OnboardingTitle`, `OnboardingSubtitle`, `OnboardingBody`).
    *   **Colors:** Restrained palette. Clean background with clear accent colors for actions.
    *   **Animations:** Subtle, fluid transitions.

### 2.4 Internal Component Unification
*   **Standardize Input/Interaction Elements:**
    *   **Buttons:** Apply the "shocking page" style (from `parent-warning.tsx`) to ALL buttons in the flow.
    *   **Selection Cards:** Create a standardized `SelectableOption` component for multiple-choice questions.
    *   **Sliders:** (If used) Unify visual style to match the new theme.
    *   **Input Fields:** Standardize borders, padding, and focus states.

### 2.5 Scope of Application
*   **Refactor Target:** All screens within:
    *   `app/(onboarding)/quiz/` (The questionnaire)
    *   `app/(onboarding)/parent/` (The results and warning screens)
*   **Exclusion:** Do NOT apply this style to `app/(onboarding)/child/` or subsequent child-facing flows.

## 3. Non-Functional Requirements
*   **Expo Best Practices:** Use `flexbox` for layout. Avoid hardcoded dimensions or absolute positioning unless strictly necessary for animations. Use `SafeAreaView` (or hooks) from `react-native-safe-area-context`.
*   **Performance:** Animations must run at 60fps.
*   **Maintainability:** Extract reusable UI components (`OnboardingButton`, `OnboardingTitle`, etc.) to prevent code duplication.

## 4. Acceptance Criteria
*   [ ] A single `OnboardingLayout` is used across all Quiz and Parent Result screens with proper Safe Area support.
*   [ ] The Primary Action Button is in the exact same screen position on every page.
*   [ ] Internal content elements (buttons, cards, inputs) are standardized components.
*   [ ] Fonts and text sizes are consistent across all 15+ screens.
*   [ ] No visual jarring when navigating between questions.