// Polyfills for React Native to support Convex client
// These MUST be imported before any Convex code runs

// Simple event class for React Native (in case Event doesn't exist)
class RNEvent {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
}

// Polyfill Event if it doesn't exist
if (typeof global !== "undefined" && typeof (global as any).Event === "undefined") {
  (global as any).Event = RNEvent;
}

// Polyfill window object if it doesn't exist
if (typeof global !== "undefined" && typeof (global as any).window === "undefined") {
  (global as any).window = global;
}

// Type for our listener function
type ListenerFn = (...args: any[]) => void;

// Storage for event listeners
const eventListeners: Map<string, Set<ListenerFn>> = new Map();

// Polyfill addEventListener if it doesn't exist on window
if (typeof global !== "undefined") {
  const win = (global as any).window || global;
  
  if (typeof win.addEventListener !== "function") {
    win.addEventListener = (type: string, listener: ListenerFn) => {
      if (!eventListeners.has(type)) {
        eventListeners.set(type, new Set());
      }
      eventListeners.get(type)!.add(listener);
    };
  }

  if (typeof win.removeEventListener !== "function") {
    win.removeEventListener = (type: string, listener: ListenerFn) => {
      const listeners = eventListeners.get(type);
      if (listeners) {
        listeners.delete(listener);
      }
    };
  }
}

// Polyfill navigator.onLine if it doesn't exist
if (typeof navigator !== "undefined") {
  try {
    if (navigator.onLine === undefined) {
      Object.defineProperty(navigator, "onLine", {
        get: () => true,
        configurable: true,
      });
    }
  } catch {
    // Some environments don't allow modifying navigator
  }
}

// Export for typescript module system
export {};
