# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Community Services Navigator web application that helps users search and discover local community services. The application displays services in a federated format compliant with Human Services Data Specification (HSDS) standards.

## Architecture

**Consolidated Pure HTML/JS Application:**
- **Primary Entry Point**: `index.html` - Main application with all functionality
- **Modular JavaScript**: `/js/` directory contains reusable modules
- **Legacy File**: `ServiceNavigator.html` - Original prototype (for reference)
- **Data Layer**: Centralized HSDS-compliant service data
- **Styling**: Tailwind CSS via CDN
- **Map Integration**: Leaflet.js for interactive service locations

**Key Architecture Decisions:**
- **No Build Process**: Direct browser deployment using ES6 modules
- **Security-First**: XSS-safe DOM manipulation, no innerHTML usage
- **Single Source of Truth**: Centralized data management
- **CDN Dependencies**: Tailwind, Leaflet, Lucide Icons, Google Fonts

## Code Structure

**Core Files:**
- `index.html` - Main application (544 lines) with hamburger navigation, filtering, map integration
- `js/data.js` - Centralized HSDS service data export
- `js/dom-utils.js` - SafeDOM class for XSS-safe element creation

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
1. Edit `index.html` for UI/UX changes
2. Modify `js/data.js` for service data updates
3. Use `js/dom-utils.js` for new DOM creation patterns
4. Test via local HTTP server (not file:// protocol due to modules)

**Data Federation:**
- Services include `sourceOrg` field for federation tracking
- Designed to aggregate from multiple HSDS-compliant data sources
- Currently uses mock data - ready for API integration

**Map Integration:**
- Leaflet markers use category-based colors
- Safe popup creation via DOM elements
- Coordinates stored as `[lat, lng]` arrays in service data

## Project Status

**Fully Consolidated:**
- Pure HTML/JS architecture with zero build dependencies
- All legacy Svelte components and build tools removed
- Optimized for direct browser deployment
- Total project size: ~1.3MB (down from 33MB+ with node_modules)