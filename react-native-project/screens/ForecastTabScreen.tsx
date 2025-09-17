import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThreeDayForecastScreen, FiveDayForecastScreen } from './ForecastScreens';

export type ForecastTabParamList = {
  ThreeDayForecast: undefined;
  FiveDayForecast: undefined;
};

const ForecastTab = createBottomTabNavigator<ForecastTabParamList>();

const ForecastTabScreen = () => {
  return (
    <ForecastTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
      }}
    >
      <ForecastTab.Screen 
        name="ThreeDayForecast" 
        component={ThreeDayForecastScreen}
        options={{
          tabBarLabel: '3 Days',
        }}
      />
      <ForecastTab.Screen 
        name="FiveDayForecast" 
        component={FiveDayForecastScreen}
        options={{
          tabBarLabel: '5 Days',
        }}
      />
    </ForecastTab.Navigator>
  );
};

export default ForecastTabScreen;