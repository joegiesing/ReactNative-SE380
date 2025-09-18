import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TrashCan, EmptyingLog } from '../types/data';

export const ReportsScreen: React.FC = () => {
  const [trashCans, setTrashCans] = useState<TrashCan[]>([]);
  const [emptyingLogs, setEmptyingLogs] = useState<EmptyingLog[]>([]);
  const [dailyStats, setDailyStats] = useState({
    totalCansEmptied: 0,
    urgentCans: 0,
    averageFillLevel: 0,
    completionRate: 0
  });

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      // Load trash cans
      const storedCans = await AsyncStorage.getItem('trashCans');
      if (storedCans) {
        const cans = JSON.parse(storedCans);
        setTrashCans(cans);
        calculateDailyStats(cans);
      }

      // Load emptying logs
      const storedLogs = await AsyncStorage.getItem('emptyingLogs');
      if (storedLogs) {
        const logs = JSON.parse(storedLogs);
        setEmptyingLogs(logs);
      }
    } catch (error) {
      console.error('Error loading reports data:', error);
    }
  };

  const calculateDailyStats = (cans: TrashCan[]) => {
    const today = new Date().toDateString();
    const todayLogs = emptyingLogs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    );

    const urgentCans = cans.filter(can => can.isOverdue).length;
    const fillLevels: number[] = cans.map(can => {
      switch (can.fillLevel) {
        case 'empty': return 0;
        case '1/4': return 25;
        case '1/2': return 50;
        case '3/4': return 75;
        case 'full': return 100;
        default: return 0;
      }
    });

    const averageFillLevel = fillLevels.reduce((sum, level) => sum + level, 0) / fillLevels.length;
    const completionRate = ((cans.length - urgentCans) / cans.length) * 100;

    setDailyStats({
      totalCansEmptied: todayLogs.length,
      urgentCans,
      averageFillLevel: Math.round(averageFillLevel),
      completionRate: Math.round(completionRate)
    });
  };

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={24} color="white" />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Daily Reports</Text>
          <Text style={styles.subtitle}>{new Date().toLocaleDateString()}</Text>
        </View>

        {/* Daily Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today's Performance</Text>
          
          {renderStatCard(
            'Cans Emptied',
            dailyStats.totalCansEmptied,
            'checkmark-circle',
            '#4CAF50'
          )}
          
          {renderStatCard(
            'Urgent Cans',
            dailyStats.urgentCans,
            'warning',
            '#F44336'
          )}
          
          {renderStatCard(
            'Avg Fill Level',
            `${dailyStats.averageFillLevel}%`,
            'analytics',
            '#2196F3'
          )}
          
          {renderStatCard(
            'Completion Rate',
            `${dailyStats.completionRate}%`,
            'trophy',
            '#FF9800'
          )}
        </View>

        {/* Region Breakdown */}
        <View style={styles.regionContainer}>
          <Text style={styles.sectionTitle}>Region Performance</Text>
          
          {['A', 'B', 'C'].map(region => {
            const regionCans = trashCans.filter(can => can.region === region);
            const regionUrgent = regionCans.filter(can => can.isOverdue).length;
            const regionTotal = regionCans.length;
            const regionCompletion = regionTotal > 0 ? 
              Math.round(((regionTotal - regionUrgent) / regionTotal) * 100) : 0;

            return (
              <View key={region} style={styles.regionCard}>
                <View style={styles.regionHeader}>
                  <Text style={styles.regionTitle}>Region {region}</Text>
                  <Text style={styles.regionCompletion}>{regionCompletion}%</Text>
                </View>
                <View style={styles.regionStats}>
                  <Text style={styles.regionStat}>Total: {regionTotal}</Text>
                  <Text style={styles.regionStat}>Urgent: {regionUrgent}</Text>
                  <Text style={styles.regionStat}>
                    Completed: {regionTotal - regionUrgent}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Recent Activity Summary */}
        <View style={styles.activitySummary}>
          <Text style={styles.sectionTitle}>Shift Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Ionicons name="time" size={20} color="#666" />
              <Text style={styles.summaryText}>
                Shift Duration: 8 hours
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="location" size={20} color="#666" />
              <Text style={styles.summaryText}>
                Regions Covered: A, B, C (24 total cans)
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="people" size={20} color="#666" />
              <Text style={styles.summaryText}>
                Active Workers: 3 team members
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 15,
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  regionContainer: {
    marginBottom: 25,
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
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  regionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  regionCompletion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  regionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  regionStat: {
    fontSize: 12,
    color: '#666',
  },
  activitySummary: {
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
});