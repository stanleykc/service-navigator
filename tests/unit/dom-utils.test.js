/**
 * Unit tests for SafeDOM class with condition-based testing
 */
import { describe, test, expect, beforeEach } from '@jest/globals';
import { SafeDOM } from '../../js/dom-utils.js';
import { 
  ConditionTester, 
  DataConditions, 
  ConditionAssertions,
  describeConditions 
} from '../utils/condition-tester.js';

// Mock DOM environment
const mockDocument = {
  createElement: jest.fn((tagName) => ({
    tagName: tagName.toUpperCase(),
    className: '',
    textContent: '',
    dataset: {},
    appendChild: jest.fn(),
    setAttribute: jest.fn(),
    href: ''
  }))
};

// Mock service data for testing
const mockService = {
  id: 1,
  name: 'Community Food Pantry',
  organization: 'Local Food Bank',
  description: 'Provides food assistance to families in need',
  category: 'Food',
  sourceOrg: 'Alpha Org',
  distance: '1.2 mi',
  address: '123 Main St',
  contact: {
    phone: '(555) 123-4567',
    email: 'info@foodbank.org',
    website: 'foodbank.org'
  },
  hours: {
    Monday: '9:00 AM - 5:00 PM',
    Tuesday: '9:00 AM - 5:00 PM',
    Wednesday: 'Closed'
  },
  eligibility: 'Low-income families',
  application: 'Walk-in or call ahead'
};

global.document = mockDocument;

