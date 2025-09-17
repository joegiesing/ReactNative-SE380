import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Battery from 'expo-battery';

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

const ShakeChargeHomeworkScreen = () => {
  const [batteryLevel, setBatteryLevel] = useState<number>(0);
  const [accelerometerData, setAccelerometerData] = useState<AccelerometerData>({
    x: 0,
    y: 0,
    z: 0,
  });
  const [accelerometerSubscription, setAccelerometerSubscription] = useState<any>(null);
  const [isFullyCharged, setIsFullyCharged] = useState<boolean>(false);

  // Initialize with real device battery level
  useEffect(() => {
    initializeBattery();
    subscribeToAccelerometer();
    
    return () => {
      unsubscribeFromAccelerometer();
    };
  }, []);

  // Monitor for shake to charge effect
  useEffect(() => {
    const { x, y, z } = accelerometerData;
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    // If shaking detected and not fully charged
    if (magnitude > 1.5 && batteryLevel < 1) {
      setBatteryLevel((prevLevel) => {
        const newLevel = Math.min(prevLevel + 0.001, 1);
        if (newLevel >= 1 && !isFullyCharged) {
          setIsFullyCharged(true);
        }
        return newLevel;
      });
    }
  }, [accelerometerData, batteryLevel, isFullyCharged]);

  const initializeBattery = async () => {
    try {
      const deviceBatteryLevel = await Battery.getBatteryLevelAsync();
      setBatteryLevel(deviceBatteryLevel);
      setIsFullyCharged(deviceBatteryLevel >= 1);
    } catch (error) {
      // Fallback if battery API fails
      setBatteryLevel(0.5);
    }
  };

  const resetBatteryToDevice = async () => {
    try {
      const deviceBatteryLevel = await Battery.getBatteryLevelAsync();
      setBatteryLevel(deviceBatteryLevel);
      setIsFullyCharged(deviceBatteryLevel >= 1);
    } catch (error) {
      // Fallback if battery API fails
      setBatteryLevel(0.5);
      setIsFullyCharged(false);
    }
  };

  const subscribeToAccelerometer = () => {
    const subscription = Accelerometer.addListener(setAccelerometerData);
    setAccelerometerSubscription(subscription);
  };

  const unsubscribeFromAccelerometer = () => {
    accelerometerSubscription && accelerometerSubscription.remove();
    setAccelerometerSubscription(null);
  };

  // Determine battery color based on level
  const getBatteryColor = () => {
    if (batteryLevel < 0.2) return '#FF4444'; // Red
    if (batteryLevel < 0.5) return '#FFB84D'; // Yellow
    return '#4CAF50'; // Green
  };

  const batteryPercentage = Math.round(batteryLevel * 100);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Shake to Charge</Text>
        
        {/* Battery Percentage Display */}
        <Text style={styles.percentage}>{batteryPercentage}%</Text>
        
        {/* Battery Visual */}
        <View style={styles.batteryContainer}>
          {/* Battery Outline */}
          <View style={styles.batteryOutline}>
            {/* Battery Fill */}
            <View 
              style={[
                styles.batteryFill, 
                { 
                  width: `${batteryPercentage}%`,
                  backgroundColor: getBatteryColor()
                }
              ]} 
            />
          </View>
          {/* Battery Tip */}
          <View style={styles.batteryTip} />
        </View>

        {/* Status Messages and Reset Button */}
        {isFullyCharged ? (
          <View style={styles.messageContainer}>
            <Text style={styles.fullyChargedText}>🔋 Device is Fully Charged! 🔋</Text>
            <TouchableOpacity onPress={resetBatteryToDevice} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Reset to Device Battery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.instructionText}>
              Shake your device to charge the battery!
            </Text>
            <TouchableOpacity onPress={resetBatteryToDevice} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Reset to Device Battery</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Battery Status Indicator */}
        <View style={styles.statusContainer}>
          <View 
            style={[
              styles.statusIndicator,
              { backgroundColor: getBatteryColor() }
            ]}
          />
          <Text style={styles.statusText}>
            {batteryLevel < 0.2 ? 'Low Battery' : 
             batteryLevel < 0.5 ? 'Medium Battery' : 
             'Good Battery'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  percentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  batteryOutline: {
    width: 200,
    height: 80,
    borderWidth: 4,
    borderColor: '#666',
    borderRadius: 8,
    backgroundColor: '#333',
    overflow: 'hidden',
    position: 'relative',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 4,
  },
  batteryTip: {
    width: 8,
    height: 40,
    backgroundColor: '#666',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    marginLeft: 2,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  fullyChargedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default ShakeChargeHomeworkScreen;