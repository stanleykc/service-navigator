# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Community Services Navigator web application that helps users search and discover local community services. The application displays services in a federated format compliant with Human Services Data Specification (HSDS) standards.

## Architecture

**Component-Based Pure HTML/JS Application:**
- **Primary Entry Point**: `index.html` - Main application with modular component integration
- **Service Layer**: DataService class for centralized data management and API abstraction
- **Component System**: Reusable components in `/js/components/` directory
- **Legacy File**: `ServiceNavigator.html` - Original prototype (for reference)
- **Data Layer**: HSDS-compliant service data with federation support
- **Styling**: Tailwind CSS via CDN
- **Map Integration**: Modular ServiceMap component with event-driven architecture

**Key Architecture Decisions:**
- **No Build Process**: Direct browser deployment using ES6 modules
- **Component-Driven**: Reusable, event-driven components for scalability
- **Security-First**: XSS-safe DOM manipulation, no innerHTML usage
- **Service Layer**: Centralized data operations with API-ready abstraction
- **CDN Dependencies**: Tailwind, Leaflet, Lucide Icons, Google Fonts

## Code Structure

**Core Files:**
- `index.html` - Main application with hamburger navigation, filtering, component integration
- `js/data-service.js` - DataService class for centralized data operations and API abstraction
- `js/data.js` - HSDS service data source (imported by DataService)
- `js/dom-utils.js` - SafeDOM class for XSS-safe element creation

**Component Architecture:**
- `js/components/service-map.js` - ServiceMap component for interactive map functionality

**Service Layer:**
- **DataService**: Centralized service data management with filtering, search, and CRUD operations
- **ServiceMap**: Event-driven map component with marker management and user interactions

**Data Model (HSDS Compliant):**
```javascript
{
  id, name, organization, address, distance, description, category, sourceOrg,
  contact: { phone, email, website },
  hours: { Monday: "9am-5pm", ... },
  eligibility, application, coordinates: [lat, lng]
}
```

**UI Sections:**
- **Browse**: Service filtering, results list, interactive map
- **Admin**: Dashboard placeholders for data source management
- **Contribute**: Form for adding new services

## Development Commands

**Local Development:**
```bash
# Start local server (required for ES6 modules)
python3 -m http.server 8080
# or
npm run dev  # Uses Vite server (legacy Svelte setup)

# Access application
open http://localhost:8080
```

**NPM Commands:**
```bash
npm start        # Start development server
npm run dev      # Same as npm start
```

## Security Considerations

- **XSS Prevention**: All dynamic content uses SafeDOM utility class
- **No innerHTML**: DOM manipulation via createElement/appendChild only  
- **Input Validation**: Form inputs should be sanitized before processing
- **CDN Integrity**: External dependencies loaded without SRI checks (consider adding)

## Development Notes

**Primary Workflow:**
1. Edit `index.html` for UI/UX changes and component integration
2. Use `js/data-service.js` for data operations and business logic
3. Modify `js/data.js` for raw service data updates
4. Create new components in `js/components/` for reusable functionality
5. Use `js/dom-utils.js` for safe DOM creation patterns
6. Test via local HTTP server (not file:// protocol due to ES6 modules)

**Data Federation:**
- Services include `sourceOrg` field for federation tracking
- DataService provides API-ready abstraction for multiple data sources
- Currently uses mock data via `js/data.js` - ready for API integration
- Built-in filtering, search, and CRUD operations through DataService

**Component Integration:**
- ServiceMap component provides event-driven map functionality
- Components communicate via custom event system
- Service interactions (clicks, hovers) trigger application events
- Category-based marker styling with configurable colors
- Safe popup creation via DOM elements, coordinates as `[lat, lng]` arrays

**Component Development:**
- Components in `js/components/` follow consistent API patterns
- Event-driven architecture for loose coupling
- Configuration-based styling and behavior
- Built-in error handling and resource cleanup

## Project Status

**Component-Based Architecture:**
- Pure HTML/JS with modular component system
- Zero build dependencies, direct browser deployment
- Service layer abstraction with DataService class
- Event-driven ServiceMap component for map functionality
- All legacy Svelte components and build tools removed
- Optimized for scalability and maintainability
- Total project size: ~1.3MB (down from 33MB+ with node_modules)

## Component APIs

**DataService:**
```javascript
// Initialization
await dataService.init()

// Data retrieval
dataService.getAllServices()
dataService.getServicesByCategories(categories)
dataService.getServiceById(id)
dataService.filterServices({ categories, sourceOrgs, keyword })

// Utilities
dataService.getCategories()
dataService.getStats()
```

**ServiceMap:**
```javascript
// Initialization
const map = createServiceMap('container-id', options)
await map.init()

// Data management
map.updateServices(services)
map.addService(service)
map.removeService(serviceId)

// Navigation
map.centerOnService(serviceId)
map.fitBounds(services)

// Events
map.on('service-click', callback)
map.on('map-ready', callback)
```
- remember the style guide and coding conventions for this project