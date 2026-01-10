export const OnboardingTheme = {
  Colors: {
    Background: '#FFFFFF',
    Primary: '#111827', // Gray 900 - Main Actions/Headings
    Secondary: '#4B5563', // Gray 600 - Body Text
    Text: '#111827',
    TextSecondary: '#6B7280', // Gray 500
    Accent: '#EA580C', // Orange 600 - Highlights
    Surface: '#F9FAFB', // Gray 50
    Border: '#E5E7EB', // Gray 200
    White: '#FFFFFF',
    Error: '#EF4444', // Red 500
    Success: '#22C55E', // Green 500
    IconColor: '#6B7280', // Gray 500 - Icon color
    IconBackground: '#F3F4F6', // Gray 100 - Icon container background
  },
  Radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },
  Typography: {
    Title: {
      fontSize: 30,
      fontWeight: '700' as const,
      lineHeight: 36,
      color: '#111827',
      fontFamily: undefined as string | undefined,
    },
    Subtitle: {
      fontSize: 12,
      fontWeight: '700' as const,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
      lineHeight: 16,
      color: '#9CA3AF', // Gray 400
      fontFamily: undefined as string | undefined,
    },
    Body: {
      fontSize: 18,
      lineHeight: 28,
      color: '#4B5563',
      fontFamily: undefined as string | undefined,
    },
    Button: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: '#FFFFFF',
      fontFamily: undefined as string | undefined,
    },
  },
  Spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};
