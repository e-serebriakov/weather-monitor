import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled, { injectGlobal } from 'styled-components';

import AddForm from '../addForm/AddForm';
import CitiesList from '../citiesList/CitiesList';
import DevTools from '../../common/DevTools';
import { resetStyles, styleGlobally } from './AppStyles';
import {
  loadSavedCities,
  getWeatherByCoords,
  saveCityWeatherByName,
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

  componentDidMount() {
    const savedCityCollection = this._getSavedCityCollection();

    console.log('savedCityCollection', savedCityCollection);

    if (savedCityCollection.length) {
      const citiesIds = this._getSavedCitiesIds(savedCityCollection);
      this.props.updateSavedCityCollection(citiesIds);
      this._setSavedCityCollection(this.props.savedCities);
      console.log('citiesIds', citiesIds);
    }

    this.inputElement.focus();
    this._checkCurrentCityInStorage();
    this._getCurrentPosition();
    this.props.loadSavedCities(savedCityCollection);
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);

    if (nextProps.addedCity) {
      const cityCollection = this._getSavedCityCollection();
      this._addCityToStorage(nextProps.addedCity, cityCollection);
      this.props.loadSavedCities(filteredCityCollection);
    }
  }

  /**
   * Get saved cities IDs
   * @param cities
   * @private
   */
  _getSavedCitiesIds(cities) {
    return cities.map(city => city.id);
  }

  /**
   * Check if the current city is in localSorage
   * @private
   */
  _checkCurrentCityInStorage() {
    const savedCityCollection = this._getSavedCityCollection();
    const currentPosition = this._getCurrentPosition();

    console.log('_checkCurrentCityInStorage', savedCityCollection, currentPosition);
  }

  /**
   * Get user navigator coordinates
   * @private
   */
  _getCurrentPosition() {
    if (navigator.geolocation) {
      var lat;
      var lon;

      navigator.geolocation.getCurrentPosition(
        position => {
          lat = (position.coords.latitude).toFixed(1);
          lon = (position.coords.longitude).toFixed(1);

          this.props.getWeatherByCoords({ lat, lon });
        },
        (error) => {
          console.log('_getCurrentPosition', error);
          this.setState({ geoError: true });
        }
      );

      return { lat, lon };
    }
    this.setState({ geoError: true });
  }

  _addCityToStorage(newCity, savedCities = []) {
    const updatedCollection = savedCities.concat(newCity);
    localStorage.setItem('savedCities', JSON.stringify(updatedCollection));
  }

  /**
   * Get saved cities from localStorage
   * @private
   */
  _getSavedCityCollection() {
    return JSON.parse(localStorage.getItem('savedCities')) || [];
  }

  _setSavedCityCollection(cities) {
    localStorage.setItem('savedCities', JSON.stringify(cities));
  }

  handleInputChange(event) {
    const inputValue = event.target.value;

    this.setState({
      inputValue,
      inputError: false,
    });
  }

  addCity(event) {
    event.preventDefault();
    const inputValue = this.state.inputValue;

    if (!this.state.inputValue.trim()) {
      this.setState({ inputError: true });
      return;
    }

    if (!(isNaN(parseInt(inputValue, 10)))) {
      console.log('addCity number', inputValue);
      this.props.saveCityWeatherByCode(inputValue);
      return;
    }

    const cityDataArray = inputValue.split(',');
    if (cityDataArray.length !== 2) {
      this.setState({ inputError: true });
      return;
    }
    const cityName = cityDataArray[0].trim();
    const countryCode = cityDataArray[1].trim();
    this.props.saveCityWeatherByName({ cityName, countryCode });
    this.setState({ inputValue: '' });
  }

  /**
   * Delete city
   * @param event
   */
  deleteCityCard(event) {
    const cityElement = event.target.closest('div');
    const cityID = cityElement.getAttribute('data-id');
    const savedCityCollection = this._getSavedCityCollection();
    const filteredCityCollection = savedCityCollection.filter(city => {
      return parseInt(city.id, 10) !== parseInt(cityID, 10);
    });

    localStorage.setItem('savedCities', JSON.stringify(filteredCityCollection));

    this.props.loadSavedCities(filteredCityCollection);
  }

  render() {
    const shouldShowDevTools = WP_IS_DEV;
    const { geoError, inputError } = this.state;
    const { currentCity, savedCities } = this.props;
    const cities = currentCity ? savedCities.concat(currentCity) : savedCities;

    return (
      <Wrapper>
        <AddForm
          inputError={inputError}
          onClickBtn={this.addCity}
          onInputChange={this.handleInputChange}
          inputValue={this.state.inputValue}
          inputRef={input => this.inputElement = input}
        />
        {
          cities && cities.length ?
            <CitiesList cities={cities} onClickDeleteBtn={this.deleteCityCard} /> :
            geoError && <ErrorText>Location error (try enable geo or try later)</ErrorText>
        }
        { geoError && <ErrorText>Location error (try enable geo or try later)</ErrorText> }
        {shouldShowDevTools && <DevTools />}
      </Wrapper>
    );
  }
}

App.propTypes = {
  addedCity: PropTypes.object,
  currentCity: PropTypes.object,
  savedCities: PropTypes.array,
  loadSavedCities: PropTypes.func.isRequired,
  getWeatherByCoords: PropTypes.func.isRequired,
  saveCityWeatherByName: PropTypes.func.isRequired,
  saveCityWeatherByCode: PropTypes.func.isRequired,
  getWeatherByCitiesCode: PropTypes.func.isRequired,
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
    getWeatherByCoords(coords) {
      dispatch(getWeatherByCoords(coords));
    },
    saveCityWeatherByName(data) {
      dispatch(saveCityWeatherByName(data));
    },
    saveCityWeatherByCode(cityID) {
      dispatch(saveCityWeatherByCode(cityID));
    },
    getWeatherByCitiesCode(ID) {
      dispatch(getWeatherByCitiesCode(ID));
    },
    updateSavedCityCollection(IDs) {
      dispatch(updateSavedCityCollection(IDs))
    },
    loadSavedCities(savedCityCollection) {
      dispatch(loadSavedCities(savedCityCollection));
    },
  }),
)(App);
