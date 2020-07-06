function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  console.log(response);
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

export function request(url, options = {}) {
  const jwt = localStorage.getItem("jwt");
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    }
  })
    .then(checkStatus)
    .then(parseJSON);
}
