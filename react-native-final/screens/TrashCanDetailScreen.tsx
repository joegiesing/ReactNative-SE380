import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming
} from 'react-native-reanimated';

import { RegionStackParamList } from '../types/navigation';
import { TrashCan, FillLevel, EmptyingLog } from '../types/data';

type TrashCanDetailRouteProp = RouteProp<RegionStackParamList, 'TrashCanDetail'>;
type TrashCanDetailNavigationProp = NativeStackNavigationProp<RegionStackParamList, 'TrashCanDetail'>;

export const TrashCanDetailScreen: React.FC = () => {
  const route = useRoute<TrashCanDetailRouteProp>();
  const navigation = useNavigation<TrashCanDetailNavigationProp>();
  const { canId } = route.params;

  const [trashCan, setTrashCan] = useState<TrashCan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Animation values
  const fillLevelAnimation = useSharedValue(0);

  useEffect(() => {
    loadTrashCanDetails();
  }, [canId]);

  useEffect(() => {
    if (trashCan) {
      // Animate fill level indicator
      const fillPercentage = getFillPercentage(trashCan.fillLevel);
      fillLevelAnimation.value = withTiming(fillPercentage, { duration: 1000 });
    }
  }, [trashCan]);

  const loadTrashCanDetails = async () => {
    try {
      const storedCans = await AsyncStorage.getItem('trashCans');
      if (storedCans) {
        const allCans: TrashCan[] = JSON.parse(storedCans);
        const can = allCans.find(c => c.id === canId);
        setTrashCan(can || null);
      }
    } catch (error) {
      console.error('Error loading trash can details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFillPercentage = (fillLevel: FillLevel): number => {
    switch (fillLevel) {
      case 'empty': return 0;
      case '1/4': return 25;
      case '1/2': return 50;
      case '3/4': return 75;
      case 'full': return 100;
      default: return 0;
    }
  };

  const getFillColor = (fillLevel: FillLevel): string => {
    switch (fillLevel) {
      case 'empty': return '#4CAF50';
      case '1/4': return '#8BC34A';
      case '1/2': return '#FF9800';
      case '3/4': return '#FF5722';
      case 'full': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const markAsEmpty = async (fillLevel: FillLevel) => {
    if (!trashCan) return;

    try {
      const updatedCan = {
        ...trashCan,
        lastEmptied: new Date().toISOString(),
        fillLevel,
        isOverdue: false
      };

      // Update local state
      setTrashCan(updatedCan);

      // Create emptying log
      const log: EmptyingLog = {
        id: `log_${Date.now()}`,
        canId: trashCan.id,
        workerId: 'worker123', // This would come from current user context
        timestamp: new Date().toISOString(),
        fillLevelWhenEmptied: trashCan.fillLevel,
        region: trashCan.region
      };

      // Save log to AsyncStorage
      const existingLogs = await AsyncStorage.getItem('emptyingLogs') || '[]';
      const logs = JSON.parse(existingLogs);
      logs.push(log);
      await AsyncStorage.setItem('emptyingLogs', JSON.stringify(logs));

      // Update trash can in storage
      const storedCans = await AsyncStorage.getItem('trashCans');
      if (storedCans) {
        const allCans = JSON.parse(storedCans);
        const updatedAllCans = allCans.map((c: TrashCan) => c.id === trashCan.id ? updatedCan : c);
        await AsyncStorage.setItem('trashCans', JSON.stringify(updatedAllCans));
      }

      Alert.alert('Success', `${trashCan.id} marked as ${fillLevel}`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      console.error('Error updating trash can:', error);
      Alert.alert('Error', 'Failed to update trash can');
    }
  };

  const showEmptyOptions = () => {
    Alert.alert(
      'Mark as Empty',
      'What was the fill level when emptied?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Empty', onPress: () => markAsEmpty('empty') },
        { text: '1/4 Full', onPress: () => markAsEmpty('1/4') },
        { text: '1/2 Full', onPress: () => markAsEmpty('1/2') },
        { text: '3/4 Full', onPress: () => markAsEmpty('3/4') },
        { text: 'Full', onPress: () => markAsEmpty('full') },
      ]
    );
  };

  // Animated styles
  const fillLevelStyle = useAnimatedStyle(() => {
    return {
      height: `${fillLevelAnimation.value}%`,
    };
  });

  if (isLoading || !trashCan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const timeSinceEmpty = Math.floor((Date.now() - new Date(trashCan.lastEmptied).getTime()) / (1000 * 60));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.canId}>{trashCan.id}</Text>
          <Text style={styles.canLocation}>{trashCan.location}</Text>
          <Text style={styles.regionLabel}>Region {trashCan.region}</Text>
        </View>

        {/* Fill Level Indicator */}
        <View style={styles.fillIndicatorContainer}>
          <Text style={styles.sectionTitle}>Fill Level: {trashCan.fillLevel}</Text>
          <View style={styles.fillIndicator}>
            <Animated.View 
              style={[
                styles.fillLevel, 
                { backgroundColor: getFillColor(trashCan.fillLevel) },
                fillLevelStyle
              ]} 
            />
          </View>
          <Text style={styles.fillPercentage}>{getFillPercentage(trashCan.fillLevel)}%</Text>
        </View>

        {/* Status Information */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#666" />
            <Text style={styles.infoText}>
              Last emptied: {timeSinceEmpty} minutes ago
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="alarm" size={20} color="#666" />
            <Text style={styles.infoText}>
              Alert threshold: {trashCan.alertThreshold} minutes
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name={trashCan.isOverdue ? "warning" : "checkmark-circle"} 
                     size={20} 
                     color={trashCan.isOverdue ? "#F44336" : "#4CAF50"} />
            <Text style={[styles.infoText, { color: trashCan.isOverdue ? "#F44336" : "#4CAF50" }]}>
              {trashCan.isOverdue ? 'OVERDUE - Needs attention!' : 'On schedule'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.emptyButton} onPress={showEmptyOptions}>
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text style={styles.emptyButtonText}>Mark as Empty</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.flagButton}>
            <Ionicons name="flag" size={20} color="#FF9800" />
            <Text style={styles.flagButtonText}>Flag for Attention</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  canId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  canLocation: {
    fontSize: 18,
    color: 'white',
    marginTop: 5,
  },
  regionLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginTop: 5,
  },
  fillIndicatorContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  fillIndicator: {
    width: 80,
    height: 150,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  fillLevel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
  },
  fillPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
    flex: 1,
  },
  actionsContainer: {
    gap: 15,
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  flagButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  flagButtonText: {
    color: '#FF9800',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});