const API_PATH = process.env.API_PATH;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const request = ({method, path, data = null, isFileUpload = false}) => {
  const options = {
    method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + AUTH_TOKEN
    }
  };
  if (isFileUpload) {
    delete options.headers['Content-Type'];
  }
  if (data) {
    options.body = isFileUpload ? data : JSON.stringify(data)
  }
  return fetch(API_PATH + path, options)
    .then(resp => {
      if (resp.status !== 204) {
        return resp.json();
      }
      return Promise.resolve();
    })
    .catch(() => alert('Network error'));
}

export { request };