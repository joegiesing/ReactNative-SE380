import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AdminStackParamList } from '../types/navigation';
import { TrashCan, Worker, ActivityLog, RegionStats } from '../types/data';
import { generateMockActivity, mockWorkers } from '../data/mockData';
import { WorkerCoordinationModal } from '../components/WorkerCoordinationModal';
import { httpService } from '../services/httpService';

type AdminOverviewNavigationProp = NativeStackNavigationProp<AdminStackParamList, 'AdminOverview'>;

export const AdminOverviewScreen: React.FC = () => {
  const navigation = useNavigation<AdminOverviewNavigationProp>();
  
  const [allTrashCans, setAllTrashCans] = useState<TrashCan[]>([]);
  const [currentWorker, setCurrentWorker] = useState<Worker>(mockWorkers[0]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [regionStats, setRegionStats] = useState<{[key: string]: RegionStats}>({});
  const [coordinationModalVisible, setCoordinationModalVisible] = useState(false);

  useEffect(() => {
    loadAdminData();
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(simulateWorkerActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAdminData = async () => {
    try {
      const storedCans = await AsyncStorage.getItem('trashCans');
      if (storedCans) {
        const cans = JSON.parse(storedCans);
        setAllTrashCans(cans);
        calculateRegionStats(cans);
      }

      const activity = generateMockActivity();
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const calculateRegionStats = (cans: TrashCan[]) => {
    const stats: {[key: string]: RegionStats} = {};
    
    ['A', 'B', 'C'].forEach(region => {
      const regionCans = cans.filter(can => can.region === region);
      stats[region] = regionCans.reduce(
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
    });
    
    setRegionStats(stats);
  };

  const simulateWorkerActivity = () => {
    const activities = [
      'completed region sweep',
      'emptied trash can (was 3/4 full)',
      'flagged can as urgent',
      'reported overflow issue',
      'started inspection round'
    ];

    const randomWorker = mockWorkers[Math.floor(Math.random() * mockWorkers.length)];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    const newActivity: ActivityLog = {
      id: `activity_${Date.now()}`,
      workerId: randomWorker.id,
      workerName: randomWorker.name,
      action: randomActivity,
      timestamp: new Date().toISOString(),
      timeAgo: 'just now'
    };

    setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10 activities
  };

  const switchWorker = () => {
    Alert.alert(
      'Switch Worker',
      'Select worker to simulate:',
      [
        { text: 'Cancel', style: 'cancel' },
        ...mockWorkers.map(worker => ({
          text: worker.name,
          onPress: () => {
            setCurrentWorker(worker);
            Alert.alert('Worker Changed', `Now simulating as ${worker.name}`);
          }
        }))
      ]
    );
  };

  const showCoordinationPanel = () => {
    setCoordinationModalVisible(true);
  };

  const handleWorkerSwitch = (workerId: string) => {
    const worker = mockWorkers.find(w => w.id === workerId);
    if (worker) {
      setCurrentWorker(worker);
      setCoordinationModalVisible(false);
    }
  };

  const sendShiftReport = async () => {
    try {
      const reportData = {
        workerId: currentWorker.id,
        region: 'ALL',
        totalCans: allTrashCans.length,
        urgentCans: allTrashCans.filter(can => can.isOverdue).length,
        completionRate: Math.round(
          ((allTrashCans.length - allTrashCans.filter(can => can.isOverdue).length) / allTrashCans.length) * 100
        )
      };

      const response = await httpService.sendShiftReport(reportData);
      
      if (response.success) {
        Alert.alert(
          'Report Sent',
          `Shift report successfully submitted. Report ID: ${response.data.reportId}`
        );
      } else {
        Alert.alert('Error', 'Failed to send shift report');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error while sending report');
    }
  };

  const navigateToReports = () => {
    navigation.navigate('Reports');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const renderRegionStats = (region: string) => {
    const stats = regionStats[region] || { urgent: 0, attention: 0, recent: 0, unknown: 0 };
    
    return (
      <View key={region} style={styles.regionCard}>
        <Text style={styles.regionTitle}>Region {region}</Text>
        <View style={styles.regionStatsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: '#F44336' }]} />
            <Text style={styles.statNumber}>{stats.urgent}</Text>
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.statNumber}>{stats.attention}</Text>
            <Text style={styles.statLabel}>Attention</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.statNumber}>{stats.recent}</Text>
            <Text style={styles.statLabel}>Recent</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderActivityItem = ({ item }: { item: ActivityLog }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Ionicons name="person" size={20} color="#2196F3" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>
          <Text style={styles.workerName}>{item.workerName}</Text> {item.action}
        </Text>
        <Text style={styles.activityTime}>{item.timeAgo}</Text>
      </View>
    </View>
  );

  const totalCans = allTrashCans.length;
  const urgentCans = allTrashCans.filter(can => can.isOverdue).length;
  const attentionCans = allTrashCans.filter(can => can.fillLevel === '3/4' || can.fillLevel === 'full').length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Overview</Text>
        <Text style={styles.subtitle}>Current Worker: {currentWorker.name}</Text>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{totalCans}</Text>
          <Text style={styles.summaryLabel}>Total Cans</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: '#F44336' }]}>{urgentCans}</Text>
          <Text style={styles.summaryLabel}>Urgent</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: '#FF9800' }]}>{attentionCans}</Text>
          <Text style={styles.summaryLabel}>Attention</Text>
        </View>
      </View>

      {/* Region Breakdown */}
      <View style={styles.regionsContainer}>
        <Text style={styles.sectionTitle}>Region Breakdown</Text>
        {['A', 'B', 'C'].map(renderRegionStats)}
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Live Activity Feed</Text>
        <FlatList
          data={recentActivity.slice(0, 5)}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={switchWorker}>
          <Ionicons name="person-circle" size={20} color="#2196F3" />
          <Text style={styles.actionButtonText}>Switch Worker</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={showCoordinationPanel}>
          <Ionicons name="people" size={20} color="#FF9800" />
          <Text style={[styles.actionButtonText, { color: '#FF9800' }]}>Team Coordination</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={navigateToReports}>
          <Ionicons name="analytics" size={20} color="#2196F3" />
          <Text style={styles.actionButtonText}>Reports</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={sendShiftReport}>
          <Ionicons name="cloud-upload" size={20} color="#4CAF50" />
          <Text style={[styles.actionButtonText, { color: '#4CAF50' }]}>Send Report</Text>
        </TouchableOpacity>
      </View>

      {/* Worker Coordination Modal */}
      <WorkerCoordinationModal
        visible={coordinationModalVisible}
        onClose={() => setCoordinationModalVisible(false)}
        onWorkerSwitch={handleWorkerSwitch}
      />
    </SafeAreaView>
  );
};;

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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginTop: 5,
  },
  summaryContainer: {
    flexDirection: 'row',
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
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  regionsContainer: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  regionCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  regionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  regionStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    marginRight: 10,
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    justifyContent: 'center',
  },
  activityText: {
    fontSize: 14,
    color: '#333',
  },
  workerName: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 11,
  },
});