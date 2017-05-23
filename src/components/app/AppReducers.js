import {
  ADD_CITY,
  LOAD_SAVED_CITIES,
  GET_CURRENT_CITY_WEATHER,
  SAVE_CITY_WEATHER_BY_CITY_NAME,
  SAVE_CITY_WEATHER_BY_CODE,
  UPDATE_SAVED_CITY_COLLECTION
} from './AppActions';

import { convertResponseToCityObject } from '../../common/utils/weatherResponseConvertor';

export function currentCity(state = null, action = {}) {
  switch (action.type) {
    case GET_CURRENT_CITY_WEATHER:
      if (action.response) {
        return convertResponseToCityObject(action);
      }
      return state;
    default:
      return state;
  }
}

export function addedCity(state = null, action = {}) {
  switch (action.type) {
    case SAVE_CITY_WEATHER_BY_CODE:
    case SAVE_CITY_WEATHER_BY_CITY_NAME:
      if (action.response) {
        return convertResponseToCityObject(action);
      }
      return state;
    default:
      return state;
  }
}

export function savedCities(state = [], action = {}) {
  switch (action.type) {
    case ADD_CITY:
      if (action.payload) {
        return [
          ...state,
          action.payload,
        ];
      }
      break;
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
      return state;
    default:
      return state;
  }
}
