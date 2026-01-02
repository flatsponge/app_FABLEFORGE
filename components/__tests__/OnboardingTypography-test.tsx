import React from 'react';
import renderer from 'react-test-renderer';
import { OnboardingTitle, OnboardingBody, OnboardingSubtitle } from '../OnboardingTypography';

// TODO: Fix NativeWind v4 css-interop test environment issue.
describe('OnboardingTypography', () => {
  it.skip('renders Title correctly', () => {
    const tree = renderer.create(<OnboardingTitle>Test Title</OnboardingTitle>).toJSON();
    expect(tree).toBeTruthy();
  });

  it.skip('renders Body correctly', () => {
    const tree = renderer.create(<OnboardingBody>Test Body</OnboardingBody>).toJSON();
    expect(tree).toBeTruthy();
  });

  it.skip('renders Subtitle correctly', () => {
    const tree = renderer.create(<OnboardingSubtitle>Test Subtitle</OnboardingSubtitle>).toJSON();
    expect(tree).toBeTruthy();
  });
});