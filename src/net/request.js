const API_PATH = process.env.API_PATH;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const request = ({method, path, data = null}) => {
  const options = {
    method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + AUTH_TOKEN
    }
  };
  if (data) {
    options.body = JSON.stringify(data) // body data type must match "Content-Type" header
  }
  return fetch(API_PATH + path, options).then(resp => {
    if (resp.status !== 204) {
      return resp.json();
    }
    return Promise.resolve();
  });
}

export { request };