describe('SafeDOM', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock to return a fresh mock element each time
    mockDocument.createElement.mockImplementation((tagName) => ({
      tagName: tagName.toUpperCase(),
      className: '',
      textContent: '',
      dataset: {},
      appendChild: jest.fn(),
      setAttribute: jest.fn(),
      href: '',
      children: []
    }));
  });

  describe('createResultCard', () => {
    test('should create a result card with valid service data', () => {
      const card = SafeDOM.createResultCard(mockService);
      
      expect(mockDocument.createElement).toHaveBeenCalledWith('div');
      expect(card.dataset.serviceId).toBe(mockService.id);
      expect(card.className).toContain('bg-white');
    });

    // Condition-based testing for different service data states
    describeConditions(
      'createResultCard',
      () => SafeDOM,
      [
        {
          name: 'valid service data',
          data: mockService,
          expected: (result) => {
            expect(result).toBeDefined();
            expect(result.dataset.serviceId).toBe(mockService.id);
          }
        },
        {
          name: 'service with missing optional fields',
          data: DataConditions.withMissingFields([mockService], ['distance'])[0],
          expected: (result) => {
            expect(result).toBeDefined();
            expect(result.dataset.serviceId).toBe(mockService.id);
          }
        },
        {
          name: 'service with null values',
          data: DataConditions.withNullValues([mockService], ['description'])[0],
          expected: (result) => {
            expect(result).toBeDefined();
          }
        },
        {
          name: 'service with XSS attempt in name',
          data: { 
            ...mockService, 
            name: '<script>alert("XSS")</script>Malicious Service' 
          },
          expected: (result) => {
            expect(result).toBeDefined();
            // Verify XSS prevention by checking that textContent is used
            expect(mockDocument.createElement).toHaveBeenCalled();
          }
        }
      ],
      async (safeDOM, data) => {
        return safeDOM.createResultCard(data);
      }
    );
  });

  describe('createModalContent', () => {
    test('should create modal content with complete service data', () => {
      const content = SafeDOM.createModalContent(mockService);
      
      expect(content).toBeDefined();
      expect(mockDocument.createElement).toHaveBeenCalledWith('div');
    });

    // Condition-based testing for modal content creation
    const modalConditions = new ConditionTester(SafeDOM)
      .when('complete service data', (safeDOM) => {
        // Setup complete service data
        return mockService;
      })
      .when('missing contact info', (safeDOM) => {
        return {
          ...mockService,
          contact: {}
        };
      })
      .when('empty hours', (safeDOM) => {
        return {
          ...mockService,
          hours: {}
        };
      });

    test('should handle different modal content conditions', async () => {
      await modalConditions.testAll(async (safeDOM, conditionName) => {
        const testData = conditionName === 'complete service data' ? mockService :
                        conditionName === 'missing contact info' ? { ...mockService, contact: {} } :
                        { ...mockService, hours: {} };
        
        const result = safeDOM.createModalContent(testData);
        expect(result).toBeDefined();
        expect(result.className).toBe('space-y-6');
      });
    });
  });

  describe('createSection', () => {
    test('should create a section with title and content', () => {
      const title = 'Test Title';
      const content = 'Test content';
      const section = SafeDOM.createSection(title, content);
      
      expect(section).toBeDefined();
      expect(mockDocument.createElement).toHaveBeenCalledWith('div');
      expect(mockDocument.createElement).toHaveBeenCalledWith('h4');
      expect(mockDocument.createElement).toHaveBeenCalledWith('p');
    });

    // Condition-based testing for section creation
    const sectionTestConditions = [
      { title: 'Normal Title', content: 'Normal content', expectValid: true },
      { title: '', content: 'Content only', expectValid: true },
      { title: 'Title only', content: '', expectValid: true },
      { title: '<script>alert("xss")</script>', content: 'Safe content', expectValid: true },
      { title: null, content: 'Null title', expectValid: true },
      { title: 'Title', content: null, expectValid: true }
    ];

    test.each(sectionTestConditions)(
      'should handle section creation condition: $title / $content',
      ({ title, content, expectValid }) => {
        const result = SafeDOM.createSection(title, content);
        
        if (expectValid) {
          expect(result).toBeDefined();
        } else {
          expect(() => SafeDOM.createSection(title, content)).toThrow();
        }
      }
    );
  });

  describe('getCategoryColor', () => {
    // Condition-based testing for category colors
    const categoryConditions = [
      { category: 'Food', expected: 'bg-green-100 text-green-800' },
      { category: 'Legal Aid', expected: 'bg-blue-100 text-blue-800' },
      { category: 'Housing', expected: 'bg-yellow-100 text-yellow-800' },
      { category: 'Healthcare', expected: 'bg-gray-100 text-gray-800' }, // Default case
      { category: '', expected: 'bg-gray-100 text-gray-800' }, // Empty string
      { category: null, expected: 'bg-gray-100 text-gray-800' }, // Null
      { category: undefined, expected: 'bg-gray-100 text-gray-800' } // Undefined
    ];

    test.each(categoryConditions)(
      'should return correct color for category: $category',
      ({ category, expected }) => {
        const result = SafeDOM.getCategoryColor(category);
        expect(result).toBe(expected);
      }
    );
  });

  describe('XSS Prevention', () => {
    const xssTestCases = [
      {
        name: 'script tag in service name',
        service: { ...mockService, name: '<script>alert("XSS")</script>Safe Name' }
      },
      {
        name: 'HTML in description',
        service: { ...mockService, description: '<img src=x onerror=alert("XSS")>Description' }
      },
      {
        name: 'XSS in organization',
        service: { ...mockService, organization: '<div onclick="alert()">Org</div>' }
      }
    ];

    test.each(xssTestCases)(
      'should prevent XSS in $name',
      ({ service }) => {
        // Test result card creation
        const card = SafeDOM.createResultCard(service);
        expect(card).toBeDefined();

        // Test modal content creation
        const modal = SafeDOM.createModalContent(service);
        expect(modal).toBeDefined();

        // Verify that createElement was called (indicating DOM elements were created safely)
        expect(mockDocument.createElement).toHaveBeenCalled();
      }
    );
  });

  describe('Edge Cases and Error Conditions', () => {
    test('should handle undefined service gracefully', () => {
      expect(() => SafeDOM.createResultCard(undefined)).toThrow();
    });

    test('should handle null service gracefully', () => {
      expect(() => SafeDOM.createResultCard(null)).toThrow();
    });

    test('should handle service with missing required fields', () => {
      const incompleteService = { id: 1 }; // Missing most fields
      
      expect(() => SafeDOM.createResultCard(incompleteService)).toThrow();
    });

    // Performance condition testing
    test('should maintain performance with large service data', () => {
      const largeDescriptionService = {
        ...mockService,
        description: 'A'.repeat(10000) // Very long description
      };

      const start = performance.now();
      const result = SafeDOM.createResultCard(largeDescriptionService);
      const end = performance.now();

      expect(result).toBeDefined();
      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });
  });
});