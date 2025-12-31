# AGENTS.md - Expo Storytime App

## Commands
- `bun start` or `npm start` - Start Expo dev server
- `bun ios` / `bun android` - Run on iOS/Android simulator
- `npx tsc --noEmit` - Type check the project

## Architecture
- **Framework**: Expo SDK 54 with expo-router (file-based routing)
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **Animations**: Moti + React Native Reanimated
- **Icons**: lucide-react-native, @expo/vector-icons
- **Navigation**: Stack-based with tabs layout in `app/(tabs)/`

## Structure
- `app/` - File-based routes (_layout.tsx, (tabs)/, book/[id], reading/[id])
- `components/` - Reusable UI components (BookCard, Header, CategoryRail, etc.)
- `constants/` - App constants and theme values
- `assets/` - Fonts, images, and static files

## Code Style
- TypeScript with strict mode; use `@/*` path alias for imports
- Components: Named exports, React.FC with typed props interfaces
- Styling: Use NativeWind className for styling, StyleSheet for complex cases
- Colors: Use Tailwind classes; background=#FDFBF7, primary=purple scale
- Icons: Import from lucide-react-native with explicit size/color props
