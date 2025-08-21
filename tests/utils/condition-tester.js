/**
 * Condition-Based Testing Utilities
 * Provides utilities for testing different conditions and scenarios
 */
import { expect } from '@jest/globals';

export class ConditionTester {
  constructor(testSubject) {
    this.testSubject = testSubject;
    this.conditions = [];
  }

  /**
   * Add a condition to test
   * @param {string} name - Name of the condition
   * @param {Function} setup - Function to set up the condition
   * @param {Function} teardown - Optional teardown function
   */
  when(name, setup, teardown = null) {
    this.conditions.push({ name, setup, teardown });
    return this;
  }

  /**
   * Test all conditions with the provided test function
   * @param {Function} testFn - Function that receives (subject, conditionName)
   */
  async testAll(testFn) {
    for (const condition of this.conditions) {
      // Set up condition
      if (condition.setup) {
        await condition.setup(this.testSubject);
      }

      try {
        // Run test
        await testFn(this.testSubject, condition.name);
      } finally {
        // Clean up condition
        if (condition.teardown) {
          await condition.teardown(this.testSubject);
        }
      }
    }
  }

  /**
   * Test a specific condition by name
   * @param {string} conditionName - Name of condition to test
   * @param {Function} testFn - Test function
   */
  async testCondition(conditionName, testFn) {
    const condition = this.conditions.find(c => c.name === conditionName);
    if (!condition) {
      throw new Error(`Condition "${conditionName}" not found`);
    }

    if (condition.setup) {
      await condition.setup(this.testSubject);
    }

    try {
      await testFn(this.testSubject, conditionName);
    } finally {
      if (condition.teardown) {
        await condition.teardown(this.testSubject);
      }
    }
  }
}

/**
 * Data condition generators for testing various data states
 */
export class DataConditions {
  static emptyArray() {
    return [];
  }

  static singleItem(item) {
    return [item];
  }

  static multipleItems(items) {
    return items;
  }

  static withNullValues(data, nullFields = []) {
    return data.map(item => {
      const modified = { ...item };
      nullFields.forEach(field => {
        modified[field] = null;
      });
      return modified;
    });
  }

  static withMissingFields(data, missingFields = []) {
    return data.map(item => {
      const modified = { ...item };
      missingFields.forEach(field => {
        delete modified[field];
      });
      return modified;
    });
  }

  static withInvalidData(data, invalidFields = {}) {
    return data.map(item => ({
      ...item,
      ...invalidFields
    }));
  }
}

/**
 * Environment condition helpers
 */
export class EnvironmentConditions {
  static mockBrowserAPI(apiName, implementation) {
    const original = global[apiName];
    global[apiName] = implementation;
    return () => {
      global[apiName] = original;
    };
  }

  static mockConsole() {
    const originalMethods = {};
    ['log', 'warn', 'error', 'info'].forEach(method => {
      originalMethods[method] = console[method];
      console[method] = jest.fn();
    });
    
    return () => {
      Object.keys(originalMethods).forEach(method => {
        console[method] = originalMethods[method];
      });
    };
  }

  static mockDocumentReady() {
    Object.defineProperty(document, 'readyState', {
      writable: true,
      value: 'complete'
    });
  }
}

/**
 * Assertion helpers for condition-based testing
 */
export class ConditionAssertions {
  /**
   * Assert that all conditions produce expected results
   * @param {Array} results - Array of results from different conditions
   * @param {Function} validator - Function to validate each result
   */
  static allConditionsShouldPass(results, validator) {
    results.forEach((result, index) => {
      expect(() => validator(result)).not.toThrow();
    });
  }

  /**
   * Assert that specific conditions fail as expected
   * @param {Array} results - Array of results
   * @param {Array} expectedFailures - Indices of expected failures
   * @param {Function} validator - Validation function
   */
  static expectedConditionsShouldFail(results, expectedFailures, validator) {
    results.forEach((result, index) => {
      if (expectedFailures.includes(index)) {
        expect(() => validator(result)).toThrow();
      } else {
        expect(() => validator(result)).not.toThrow();
      }
    });
  }

  /**
   * Assert condition-specific behaviors
   * @param {Object} conditionResults - Object mapping condition names to results
   * @param {Object} expectedBehaviors - Object mapping condition names to expected behaviors
   */
  static conditionSpecificBehaviors(conditionResults, expectedBehaviors) {
    Object.keys(expectedBehaviors).forEach(condition => {
      const result = conditionResults[condition];
      const expected = expectedBehaviors[condition];
      
      if (typeof expected === 'function') {
        expected(result);
      } else {
        expect(result).toEqual(expected);
      }
    });
  }
}

/**
 * Performance condition testing
 */
export class PerformanceConditions {
  static async measureExecutionTime(fn) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    return {
      result,
      executionTime: end - start
    };
  }

  static async testPerformanceUnderConditions(conditions, testFn) {
    const results = {};
    
    for (const [name, condition] of Object.entries(conditions)) {
      const measurement = await this.measureExecutionTime(() => testFn(condition));
      results[name] = measurement;
    }
    
    return results;
  }
}

/**
 * Helper function to create condition-based test suite
 * @param {string} suiteName - Name of the test suite
 * @param {Function} testFactory - Function that creates test subject
 * @param {Array} conditions - Array of condition definitions
 * @param {Function} testFunction - Function to run for each condition
 */
export function describeConditions(suiteName, testFactory, conditions, testFunction) {
  describe(`${suiteName} - Condition-Based Tests`, () => {
    conditions.forEach(({ name, setup, data, expected }) => {
      test(`should handle condition: ${name}`, async () => {
        const testSubject = testFactory();
        
        if (setup) {
          await setup(testSubject, data);
        }
        
        const result = await testFunction(testSubject, data);
        
        if (typeof expected === 'function') {
          expected(result, testSubject);
        } else {
          expect(result).toEqual(expected);
        }
      });
    });
  });
}