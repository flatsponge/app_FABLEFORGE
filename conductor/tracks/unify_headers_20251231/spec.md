# Specification: Unify Headers

## Overview
Refactor the application to use a single, unified `Header` component across all screens. This resolves current inconsistencies in styling, positioning, and behavior, creating a cohesive user experience that aligns with the "Dual-Experience" design philosophy (Clean/Parent vs. Playful/Child).

## Functional Requirements
1.  **Unified Component:** A single `<UnifiedHeader />` component must be created.
2.  **Variants:** The component must support at least two variants via props:
    *   `variant="default"` (Parent/Growth): Minimalist, clean, neutral colors, standard system font or Inter.
    *   `variant="child"` (Child/Play): Vibrant, colorful (using "sunny yellow" or similar from guidelines), playful rounded font, larger elements.
3.  **Title:** Accepts a `title` prop (string).
4.  **Navigation:** Includes a back button functionality that integrates with `expo-router`'s `useRouter().back()`. The back button should be optional or automatically hidden if not applicable (or specified via prop).
5.  **Safe Area:** Correctly handles safe area insets (top padding) on iOS and Android.
6.  **Action Buttons:** Optional support for a right-side action button (e.g., "Edit" or "Settings" icon) via a `rightAction` prop or slot.

## Technical Requirements
1.  **Styling:** Use `NativeWind` (Tailwind CSS) classes.
2.  **Framework:** React Native / Expo.
3.  **Path:** Create at `components/UnifiedHeader.tsx`.
4.  **Tests:** Unit tests using `react-test-renderer` (standard RN testing).
5.  **Accessibility:** Headers must have `accessibilityRole="header"`.

## Acceptance Criteria
*   The `UnifiedHeader` component exists in `components/`.
*   All screens in `app/(tabs)/` use the new header.
*   "Leo's Growth" and "Settings" screens use the `default` variant.
*   "StoryTime" (Index) and "Child Hub" screens use the `child` variant.
*   The header looks consistent in terms of height and padding across screens of the same variant.
*   Navigation back works correctly where implemented.

## Out of Scope
*   Redesigning the entire navigation bar (TabBar). This track focuses only on the top Header.
