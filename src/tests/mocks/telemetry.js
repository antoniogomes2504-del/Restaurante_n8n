import { vi } from 'vitest';

vi.mock('../api/telemetry', () => ({
  telemetry: {
    trace: vi.fn(() => ({
      event: vi.fn(),
      error: vi.fn(),
      end: vi.fn(),
    })),
    logLogin: vi.fn(),
    logSignup: vi.fn(),
    logOrder: vi.fn(),
    logDatabaseError: vi.fn(),
  },
  default: {
    trace: vi.fn(() => ({
      event: vi.fn(),
      error: vi.fn(),
      end: vi.fn(),
    })),
    logLogin: vi.fn(),
    logSignup: vi.fn(),
    logOrder: vi.fn(),
    logDatabaseError: vi.fn(),
  }
}));
