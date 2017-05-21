export function asyncAction({ action, url, method, body }) {
  return (dispatch) => {
    dispatch({
      type: action,
      isFetching: true,
    });

    const headers = {};

    if (body) {
      headers['Content-type'] = 'application/json;charset=UTF-8';
    }

    const options = {
      method,
      credentials: 'same-origin',
      headers,
    };

    if (body) {
      options.body = body;
    }

    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw {
            status: response.status,
            statusText: response.statusText,
          };
        }
        return response.json();
      })
      .then(json => {
        return dispatch({
          type: action,
          isFetching: false,
          response: json,
        });
      })
      .catch(error => {
        if (error.status >= 500) {
          console.log('Error status >= 500');
        } else if (error.status === 401) {
          console.log('Error status === 401');
        }

        return dispatch({
          type: action,
          isFetching: false,
          error,
        });
      });
  };
}
