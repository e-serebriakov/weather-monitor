import {
  GET_CURRENT_CITY_WEATHER,
  SAVE_CITY_WEATHER_BY_NAME,
  UPDATE_SAVED_CITY_COLLECTION,
  SAVE_CITY_WEATHER_BY_CODE,
  LOAD_SAVED_CITIES,
} from './AppActions';

export function currentCity(state = null, action = {}) {
  switch (action.type) {
    case GET_CURRENT_CITY_WEATHER:
      if (action.response) {
        return {
          id: action.response.id,
          name: action.response.name,
          coords: action.response.coord,
          country: action.response.sys.country,
          temperature: action.response.main.temp,
          weather: action.response.weather[0].main,
          weatherDescription: action.response.weather[0].description,
        };
      }
      return state;
    default:
      return state;
  }
}

export function addedCity(state = null, action = {}) {
  switch (action.type) {
    case SAVE_CITY_WEATHER_BY_CODE:
    case SAVE_CITY_WEATHER_BY_NAME:
      if (action.response) {
        return {
          id: action.response.id,
          name: action.response.name,
          coords: action.response.coord,
          country: action.response.sys.country,
          temperature: action.response.main.temp,
          weather: action.response.weather[0].main,
          weatherDescription: action.response.weather[0].description,
        };
      }
      break;
    default:
      return state;
  }
}

export function savedCities(state = [], action = {}) {
  switch (action.type) {
    case LOAD_SAVED_CITIES:
      if (action.payload) {
        return action.payload;
      }
      return state;
    case UPDATE_SAVED_CITY_COLLECTION:
      if (action.response) {
        return action.response.list.map(city => {
          return {
            id: city.id,
            name: city.name,
            coords: city.coord,
            country: city.sys.country,
            temperature: city.main.temp,
            weather: city.weather[0].main,
            weatherDescription: city.weather[0].description,
          };
        });
      }
      break;
    default:
      return state;
  }
}
