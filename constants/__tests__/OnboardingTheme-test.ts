import { OnboardingTheme } from '../OnboardingTheme';

describe('OnboardingTheme', () => {
  it('should have defined Colors', () => {
    expect(OnboardingTheme.Colors).toBeDefined();
    expect(OnboardingTheme.Colors.Background).toBeDefined();
    expect(OnboardingTheme.Colors.Primary).toBeDefined(); // For buttons
    expect(OnboardingTheme.Colors.Text).toBeDefined();
    expect(OnboardingTheme.Colors.TextSecondary).toBeDefined();
  });

  it('should have defined Typography', () => {
    expect(OnboardingTheme.Typography).toBeDefined();
    expect(OnboardingTheme.Typography.Title).toBeDefined();
    expect(OnboardingTheme.Typography.Subtitle).toBeDefined();
    expect(OnboardingTheme.Typography.Body).toBeDefined();
  });

  it('should have defined Spacing', () => {
    expect(OnboardingTheme.Spacing).toBeDefined();
    expect(OnboardingTheme.Spacing.xs).toBeDefined();
    expect(OnboardingTheme.Spacing.sm).toBeDefined();
    expect(OnboardingTheme.Spacing.md).toBeDefined();
    expect(OnboardingTheme.Spacing.lg).toBeDefined();
    expect(OnboardingTheme.Spacing.xl).toBeDefined();
  });
});
