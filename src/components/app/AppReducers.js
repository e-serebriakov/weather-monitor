import {
  GET_CURRENT_CITY_WEATHER,
  SAVE_CITY_WEATHER_BY_NAME,
  SAVE_CITY_WEATHER_BY_CODE,
  GET_CITY_WEATHER_BY_CODE,
  LOAD_SAVED_CITIES,
} from './AppActions';

export function currentCity(state = null, action = {}) {
  switch (action.type) {
    case GET_CURRENT_CITY_WEATHER:
      if (action.response) {
        return {
          id: action.response.id,
          name: action.response.name,
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

export function savedCities(state = [], action = {}) {
  const savedCityCollection = JSON.parse(localStorage.getItem('savedCities')) || [];
  switch (action.type) {
    case LOAD_SAVED_CITIES:
      if (action.payload) {
        return action.payload;
      }
      break;
    case SAVE_CITY_WEATHER_BY_NAME:
    case SAVE_CITY_WEATHER_BY_CODE:
      if (action.response) {
        const cityData = {
          id: action.response.id,
          name: action.response.name,
          country: action.response.sys.country,
          temperature: action.response.main.temp,
          weather: action.response.weather[0].main,
          weatherDescription: action.response.weather[0].description,
        };
        const newCityCollection = savedCityCollection.concat(cityData);

        localStorage.setItem('savedCities', JSON.stringify(newCityCollection));
        return [
          ...state,
          cityData,
        ];
      }
      return state;
    case GET_CITY_WEATHER_BY_CODE:
      if (action.response) {
        return action.response.list.map(city => {
          return {
            id: city.id,
            name: city.name,
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
