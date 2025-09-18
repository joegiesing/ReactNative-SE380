import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  SharedValue
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TrashCan, FillLevel } from '../types/data';

type Props = {
  item: TrashCan;
  index: number;
  scrollY: SharedValue<number>;
  listHeight: SharedValue<number>;
  onPress: (canId: string) => void;
};

export const TrashCanItem: React.FC<Props> = ({ 
  item, 
  index, 
  scrollY, 
  listHeight, 
  onPress 
}) => {
  
  // Animation logic moved here (proper component level)
  const animatedStyle = useAnimatedStyle(() => {
    const itemHeight = 180; // Approximate height of each card
    const itemTop = index * itemHeight;
    const itemCenter = itemTop + itemHeight / 2;
    const screenCenter = scrollY.value + listHeight.value / 2;
    
    const distance = Math.abs(itemCenter - screenCenter);
    const maxDistance = listHeight.value / 2;
    
    // Scale: larger when closer to center
    const scale = interpolate(
      distance,
      [0, maxDistance],
      [1.1, 0.9],
      Extrapolate.CLAMP
    );
    
    // Opacity: more opaque when closer to center
    const opacity = interpolate(
      distance,
      [0, maxDistance],
      [1, 0.7],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const getStatusColor = (can: TrashCan) => {
    if (can.isOverdue) return '#F44336'; // Red
    if (can.fillLevel === '3/4' || can.fillLevel === 'full') return '#FF9800'; // Orange
    if (can.fillLevel === 'empty' || can.fillLevel === '1/4') return '#4CAF50'; // Green
    return '#9E9E9E'; // Gray
  };

  const getStatusText = (can: TrashCan) => {
    if (can.isOverdue) return 'URGENT';
    if (can.fillLevel === '3/4' || can.fillLevel === 'full') return 'ATTENTION';
    if (can.fillLevel === 'empty' || can.fillLevel === '1/4') return 'RECENT';
    return 'UNKNOWN';
  };

  const handleQuickEmpty = (can: TrashCan) => {
    Alert.alert(
      'Quick Empty',
      `Mark ${can.id} as emptied?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Empty', onPress: () => markAsEmpty(can, 'empty') },
        { text: '1/4 Full', onPress: () => markAsEmpty(can, '1/4') },
        { text: '1/2 Full', onPress: () => markAsEmpty(can, '1/2') },
        { text: '3/4 Full', onPress: () => markAsEmpty(can, '3/4') },
      ]
    );
  };

  const markAsEmpty = async (can: TrashCan, fillLevel: FillLevel) => {
    try {
      const updatedCan = {
        ...can,
        lastEmptied: new Date().toISOString(),
        fillLevel,
        isOverdue: false
      };

      // Update AsyncStorage
      const storedCans = await AsyncStorage.getItem('trashCans');
      if (storedCans) {
        const allCans = JSON.parse(storedCans);
        const updatedAllCans = allCans.map((c: TrashCan) => c.id === can.id ? updatedCan : c);
        await AsyncStorage.setItem('trashCans', JSON.stringify(updatedAllCans));
      }

      Alert.alert('Success', `${can.id} marked as ${fillLevel}`);
    } catch (error) {
      console.error('Error updating trash can:', error);
      Alert.alert('Error', 'Failed to update trash can');
    }
  };

  return (
    <Animated.View style={[styles.canCardContainer, animatedStyle]}>
      <TouchableOpacity 
        style={styles.canCard} 
        onPress={() => onPress(item.id)}
        onLongPress={() => handleQuickEmpty(item)}
      >
        <View style={styles.canHeader}>
          <Text style={styles.canId}>{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item) }]}>
            <Text style={styles.statusText}>{getStatusText(item)}</Text>
          </View>
        </View>
        
        <Text style={styles.canLocation}>{item.location}</Text>
        
        <View style={styles.canInfo}>
          <Text style={styles.fillLevel}>Fill Level: {item.fillLevel}</Text>
          <Text style={styles.lastEmptied}>
            Last Emptied: {new Date(item.lastEmptied).toLocaleTimeString()}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.quickEmptyButton}
          onPress={() => handleQuickEmpty(item)}
        >
          <Ionicons name="checkmark-circle" size={20} color="#2196F3" />
          <Text style={styles.quickEmptyText}>Quick Empty</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  canCardContainer: {
    marginBottom: 10,
  },
  canCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  canHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  canId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  canLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  canInfo: {
    marginBottom: 10,
  },
  fillLevel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  lastEmptied: {
    fontSize: 12,
    color: '#666',
  },
  quickEmptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 6,
  },
  quickEmptyText: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});