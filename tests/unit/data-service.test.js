/**
 * Unit tests for DataService class with comprehensive condition-based testing
 */
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { DataService } from '../../js/data-service.js';
import { 
  ConditionTester, 
  DataConditions, 
  ConditionAssertions,
  PerformanceConditions,
  describeConditions 
} from '../utils/condition-tester.js';

// Mock the data import
jest.mock('../../js/data.js', () => ({
  mockServices: [
    {
      id: 1,
      name: 'Community Food Pantry',
      organization: 'Local Food Bank',
      description: 'Provides food assistance to families in need',
      category: 'Food',
      sourceOrg: 'Alpha Org',
      address: '123 Main St',
      coordinates: [38.7190, -90.4218],
      contact: { phone: '555-1234', email: 'test@example.com', website: 'example.com' },
      hours: { Monday: '9-5', Tuesday: '9-5' },
      eligibility: 'Low income',
      application: 'Walk-in'
    },
    {
      id: 2,
      name: 'Legal Aid Society',
      organization: 'Legal Aid Center',
      description: 'Free legal services for low-income families',
      category: 'Legal Aid',
      sourceOrg: 'Beta Org',
      address: '456 Oak Ave',
      coordinates: [38.7290, -90.4318],
      contact: { phone: '555-5678', email: 'legal@example.com', website: 'legal.example.com' },
      hours: { Monday: '8-4', Wednesday: '8-4' },
      eligibility: 'Income verified',
      application: 'Appointment required'
    },
    {
      id: 3,
      name: 'Housing Assistance Program',
      organization: 'Housing Authority',
      description: 'Helps families find affordable housing',
      category: 'Housing',
      sourceOrg: 'Alpha Org',
      address: '789 Pine St',
      coordinates: [38.7390, -90.4418],
      contact: { phone: '555-9012', email: 'housing@example.com', website: 'housing.example.com' },
      hours: { Tuesday: '10-6', Thursday: '10-6' },
      eligibility: 'First-time homebuyers',
      application: 'Online application'
    }
  ]
}));

