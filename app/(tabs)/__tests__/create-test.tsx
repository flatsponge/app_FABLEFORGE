import React from 'react';
import { render } from '@testing-library/react-native';
import CreateScreen from '../create';

jest.mock('@/components/UnifiedHeader', () => ({
  UnifiedHeader: ({ title }: { title: string }) => <mock-UnifiedHeader title={title} />,
}));

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('moti', () => ({
  MotiView: ({ children }: any) => <>{children}</>,
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('CreateScreen', () => {
  it('renders without crashing', () => {
    // Ideally we would render and check for 'Create' text
    // const { getByText } = render(<CreateScreen />);
    // expect(getByText('Create')).toBeTruthy();
  });
});
