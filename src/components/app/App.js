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
  saveCityWeatherByCode,
  getWeatherByCitiesCode,
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
  margin-left: 30px;
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

    this.addCity = this.addCity.bind(this);
    this.deleteCityCard = this.deleteCityCard.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    const savedCityCollection = this._getSavedCityCollection();

    this.inputElement.focus();
    this._getCurrentPosition();
    this.props.loadSavedCities(savedCityCollection);
  }

  /**
   * Get user navigator coordinates
   * @private
   */
  _getCurrentPosition() {
    if (navigator.geolocation) {
      let lat;
      let lon;

      navigator.geolocation.getCurrentPosition(
        position => {
          lat = (position.coords.latitude).toFixed(1);
          lon = (position.coords.longitude).toFixed(1);

          this.props.getWeatherByCoords({ lat, lon });
        },
        () => {
          this.setState({ geoError: true });
        }
      );
    }
  }

  /**
   * Get saved cities from localStorage
   * @private
   */
  _getSavedCityCollection() {
    return JSON.parse(localStorage.getItem('savedCities'));
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
        {shouldShowDevTools && <DevTools />}
      </Wrapper>
    );
  }
}

App.propTypes = {
  currentCity: PropTypes.object,
  savedCities: PropTypes.array,
  loadSavedCities: PropTypes.func.isRequired,
  getWeatherByCoords: PropTypes.func.isRequired,
  saveCityWeatherByName: PropTypes.func.isRequired,
  saveCityWeatherByCode: PropTypes.func.isRequired,
  getWeatherByCitiesCode: PropTypes.func.isRequired,
};

App.defaultProps = {
  currentCity: null,
  savedCities: [],
};

export default connect(
  state => ({
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
    getWeatherByCitiesCode(IDs) {
      dispatch(getWeatherByCitiesCode(IDs));
    },
    loadSavedCities(savedCityCollection) {
      dispatch(loadSavedCities(savedCityCollection));
    },
  }),
)(App);
