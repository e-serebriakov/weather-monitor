import { combineReducers } from 'redux';

import {
  currentCity,
  savedCities,
} from './components/app/AppReducers';

export default combineReducers({
  currentCity,
  savedCities,
});
