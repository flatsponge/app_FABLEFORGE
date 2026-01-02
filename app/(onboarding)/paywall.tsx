import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import OnboardingLayout from '../../components/OnboardingLayout';
import { OnboardingTitle, OnboardingBody } from '../../components/OnboardingTypography';
import { OnboardingTheme } from '../../constants/OnboardingTheme';

export default function PaywallScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  const handlePurchase = () => {
    router.replace('/(tabs)');
  };

  return (
    <OnboardingLayout
        progress={1.0}
        onNext={handlePurchase}
        nextLabel="Start 7-Day Free Trial"
        isScrollable={true}
    >
      <View style={styles.container}>
        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconWrapper}>
            <Ionicons name="rocket" size={56} color={OnboardingTheme.Colors.Primary} />
          </View>
          <OnboardingTitle style={styles.heroTitle}>Unlock Their Full Potential</OnboardingTitle>
          <OnboardingBody style={styles.heroSubtitle}>
            Turn daily struggles into magical lessons.
          </OnboardingBody>
        </View>

        {/* Timeline */}
        <Animated.View entering={FadeIn.delay(200)} style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>How Your Free Trial Works</Text>

          <View style={styles.timelineWrapper}>
            <View style={styles.timelineLine} />

            {/* Day 1 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineDotPrimary}>
                <Ionicons name="lock-open" size={20} color="white" />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Today</Text>
                <Text style={styles.timelineDescription}>
                  Instant access to unlimited AI stories & avatar customization.
                </Text>
              </View>
            </View>

            {/* Day 5 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineDotOrange}>
                <Ionicons name="notifications" size={20} color="white" />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Day 5</Text>
                <Text style={styles.timelineDescription}>
                  We'll send you a reminder email before your trial ends.
                </Text>
              </View>
            </View>

            {/* Day 7 */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineDotGreen}>
                <Ionicons name="star" size={20} color="white" />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Day 7</Text>
                <Text style={styles.timelineDescription}>
                  Premium membership begins. Cancel anytime before this.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Features */}
        <Animated.View entering={FadeIn.delay(300)} style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What You Get</Text>
          {[
            { icon: 'book', text: 'Unlimited AI-Generated Stories' },
            { icon: 'analytics', text: 'Moral Growth Dashboard' },
            { icon: 'shirt', text: 'Full Avatar Customization' },
            { icon: 'document-text', text: 'Weekly Parent Reports' },
            { icon: 'gift', text: 'Bonus: "The Tantrum Tamer" Guide' },
          ].map((item, i) => (
            <View key={i} style={styles.featureItem}>
              <View style={styles.featureIconWrapper}>
                <Ionicons name={item.icon as any} size={20} color={OnboardingTheme.Colors.Primary} />
              </View>
              <Text style={styles.featureText}>{item.text}</Text>
              <Ionicons name="checkmark-circle" size={20} color={OnboardingTheme.Colors.Success} />
            </View>
          ))}
        </Animated.View>

        {/* Pricing Cards */}
        <Animated.View entering={FadeIn.delay(400)} style={styles.pricingSection}>
          {/* Yearly */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('yearly')}
            style={[
                styles.planCard,
                selectedPlan === 'yearly' ? styles.planCardSelected : styles.planCardUnselected
            ]}
          >
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>SAVE 60%</Text>
            </View>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planTitle}>Yearly</Text>
                <Text style={styles.planSubtitle}>Billed annually</Text>
              </View>
              <View style={styles.planPriceWrapper}>
                <Text style={styles.planPrice}>$59.99</Text>
                <Text style={styles.planPriceMonthly}>$4.99/mo</Text>
              </View>
            </View>
            {selectedPlan === 'yearly' && (
              <View style={styles.selectionCheck}>
                <Ionicons name="checkmark-circle" size={24} color={OnboardingTheme.Colors.Primary} />
              </View>
            )}
          </TouchableOpacity>

          {/* Monthly */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('monthly')}
            style={[
                styles.planCard,
                selectedPlan === 'monthly' ? styles.planCardSelected : styles.planCardUnselected
            ]}
          >
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planTitle}>Monthly</Text>
                <Text style={styles.planSubtitle}>Billed monthly</Text>
              </View>
              <View style={styles.planPriceWrapper}>
                <Text style={styles.planPrice}>$12.99</Text>
                <Text style={styles.planPriceMonthlySecondary}>/month</Text>
              </View>
            </View>
            {selectedPlan === 'monthly' && (
              <View style={styles.selectionCheck}>
                <Ionicons name="checkmark-circle" size={24} color={OnboardingTheme.Colors.Primary} />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Guarantee */}
        <View style={styles.guaranteeCard}>
          <Ionicons name="shield-checkmark" size={28} color={OnboardingTheme.Colors.Success} />
          <View style={styles.guaranteeContent}>
            <Text style={styles.guaranteeTitle}>30-Day Money-Back Guarantee</Text>
            <Text style={styles.guaranteeDescription}>No questions asked. Full refund if you're not satisfied.</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handlePurchase} style={styles.laterButton}>
          <Text style={styles.laterButtonText}>No thanks, maybe later</Text>
        </TouchableOpacity>

        {/* Social Proof */}
        <View style={styles.socialProof}>
          <Text style={styles.socialProofLabel}>TRUSTED BY</Text>
          <Text style={styles.socialProofTitle}>50,000+ Parents</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons key={i} name="star" size={16} color="#facc15" />
            ))}
            <Text style={styles.ratingText}>4.9 Rating</Text>
          </View>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: OnboardingTheme.Spacing.lg,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: OnboardingTheme.Spacing.xl,
  },
  heroIconWrapper: {
    backgroundColor: '#f3e8ff', // primary-50
    padding: 16,
    borderRadius: 24,
    marginBottom: OnboardingTheme.Spacing.md,
  },
  heroTitle: {
    textAlign: 'center',
    marginBottom: OnboardingTheme.Spacing.xs,
  },
  heroSubtitle: {
    textAlign: 'center',
    color: OnboardingTheme.Colors.TextSecondary,
  },
  timelineCard: {
    backgroundColor: '#f9fafb', // gray-50
    borderRadius: OnboardingTheme.Radius.xl,
    padding: OnboardingTheme.Spacing.lg,
    marginBottom: OnboardingTheme.Spacing.xl,
    borderWidth: 1,
    borderColor: OnboardingTheme.Colors.Border,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: OnboardingTheme.Colors.Text,
    marginBottom: OnboardingTheme.Spacing.lg,
    textAlign: 'center',
    fontFamily: OnboardingTheme.Typography.Title.fontFamily,
  },
  timelineWrapper: {
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 24,
    top: 32,
    bottom: 32,
    width: 2,
    backgroundColor: '#e5e7eb', // gray-200
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: OnboardingTheme.Spacing.lg,
  },
  timelineDotPrimary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: OnboardingTheme.Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  timelineDotOrange: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fb923c', // orange-400
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  timelineDotGreen: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: OnboardingTheme.Colors.Success,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  timelineContent: {
    marginLeft: OnboardingTheme.Spacing.md,
    flex: 1,
    paddingTop: 4,
  },
  timelineLabel: {
    fontWeight: 'bold',
    color: OnboardingTheme.Colors.Text,
    fontSize: 16,
    fontFamily: OnboardingTheme.Typography.Title.fontFamily,
  },
  timelineDescription: {
    color: OnboardingTheme.Colors.TextSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: OnboardingTheme.Typography.Body.fontFamily,
  },
  featuresSection: {
    marginBottom: OnboardingTheme.Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: OnboardingTheme.Colors.Text,
    marginBottom: OnboardingTheme.Spacing.md,
    fontFamily: OnboardingTheme.Typography.Title.fontFamily,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: OnboardingTheme.Spacing.sm,
  },
  featureIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3e8ff', // primary-50
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: OnboardingTheme.Spacing.sm,
  },
  featureText: {
    color: '#374151', // gray-800
    fontWeight: '500',
    flex: 1,
    fontFamily: OnboardingTheme.Typography.Body.fontFamily,
  },
  pricingSection: {
    marginBottom: OnboardingTheme.Spacing.lg,
  },
  planCard: {
    padding: OnboardingTheme.Spacing.lg,
    borderRadius: OnboardingTheme.Radius.xl,
    borderWidth: 2,
    marginBottom: OnboardingTheme.Spacing.md,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: OnboardingTheme.Colors.Primary,
    backgroundColor: '#f3e8ff', // primary-50
  },
  planCardUnselected: {
    borderColor: OnboardingTheme.Colors.Border,
    backgroundColor: 'white',
  },
  saveBadge: {
    position: 'absolute',
    top: -12,
    right: 16,
    backgroundColor: OnboardingTheme.Colors.Success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  saveBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: OnboardingTheme.Colors.Text,
    fontFamily: OnboardingTheme.Typography.Title.fontFamily,
  },
  planSubtitle: {
    fontSize: 12,
    color: OnboardingTheme.Colors.TextSecondary,
    fontFamily: OnboardingTheme.Typography.Body.fontFamily,
  },
  planPriceWrapper: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: OnboardingTheme.Colors.Text,
    fontFamily: OnboardingTheme.Typography.Title.fontFamily,
  },
  planPriceMonthly: {
    fontSize: 14,
    color: OnboardingTheme.Colors.Primary,
    fontWeight: '600',
  },
  planPriceMonthlySecondary: {
    fontSize: 14,
    color: OnboardingTheme.Colors.TextSecondary,
  },
  selectionCheck: {
    position: 'absolute',
    top: 20,
    left: 16,
  },
  guaranteeCard: {
    backgroundColor: '#f0fdf4', // green-50
    padding: OnboardingTheme.Spacing.md,
    borderRadius: OnboardingTheme.Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: OnboardingTheme.Spacing.xl,
    borderWidth: 1,
    borderColor: '#dcfce7', // green-100
  },
  guaranteeContent: {
    marginLeft: OnboardingTheme.Spacing.sm,
    flex: 1,
  },
  guaranteeTitle: {
    color: '#166534', // green-800
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: OnboardingTheme.Typography.Title.fontFamily,
  },
  guaranteeDescription: {
    color: '#15803d', // green-700
    fontSize: 12,
    fontFamily: OnboardingTheme.Typography.Body.fontFamily,
  },
  laterButton: {
    padding: OnboardingTheme.Spacing.md,
    marginBottom: OnboardingTheme.Spacing.lg,
  },
  laterButtonText: {
    textAlign: 'center',
    color: OnboardingTheme.Colors.TextSecondary,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: OnboardingTheme.Typography.Body.fontFamily,
  },
  socialProof: {
    alignItems: 'center',
    marginBottom: OnboardingTheme.Spacing.xl,
  },
  socialProofLabel: {
    color: OnboardingTheme.Colors.TextSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  socialProofTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: OnboardingTheme.Colors.Text,
    fontFamily: OnboardingTheme.Typography.Title.fontFamily,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: OnboardingTheme.Colors.TextSecondary,
    fontFamily: OnboardingTheme.Typography.Body.fontFamily,
  },
});