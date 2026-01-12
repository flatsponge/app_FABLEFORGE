import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import OnboardingLayout from '../OnboardingLayout';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

describe('OnboardingLayout Scroll Behavior', () => {
  const initialMetrics = {
    frame: { x: 0, y: 0, width: 320, height: 568 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  };

  it('disables bouncing/scrolling when content fits the screen', () => {
    const { getByTestId } = render(
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <OnboardingLayout>
          <View style={{ height: 100 }}>
            <Text>Small Content</Text>
          </View>
        </OnboardingLayout>
      </SafeAreaProvider>
    );

    const scrollView = getByTestId('onboarding-layout-scroll-view');

    // Simulate Layout (Viewport Height = 800)
    fireEvent(scrollView, 'layout', {
      nativeEvent: { layout: { height: 800 } },
    });

    // Simulate Content Size Change (Content Height = 200)
    fireEvent(scrollView, 'contentSizeChange', 100, 200);

    // Expect bounces to be false (or scrollEnabled false)
    expect(scrollView.props.bounces).toBe(false);
  });

  it('enables bouncing/scrolling when content overflows', () => {
    const { getByTestId } = render(
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <OnboardingLayout>
          <View style={{ height: 1000 }}>
            <Text>Large Content</Text>
          </View>
        </OnboardingLayout>
      </SafeAreaProvider>
    );

    const scrollView = getByTestId('onboarding-layout-scroll-view');

    // Simulate Layout (Viewport Height = 800)
    fireEvent(scrollView, 'layout', {
      nativeEvent: { layout: { height: 800 } },
    });

    // Simulate Content Size Change (Content Height = 1000)
    fireEvent(scrollView, 'contentSizeChange', 100, 1000);

    // Expect bounces to be true
    expect(scrollView.props.bounces).toBe(true);
  });
});
