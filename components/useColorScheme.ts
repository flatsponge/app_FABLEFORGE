// Force light mode only - disable system color scheme detection
export function useColorScheme() {
  return 'light' as const;
}
