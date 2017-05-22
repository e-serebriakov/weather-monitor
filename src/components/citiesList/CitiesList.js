import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CityCard from '../cityCard/CityCard';

const CitiesWrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
`;

const CitiesList = ({ onClickDeleteBtn, cities }) => {
  return (
    <CitiesWrapper>
      {cities.map(city => <CityCard key={city.id} onRemove={onClickDeleteBtn} data={city} />)}
    </CitiesWrapper>
  );
};

CitiesList.propTypes = {
  onClickDeleteBtn: PropTypes.func.isRequired,
  cities: PropTypes.array.isRequired,
};

export default CitiesList;
