# Plan: Unify Headers

## Phase 1: Component Design & Implementation
- [x] Task: Create test file `components/__tests__/UnifiedHeader-test.tsx` and write initial failing tests for rendering and variants. 903841b
- [x] Task: Implement `UnifiedHeader` component in `components/UnifiedHeader.tsx` with `default` and `child` variants using NativeWind. 903841b
- [x] Task: Refactor `UnifiedHeader` to handle Safe Area Insets and Back Button logic. 903841b
- [x] Task: Verify tests pass and component renders correctly in isolation. 903841b
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Component Design & Implementation' (Protocol in workflow.md)

## Phase 2: Integration - Parent Views (Growth & Settings)
- [x] Task: Write tests ensuring `app/(tabs)/stats.tsx` (Growth) renders with the new header.
- [x] Task: Replace header in `app/(tabs)/stats.tsx` with `<UnifiedHeader variant="default" />`.
- [x] Task: Replace header in `app/(tabs)/settings.tsx` with `<UnifiedHeader variant="default" />`.
- [x] Task: Replace header in `app/(tabs)/create.tsx` (Create Story) with `<UnifiedHeader variant="default" />`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Integration - Parent Views (Growth & Settings)' (Protocol in workflow.md)

## Phase 3: Integration - Child Views (StoryTime & Hub)
- [x] Task: Write tests ensuring `app/(tabs)/index.tsx` (StoryTime) renders with the new header.
- [x] Task: Replace header in `app/(tabs)/index.tsx` with `<UnifiedHeader variant="child" />`.
- [x] Task: Replace header in `app/(tabs)/child-hub.tsx` with `<UnifiedHeader variant="child" />`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration - Child Views (StoryTime & Hub)' (Protocol in workflow.md)

## Phase 4: Cleanup & Polish
- [x] Task: Remove any specific legacy header components or styles that are no longer used.
- [x] Task: Verify accessibility labels and hit slop for buttons.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Cleanup & Polish' (Protocol in workflow.md)
