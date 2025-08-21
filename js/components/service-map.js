// ServiceMap Component - Interactive map for displaying community services
// Provides a reusable, event-driven map component with HSDS service integration

export class ServiceMap {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.services = [];
        this.map = null;
        this.markers = [];
        this.eventListeners = new Map();
        
        // Default configuration
        this.config = {
            defaultCenter: [38.7190, -90.4218], // Maryland Heights, MO
            defaultZoom: 12,
            minZoom: 8,
            maxZoom: 18,
            
            categoryColors: {
                'Food': '#059669',
                'Legal Aid': '#2563EB',
                'Housing': '#D97706',
                'Healthcare': '#DC2626',
                'default': '#6B7280'
            },
            
            markerRadius: 8,
            markerWeight: 2,
            markerOpacity: 1,
            markerFillOpacity: 0.8,
            
            tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            tileAttribution: '© OpenStreetMap contributors',
            
            enablePopups: true,
            enableClustering: false,
            clusterThreshold: 10,
            
            ...options
        };
    }

    // Initialize the map
    async init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Map container ${this.containerId} not found`);
            return false;
        }

        try {
            // Create Leaflet map
            this.map = L.map(this.containerId).setView(
                this.config.defaultCenter, 
                this.config.defaultZoom
            );

            // Set zoom limits
            this.map.setMinZoom(this.config.minZoom);
            this.map.setMaxZoom(this.config.maxZoom);

            // Add tile layer
            L.tileLayer(this.config.tileLayer, {
                attribution: this.config.tileAttribution
            }).addTo(this.map);

            // Add map event listeners
            this.map.on('zoomend', () => this.emit('zoom-changed', this.map.getZoom()));
            this.map.on('moveend', () => this.emit('bounds-changed', this.map.getBounds()));

            // Add service markers if services were provided
            if (this.services.length > 0) {
                this.addServiceMarkers();
            }

            this.emit('map-ready');
            return true;
        } catch (error) {
            console.error('Failed to initialize map:', error);
            this.emit('map-error', error);
            return false;
        }
    }

    // Destroy the map and clean up resources
    destroy() {
        if (this.map) {
            this.clearMarkers();
            this.map.remove();
            this.map = null;
        }
        this.eventListeners.clear();
    }

    // Update services and refresh markers
    updateServices(services) {
        this.services = Array.isArray(services) ? [...services] : [];
        
        if (this.map) {
            this.addServiceMarkers();
        }
        
        this.emit('services-updated', this.services);
    }

    // Add a single service
    addService(service) {
        if (!service || this.services.find(s => s.id === service.id)) {
            return false;
        }
        
        this.services.push(service);
        
        if (this.map) {
            this.addSingleMarker(service);
        }
        
        this.emit('service-added', service);
        return true;
    }

    // Remove a service by ID
    removeService(serviceId) {
        const index = this.services.findIndex(s => s.id === serviceId);
        if (index === -1) return false;
        
        const removedService = this.services.splice(index, 1)[0];
        
        // Remove corresponding marker
        const markerIndex = this.markers.findIndex(m => m.serviceId === serviceId);
        if (markerIndex >= 0 && this.map) {
            this.map.removeLayer(this.markers[markerIndex]);
            this.markers.splice(markerIndex, 1);
        }
        
        this.emit('service-removed', removedService);
        return true;
    }

    // Center map on a specific service
    centerOnService(serviceId) {
        const service = this.services.find(s => s.id === serviceId);
        if (!service || !service.coordinates || !this.map) {
            return false;
        }
        
        const [lat, lng] = service.coordinates;
        this.map.setView([lat, lng], Math.max(this.config.defaultZoom, this.map.getZoom()));
        
        this.emit('service-centered', service);
        return true;
    }

    // Fit map bounds to show all services
    fitBounds(services = null) {
        const servicesToFit = services || this.services;
        const servicesWithCoords = servicesToFit.filter(s => s.coordinates);
        
        if (servicesWithCoords.length === 0 || !this.map) {
            return false;
        }
        
        if (servicesWithCoords.length === 1) {
            const [lat, lng] = servicesWithCoords[0].coordinates;
            this.map.setView([lat, lng], this.config.defaultZoom);
        } else {
            const bounds = L.latLngBounds(servicesWithCoords.map(s => s.coordinates));
            this.map.fitBounds(bounds, { padding: [20, 20] });
        }
        
        return true;
    }

    // Set map zoom level
    setZoom(level) {
        if (this.map && level >= this.config.minZoom && level <= this.config.maxZoom) {
            this.map.setZoom(level);
            return true;
        }
        return false;
    }

    // Get current map center and zoom
    getView() {
        if (!this.map) return null;
        
        const center = this.map.getCenter();
        return {
            lat: center.lat,
            lng: center.lng,
            zoom: this.map.getZoom()
        };
    }

    // Clear all markers
    clearMarkers() {
        if (this.map) {
            this.markers.forEach(marker => this.map.removeLayer(marker));
        }
        this.markers = [];
    }

    // Add markers for all services
    addServiceMarkers() {
        if (!this.map) return;
        
        this.clearMarkers();
        
        this.services.forEach(service => {
            this.addSingleMarker(service);
        });
    }

    // Add a single service marker
    addSingleMarker(service) {
        if (!service.coordinates || !this.map) return null;
        
        const [lat, lng] = service.coordinates;
        const categoryColor = this.getCategoryColor(service.category);
        
        const marker = L.circleMarker([lat, lng], {
            radius: this.config.markerRadius,
            fillColor: categoryColor,
            color: '#ffffff',
            weight: this.config.markerWeight,
            opacity: this.config.markerOpacity,
            fillOpacity: this.config.markerFillOpacity
        });

        // Store service ID for reference
        marker.serviceId = service.id;
        
        // Add popup if enabled
        if (this.config.enablePopups) {
            const popup = this.createServicePopup(service);
            marker.bindPopup(popup);
        }
        
        // Add click event
        marker.on('click', (e) => {
            this.emit('service-click', service, e);
        });
        
        // Add hover events
        marker.on('mouseover', (e) => {
            this.emit('service-hover', service, e);
        });
        
        marker.on('mouseout', (e) => {
            this.emit('service-hover-end', service, e);
        });
        
        marker.addTo(this.map);
        this.markers.push(marker);
        
        return marker;
    }

    // Create popup content for a service
    createServicePopup(service) {
        const popupDiv = document.createElement('div');
        popupDiv.className = 'p-2';

        const title = document.createElement('h3');
        title.className = 'font-bold text-sm mb-1';
        title.textContent = service.name;

        const org = document.createElement('p');
        org.className = 'text-xs text-gray-600 mb-1';
        org.textContent = service.organization;

        const desc = document.createElement('p');
        desc.className = 'text-xs mb-2';
        desc.textContent = service.description;

        const footer = document.createElement('div');
        footer.className = 'flex items-center justify-between';

        const categoryBadge = document.createElement('span');
        categoryBadge.className = 'inline-block px-2 py-1 text-xs font-medium rounded-full';
        const categoryColor = this.getCategoryColor(service.category);
        categoryBadge.style.backgroundColor = categoryColor + '20';
        categoryBadge.style.color = categoryColor;
        categoryBadge.textContent = service.category;

        const distance = document.createElement('span');
        distance.className = 'text-xs text-gray-500';
        distance.textContent = service.distance;

        footer.appendChild(categoryBadge);
        footer.appendChild(distance);

        popupDiv.appendChild(title);
        popupDiv.appendChild(org);
        popupDiv.appendChild(desc);
        popupDiv.appendChild(footer);

        return popupDiv;
    }

    // Get category color
    getCategoryColor(category) {
        return this.config.categoryColors[category] || this.config.categoryColors.default;
    }

    // Set custom marker style for a category
    setMarkerStyle(category, style) {
        this.config.categoryColors[category] = style.color || style;
        
        // Update existing markers of this category
        this.markers.forEach(marker => {
            const service = this.services.find(s => s.id === marker.serviceId);
            if (service && service.category === category) {
                marker.setStyle({ fillColor: this.getCategoryColor(category) });
            }
        });
    }

    // Set default map view
    setDefaultView(lat, lng, zoom) {
        this.config.defaultCenter = [lat, lng];
        this.config.defaultZoom = zoom;
        
        if (this.map) {
            this.map.setView([lat, lng], zoom);
        }
    }

    // Event system
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (!this.eventListeners.has(event)) return;
        
        const listeners = this.eventListeners.get(event);
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    // Emit event to all listeners
    emit(event, ...args) {
        if (!this.eventListeners.has(event)) return;
        
        this.eventListeners.get(event).forEach(callback => {
            try {
                callback(...args);
            } catch (error) {
                console.error(`Error in ${event} event listener:`, error);
            }
        });
    }

    // Get map statistics
    getStats() {
        return {
            totalMarkers: this.markers.length,
            visibleServices: this.services.length,
            mapCenter: this.getView(),
            bounds: this.map ? this.map.getBounds() : null
        };
    }

    // Resize map (useful for responsive layouts)
    resize() {
        if (this.map) {
            this.map.invalidateSize();
        }
    }

    // Get services currently visible in map viewport
    getVisibleServices() {
        if (!this.map) return [];
        
        const bounds = this.map.getBounds();
        return this.services.filter(service => {
            if (!service.coordinates) return false;
            const [lat, lng] = service.coordinates;
            return bounds.contains([lat, lng]);
        });
    }
}

// Export singleton factory function for easy integration
export function createServiceMap(containerId, options = {}) {
    return new ServiceMap(containerId, options);
}