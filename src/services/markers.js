import { request } from '../net/request';

const API_ENDPOINT = '/predefined_marker';

const create = async (marker) => {
  return await request({
    method: 'POST',
    path: API_ENDPOINT,
    data: marker
  });
}

const remove = async (marker) => {
  return await request({
    method: 'DELETE',
    path: API_ENDPOINT + '/' + marker.id
  });
}

const fetchAll = async () => {
  return await request({
    method: 'GET',
    path: API_ENDPOINT
  });
}

const update = async (marker) => {
  return await request({
    method: 'PUT',
    path: API_ENDPOINT,
    data: marker
  });
}

export { create, remove, fetchAll, update };