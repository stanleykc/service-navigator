# Community Services Navigator

A federated web application for discovering and accessing local community services, built with HSDS (Human Services Data Specification) compliance in mind.

## 🌟 Features

- **Service Discovery**: Browse and filter community services by category (Food, Housing, Legal Aid, Healthcare)
- **Interactive Map**: View service locations with detailed popups
- **Detailed Information**: Access comprehensive service details including hours, eligibility, and contact information
- **Multi-Source Federation**: Designed to aggregate data from multiple HSDS-compliant sources
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Built with semantic HTML and keyboard navigation support

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server) or any static file server

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/stanleykc/service-navigator.git
   cd service-navigator
   ```

2. **Start the development server**
   ```bash
   # Using Python (recommended)
   python3 -m http.server 8080
   
   # Or using Node.js (if you have it installed)
   npx serve . -p 8080
   ```

3. **Open in browser**
   ```
   http://localhost:8080
   ```

That's it! No build process, no dependencies to install.

## 🏗️ Architecture

### Overview

The Service Navigator uses a **consolidated pure HTML/JavaScript architecture** designed for simplicity, security, and maintainability.

```
service-navigator/
├── index.html              # Main application entry point
├── js/                     # Modular JavaScript architecture
│   ├── components/         # Reusable component system
│   │   └── service-map.js  # ServiceMap component with event-driven architecture
│   ├── data-service.js     # DataService class for centralized data operations
│   ├── data.js            # HSDS service data source
│   └── dom-utils.js       # SafeDOM class for XSS-safe DOM manipulation
├── package.json           # NPM configuration with lint/format scripts
└── .eslintrc.json         # ESLint configuration for code quality
```

### Key Architecture Decisions

- **Zero Build Process**: Direct browser deployment using ES6 modules
- **Component-Driven**: Reusable, event-driven components for scalability
- **Service Layer**: Centralized data operations with DataService abstraction
- **Security First**: XSS-safe DOM manipulation via SafeDOM class
- **CDN Dependencies**: External libraries loaded via CDN for simplicity

### Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6 modules)
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Lucide Icons (CDN)
- **Maps**: Leaflet.js (CDN)
- **Fonts**: Google Fonts (Inter)

## 📊 Data Model

The application follows the Human Services Data Specification (HSDS) standard:

```javascript
{
  id: 1,
  name: "Community Food Pantry",
  organization: "Maryland Heights Community Center",
  address: "2344 McKelvey Rd, Maryland Heights, MO 63043",
  distance: "1.2 mi",
  description: "Service description...",
  category: "Food",
  sourceOrg: "Alpha Org",
  contact: {
    phone: "(314) 555-1234",
    email: "contact@example.org",
    website: "example.org"
  },
  hours: {
    Monday: "9am - 3pm",
    Tuesday: "9am - 3pm",
    // ... other days
  },
  eligibility: "Eligibility requirements...",
  application: "How to apply...",
  coordinates: [38.7190, -90.4218] // [latitude, longitude]
}
```

## 🔧 Component APIs

### DataService

The DataService class provides centralized data operations:

```javascript
// Initialization
import { DataService } from './js/data-service.js';
const dataService = new DataService();
await dataService.init();

// Data retrieval
const allServices = dataService.getAllServices();
const healthServices = dataService.getServicesByCategories(['Healthcare']);
const service = dataService.getServiceById(1);
const filtered = dataService.filterServices({ 
  categories: ['Food'], 
  sourceOrgs: ['Alpha Org'],
  keyword: 'pantry' 
});

// Utilities
const categories = dataService.getCategories();
const stats = dataService.getStats();
```

### ServiceMap Component

The ServiceMap component provides interactive map functionality:

```javascript
// Initialization
import { createServiceMap } from './js/components/service-map.js';
const map = createServiceMap('map-container', {
  defaultZoom: 12,
  markerRadius: 8,
  categoryColors: { Food: '#10b981', Healthcare: '#3b82f6' }
});
await map.init();

// Data management
map.updateServices(services);
map.addService(newService);
map.removeService(serviceId);

// Navigation
map.centerOnService(serviceId);
map.fitBounds(services);

// Events
map.on('service-click', (serviceId) => console.log('Clicked:', serviceId));
map.on('map-ready', () => console.log('Map initialized'));
```

## 🎨 User Interface

### Main Sections

1. **Browse** (Default)
   - Service filtering by category and data source
   - Results list with service cards
   - Interactive map with service markers

2. **Admin** (Placeholder)
   - Data source management dashboard
   - System configuration panels

3. **Contribute**
   - Form for adding new services
   - Community contribution workflow

### Navigation

- **Hamburger Menu**: Access different application sections
- **Filter Sidebar**: Category and source filtering
- **Service Cards**: Click for detailed modal information
- **Map Markers**: Click for popup service summaries

## 🛠️ Development

### Local Development

```bash
# Start local server (required for ES6 modules)
npm run dev
# or
python3 -m http.server 8080

