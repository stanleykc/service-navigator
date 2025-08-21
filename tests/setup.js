// Global test setup with comprehensive mocking strategy
import { jest } from '@jest/globals';

// Create reusable mock factories
const createMockElement = (tagName = 'div') => {
  const dataset = {};
  return {
    tagName: tagName.toUpperCase(),
    className: '',
    textContent: '',
    innerHTML: '',
    dataset: new Proxy(dataset, {
      set(target, property, value) {
        // Convert all dataset values to strings like real DOM
        target[property] = String(value);
        return true;
      },
      get(target, property) {
        return target[property];
      }
    }),
    style: {},
    children: [],
    appendChild: jest.fn(function(child) {
      this.children.push(child);
      return child;
    }),
    removeChild: jest.fn(),
    setAttribute: jest.fn(),
    getAttribute: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    click: jest.fn(),
    focus: jest.fn(),
    blur: jest.fn(),
    getBoundingClientRect: jest.fn(() => ({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      right: 100,
      bottom: 100
    }))
  };
};

const createMockMap = () => ({
  setView: jest.fn().mockReturnThis(),
  setMinZoom: jest.fn().mockReturnThis(),
  setMaxZoom: jest.fn().mockReturnThis(),
  setZoom: jest.fn().mockReturnThis(),
  getZoom: jest.fn().mockReturnValue(12),
  getCenter: jest.fn().mockReturnValue({ lat: 38.719, lng: -90.4218 }),
  getBounds: jest.fn().mockReturnValue({
    contains: jest.fn().mockReturnValue(true),
    getSouthWest: jest.fn().mockReturnValue({ lat: 38.7, lng: -90.5 }),
    getNorthEast: jest.fn().mockReturnValue({ lat: 38.8, lng: -90.3 })
  }),
  fitBounds: jest.fn().mockReturnThis(),
  invalidateSize: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  removeLayer: jest.fn(),
  addLayer: jest.fn(),
  hasLayer: jest.fn().mockReturnValue(false),
  remove: jest.fn(), // Add the missing remove method
  eachLayer: jest.fn(),
  clearLayers: jest.fn()
});

const createMockMarker = (serviceId = 1) => ({
  serviceId,
  addTo: jest.fn().mockReturnThis(),
  removeFrom: jest.fn().mockReturnThis(),
  bindPopup: jest.fn().mockReturnThis(),
  unbindPopup: jest.fn().mockReturnThis(),
  openPopup: jest.fn().mockReturnThis(),
  closePopup: jest.fn().mockReturnThis(),
  setLatLng: jest.fn().mockReturnThis(),
  getLatLng: jest.fn().mockReturnValue({ lat: 38.719, lng: -90.4218 }),
  setStyle: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  off: jest.fn().mockReturnThis()
});

// Mock DOM APIs globally
global.document = {
  createElement: jest.fn((tagName) => createMockElement(tagName)),
  getElementById: jest.fn((id) => createMockElement('div')),
  querySelector: jest.fn(() => createMockElement()),
  querySelectorAll: jest.fn(() => []),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  body: createMockElement('body'),
  head: createMockElement('head'),
  documentElement: createMockElement('html'),
  readyState: 'complete'
};

global.window = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  location: {
    href: 'http://localhost:3000/',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: ''
  },
  history: {
    pushState: jest.fn(),
    replaceState: jest.fn(),
    back: jest.fn(),
    forward: jest.fn()
  },
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  sessionStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  alert: jest.fn(),
  confirm: jest.fn(() => true),
  prompt: jest.fn(),
  open: jest.fn(),
  close: jest.fn(),
  focus: jest.fn(),
  blur: jest.fn()
};

// Mock Leaflet with factory functions
global.L = {
  map: jest.fn((containerId) => {
    const mockMap = createMockMap();
    mockMap.containerId = containerId;
    return mockMap;
  }),
  circleMarker: jest.fn((latLng, options = {}) => {
    const marker = createMockMarker();
    marker.latLng = latLng;
    marker.options = options;
    return marker;
  }),
  marker: jest.fn((latLng, options = {}) => {
    const marker = createMockMarker();
    marker.latLng = latLng;
    marker.options = options;
    return marker;
  }),
  popup: jest.fn(() => ({
    setLatLng: jest.fn().mockReturnThis(),
    setContent: jest.fn().mockReturnThis(),
    openOn: jest.fn().mockReturnThis(),
    closeOn: jest.fn().mockReturnThis(),
    isOpen: jest.fn().mockReturnValue(false)
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn().mockReturnThis(),
    removeFrom: jest.fn().mockReturnThis(),
    setOpacity: jest.fn().mockReturnThis(),
    setZIndex: jest.fn().mockReturnThis()
  })),
  control: {
    zoom: jest.fn(() => ({
      addTo: jest.fn().mockReturnThis(),
      removeFrom: jest.fn().mockReturnThis()
    })),
    attribution: jest.fn(() => ({
      addTo: jest.fn().mockReturnThis(),
      removeFrom: jest.fn().mockReturnThis()
    }))
  }
};

// Mock Lucide Icons
global.lucide = {
  createIcons: jest.fn(),
  icons: {
    search: '<svg>search</svg>',
    menu: '<svg>menu</svg>',
    phone: '<svg>phone</svg>',
    mail: '<svg>mail</svg>',
    globe: '<svg>globe</svg>'
  }
};

// Mock Performance API
global.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(() => []),
  getEntriesByType: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn()
};

// Mock console methods with original fallbacks
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug
};

global.console = {
  ...originalConsole,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Mock fetch for future API testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    headers: new Map()
  })
);

// Test lifecycle hooks
beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
  
  // Reset DOM state by reassigning functions
  global.document.createElement = jest.fn((tagName) => createMockElement(tagName));
  global.document.getElementById = jest.fn((id) => {
    const element = createMockElement('div');
    element.id = id;
    return element;
  });
  
  // Reset Leaflet mocks
  global.L.map = jest.fn((containerId) => {
    const mockMap = createMockMap();
    mockMap.containerId = containerId;
    return mockMap;
  });
  
  global.L.circleMarker = jest.fn((latLng, options = {}) => {
    const marker = createMockMarker();
    marker.latLng = latLng;
    marker.options = options;
    return marker;
  });
});

afterEach(() => {
  // Clean up after each test
  jest.clearAllMocks();
});

// Global test utilities
global.testUtils = {
  createMockElement,
  createMockMap,
  createMockMarker,
  waitFor: (callback, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        try {
          callback();
          resolve();
        } catch (error) {
          if (Date.now() - start > timeout) {
            reject(error);
          } else {
            setTimeout(check, 10);
          }
        }
      };
      check();
    });
  }
};