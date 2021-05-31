import { request } from '../net/request';

const fetchAll = async (marker) => {
  return await request({
    method: 'GET',
    path: `/predefined_marker/${marker.id}/gallery`
  });
}

const upload = async (marker, photo, cb) => {
  try {
    const formData = new FormData();
    formData.append('photo', photo, photo.name);
    const resp = await request({
      method: 'POST',
      path: `/predefined_marker/${marker.id}/gallery`,
      data: formData,
      isFileUpload: true
    });
    cb(null, resp);
  } catch (err) {
    console.error(err);
    cb(err);
  }
}

const remove = async (marker, photoId) => {
  return await request({
    method: 'DELETE',
    path: `/predefined_marker/${marker.id}/gallery/${photoId}`
  });
}

export { fetchAll, upload, remove };