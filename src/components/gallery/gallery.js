import './gallery.less';

import Splide from '@splidejs/splide';
import { fetchAll, upload, remove } from '../../services/gallery';

const renderPhoto = (photo) => `<li class="splide__slide" data-id="${photo.id}"><img src="${photo.url.regular}" width="280"></li>`;

const init = async ($el, marker) => {
  let photos = await fetchAll(marker);
  window.photos = photos;
  $el.style.display = 'block';

  const $content = $el.querySelector('.splide__list');
  $content.innerHTML = photos.map(renderPhoto).join('');

  const $gallery = $el.querySelector('.gallery');
  const splide = new Splide($gallery, { rewind: true }).mount();

  const updateGalleryVisibility = () => $gallery.style.display = photos.length ? 'block' : 'none';
  queueMicrotask(updateGalleryVisibility);

  const $upload = $el.querySelector('.upload');
  const $photo = $el.querySelector('#photo');
  const selectPhoto = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    $photo.dispatchEvent(event);
  };
  const onPhotoSelected = () => {
    for (const file of $photo.files) {
      upload(marker, file, uploadHandler);
    }
  }
  const onClickPhoto = async (e) => {
    if (e.target.tagName === 'IMG') {
      if (confirm('Delete?')) {
        const photoId = Number(e.target.parentElement.dataset.id);
        await remove(marker, photoId);
        e.target.parentElement.parentElement.removeChild(e.target.parentElement);
        photos = photos.filter(p => p.id !== photoId);
        splide.refresh();
        updateGalleryVisibility();
      }
    }
  }
  $upload.addEventListener('click', selectPhoto, false);
  $photo.addEventListener('change', onPhotoSelected, false);
  $gallery.addEventListener('click', onClickPhoto, false);

  const uploadHandler = (err, photo) => {
    if (err) {
      return alert('Error, try again later');
    }

    if (photo.predefinedMarkerId === marker.id) {
      photos.push(photo);
      $content.innerHTML += renderPhoto(photo);
      splide.refresh();
      updateGalleryVisibility();
    }
  }

  return () => {
    splide.destroy();
    $upload.removeEventListener('click', selectPhoto, false);
    $photo.removeEventListener('change', onPhotoSelected, false);
    $gallery.removeEventListener('click', onClickPhoto, false);
  }
}

export { init };