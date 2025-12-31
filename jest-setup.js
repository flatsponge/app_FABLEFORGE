// Mock window.dispatchEvent for NativeWind/React Native Web
if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'undefined') {
  window.dispatchEvent = jest.fn();
}
