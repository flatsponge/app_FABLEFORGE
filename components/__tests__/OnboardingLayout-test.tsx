import React from 'react';
import renderer, { act } from 'react-test-renderer';
import OnboardingLayout from '../OnboardingLayout';
import { Text, View } from 'react-native';

// Mocks
jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => <>{children}</>,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('lucide-react-native', () => ({
  ArrowLeft: 'ArrowLeft',
}));

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockedView = (props: any) => <View {...props} />;
  MockedView.displayName = 'Animated.View';
  return {
    default: {
        View: MockedView,
    },
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    withTiming: (v: any) => v,
  };
});

describe('OnboardingLayout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // TODO: Fix NativeWind v4 css-interop test environment issue.
  // The current test environment fails when nativewind intercepts Animated.View or SafeAreaContext
  // throwing "TypeError: Cannot read properties of undefined (reading 'displayName')"
  it.skip('renders correctly with children', () => {
    let tree: any;
    act(() => {
        tree = renderer.create(
        <OnboardingLayout progress={0.5} onNext={() => {}}>
            <Text>Test Content</Text>
        </OnboardingLayout>
        );
    });
    expect(tree.toJSON()).toBeTruthy();
  });
});
