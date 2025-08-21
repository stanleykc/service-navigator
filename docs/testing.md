# Testing Guide

This project includes a comprehensive unit testing framework with condition-based testing capabilities.

## Testing Framework

- **Jest**: Primary testing framework
- **jsdom**: Browser environment simulation
- **Babel**: ES6 module transformation
- **Condition-Based Testing**: Custom utilities for testing multiple scenarios

## Test Structure

```
tests/
├── setup.js                           # Global test configuration
├── utils/
│   └── condition-tester.js           # Condition-based testing utilities
├── unit/                             # Unit tests for individual components
│   ├── dom-utils.test.js            # SafeDOM class tests
│   ├── data-service.test.js         # DataService class tests
│   └── service-map.test.js          # ServiceMap component tests
└── conditions/                      # Integration and condition-based tests
    └── integration-conditions.test.js # Cross-component integration tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only condition-based tests
npm run test:conditions

# Run specific test file
npm test -- --testPathPattern=dom-utils

# Run tests matching a pattern
npm test -- --testNamePattern="condition"
```

## Condition-Based Testing

This project uses a custom condition-based testing system that allows testing components under various scenarios:

### Basic Usage

```javascript
import { ConditionTester, DataConditions } from '../utils/condition-tester.js';

const tester = new ConditionTester(component)
  .when('normal data', () => normalData)
  .when('empty data', () => [])
  .when('malformed data', () => malformedData);

await tester.testAll((component, conditionName) => {
  // Test logic here
});
```

### Data Condition Generators

```javascript
// Generate different data states
DataConditions.emptyArray()                    // []
DataConditions.singleItem(item)               // [item]
DataConditions.withNullValues(data, fields)   // Data with null fields
DataConditions.withMissingFields(data, fields) // Data with missing fields
DataConditions.withInvalidData(data, invalid) // Data with invalid values
```

### Descriptive Test Patterns

```javascript
describeConditions(
  'ComponentName',
  () => createTestSubject(),
  [
    {
      name: 'valid input',
      data: validData,
      expected: result => expect(result).toBeDefined()
    },
    {
      name: 'invalid input',
      data: invalidData,
      expected: result => expect(result).toThrow()
    }
  ],
  (subject, data) => subject.method(data)
);
```

## Test Coverage

### SafeDOM Tests
- XSS prevention verification
- DOM element creation safety
- Null/undefined handling
- Performance with large data
- Category color mapping

### DataService Tests
- Data initialization
- Service filtering and search
- CRUD operations
- Performance with large datasets
- Concurrent operation handling
- Error condition management

### ServiceMap Tests
- Map initialization under various conditions
- Service marker management
- Event system functionality
- Navigation and view controls
- Memory management and cleanup
- Performance optimization

### Integration Tests
- Component interaction verification
- State synchronization testing
- Error propagation isolation
- Performance under integrated load
- Cross-component event handling

## Mocking Strategy

### Browser APIs
```javascript
// Leaflet map mocking
global.L = {
  map: jest.fn().mockReturnValue(mockMapInstance),
  circleMarker: jest.fn().mockReturnValue(mockMarker),
  // ... other Leaflet APIs
};

// DOM mocking
global.document = {
  getElementById: jest.fn().mockReturnValue(mockElement),
  createElement: jest.fn().mockReturnValue(mockElement)
};
```

### Module Mocking
```javascript
// Mock data imports
jest.mock('../../js/data.js', () => ({
  mockServices: [/* test data */]
}));
```

## Performance Testing

Performance conditions are automatically tested:

```javascript
const results = await PerformanceConditions.testPerformanceUnderConditions(
  testScenarios,
  testFunction
);

// Assert performance thresholds
Object.values(results).forEach(({ executionTime }) => {
  expect(executionTime).toBeLessThan(100); // 100ms threshold
});
```

## Error Condition Testing

Test error scenarios systematically:

```javascript
const errorConditions = [
  { input: null, shouldThrow: true },
  { input: undefined, shouldThrow: true },
  { input: validData, shouldThrow: false }
];

test.each(errorConditions)(
  'should handle error condition: $input',
  ({ input, shouldThrow }) => {
    if (shouldThrow) {
      expect(() => component.method(input)).toThrow();
    } else {
      expect(() => component.method(input)).not.toThrow();
    }
  }
);
```

## Best Practices

### Test Organization
1. **Group by functionality**: Organize tests by component methods/features
2. **Use descriptive names**: Test names should clearly indicate what's being tested
3. **Separate unit and integration**: Keep unit tests focused, integration tests comprehensive

### Condition Testing
1. **Cover edge cases**: Test null, undefined, empty, and malformed data
2. **Test error conditions**: Verify proper error handling
3. **Performance testing**: Include performance assertions for critical paths
4. **State consistency**: Verify component state remains consistent

### Mocking
1. **Mock external dependencies**: Don't test third-party libraries
2. **Use realistic mocks**: Mocks should behave like real implementations
3. **Reset mocks**: Clear mocks between tests to avoid interference

### Coverage Goals
- **Functions**: 90%+ coverage
- **Branches**: 85%+ coverage
- **Lines**: 90%+ coverage
- **Critical paths**: 100% coverage

## Custom Assertions

The framework includes custom assertion helpers:

```javascript
// Test all conditions pass
ConditionAssertions.allConditionsShouldPass(results, validator);

// Test specific conditions fail
ConditionAssertions.expectedConditionsShouldFail(results, [0, 2], validator);

// Test condition-specific behaviors
ConditionAssertions.conditionSpecificBehaviors(results, expectedBehaviors);
```

## Continuous Integration

Tests are designed to run in CI environments:

```bash
# Run tests with coverage and output
npm run test:coverage

# Tests should complete in under 30 seconds
# All tests should pass before merge
# Coverage reports are generated in ./coverage/
```

## Debugging Tests

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test with debugging
npm test -- --testNamePattern="specific test" --verbose

# Generate detailed coverage report
npm run test:coverage -- --verbose
```

## Adding New Tests

1. **Create test file**: Follow naming convention `*.test.js`
2. **Use condition-based patterns**: Leverage existing utilities
3. **Include performance tests**: For new components or critical paths
4. **Mock dependencies**: Keep tests isolated
5. **Update documentation**: Add any new patterns or utilities

## Test Configuration

Key configuration in `jest.config.js`:
- **testEnvironment**: 'jsdom' for browser simulation
- **setupFilesAfterEnv**: Global test setup
- **collectCoverageFrom**: Coverage scope definition
- **testTimeout**: 10 second timeout for async operations

This comprehensive testing approach ensures code reliability, performance, and maintainability while providing detailed feedback on component behavior under various conditions.