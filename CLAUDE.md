# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-file HTML application for a Community Services Navigator that helps users search and discover local community services. The application displays services in a federated format compliant with Human Services Data Specification (HSDS) standards.

## Architecture

**Single-Page Application Structure:**
- **Frontend**: Pure HTML/CSS/JavaScript with Tailwind CSS for styling
- **Data**: Mock HSDS-compliant service data embedded in JavaScript
- **UI Components**: 
  - Filter sidebar for search and category filtering
  - Results list with service cards
  - Map placeholder view
  - Modal for detailed service information
- **External Dependencies**:
  - Tailwind CSS (CDN)
  - Lucide Icons (CDN) 
  - Google Fonts (Inter font family)

## Key Components

**Main Application Structure (ServiceNavigator.html:41-145):**
- Header with navigation and user avatar
- Three-column layout: filters sidebar, results list, map view
- Responsive design that adapts to different screen sizes

**Data Model (ServiceNavigator.html:164-223):**
The mock data follows HSDS standards with services containing:
- Basic info: name, organization, address, description
- Contact details: phone, email, website
- Operating hours (day-by-day schedule)
- Eligibility requirements and application process
- Service category and data source attribution

**UI Logic (ServiceNavigator.html:225-331):**
- Dynamic result card generation
- Modal system for service details
- Search and filter functionality structure (UI-only, no backend)
- Icon rendering with Lucide library

## Development Notes

- This is a prototype/demo application with no build system or dependencies
- All functionality is client-side with embedded mock data
- No package.json, build tools, or test framework present
- Files can be opened directly in a browser for development
- The application is designed to demonstrate HSDS data federation concepts

## Common Tasks

**Development:**
- Open `ServiceNavigator.html` directly in browser to view/test
- No build or compilation step required

**Deployment:**
- Simply serve the HTML file from any web server
- All dependencies loaded via CDN