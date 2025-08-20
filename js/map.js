// Map functionality using Leaflet
// Replaces Svelte map component with pure JavaScript implementation

class ServiceMap {
  constructor(containerId, services = []) {
    this.containerId = containerId;
    this.services = services;
    this.map = null;
    this.markers = [];
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Map container ${this.containerId} not found`);
      return;
    }

    // Initialize map centered on Maryland Heights, MO
    this.map = L.map(this.containerId).setView([38.7190, -90.4218], 12);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.addServiceMarkers();
  }

  addServiceMarkers() {
    if (!this.map) return;
    
    // Clear existing markers
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    this.services.forEach(service => {
      if (service.coordinates) {
        const [lat, lng] = service.coordinates;
        
        // Category-based marker colors
        let categoryColor = '#6B7280'; // gray-500
        if (service.category === 'Food') categoryColor = '#059669'; // green-600
        if (service.category === 'Legal Aid') categoryColor = '#2563EB'; // blue-600
        if (service.category === 'Housing') categoryColor = '#D97706'; // yellow-600

        const marker = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: categoryColor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        });

        // Create safe popup content using DOM elements
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

        marker.bindPopup(popupDiv);
        marker.addTo(this.map);
        this.markers.push(marker);
      }
    });
  }

  updateServices(newServices) {
    this.services = newServices;
    this.addServiceMarkers();
  }

  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.markers = [];
  }
}