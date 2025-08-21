module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Code style rules
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    
    // Best practices
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'eqeqeq': 'error',
    'curly': 'error',
    
    // ES6+ features
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    
    // Line length
    'max-len': ['error', { 
      'code': 100,
      'ignoreUrls': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true
    }]
  },
  globals: {
    // Browser globals
    'L': 'readonly',
    'lucide': 'readonly'
  }
};