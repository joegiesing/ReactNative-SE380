import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useWeatherApi, ForecastWeatherData, ForecastDay } from '../hooks/useWeatherApi';

interface ForecastComponentProps {
  days: number;
}

const ForecastComponent = ({ days }: ForecastComponentProps) => {
  const { data, loading, error, fetchForecastWeather } = useWeatherApi();
  const forecastWeather = data as ForecastWeatherData;

  useFocusEffect(
    React.useCallback(() => {
      fetchForecastWeather('02893', days);
    }, [fetchForecastWeather, days])
  );

  const renderForecastItem = ({ item }: { item: ForecastDay }) => (
    <View style={styles.forecastItem}>
      <Text style={styles.dayText}>{item.date}</Text>
      <Image 
        source={{ uri: item.day.condition.icon }}
        style={styles.forecastIcon}
      />
      <Text style={styles.conditionText}>{item.day.condition.text}</Text>
      <View style={styles.temperatureContainer}>
        <Text style={styles.highTemp}>{item.day.maxTempF}°</Text>
        <Text style={styles.lowTemp}>{item.day.minTempF}°</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading forecast...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!forecastWeather) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No forecast data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.locationName}>{forecastWeather.location.name}</Text>
        <Text style={styles.locationRegion}>{forecastWeather.location.region}</Text>
        <Text style={styles.forecastTitle}>{days} Day Forecast</Text>
      </View>
      
      <FlatList
        data={forecastWeather.forecast.forecastDay}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderForecastItem}
        style={styles.forecastList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  locationRegion: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  forecastTitle: {
    fontSize: 18,
    color: '#007AFF',
    marginTop: 10,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3333',
    textAlign: 'center',
  },
  forecastList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  forecastItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  forecastIcon: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
  conditionText: {
    fontSize: 14,
    color: '#666',
    flex: 2,
    textAlign: 'center',
  },
  temperatureContainer: {
    alignItems: 'center',
    flex: 1,
  },
  highTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lowTemp: {
    fontSize: 14,
    color: '#666',
  },
});

export default ForecastComponent;