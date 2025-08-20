// Setup file for Jest tests
// Add any global test setup here

// Mock localStorage for tests
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock setTimeout and clearTimeout for better test control
jest.useFakeTimers();
