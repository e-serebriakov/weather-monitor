export function convertResponseToCityObject(response) {
  return {
    id: response.response.id,
    name: response.response.name,
    coords: response.response.coord,
    country: response.response.sys.country,
    weather: response.response.weather[0].main,
    temperature: response.response.main.temp,
    weatherDescription: response.response.weather[0].description,
  };
}
