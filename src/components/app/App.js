import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { injectGlobal } from 'styled-components';

import AddForm from '../addForm/AddForm';
import CitiesList from '../citiesList/CitiesList';
import DevTools from '../../common/DevTools';
import { convertResponseToCityObject } from '../../common/utils/weatherResponseConvertor';
import { resetStyles, styleGlobally } from './AppStyles';
import {
  addCity,
  loadSavedCities,
  getWeatherByCoords,
  saveCityWeatherByCityName,
  updateSavedCityCollection,
  saveCityWeatherByCode,
} from './AppActions';

/**
 * Global styles
 */
injectGlobal`
  ${resetStyles()}
  ${styleGlobally()}
`;

const Wrapper = styled.div`
  max-width: 1150px;
  margin: 0 auto;
  padding: 50px 0 30px;
  background-color: transparent;
`;

const ErrorText = styled.p`
  margin-top: 30px;
  color: #fe4a49;
`;

/**
 * Stateful class implementing Application
 */
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      geoError: false,
      inputError: false,
    };

    this.addCity = this::this.addCity;
    this.handleInputChange = this::this.handleInputChange ;
    this.deleteCityCard = this::this.deleteCityCard;
  }

  /**
   * Return localStorage key
   * @return {string}
   */
  static get localStorageKey() {
    return 'savedCities';
  }

  /**
   * @inheritDoc
   */
  componentDidMount() {
    const savedCityCollection = App.getSavedCityCollection();
    if (savedCityCollection && savedCityCollection.length) {
      const citiesIds = App.getSavedCitiesIds(savedCityCollection);
      this.props.updateSavedCityCollection(citiesIds);
    }

    this.inputElement.focus();
    if (!navigator.geolocation) {
      this.setState({ geoError: true });
      return;
    }

    this.isCurrentCityInStorage(savedCityCollection)
      .then(result => {
        if (result && !result.isCityInStorage) {
          this.props.getWeatherByCoords({
            lat: result.currentPosition.coords.latitude.toFixed(1),
            lon: result.currentPosition.coords.longitude.toFixed(1),
          })
            .then(response => {
              const savedCityCollection = App.getSavedCityCollection();
              const currentCity = convertResponseToCityObject(response);

              this.props.addCity(currentCity);
              App.addCityToStorage(currentCity, savedCityCollection);
            });
          this.setState({ geoError: false });
        }
      });
  }

  /**
   * Get saved cities IDs
   * @param cities
   * @private
   */
  static getSavedCitiesIds(cities) {
    return cities.map(city => city.id);
  }

  /**
   * Check if the current city is in localSorage
   */
  isCurrentCityInStorage(cityCollection) {
    return this.getCurrentPosition()
      .then(currentPosition => {
        const currentCityPosition = {
          lat: parseFloat(currentPosition.coords.latitude.toFixed(1)),
          lon: parseFloat(currentPosition.coords.longitude.toFixed(1)),
        };

        if (!cityCollection || !cityCollection.length) {
          return {
            isCityInStorage: false,
            currentPosition,
          }
        }

        const isCityInStorage = cityCollection.some(city => {
          return city.coords.lat === currentCityPosition.lat &&
            city.coords.lon === currentCityPosition.lon;
        });

        return {
          isCityInStorage,
          currentPosition,
        }
      })
      .catch(error => {
        this.setState({ geoError: true });
        console.log('Geo error', error);
      });
  }

  /**
   * Get user navigator coordinates
   */
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error());
      }
      navigator.geolocation.getCurrentPosition(
        coords => resolve(coords),
        error => reject(error)
      );
    });
  }

  /**
   * Add city to localStorage
   * @param newCity
   * @param savedCities
   */
  static addCityToStorage(newCity, savedCities) {
    savedCities = savedCities || [];
    const updatedCollection = savedCities.concat(newCity);
    localStorage.setItem(App.localStorageKey, JSON.stringify(updatedCollection));
  }

  /**
   * Get saved cities from localStorage
   */
  static getSavedCityCollection() {
    return JSON.parse(localStorage.getItem(App.localStorageKey));
  }

  handleInputChange(event) {
    const inputValue = event.target.value;

    this.setState({
      inputValue,
      inputError: false,
    });
  }

  /**
   * Add new city
   * @param event
   */
  addCity(event) {
    event.preventDefault();
    const savedCityCollection = App.getSavedCityCollection();
    const inputValue = this.state.inputValue;
    if (!this.state.inputValue.trim()) {
      this.setState({ inputError: true });
      return;
    }

    if (!(isNaN(parseInt(inputValue, 10)))) {
      this.props.saveCityWeatherByCode(inputValue).then((response) => {
        const addedCity = convertResponseToCityObject(response);
        this.props.loadSavedCities(this.props.savedCities.concat(addedCity));
        App.addCityToStorage(addedCity, savedCityCollection);
      });
      return;
    }

    const cityDataArray = inputValue.split(',');
    if (cityDataArray.length !== 2) {
      this.setState({ inputError: true });
      return;
    }
    const cityName = cityDataArray[0].trim();
    const countryCode = cityDataArray[1].trim();
    this.props.saveCityWeatherByCityName({ cityName, countryCode })
      .then((response) => {
        const addedCity = convertResponseToCityObject(response);
        this.props.loadSavedCities(this.props.savedCities.concat(addedCity));
        App.addCityToStorage(addedCity, savedCityCollection);
      });
    this.setState({ inputValue: '' });
  }

  /**
   * Delete city
   * @param event
   */
  deleteCityCard(event) {
    const cityElement = event.target.closest('div');
    const cityID = cityElement.getAttribute('data-id');
    const savedCityCollection = App.getSavedCityCollection();
    const filteredCityCollection = savedCityCollection.filter(city => {
      return parseInt(city.id, 10) !== parseInt(cityID, 10);
    });

    localStorage.setItem(App.localStorageKey, JSON.stringify(filteredCityCollection));

    this.props.loadSavedCities(filteredCityCollection);
  }

  render() {
    const shouldShowDevTools = WP_IS_DEV;
    const { geoError, inputError } = this.state;
    const { savedCities } = this.props;

    return (
      <Wrapper>
        <AddForm
          inputError={inputError}
          onClickBtn={this.addCity}
          onInputChange={this.handleInputChange}
          inputValue={this.state.inputValue}
          inputRef={input => this.inputElement = input}
        />
        {geoError && <ErrorText>Location error (try enable geo or try later)</ErrorText>}
        {
          savedCities && savedCities.length ?
            <CitiesList cities={savedCities} onClickDeleteBtn={this.deleteCityCard} /> :
            null
        }
        {shouldShowDevTools && <DevTools />}
      </Wrapper>
    );
  }
}

