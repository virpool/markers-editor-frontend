import { request } from '../net/request';

const fetchAll = async () => {
  const sports = await request({
    method: 'GET',
    path: '/sports'
  });
  return sports
    .map(sport => {
      sport.normalizedName = sport.name.charAt(0).toUpperCase() +
                      sport.name.substring(1).replace(/_/g, ' ');
      return sport;
    });
}

export { fetchAll };