describe('DataService', () => {
  let dataService;

  beforeEach(async () => {
    dataService = new DataService();
    await dataService.init();
  });

  describe('Initialization', () => {
    test('should initialize with mock data', async () => {
      const newService = new DataService();
      expect(newService.initialized).toBe(false);
      
      await newService.init();
      
      expect(newService.initialized).toBe(true);
      expect(newService.services).toHaveLength(3);
      expect(newService.categories.size).toBe(3);
      expect(newService.sourceOrganizations.size).toBe(2);
    });

    test('should not reinitialize if already initialized', async () => {
      const originalServicesLength = dataService.services.length;
      
      await dataService.init(); // Second init call
      
      expect(dataService.services).toHaveLength(originalServicesLength);
    });
  });

  describe('getAllServices', () => {
    test('should return all services', () => {
      const services = dataService.getAllServices();
      expect(services).toHaveLength(3);
      expect(services).not.toBe(dataService.services); // Should return a copy
    });

    // Condition-based testing for different data states
    describeConditions(
      'getAllServices',
      () => new DataService(),
      [
        {
          name: 'with initialized data',
          setup: async (service) => await service.init(),
          expected: (result) => {
            expect(result).toHaveLength(3);
            expect(Array.isArray(result)).toBe(true);
          }
        },
        {
          name: 'without initialization',
          setup: () => {}, // No initialization
          expected: (result) => {
            expect(result).toHaveLength(0);
          }
        }
      ],
      async (service, data) => service.getAllServices()
    );
  });

  describe('getServicesByCategories', () => {
    test('should filter services by single category', () => {
      const foodServices = dataService.getServicesByCategories(['Food']);
      expect(foodServices).toHaveLength(1);
      expect(foodServices[0].category).toBe('Food');
    });

    test('should filter services by multiple categories', () => {
      const services = dataService.getServicesByCategories(['Food', 'Legal Aid']);
      expect(services).toHaveLength(2);
      expect(services.every(s => ['Food', 'Legal Aid'].includes(s.category))).toBe(true);
    });

    // Condition-based testing for category filtering
    const categoryFilterConditions = [
      { categories: ['Food'], expectedCount: 1 },
      { categories: ['Legal Aid'], expectedCount: 1 },
      { categories: ['Housing'], expectedCount: 1 },
      { categories: ['Food', 'Legal Aid'], expectedCount: 2 },
      { categories: ['NonExistent'], expectedCount: 0 },
      { categories: [], expectedCount: 3 },
      { categories: null, expectedCount: 3 },
      { categories: undefined, expectedCount: 3 }
    ];

    test.each(categoryFilterConditions)(
      'should handle category filter condition: $categories',
      ({ categories, expectedCount }) => {
        const result = dataService.getServicesByCategories(categories);
        expect(result).toHaveLength(expectedCount);
      }
    );
  });

  describe('searchServices', () => {
    const searchConditions = new ConditionTester(dataService)
      .when('search by service name', () => 'Food Pantry')
      .when('search by organization', () => 'Legal Aid Center')
      .when('search by description keyword', () => 'assistance')
      .when('search by address', () => 'Main St')
      .when('case insensitive search', () => 'FOOD')
      .when('empty search term', () => '')
      .when('whitespace only search', () => '   ')
      .when('non-existent term', () => 'xyz123')
      .when('null search term', () => null);

    test('should perform condition-based searches', async () => {
      await searchConditions.testAll(async (service, conditionName) => {
        const searchTerm = conditionName === 'search by service name' ? 'Food Pantry' :
                          conditionName === 'search by organization' ? 'Legal Aid Center' :
                          conditionName === 'search by description keyword' ? 'assistance' :
                          conditionName === 'search by address' ? 'Main St' :
                          conditionName === 'case insensitive search' ? 'FOOD' :
                          conditionName === 'empty search term' ? '' :
                          conditionName === 'whitespace only search' ? '   ' :
                          conditionName === 'non-existent term' ? 'xyz123' :
                          null;
        
        const results = service.searchServices(searchTerm);
        
        // Verify search results based on condition
        switch (conditionName) {
          case 'search by service name':
          case 'case insensitive search':
            expect(results.length).toBeGreaterThan(0);
            break;
          case 'search by organization':
            expect(results.some(r => r.organization.includes('Legal Aid Center'))).toBe(true);
            break;
          case 'search by description keyword':
            expect(results.length).toBeGreaterThan(0);
            break;
          case 'empty search term':
          case 'whitespace only search':
          case 'null search term':
            expect(results).toHaveLength(3); // Returns all services
            break;
          case 'non-existent term':
            expect(results).toHaveLength(0);
            break;
        }
      });
    });
  });

  describe('getServiceById', () => {
    test('should find service by valid ID', () => {
      const service = dataService.getServiceById(1);
      expect(service).toBeDefined();
      expect(service.id).toBe(1);
      expect(service.name).toBe('Community Food Pantry');
    });

    // Condition-based testing for ID lookup
    const idLookupConditions = [
      { id: 1, shouldExist: true },
      { id: 2, shouldExist: true },
      { id: 3, shouldExist: true },
      { id: 999, shouldExist: false },
      { id: -1, shouldExist: false },
      { id: 0, shouldExist: false },
      { id: '1', shouldExist: true }, // String ID (loose equality)
      { id: null, shouldExist: false },
      { id: undefined, shouldExist: false }
    ];

    test.each(idLookupConditions)(
      'should handle ID lookup condition: $id',
      ({ id, shouldExist }) => {
        const result = dataService.getServiceById(id);
        
        if (shouldExist) {
          expect(result).toBeDefined();
          expect(result.id == id).toBe(true); // Using loose equality
        } else {
          expect(result).toBeUndefined();
        }
      }
    );
  });

  describe('filterServices', () => {
    test('should apply multiple filters simultaneously', () => {
      const filters = {
        categories: ['Food', 'Housing'],
        sourceOrgs: ['Alpha Org'],
        keyword: 'food'
      };
      
      const results = dataService.filterServices(filters);
      expect(results).toHaveLength(1);
      expect(results[0].category).toBe('Food');
      expect(results[0].sourceOrg).toBe('Alpha Org');
    });

    // Comprehensive condition-based testing for filtering
    const filterConditions = [
      {
        name: 'no filters',
        filters: {},
        expected: (results) => expect(results).toHaveLength(3)
      },
      {
        name: 'category filter only',
        filters: { categories: ['Food'] },
        expected: (results) => {
          expect(results).toHaveLength(1);
          expect(results[0].category).toBe('Food');
        }
      },
      {
        name: 'source org filter only',
        filters: { sourceOrgs: ['Alpha Org'] },
        expected: (results) => {
          expect(results).toHaveLength(2);
          expect(results.every(r => r.sourceOrg === 'Alpha Org')).toBe(true);
        }
      },
      {
        name: 'keyword filter only',
        filters: { keyword: 'legal' },
        expected: (results) => {
          expect(results).toHaveLength(1);
          expect(results[0].category).toBe('Legal Aid');
        }
      },
      {
        name: 'combined filters',
        filters: { categories: ['Food', 'Housing'], sourceOrgs: ['Alpha Org'] },
        expected: (results) => {
          expect(results).toHaveLength(2);
        }
      },
      {
        name: 'filters with no matches',
        filters: { categories: ['Food'], keyword: 'legal' },
        expected: (results) => expect(results).toHaveLength(0)
      }
    ];

    test.each(filterConditions)(
      'should handle filter condition: $name',
      ({ filters, expected }) => {
        const results = dataService.filterServices(filters);
        expected(results);
      }
    );
  });

  describe('getServicesWithinRadius', () => {
    test('should find services within specified radius', () => {
      // Center near first service
      const services = dataService.getServicesWithinRadius(38.7190, -90.4218, 10);
      expect(services.length).toBeGreaterThan(0);
    });

    test('should return empty array when no services in radius', () => {
      // Very far location
      const services = dataService.getServicesWithinRadius(0, 0, 1);
      expect(services).toHaveLength(0);
    });

    // Condition-based testing for radius filtering
    const radiusConditions = [
      { center: [38.7190, -90.4218], radius: 1, expectedMin: 1 },
      { center: [38.7190, -90.4218], radius: 50, expectedMin: 3 },
      { center: [0, 0], radius: 1, expectedMin: 0 },
      { center: [38.7190, -90.4218], radius: 0, expectedMin: 0 }
    ];

    test.each(radiusConditions)(
      'should handle radius condition: center=$center, radius=$radius',
      ({ center, radius, expectedMin }) => {
        const [lat, lng] = center;
        const results = dataService.getServicesWithinRadius(lat, lng, radius);
        expect(results.length).toBeGreaterThanOrEqual(expectedMin);
      }
    );
  });

  describe('calculateDistance', () => {
    test('should calculate distance correctly', () => {
      const distance = dataService.calculateDistance(38.7190, -90.4218, 38.7290, -90.4318);
      expect(distance).toBeGreaterThan(0);
      expect(typeof distance).toBe('number');
    });

    test('should return zero for same coordinates', () => {
      const distance = dataService.calculateDistance(38.7190, -90.4218, 38.7190, -90.4218);
      expect(distance).toBe(0);
    });
  });

  describe('addService', () => {
    test('should add valid service', async () => {
      const newServiceData = {
        name: 'New Service',
        organization: 'New Org',
        address: '999 New St',
        category: 'Healthcare',
        description: 'New healthcare service'
      };

      const originalLength = dataService.services.length;
      const addedService = await dataService.addService(newServiceData);

      expect(dataService.services).toHaveLength(originalLength + 1);
      expect(addedService.id).toBeGreaterThan(3);
      expect(addedService.name).toBe(newServiceData.name);
      expect(dataService.categories.has('Healthcare')).toBe(true);
    });

    // Condition-based testing for service addition
    const addServiceConditions = [
      {
        name: 'complete valid service',
        serviceData: {
          name: 'Complete Service',
          organization: 'Complete Org',
          address: '123 Complete St',
          category: 'Healthcare'
        },
        shouldSucceed: true
      },
      {
        name: 'missing required field - name',
        serviceData: {
          organization: 'Missing Name Org',
          address: '123 Missing Name St',
          category: 'Healthcare'
        },
        shouldSucceed: false
      },
      {
        name: 'missing required field - organization',
        serviceData: {
          name: 'Missing Org Service',
          address: '123 Missing Org St',
          category: 'Healthcare'
        },
        shouldSucceed: false
      },
      {
        name: 'empty service data',
        serviceData: {},
        shouldSucceed: false
      }
    ];

    test.each(addServiceConditions)(
      'should handle add service condition: $name',
      async ({ serviceData, shouldSucceed }) => {
        if (shouldSucceed) {
          const result = await dataService.addService(serviceData);
          expect(result).toBeDefined();
          expect(result.id).toBeGreaterThan(0);
        } else {
          await expect(dataService.addService(serviceData)).rejects.toThrow();
        }
      }
    );
  });

  describe('getStats', () => {
    test('should return accurate statistics', () => {
      const stats = dataService.getStats();
      
      expect(stats.totalServices).toBe(3);
      expect(stats.totalCategories).toBe(3);
      expect(stats.totalSourceOrgs).toBe(2);
      expect(stats.servicesByCategory).toHaveLength(3);
      expect(stats.servicesBySourceOrg).toHaveLength(2);
    });

    test('should update stats after adding service', async () => {
      const originalStats = dataService.getStats();
      
      await dataService.addService({
        name: 'Stats Test Service',
        organization: 'Stats Org',
        address: '123 Stats St',
        category: 'Education'
      });
      
      const newStats = dataService.getStats();
      expect(newStats.totalServices).toBe(originalStats.totalServices + 1);
      expect(newStats.totalCategories).toBe(originalStats.totalCategories + 1);
    });
  });

  describe('Performance Testing', () => {
    test('should maintain performance with large datasets', async () => {
      // Create a large dataset
      const largeServiceCount = 1000;
      const largeServices = Array.from({ length: largeServiceCount }, (_, i) => ({
        id: i + 100,
        name: `Service ${i}`,
        organization: `Org ${i % 10}`,
        address: `Address ${i}`,
        category: ['Food', 'Housing', 'Legal Aid', 'Healthcare'][i % 4],
        sourceOrg: ['Alpha Org', 'Beta Org'][i % 2],
        description: `Description for service ${i}`,
        coordinates: [38.7190 + (i * 0.001), -90.4218 + (i * 0.001)]
      }));

      // Add large dataset
      dataService.services = [...dataService.services, ...largeServices];
      dataService.services.forEach(service => {
        dataService.categories.add(service.category);
        dataService.sourceOrganizations.add(service.sourceOrg);
      });

      // Test performance of various operations
      const performanceTests = {
        getAllServices: () => dataService.getAllServices(),
        searchServices: () => dataService.searchServices('Service'),
        filterServices: () => dataService.filterServices({ categories: ['Food'] }),
        getStats: () => dataService.getStats()
      };

      const results = await PerformanceConditions.testPerformanceUnderConditions(
        performanceTests,
        (testFn) => testFn()
      );

      // Assert performance thresholds
      Object.values(results).forEach(({ executionTime }) => {
        expect(executionTime).toBeLessThan(100); // Should complete in under 100ms
      });
    });
  });

  describe('Edge Cases and Error Conditions', () => {
    test('should handle malformed service data gracefully', () => {
      const malformedService = {
        id: 'not-a-number',
        name: null,
        organization: undefined,
        category: 123
      };

      // The service should still be handled, but with appropriate defaults/conversions
      expect(() => {
        dataService.services.push(malformedService);
        dataService.getAllServices();
      }).not.toThrow();
    });

    test('should handle concurrent operations safely', async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        dataService.addService({
          name: `Concurrent Service ${i}`,
          organization: `Concurrent Org ${i}`,
          address: `Concurrent Address ${i}`,
          category: 'Concurrent'
        })
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
      expect(new Set(results.map(r => r.id)).size).toBe(10); // All unique IDs
    });
  });
});