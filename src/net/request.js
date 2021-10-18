const API_PATH = process.env.API_PATH;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const request = ({method, path, data = null, isFileUpload = false}) => {
  const options = {
    method,
    mode: 'cors',
    cache: 'no-cache',
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
    })
    .catch(() => alert('Network error'));
}

export { request };