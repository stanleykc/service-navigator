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
├── js/                     # Modular JavaScript components
│   ├── data.js            # Centralized HSDS service data
│   ├── dom-utils.js       # XSS-safe DOM manipulation utilities
│   └── map.js             # Standalone map implementation
├── ServiceNavigator.html   # Legacy prototype (reference)
└── src/                   # Legacy Svelte components (unused)
```

### Key Architecture Decisions

- **Zero Build Process**: Direct browser deployment using ES6 modules
- **Security First**: XSS-safe DOM manipulation, no `innerHTML` usage
- **CDN Dependencies**: External libraries loaded via CDN for simplicity
- **Single Source of Truth**: Centralized data management in `/js/data.js`

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
python3 -m http.server 8080

# Access application
open http://localhost:8080
```

### Code Organization

**Core Files:**
- `index.html` - Main application (540+ lines)
- `js/data.js` - Service data exports
- `js/dom-utils.js` - SafeDOM utility class
- `js/map.js` - Map implementation (standalone)

**Development Workflow:**
1. Edit `index.html` for UI/UX changes
2. Modify `js/data.js` for service data updates  
3. Use `js/dom-utils.js` patterns for new DOM elements
4. Test changes via local HTTP server

### Security Features

- **XSS Prevention**: SafeDOM utility prevents code injection
- **Input Sanitization**: Form inputs validated before processing
- **Safe DOM Manipulation**: No `innerHTML` usage throughout codebase
- **CSP Ready**: Content Security Policy compatible structure

### Adding New Services

1. **Update Data**: Add service objects to `js/data.js`
2. **Follow HSDS Format**: Ensure all required fields are present
3. **Test Filtering**: Verify services appear in appropriate categories
4. **Map Integration**: Include valid coordinates for map markers

Example:
```javascript
// In js/data.js
export const mockServices = [
  // ... existing services
  {
    id: 5,
    name: "New Community Service",
    organization: "Local Organization",
    // ... other required fields
    coordinates: [latitude, longitude]
  }
];
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

### Manual Testing Checklist

- [ ] Service filtering by category works
- [ ] Map markers display correctly
- [ ] Service detail modals open and display all information
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

- Use SafeDOM utility for all dynamic content
- Follow existing code organization patterns
- Maintain HSDS compliance for service data
- Test across multiple browsers and devices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Report bugs via GitHub Issues
- **Documentation**: See `CLAUDE.md` for detailed development guidance
- **Architecture Questions**: Review the Architecture section above

## 📈 Roadmap

- [ ] Real HSDS API integration
- [ ] Advanced search functionality
- [ ] User accounts and favorites
- [ ] Service provider dashboard
- [ ] Multi-language support
- [ ] Progressive Web App features

---

**Built with ❤️ for communities seeking better access to local services.**