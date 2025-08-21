// DataService - Manages service data for the Community Services Navigator
// Provides a centralized interface for service data operations

import { mockServices } from './data.js';

export class DataService {
  constructor() {
    this.services = [];
    this.categories = new Set();
    this.sourceOrganizations = new Set();
    this.initialized = false;
  }

  // Initialize the service with data
  async init() {
    if (this.initialized) return;
    
    // Load services (currently from mock data, can be extended for API calls)
    this.services = [...mockServices];
    
    // Build category and source organization indices
    this.services.forEach(service => {
      this.categories.add(service.category);
      this.sourceOrganizations.add(service.sourceOrg);
    });
    
    this.initialized = true;
  }

  // Get all services
  getAllServices() {
    return [...this.services];
  }

  // Get services filtered by categories
  getServicesByCategories(categories) {
    if (!categories || categories.length === 0) {
      return this.getAllServices();
    }
    
    return this.services.filter(service => 
      categories.includes(service.category)
    );
  }

  // Get services filtered by source organizations
  getServicesBySourceOrgs(sourceOrgs) {
    if (!sourceOrgs || sourceOrgs.length === 0) {
      return this.getAllServices();
    }
    
    return this.services.filter(service => 
      sourceOrgs.includes(service.sourceOrg)
    );
  }

  // Search services by keyword (searches name, description, organization)
  searchServices(keyword) {
    if (!keyword || keyword.trim() === '') {
      return this.getAllServices();
    }
    
    const searchTerm = keyword.toLowerCase().trim();
    
    return this.services.filter(service => 
      service.name.toLowerCase().includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm) ||
      service.organization.toLowerCase().includes(searchTerm) ||
      service.address.toLowerCase().includes(searchTerm)
    );
  }

  // Get service by ID
  getServiceById(id) {
    return this.services.find(service => service.id == id);
  }

  // Get all unique categories
  getCategories() {
    return Array.from(this.categories).sort();
  }

  // Get all unique source organizations
  getSourceOrganizations() {
    return Array.from(this.sourceOrganizations).sort();
  }

  // Filter services with multiple criteria
  filterServices(filters = {}) {
    let filteredServices = this.getAllServices();
    
    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      filteredServices = filteredServices.filter(service =>
        filters.categories.includes(service.category)
      );
    }
    
    // Filter by source organizations
    if (filters.sourceOrgs && filters.sourceOrgs.length > 0) {
      filteredServices = filteredServices.filter(service =>
        filters.sourceOrgs.includes(service.sourceOrg)
      );
    }
    
    // Filter by keyword search
    if (filters.keyword && filters.keyword.trim() !== '') {
      const searchTerm = filters.keyword.toLowerCase().trim();
      filteredServices = filteredServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.organization.toLowerCase().includes(searchTerm) ||
        service.address.toLowerCase().includes(searchTerm)
      );
    }
    
    return filteredServices;
  }

  // Get services within a specific radius (if location filtering is needed)
  getServicesWithinRadius(centerLat, centerLng, radiusMiles) {
    return this.services.filter(service => {
      if (!service.coordinates) return false;
      
      const [lat, lng] = service.coordinates;
      const distance = this.calculateDistance(centerLat, centerLng, lat, lng);
      
      return distance <= radiusMiles;
    });
  }

  // Calculate distance between two coordinates in miles
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }

  // Helper method to convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Add a new service (for future use with API)
  async addService(serviceData) {
    // Validate required fields
    const requiredFields = ['name', 'organization', 'address', 'category'];
    for (const field of requiredFields) {
      if (!serviceData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Generate new ID
    const newId = Math.max(...this.services.map(s => s.id), 0) + 1;
    
    const newService = {
      id: newId,
      ...serviceData,
      // Set default values for optional fields
      distance: serviceData.distance || 'Unknown',
      sourceOrg: serviceData.sourceOrg || 'User Contributed',
      contact: serviceData.contact || {},
      hours: serviceData.hours || {},
      eligibility: serviceData.eligibility || 'Not specified',
      application: serviceData.application || 'Contact service for details'
    };
    
    this.services.push(newService);
    this.categories.add(newService.category);
    this.sourceOrganizations.add(newService.sourceOrg);
    
    // In a real implementation, this would make an API call
    return newService;
  }

  // Get statistics about the data
  getStats() {
    return {
      totalServices: this.services.length,
      totalCategories: this.categories.size,
      totalSourceOrgs: this.sourceOrganizations.size,
      servicesByCategory: this.getCategories().map(category => ({
        category,
        count: this.services.filter(s => s.category === category).length
      })),
      servicesBySourceOrg: this.getSourceOrganizations().map(org => ({
        organization: org,
        count: this.services.filter(s => s.sourceOrg === org).length
      }))
    };
  }
}

// Export a singleton instance for use throughout the application
export const dataService = new DataService();