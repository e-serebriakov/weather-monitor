import { asyncAction } from '../../common/utils/api';
import { apiUrl, appID } from '../../../config';

export const GET_CURRENT_CITY_WEATHER = 'App/getWeatherByCoords';
export const SAVE_CITY_WEATHER_BY_NAME = 'App/saveCityWeatherByName';
export const UPDATE_SAVED_CITY_COLLECTION = 'App/updateSavedCityCollection';
export const SAVE_CITY_WEATHER_BY_CODE = 'App/saveCityWeatherByCode';
export const LOAD_SAVED_CITIES = 'App/loadSavedCities';

export function loadSavedCities(savedCityCollection) {
  return {
    type: LOAD_SAVED_CITIES,
    payload: savedCityCollection,
  };
}

export function getWeatherByCoords(coords) {
  return asyncAction({
    action: GET_CURRENT_CITY_WEATHER,
    method: 'GET',
    url: `${apiUrl}weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${appID}`,
  });
}

export function saveCityWeatherByName(data) {
  return asyncAction({
    action: SAVE_CITY_WEATHER_BY_NAME,
    method: 'GET',
    url: `${apiUrl}weather?q=${data.cityName},${data.countryCode}&units=metric&appid=${appID}`,
  });
}

export function saveCityWeatherByCode(cityID) {
  return asyncAction({
    action: SAVE_CITY_WEATHER_BY_CODE,
    method: 'GET',
    url: `${apiUrl}weather?id=${cityID}&units=metric&appid=${appID}`,
  });
}

export function updateSavedCityCollection(IDs) {
  return asyncAction({
    action: UPDATE_SAVED_CITY_COLLECTION,
    method: 'GET',
    url: `${apiUrl}group?id=${IDs}&units=metric&appid=${appID}`,
  });
}
