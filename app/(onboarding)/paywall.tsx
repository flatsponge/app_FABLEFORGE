import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

export default function PaywallScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  const handlePurchase = () => {
    router.replace('/');
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Hero */}
      <View className="bg-gradient-to-b from-primary-100 to-white pt-16 pb-12 px-6 items-center">
        <View className="bg-white p-4 rounded-3xl mb-6">
          <Ionicons name="rocket" size={56} color="#9333ea" />
        </View>
        <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
          Unlock Their Full Potential
        </Text>
        <Text className="text-lg text-gray-500 text-center">
          Turn daily struggles into magical lessons.
        </Text>
      </View>

      <View className="px-6">
        {/* Blinkist Timeline */}
        <Animated.View entering={FadeIn.delay(200).duration(500)} className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-6 text-center">
            How Your Free Trial Works
          </Text>

          <View className="relative">
            {/* Timeline Line */}
            <View className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200" />

            {/* Day 1 */}
            <View className="flex-row items-start mb-6">
              <View className="w-12 h-12 rounded-full bg-primary-500 items-center justify-center z-10">
                <Ionicons name="lock-open" size={20} color="white" />
              </View>
              <View className="ml-4 flex-1 pt-2">
                <Text className="font-bold text-gray-900">Today</Text>
                <Text className="text-gray-500 text-sm">
                  Instant access to unlimited AI stories & avatar customization.
                </Text>
              </View>
            </View>

            {/* Day 5 */}
            <View className="flex-row items-start mb-6">
              <View className="w-12 h-12 rounded-full bg-orange-400 items-center justify-center z-10">
                <Ionicons name="notifications" size={20} color="white" />
              </View>
              <View className="ml-4 flex-1 pt-2">
                <Text className="font-bold text-gray-900">Day 5</Text>
                <Text className="text-gray-500 text-sm">
                  We'll send you a reminder email before your trial ends.
                </Text>
              </View>
            </View>

            {/* Day 7 */}
            <View className="flex-row items-start">
              <View className="w-12 h-12 rounded-full bg-green-500 items-center justify-center z-10">
                <Ionicons name="star" size={20} color="white" />
              </View>
              <View className="ml-4 flex-1 pt-2">
                <Text className="font-bold text-gray-900">Day 7</Text>
                <Text className="text-gray-500 text-sm">
                  Premium membership begins. Cancel anytime before this.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Features */}
        <Animated.View entering={FadeIn.delay(300).duration(500)} className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">What You Get</Text>
          {[
            { icon: 'book', text: 'Unlimited AI-Generated Stories' },
            { icon: 'analytics', text: 'Moral Growth Dashboard' },
            { icon: 'shirt', text: 'Full Avatar Customization' },
            { icon: 'document-text', text: 'Weekly Parent Reports' },
            { icon: 'gift', text: 'Bonus: "The Tantrum Tamer" Guide' },
          ].map((item, i) => (
            <View key={i} className="flex-row items-center mb-3">
              <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center mr-3">
                <Ionicons name={item.icon as any} size={20} color="#9333ea" />
              </View>
              <Text className="text-gray-800 font-medium flex-1">{item.text}</Text>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            </View>
          ))}
        </Animated.View>

        {/* Pricing Cards */}
        <Animated.View entering={FadeIn.delay(400).duration(500)} className="mb-6">
          {/* Yearly */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('yearly')}
            className={`mb-4 p-5 rounded-2xl border-2 relative ${selectedPlan === 'yearly'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 bg-white'
              }`}
          >
            <View className="absolute -top-3 right-4 bg-green-500 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-bold">SAVE 60%</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-bold text-gray-900">Yearly</Text>
                <Text className="text-gray-500 text-sm">Billed annually</Text>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-bold text-gray-900">$59.99</Text>
                <Text className="text-primary-600 text-sm font-medium">$4.99/mo</Text>
              </View>
            </View>
            {selectedPlan === 'yearly' && (
              <View className="absolute top-5 left-4">
                <Ionicons name="checkmark-circle" size={24} color="#9333ea" />
              </View>
            )}
          </TouchableOpacity>

          {/* Monthly */}
          <TouchableOpacity
            onPress={() => setSelectedPlan('monthly')}
            className={`p-5 rounded-2xl border-2 ${selectedPlan === 'monthly'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 bg-white'
              }`}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-bold text-gray-900">Monthly</Text>
                <Text className="text-gray-500 text-sm">Billed monthly</Text>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-bold text-gray-900">$12.99</Text>
                <Text className="text-gray-400 text-sm">/month</Text>
              </View>
            </View>
            {selectedPlan === 'monthly' && (
              <View className="absolute top-5 left-4">
                <Ionicons name="checkmark-circle" size={24} color="#9333ea" />
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Guarantee */}
        <View className="bg-green-50 p-4 rounded-2xl flex-row items-center mb-8 border border-green-100">
          <Ionicons name="shield-checkmark" size={28} color="#10b981" />
          <View className="ml-3 flex-1">
            <Text className="text-green-800 font-bold">30-Day Money-Back Guarantee</Text>
            <Text className="text-green-700 text-sm">No questions asked. Full refund if you're not satisfied.</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={handlePurchase}
          className="bg-primary-600 py-5 rounded-full items-center mb-4"
        >
          <Text className="text-white text-lg font-bold">Start 7-Day Free Trial</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePurchase}>
          <Text className="text-center text-gray-400 text-sm">
            No thanks, maybe later
          </Text>
        </TouchableOpacity>

        {/* Social Proof */}
        <View className="mt-8 mb-4 items-center">
          <Text className="text-gray-400 text-xs mb-2">TRUSTED BY</Text>
          <Text className="text-gray-900 font-bold text-lg">50,000+ Parents</Text>
          <View className="flex-row mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons key={i} name="star" size={16} color="#facc15" />
            ))}
            <Text className="text-gray-500 text-sm ml-2">4.9 Rating</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
