const getLocation = (fallback) => {
  return new Promise((resolve) => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 60000
    };

    if (!navigator.geolocation || process.env.NODE_ENV === 'development') return resolve(fallback);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({lat: coords.latitude, lng: coords.longitude}),
      () => resolve(fallback),
      options
    );
  });
}

export { getLocation };