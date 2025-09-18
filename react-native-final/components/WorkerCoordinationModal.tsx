import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';

import { httpService } from '../services/httpService';
import { ActivityLog } from '../types/data';

type Props = {
  visible: boolean;
  onClose: () => void;
  onWorkerSwitch: (workerId: string) => void;
};

export const WorkerCoordinationModal: React.FC<Props> = ({
  visible,
  onClose,
  onWorkerSwitch
}) => {
  const [liveUpdates, setLiveUpdates] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'syncing'>('connected');

  // Animation values
  const modalScale = useSharedValue(0);
  const connectionDot = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      modalScale.value = withSpring(1);
      loadLiveUpdates();
      
      // Simulate real-time updates every 10 seconds
      const interval = setInterval(loadLiveUpdates, 10000);
      return () => clearInterval(interval);
    } else {
      modalScale.value = withTiming(0);
    }
  }, [visible]);

  useEffect(() => {
    // Animate connection status indicator
    if (connectionStatus === 'syncing') {
      connectionDot.value = withSpring(1.5);
    } else {
      connectionDot.value = withSpring(1);
    }
  }, [connectionStatus]);

  const loadLiveUpdates = async () => {
    setIsLoading(true);
    setConnectionStatus('syncing');

    try {
      const response = await httpService.getLiveUpdates();
      
      if (response.success) {
        setLiveUpdates(response.data.updates || []);
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Error loading live updates:', error);
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateCoordinatedAction = async () => {
    setConnectionStatus('syncing');
    
    try {
      // Simulate updating a random trash can
      const canIds = ['A-001', 'B-003', 'C-005'];
      const randomCanId = canIds[Math.floor(Math.random() * canIds.length)];
      
      const response = await httpService.updateTrashCanStatus(randomCanId, {
        lastEmptied: new Date().toISOString(),
        fillLevel: 'empty' as any,
        isOverdue: false
      });

      if (response.success) {
        Alert.alert(
          'Coordination Success',
          `Simulated: Another worker updated ${randomCanId}`,
          [{ text: 'OK', onPress: loadLiveUpdates }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to coordinate with other workers');
    } finally {
      setConnectionStatus('connected');
    }
  };

  const sendTeamAlert = async () => {
    setConnectionStatus('syncing');
    
    try {
      const response = await httpService.sendEmergencyAlert({
        message: 'High traffic area - additional attention needed',
        canId: 'B-001'
      });

      if (response.success) {
        Alert.alert(
          'Alert Sent',
          `Emergency alert sent to ${response.data.sentToWorkers} workers`
        );
        loadLiveUpdates();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send team alert');
    } finally {
      setConnectionStatus('connected');
    }
  };

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
    };
  });

  const connectionDotStyle = useAnimatedStyle(() => {
    const colors = {
      connected: '#4CAF50',
      disconnected: '#F44336',
      syncing: '#FF9800'
    };

    return {
      backgroundColor: colors[connectionStatus],
      transform: [{ scale: connectionDot.value }],
    };
  });

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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContainer, modalStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Team Coordination</Text>
              <View style={styles.connectionStatus}>
                <Animated.View style={[styles.connectionDot, connectionDotStyle]} />
                <Text style={styles.connectionText}>
                  {connectionStatus === 'connected' && 'Live'}
                  {connectionStatus === 'disconnected' && 'Offline'}
                  {connectionStatus === 'syncing' && 'Syncing...'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Live Activity Feed */}
          <View style={styles.activityContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Live Activity Feed</Text>
              {isLoading && <ActivityIndicator size="small" color="#2196F3" />}
            </View>
            
            <FlatList
              data={liveUpdates}
              renderItem={renderActivityItem}
              keyExtractor={(item) => item.id}
              style={styles.activityList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No recent activity</Text>
              }
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={simulateCoordinatedAction}
            >
              <Ionicons name="sync" size={20} color="#2196F3" />
              <Text style={styles.actionButtonText}>Simulate Worker Action</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={sendTeamAlert}
            >
              <Ionicons name="alert" size={20} color="#FF9800" />
              <Text style={[styles.actionButtonText, { color: '#FF9800' }]}>Send Team Alert</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={loadLiveUpdates}
            >
              <Ionicons name="refresh" size={20} color="#4CAF50" />
              <Text style={[styles.actionButtonText, { color: '#4CAF50' }]}>Refresh Updates</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '100%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
    color: '#666',
  },
  closeButton: {
    padding: 5,
  },
  activityContainer: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  activityList: {
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 10,
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
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  actionsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});