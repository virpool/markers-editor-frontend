const IS_DEV = process.env.NODE_ENV === 'development';

const getLocation = (fallback) => {
  return new Promise((resolve) => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 60000
    };

    if (!navigator.geolocation || IS_DEV) return resolve(fallback);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({lat: coords.latitude, lng: coords.longitude}),
      () => resolve(fallback),
      options
    );
  });
}

export { getLocation };