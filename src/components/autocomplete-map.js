const createAutocomplete = (map, $search) => {
  $search.style.display = 'block';
  const autocomplete = new google.maps.places.Autocomplete($search);
  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    map.panTo(autocomplete.getPlace().geometry.location);
  });
}

export { createAutocomplete };