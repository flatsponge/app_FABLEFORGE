import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { OnboardingScreen } from '../OnboardingScreen';
import { View, Text } from 'react-native';

describe('OnboardingScreen Scroll Behavior', () => {
  it('disables bouncing/scrolling when content fits the screen', () => {
    const { getByTestId } = render(
      <OnboardingScreen title="Test" currentStep={1} totalSteps={3}>
        <View style={{ height: 100 }}>
          <Text>Small Content</Text>
        </View>
      </OnboardingScreen>
    );

    const scrollView = getByTestId('onboarding-scroll-view');

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
      <OnboardingScreen title="Test" currentStep={1} totalSteps={3}>
        <View style={{ height: 1000 }}>
          <Text>Large Content</Text>
        </View>
      </OnboardingScreen>
    );

    const scrollView = getByTestId('onboarding-scroll-view');

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
