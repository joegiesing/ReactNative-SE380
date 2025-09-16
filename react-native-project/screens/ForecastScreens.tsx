import React from 'react';
import ForecastComponent from '../components/ForecastComponent';

export const ThreeDayForecastScreen = () => {
  return <ForecastComponent days={3} />;
};

export const FiveDayForecastScreen = () => {
  return <ForecastComponent days={5} />;
};