import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const WeatherAppScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Weather App</Text>
        <Text style={styles.subtitle}>Homework Assignment #4</Text>
        <Text style={styles.description}>
          This will be the weather app for our next homework assignment.
        </Text>
        <Text style={styles.placeholder}>
          🌤️ Coming Soon...
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  placeholder: {
    fontSize: 48,
    marginTop: 20,
  },
});

export default WeatherAppScreen;