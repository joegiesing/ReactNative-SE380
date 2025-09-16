import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useWeatherApi, CurrentWeatherData } from '../hooks/useWeatherApi';

const CurrentWeatherScreen = () => {
  const { data, loading, error, fetchCurrentWeather } = useWeatherApi();
  const currentWeather = data as CurrentWeatherData;

  useFocusEffect(
    React.useCallback(() => {
      fetchCurrentWeather('02893');
    }, [fetchCurrentWeather])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading weather...</Text>
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

  if (!currentWeather) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No weather data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationName}>{currentWeather.location.name}</Text>
          <Text style={styles.locationRegion}>{currentWeather.location.region}</Text>
        </View>

        <View style={styles.weatherContainer}>
          <Image 
            source={{ uri: currentWeather.current.condition.icon }}
            style={styles.weatherIcon}
          />
          <Text style={styles.temperature}>{currentWeather.current.tempF}°F</Text>
          <Text style={styles.condition}>{currentWeather.current.condition.text}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  locationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  locationName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  locationRegion: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  weatherContainer: {
    alignItems: 'center',
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  condition: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
  },
});

export default CurrentWeatherScreen;