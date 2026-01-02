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
  },
  Typography: {
    Title: {
      fontSize: 30,
      fontWeight: '700' as const,
      // Intentionally leaving out fontFamily here to allow component-level overrides 
      // or global font configuration usage.
      color: '#111827',
    },
    Subtitle: {
      fontSize: 12,
      fontWeight: '700' as const,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
      color: '#9CA3AF', // Gray 400
    },
    Body: {
      fontSize: 18,
      lineHeight: 28,
      color: '#4B5563',
    },
    Button: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: '#FFFFFF',
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
