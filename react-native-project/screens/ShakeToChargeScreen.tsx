import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Battery from 'expo-battery';

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

const ShakeToChargeScreen = () => {
  // Accelerometer state
  const [accelerometerData, setAccelerometerData] = useState<AccelerometerData>({
    x: 0,
    y: 0,
    z: 0,
  });
  const [accelerometerSubscription, setAccelerometerSubscription] = useState<any>(null);

  // Battery state (simulated for the shake-to-charge effect)
  const [batteryLevel, setBatteryLevel] = useState<number>(0.27); // Start at 27%
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [batterySubscription, setBatterySubscription] = useState<any>(null);

  // Initialize accelerometer when component mounts
  useEffect(() => {
    _subscribeAccelerometer();
    // Get initial real charging status for display
    _getChargingStatus();
    return () => {
      _unsubscribeAccelerometer();
    };
  }, []);

  // Get real charging status (but keep simulated battery level)
  const _getChargingStatus = async () => {
    try {
      const chargingStatus = await Battery.getBatteryStateAsync();
      setIsCharging(chargingStatus === Battery.BatteryState.CHARGING);
    } catch (error) {
      console.log('Could not get charging status');
      setIsCharging(false);
    }
  };

  // Monitor accelerometer for "shake to charge" effect
  useEffect(() => {
    const { x, y, z } = accelerometerData;
    // Calculate magnitude (number of G's detected)
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    // If shaking detected (magnitude > 1.5), increase battery level
    if (magnitude > 1.5) {
      setBatteryLevel((prevBatteryLevel) => 
        Math.min(prevBatteryLevel + 0.01, 1)
      );
    }
  }, [accelerometerData]);

  // Accelerometer controls
  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(16);

  const _subscribeAccelerometer = () => {
    setAccelerometerSubscription(Accelerometer.addListener(setAccelerometerData));
  };

  const _unsubscribeAccelerometer = () => {
    accelerometerSubscription && accelerometerSubscription.remove();
    setAccelerometerSubscription(null);
  };

  // Reset battery level to 27%
  const _resetBattery = () => {
    setBatteryLevel(0.27);
  };

  // Format battery level as percentage
  const batteryPercentage = Math.round(batteryLevel * 100);
  const magnitude = Math.sqrt(
    accelerometerData.x * accelerometerData.x +
    accelerometerData.y * accelerometerData.y +
    accelerometerData.z * accelerometerData.z
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shake to Charge</Text>
        <Text style={styles.subtitle}>Shake your phone to "charge" the battery!</Text>
      </View>

      {/* Battery Status Section */}
      <View style={styles.batterySection}>
        <Text style={styles.sectionTitle}>Battery Status</Text>
        <View style={styles.batteryDisplay}>
          <Text style={styles.batteryLevel}>{batteryPercentage}%</Text>
          <View style={[styles.batteryBar, { width: `${batteryPercentage}%` }]} />
        </View>
        <Text style={styles.chargingStatus}>
          {isCharging ? '🔌 Charging' : '🔋 Not Charging'}
        </Text>
      </View>

      {/* Accelerometer Section */}
      <View style={styles.accelerometerSection}>
        <Text style={styles.sectionTitle}>
          Accelerometer: (in gs where 1g = 9.81 m/s²)
        </Text>
        <Text style={styles.dataText}>x: {accelerometerData.x.toFixed(2)}</Text>
        <Text style={styles.dataText}>y: {accelerometerData.y.toFixed(2)}</Text>
        <Text style={styles.dataText}>z: {accelerometerData.z.toFixed(2)}</Text>
        <Text style={styles.magnitudeText}>
          Magnitude: {magnitude.toFixed(2)}g
        </Text>
        
        {magnitude > 1.5 && (
          <Text style={styles.shakeIndicator}>📳 Charging!</Text>
        )}
      </View>

      {/* Controls */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={accelerometerSubscription ? _unsubscribeAccelerometer : _subscribeAccelerometer}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {accelerometerSubscription ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={_slow}
          style={[styles.button, styles.middleButton]}
        >
          <Text style={styles.buttonText}>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={_fast} 
          style={styles.button}
        >
          <Text style={styles.buttonText}>Fast</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resetButtonContainer}>
        <TouchableOpacity
          onPress={_resetBattery}
          style={styles.resetButton}
        >
          <Text style={styles.resetButtonText}>Reset Battery</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.instructions}>
        Shake your device to see the battery level increase!
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  batterySection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  batteryDisplay: {
    width: 200,
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  batteryLevel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    zIndex: 2,
  },
  batteryBar: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    zIndex: 1,
  },
  chargingStatus: {
    fontSize: 16,
    color: '#666',
  },
  accelerometerSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  dataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginVertical: 2,
  },
  magnitudeText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 10,
  },
  shakeIndicator: {
    textAlign: 'center',
    fontSize: 20,
    color: '#4CAF50',
    marginTop: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  middleButton: {
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructions: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});

export default ShakeToChargeScreen;