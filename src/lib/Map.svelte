<script>
  import { onMount } from 'svelte'
  import * as L from 'leaflet'

  export let services = []

  let mapContainer
  let map
  let markers = []

  onMount(() => {
    map = L.map(mapContainer).setView([38.7190, -90.4218], 12)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    addServiceMarkers()

    return () => {
      if (map) {
        map.remove()
      }
    }
  })

  function addServiceMarkers() {
    markers.forEach(marker => map.removeLayer(marker))
    markers = []

    services.forEach(service => {
      if (service.coordinates) {
        const [lat, lng] = service.coordinates
        
        let categoryColor = '#6B7280'
        if (service.category === 'Food') categoryColor = '#059669'
        if (service.category === 'Legal Aid') categoryColor = '#2563EB'
        if (service.category === 'Housing') categoryColor = '#D97706'

        const marker = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: categoryColor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        })

        const popupContent = `
          <div class="p-2">
            <h3 class="font-bold text-sm mb-1">${service.name}</h3>
            <p class="text-xs text-gray-600 mb-1">${service.organization}</p>
            <p class="text-xs mb-2">${service.description}</p>
            <div class="flex items-center justify-between">
              <span class="inline-block px-2 py-1 text-xs font-medium rounded-full" 
                    style="background-color: ${categoryColor}20; color: ${categoryColor}">
                ${service.category}
              </span>
              <span class="text-xs text-gray-500">${service.distance}</span>
            </div>
          </div>
        `

        marker.bindPopup(popupContent)
        marker.addTo(map)
        markers.push(marker)
      }
    })
  }

  $: if (map && services) {
    addServiceMarkers()
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<div bind:this={mapContainer} class="w-full h-full"></div>

<style>
  :global(.leaflet-popup-content) {
    margin: 0 !important;
  }
</style>