# Specification: Onboarding Scroll Behavior Refactor

## Overview
Refactor the entire onboarding flow to ensure screens only scroll when necessary (i.e., when content overflows the viewport), while ensuring all content remains accessible on smaller devices. This addresses the "glitchy" feel of scrolling on static screens.

## Objectives
- **Conditional Scrolling:** Scrolling should be disabled by default if content fits the screen, but enabled automatically if content overflows (e.g., small screens, large text accessibility settings).
- **Safe Area & Padding:** Ensure "Continue" action bars and navigation elements never obscure content. Add sufficient bottom padding (e.g., `contentContainerStyle`) to the scroll view to account for floating buttons.
- **Keyboard Awareness:** Ensure input fields are never blocked by the keyboard.
- **Best Practices:** Use `KeyboardAvoidingView` and standard Expo/React Native patterns for layout.

## Scope
**Target Directory:** `app/(onboarding)/` and `components/`
- **Primary Component:** Refactor `components/OnboardingScreen.tsx` (and potentially `components/OnboardingLayout.tsx` if it exists) to serve as the single source of truth for this behavior.
- **Affected Screens:** All screens in `app/(onboarding)/**` that use these shared wrappers.

## Functional Requirements
1. **Auto-Scroll Behavior:**
   - Use a `ScrollView` with `flexGrow: 1`.
   - Configure `scrollEnabled` (or equivalent layout technique) to allow scrolling only when content height > viewport height. *Refinement: Often simply using `flexGrow: 1` with a proper parent `View` is sufficient in React Native to allow scrolling only when needed without explicit enabling/disabling logic, but we must verify this "bouncy" behavior on iOS.* 
   - *Correction for iOS:* iOS `ScrollView` always bounces by default. To stop the "glitchy" feel of bouncing empty space, we should set `bounces={false}` or `overScrollMode="never"` specifically when content fits.
2. **Padding Strategy:**
   - Add specific `paddingBottom` to `ScrollView` content container to clear the floating "Continue" button area.
   - Ensure the "Continue" button (if floating) sits *above* the scroll view in z-index but doesn't block the last item of the list when scrolled to bottom.

## Non-Functional Requirements
- **Device Agnostic:** Must work on iPhone SE (small) and iPhone 15 Pro Max (large).
- **UX:** No "bounce" effect on static screens (iOS).

## Out of Scope
- Redesigning the visual hierarchy of the "Continue" buttons (just positioning/padding adjustments).
