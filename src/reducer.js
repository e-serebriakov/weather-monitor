import { combineReducers } from 'redux';

import {
  addedCity,
  currentCity,
  savedCities,
} from './components/app/AppReducers';

export default combineReducers({
  addedCity,
  currentCity,
  savedCities,
});
