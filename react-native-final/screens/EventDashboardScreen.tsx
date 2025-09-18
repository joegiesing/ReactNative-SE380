import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types/navigation';
import { TrashCan, RegionStats, ActivityLog, Worker } from '../types/data';
import { generateTrashCans, generateMockActivity, mockWorkers } from '../data/mockData';

type EventDashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EventDashboard'>;

export const EventDashboardScreen: React.FC = () => {
  const navigation = useNavigation<EventDashboardNavigationProp>();
  const [trashCans, setTrashCans] = useState<TrashCan[]>([]);
  const [currentWorker, setCurrentWorker] = useState<Worker>(mockWorkers[0]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [totalStats, setTotalStats] = useState<RegionStats>({
    urgent: 0,
    attention: 0,
    recent: 0,
    unknown: 0
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    const cans = generateTrashCans();
    const activity = generateMockActivity();
    
    setTrashCans(cans);
    setRecentActivity(activity);
    calculateTotalStats(cans);
  };

  const calculateTotalStats = (cans: TrashCan[]) => {
    const stats = cans.reduce(
      (acc, can) => {
        if (can.isOverdue) {
          acc.urgent += 1;
        } else if (can.fillLevel === '3/4' || can.fillLevel === 'full') {
          acc.attention += 1;
        } else if (can.fillLevel === 'empty' || can.fillLevel === '1/4') {
          acc.recent += 1;
        } else {
          acc.unknown += 1;
        }
        return acc;
      },
      { urgent: 0, attention: 0, recent: 0, unknown: 0 }
    );
    
    setTotalStats(stats);
  };

  const handleEnterRegions = () => {
    navigation.navigate('MainApp');
  };

  const renderActivityItem = ({ item }: { item: ActivityLog }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Ionicons name="person-circle" size={24} color="#2196F3" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>
          <Text style={styles.workerName}>{item.workerName}</Text> {item.action}
        </Text>
        <Text style={styles.activityTime}>{item.timeAgo}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eventTitle}>Summer Fair 2025</Text>
        <Text style={styles.shiftInfo}>Morning Shift (8:00 AM - 4:00 PM)</Text>
        <Text style={styles.workerInfo}>Worker: {currentWorker.name}</Text>
      </View>

      {/* Total Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Total Cans: 24</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#F44336' }]}>
              <Text style={styles.statNumber}>{totalStats.urgent}</Text>
            </View>
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#FF9800' }]}>
              <Text style={styles.statNumber}>{totalStats.attention}</Text>
            </View>
            <Text style={styles.statLabel}>Attention</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#4CAF50' }]}>
              <Text style={styles.statNumber}>{totalStats.recent}</Text>
            </View>
            <Text style={styles.statLabel}>Recent</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#9E9E9E' }]}>
              <Text style={styles.statNumber}>{totalStats.unknown}</Text>
            </View>
            <Text style={styles.statLabel}>Unknown</Text>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <FlatList
          data={recentActivity.slice(0, 4)}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Action Button */}
      <TouchableOpacity style={styles.enterButton} onPress={handleEnterRegions}>
        <Ionicons name="arrow-forward" size={24} color="white" />
        <Text style={styles.enterButtonText}>Enter Regions</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  shiftInfo: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  workerInfo: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  statsContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    marginRight: 12,
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    justifyContent: 'center',
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  workerName: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  enterButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  enterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});