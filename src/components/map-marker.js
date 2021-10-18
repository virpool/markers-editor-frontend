import { update, create, remove } from '../services/markers';
import { fetchAll as fetchSports } from '../services/sports';

import { show as showModal } from './modal';
import { init as initGallery } from './gallery';

const MAIN_DOMAIN = process.env.MAIN_DOMAIN;

let sports;
(async () => {
  sports = await fetchSports();
})();

const getSportNameById = (id) => {
  for (const sport of sports) {
    if (sport.id === id) return sport.name;
  }
  return 'default';
}

const nullableString = (str) => {
  if (!str || !str.length) return null;
  return str;
}

const createModal = (sportId, onSportSelected, onHide) => {
  const hideModal = showModal('#tmpl-create', () => {
    selectr.disable();
    if (onHide) onHide();
  });

  const $select = document.querySelector('#select-sport');
  for (const sport of sports) {
    const $el = document.createElement('option');
    $el.text = sport.normalizedName;
    $el.value = sport.id;
    $select.appendChild($el);
  }
  const selectr = new Selectr($select, {
    searchable: true,
    defaultSelected: false,
    width: 300,
    placeholder: 'Select sport...'
  });
  selectr.on('selectr.change', onSportSelected);
  if (sportId) {
    selectr.setValue(sportId);
  }

  return hideModal;
}

const addToMap = (map, markerData) => {
  const image = {
    url: `${MAIN_DOMAIN}/share_static/images/markers/${markerData.sportName}.svg`,
    size: new google.maps.Size(32, 32),
    scaledSize: new google.maps.Size(32, 32)
  };
  const mapMarker = new google.maps.Marker({
    position: { lat: markerData.lat, lng: markerData.lon },
    map,
    icon: image,
    optimized: true,
    draggable: true
  });
  makeMarkerEditable(map, mapMarker, markerData);
}

const makeMarkerEditable = (map, mapMarker, markerData) => {
  mapMarker.addListener('dragend', () => {
    markerData.lon = mapMarker.position.lng();
    markerData.lat = mapMarker.position.lat();
    update(markerData);
  });
  mapMarker.addListener('click', async () => {
    let $btnCreate;
    let sportId;

    const hideModal = createModal(markerData.sportId, (option) => {
      sportId = Number(option.value);
    }, () => {
      $btnCreate.removeEventListener('click', onClickCreate, false);
      $delete.removeEventListener('click', onClickRemove, false);
      destroyGallery();
    });
    const $modal = document.querySelector('.modal');
    $modal.querySelector('h3').textContent = 'Update marker';
    $modal.querySelector('#txt-marker-title').value = markerData.title;
    $modal.querySelector('#txt-marker-location').value = markerData.locationDisplayName;
    $modal.querySelector('#txt-marker-phone').value = markerData.phone;
    $modal.querySelector('#txt-marker-website').value = markerData.website;

    const destroyGallery = await initGallery($modal.querySelector('.gallery-widget'), markerData);

    const onClickCreate = async () => {
      $btnCreate.setAttribute('disabled', 'disabled');
      markerData.title = nullableString($modal.querySelector('#txt-marker-title').value);
      markerData.locationDisplayName = nullableString($modal.querySelector('#txt-marker-location').value);
      markerData.phone = nullableString($modal.querySelector('#txt-marker-phone').value);
      markerData.website = nullableString($modal.querySelector('#txt-marker-website').value);
      markerData.sportId = sportId;
      markerData.sportName = getSportNameById(sportId);
      await update(markerData);
      mapMarker.setMap(null);
      addToMap(map, markerData);

      hideModal();
    };

    const onClickRemove = async (e) => {
      e.preventDefault();

      if (!confirm('Are you sure')) return;
      await remove(markerData);
      mapMarker.setMap(null);

      hideModal();
    };

    const $delete = $modal.querySelector('.delete');
    $delete.style.display = 'block';
    $delete.addEventListener('click', onClickRemove, false);

    $btnCreate = $modal.querySelector('#btn-create');
    $btnCreate.textContent = 'Update';
    $btnCreate.removeAttribute('disabled');
    $btnCreate.addEventListener('click', onClickCreate, false);
  });
}

const createMarker = (map, latLng) => {
  let $btnCreate;
  let sportId;
  const hideModal = createModal(null, (option) => {
    sportId = Number(option.value);
    $btnCreate.removeAttribute('disabled');
  }, () => {
    $btnCreate.removeEventListener('click', onClickCreate, false);
  });
  $btnCreate = document.querySelector('#btn-create');

  const onClickCreate = async () => {
    $btnCreate.setAttribute('disabled', 'disabled');
    const marker = {
      sportId,
      title: nullableString(document.querySelector('#txt-marker-title').value),
      locationDisplayName: nullableString(document.querySelector('#txt-marker-location').value),
      phone: nullableString(document.querySelector('#txt-marker-phone').phone),
      website: nullableString(document.querySelector('#txt-marker-website').website),
      lon: latLng.lng(),
      lat: latLng.lat()
    };
    const { id, locationDisplayName } = await create(marker);
    marker.id = id;
    marker.locationDisplayName = locationDisplayName;
    marker.sportName = getSportNameById(sportId);
    addToMap(map, marker);

    hideModal();
  };

  $btnCreate.addEventListener('click', onClickCreate, false);
}

export { addToMap, createMarker };