import { fetchAll, update } from '../services/markers';
import { getLocation } from '../services/location';
import { addToMap, createMarker } from '../components/map-marker';
import { createAutocomplete } from '../components/autocomplete-map';

const create = async ($el) => {
  const map = new google.maps.Map($el, {
    zoom: 14,
    disableDoubleClickZoom: true,
    center: await getLocation({
      lat: Number(process.env.FALLBACK_LATITUDE),
      lng: Number(process.env.FALLBACK_LONGITUDE)
    })
  });

  const markers = await fetchAll();
  for (const marker of markers) {
    addToMap(map, marker);
  }
  map.addListener('dblclick', (mapsMouseEvent) => createMarker(map, mapsMouseEvent.latLng));

  createAutocomplete(map, document.querySelector('#search'));
}

export { create };