import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { mockWorkers } from '../data/mockData';

type AppSettings = {
  alertThreshold: number;
  currentWorker: string;
  autoSync: boolean;
  soundEnabled: boolean;
};

export const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    alertThreshold: 120,
    currentWorker: 'worker123',
    autoSync: false,
    soundEnabled: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('appSettings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      setSettings(newSettings);
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const changeAlertThreshold = () => {
    Alert.alert(
      'Alert Threshold',
      'How long before a trash can needs attention?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '1 Hour', onPress: () => updateThreshold(60) },
        { text: '2 Hours', onPress: () => updateThreshold(120) },
        { text: '3 Hours', onPress: () => updateThreshold(180) },
        { text: '4 Hours', onPress: () => updateThreshold(240) },
      ]
    );
  };

  const updateThreshold = async (minutes: number) => {
    const newSettings = { ...settings, alertThreshold: minutes };
    await saveSettings(newSettings);
  };

  const changeWorker = () => {
    Alert.alert(
      'Change Worker',
      'Select current worker:',
      [
        { text: 'Cancel', style: 'cancel' },
        ...mockWorkers.map(worker => ({
          text: worker.name,
          onPress: () => updateWorker(worker.id)
        }))
      ]
    );
  };

  const updateWorker = async (workerId: string) => {
    const newSettings = { ...settings, currentWorker: workerId };
    await saveSettings(newSettings);
    
    const worker = mockWorkers.find(w => w.id === workerId);
    Alert.alert('Worker Changed', `Now logged in as ${worker?.name}`);
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all trash can data and logs. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['trashCans', 'emptyingLogs', 'appSettings']);
              Alert.alert('Success', 'All data cleared');
              // Reset to defaults
              const defaultSettings: AppSettings = {
                alertThreshold: 120,
                currentWorker: 'worker123',
                autoSync: false,
                soundEnabled: true
              };
              setSettings(defaultSettings);
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  const exportData = () => {
    Alert.alert(
      'Export Data',
      'Data export functionality would allow sharing reports with event management.',
      [{ text: 'OK' }]
    );
  };

  const getCurrentWorkerName = () => {
    const worker = mockWorkers.find(w => w.id === settings.currentWorker);
    return worker?.name || 'Unknown';
  };

  const renderSettingRow = (
    icon: string, 
    title: string, 
    subtitle?: string, 
    rightComponent?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity 
      style={styles.settingRow} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color="#2196F3" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Worker Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Worker</Text>
          
          {renderSettingRow(
            'person',
            'Current Worker',
            getCurrentWorkerName(),
            <Ionicons name="chevron-forward" size={20} color="#999" />,
            changeWorker
          )}

          {renderSettingRow(
            'sync',
            'Auto-Sync Data',
            'Automatically sync with other devices',
            <Switch
              value={settings.autoSync}
              onValueChange={(enabled) => saveSettings({ ...settings, autoSync: enabled })}
              trackColor={{ false: '#E0E0E0', true: '#2196F3' }}
            />
          )}
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          {renderSettingRow(
            'download',
            'Export Data',
            'Share reports and logs',
            <Ionicons name="chevron-forward" size={20} color="#999" />,
            exportData
          )}

          {renderSettingRow(
            'trash',
            'Clear All Data',
            'Delete all trash can data and logs',
            <Ionicons name="chevron-forward" size={20} color="#F44336" />,
            clearAllData
          )}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          {renderSettingRow(
            'information-circle',
            'App Version',
            'Sanitation Tracker 1.0.0'
          )}

          {renderSettingRow(
            'business',
            'Event',
            'Summer Fair 2025'
          )}
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
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});