App.propTypes = {
  addedCity: PropTypes.object,
  savedCities: PropTypes.array,
  currentCity: PropTypes.object,
  addCity: PropTypes.func.isRequired,
  loadSavedCities: PropTypes.func.isRequired,
  getWeatherByCoords: PropTypes.func.isRequired,
  saveCityWeatherByCityName: PropTypes.func.isRequired,
  saveCityWeatherByCode: PropTypes.func.isRequired,
  updateSavedCityCollection: PropTypes.func.isRequired,
};

App.defaultProps = {
  addedCity: null,
  currentCity: null,
  savedCities: [],
};

export default connect(
  state => ({
    addedCity: state.addedCity,
    savedCities: state.savedCities,
    currentCity: state.currentCity,
  }),
  dispatch => ({
    addCity(cityWeatherData) {
      dispatch(addCity(cityWeatherData));
    },
    getWeatherByCoords(coords) {
      return dispatch(getWeatherByCoords(coords));
    },
    saveCityWeatherByCityName(data) {
      return dispatch(saveCityWeatherByCityName(data));
    },
    saveCityWeatherByCode(cityID) {
      return dispatch(saveCityWeatherByCode(cityID));
    },
    updateSavedCityCollection(IDs) {
      dispatch(updateSavedCityCollection(IDs))
    },
    loadSavedCities(savedCityCollection) {
      dispatch(loadSavedCities(savedCityCollection));
    },
  }),
)(App);