# Install dependencies for linting/formatting
npm install

# Run linting and formatting
npm run lint
npm run format
```

### Code Organization

**Core Files:**
- `index.html` - Main application with component integration
- `js/data-service.js` - DataService class for centralized data operations
- `js/data.js` - HSDS service data source (imported by DataService)
- `js/dom-utils.js` - SafeDOM class for XSS-safe element creation
- `js/components/service-map.js` - ServiceMap component for interactive maps

**Development Workflow:**
1. Edit `index.html` for UI/UX changes and component integration
2. Use `js/data-service.js` for data operations and business logic
3. Modify `js/data.js` for raw service data updates
4. Create new components in `js/components/` for reusable functionality
5. Use `js/dom-utils.js` for safe DOM creation patterns
6. Test via local HTTP server and run `npm run lint` before committing

### Security Features

- **XSS Prevention**: SafeDOM utility prevents code injection
- **Input Sanitization**: Form inputs validated before processing
- **Safe DOM Manipulation**: No `innerHTML` usage throughout codebase
- **CSP Ready**: Content Security Policy compatible structure

### Adding New Services

1. **Update Data**: Add service objects to `js/data.js`
2. **Follow HSDS Format**: Ensure all required fields are present
3. **Use DataService**: Access via DataService class methods
4. **Test Filtering**: Verify services appear in appropriate categories
5. **Map Integration**: Include valid coordinates as `[lat, lng]` arrays

Example:
```javascript
// In js/data.js
export const mockServices = [
  // ... existing services
  {
    id: 5,
    name: "New Community Service",
    organization: "Local Organization",
    category: "Healthcare",
    sourceOrg: "Alpha Org",
    // ... other required fields
    coordinates: [38.7190, -90.4218] // [latitude, longitude]
  }
];

// Access via DataService
import { DataService } from './js/data-service.js';
const dataService = new DataService();
await dataService.init();
const newService = dataService.getServiceById(5);
```

## 🌐 Deployment

### Static Hosting

The application can be deployed to any static hosting service:

- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Connect repository for automatic deployment
- **Vercel**: Zero-config deployment
- **AWS S3**: Static website hosting
- **Traditional Web Server**: Upload files to web root

### Production Considerations

1. **CDN Performance**: Consider local hosting of external dependencies
2. **HTTPS Required**: Geolocation features require secure context
3. **Content Security Policy**: Add CSP headers for enhanced security
4. **Caching**: Implement appropriate cache headers for static assets

## 🧪 Testing

### Automated Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run condition-based tests only
npm run test:conditions

# Run linting
npm run lint

# Run code formatting check
npm run format:check

# Fix formatting issues
npm run format
```

### Manual Testing Checklist

- [ ] Service filtering by category works
- [ ] Map markers display correctly with proper categories
- [ ] Service detail modals open and display all information
- [ ] ServiceMap component events trigger correctly
- [ ] DataService filtering and search functions work
- [ ] Responsive design works on mobile
- [ ] Hamburger menu navigation functions
- [ ] External links in contact information work

### Browser Compatibility

- Chrome 80+ ✅
- Firefox 75+ ✅
- Safari 13+ ✅
- Edge 80+ ✅

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Make changes following the security and architecture patterns**
4. **Test locally using the development server**
5. **Submit a pull request**

### Code Standards

- Use SafeDOM class for all dynamic content creation
- Follow component-driven architecture patterns
- Use DataService class for all data operations
- Maintain HSDS compliance for service data
- Run `npm run lint` and `npm run format` before committing
- Test across multiple browsers and devices
- Follow event-driven architecture for component communication

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Report bugs via GitHub Issues
- **Documentation**: See `CLAUDE.md` for detailed development guidance
- **Architecture Questions**: Review the Architecture section above

## 📈 Roadmap

### Completed ✅
- [x] Component-driven architecture with ServiceMap component
- [x] DataService class for centralized data operations
- [x] Event-driven component communication
- [x] Code quality tools (ESLint, Prettier)
- [x] XSS-safe DOM manipulation with SafeDOM class

### Planned 📋
- [ ] Real HSDS API integration via DataService
- [ ] Advanced search functionality with filters
- [ ] User accounts and favorites system
- [ ] Service provider dashboard
- [ ] Multi-language support
- [ ] Progressive Web App features
- [ ] Additional reusable components (ServiceCard, FilterPanel)

---

**Built with ❤️ for communities seeking better access to local services.**