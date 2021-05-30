import { request } from '../net/request';

const create = async (marker) => {
  return await request({
    method: 'POST',
    path: '/predefined_marker',
    data: marker
  });
}

const remove = async (marker) => {
  return await request({
    method: 'DELETE',
    path: '/predefined_marker/' + marker.id
  });
}

const fetchAll = async () => {
  return await request({
    method: 'GET',
    path: '/predefined_marker'
  });
}

const update = async (marker) => {
  return await request({
    method: 'PUT',
    path: '/predefined_marker',
    data: marker
  });
}

export { create, remove, fetchAll, update };