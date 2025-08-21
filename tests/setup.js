// Global test setup
import { jest } from '@jest/globals';

// Mock browser APIs
global.L = {
  map: jest.fn(() => ({
    setView: jest.fn(),
    setZoom: jest.fn(),
    getCenter: jest.fn(() => ({ lat: 0, lng: 0 })),
    getZoom: jest.fn(() => 10),
    getBounds: jest.fn(() => ({
      contains: jest.fn(() => true)
    })),
    invalidateSize: jest.fn(),
    on: jest.fn(),
    removeLayer: jest.fn()
  })),
  circleMarker: jest.fn(() => ({
    addTo: jest.fn(),
    bindPopup: jest.fn(),
    on: jest.fn(),
    serviceId: 1
  })),
  popup: jest.fn(() => ({
    setLatLng: jest.fn(),
    setContent: jest.fn(),
    openOn: jest.fn()
  }))
};

global.lucide = {
  createIcons: jest.fn()
};

// Mock console methods for testing
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn()
};

// Restore console after each test
afterEach(() => {
  jest.clearAllMocks();
});