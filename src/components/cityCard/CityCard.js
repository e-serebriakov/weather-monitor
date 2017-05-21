import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Card = styled.div`
  position: relative;
  width: 320px;
  margin: 30px;
  padding: 20px;
  font-size: 1em;
  text-align: center;
  color: #131516;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  
  &:first-child {
    margin-left: 0;
  }
  
  &:last-child {
    margin-right: 0;
  }
`;

const CityText = styled.h3`
  margin-bottom: 20px;
`;

const WeatherText = styled.p`
`;

const TemperatureText = styled.span`
  display: inline-block;
  margin-right: 10px;
  font-size: 2em;
`;

const WeatherDescription = styled.span`
  
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  height: 20px;
  width: 20px;
  border: 0;
  outline: 0;
  border-radius: 50%;
  background-color: transparent;
  cursor: pointer;
  transition: background-color .2 linear;
  
  &:hover {
    background-color: #d2d2d2;
  }
  
  &:before,
  &:after {
    position: absolute;
    top: 9px;
    display: block;
    content: '';
    height: 2px;
    width: 12px;
    background-color: #fe4a49;
    border-radius: 1px;
  }
    
  &:before {
    left: 4px;
    transform: rotate(45deg);
  }
  
  &:after {
    right: 4px;
    transform: rotate(-45deg);
  }
`;

const CityCard = ({ onClickBtn, data }) => {
  const {
    id,
    name,
    country,
    temperature,
    weather,
    weatherDescription,
  } = data;

  return (
    <Card data-id={id}>
      <CityText>{name} ({country})</CityText>
      <WeatherText>
        <TemperatureText>{Math.round(temperature)} &#176;C</TemperatureText>
        <WeatherDescription>{weather} ({weatherDescription})</WeatherDescription>
      </WeatherText>
      <RemoveButton onClick={onClickBtn} />
    </Card>
  );
};

CityCard.propTypes = {
  onClickBtn: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default CityCard;
