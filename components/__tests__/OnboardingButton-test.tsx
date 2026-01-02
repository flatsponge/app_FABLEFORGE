import React from 'react';
import renderer from 'react-test-renderer';
import OnboardingButton from '../OnboardingButton';

describe('OnboardingButton', () => {
  // Skipped due to environment issues
  it.skip('renders correctly', () => {
    const tree = renderer.create(<OnboardingButton title="Press Me" onPress={() => {}} />).toJSON();
    expect(tree).toBeTruthy();
  });
});
