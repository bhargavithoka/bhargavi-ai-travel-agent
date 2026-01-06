// jest.setup.ts
import "@testing-library/jest-dom";

// Mock environment variables for testing
process.env.OPENAI_API_KEY = "test-key";
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";

// Suppress console logs in tests (optional)
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep error logging for debugging tests
};
