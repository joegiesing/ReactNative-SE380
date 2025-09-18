// HTTP Service for simulated worker coordination
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrashCan, EmptyingLog, ActivityLog, Worker } from '../types/data';
import { mockWorkers } from '../data/mockData';

// Simulate API endpoints for multi-worker coordination
export class HTTPService {
  private static instance: HTTPService;
  private baseURL = 'https://api.sanitationtracker.com'; // Simulated
  
  static getInstance(): HTTPService {
    if (!HTTPService.instance) {
      HTTPService.instance = new HTTPService();
    }
    return HTTPService.instance;
  }

  // Simulate HTTP delay
  private async simulateNetworkDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Simulate API response structure
  private createAPIResponse<T>(data: T, success = true) {
    return {
      success,
      data,
      timestamp: new Date().toISOString(),
      message: success ? 'Operation successful' : 'Operation failed'
    };
  }

  // Update trash can status (simulated POST request)
  async updateTrashCanStatus(canId: string, updates: Partial<TrashCan>): Promise<any> {
    await this.simulateNetworkDelay();

    try {
      // Get current data
      const storedCans = await AsyncStorage.getItem('trashCans');
      const allCans: TrashCan[] = storedCans ? JSON.parse(storedCans) : [];
      
      // Update the specific can
      const updatedCans = allCans.map(can => 
        can.id === canId ? { ...can, ...updates } : can
      );

      // Save back to storage
      await AsyncStorage.setItem('trashCans', JSON.stringify(updatedCans));

      // Simulate other worker activity
      this.simulateOtherWorkerActivity(canId);

      return this.createAPIResponse({
        canId,
        updatedFields: Object.keys(updates),
        lastUpdatedBy: 'current_worker'
      });

    } catch (error) {
      return this.createAPIResponse(null, false);
    }
  }

  // Get live updates from other workers (simulated GET request)
  async getLiveUpdates(): Promise<any> {
    await this.simulateNetworkDelay(200);

    try {
      const storedActivity = await AsyncStorage.getItem('liveActivity') || '[]';
      const activity = JSON.parse(storedActivity);

      return this.createAPIResponse({
        updates: activity.slice(0, 5), // Last 5 updates
        totalActiveWorkers: mockWorkers.length,
        lastSync: new Date().toISOString()
      });

    } catch (error) {
      return this.createAPIResponse(null, false);
    }
  }

  // Send shift report (simulated POST request)
  async sendShiftReport(reportData: any): Promise<any> {
    await this.simulateNetworkDelay(1000);

    try {
      // Store report locally
      const reports = await AsyncStorage.getItem('shiftReports') || '[]';
      const reportsList = JSON.parse(reports);
      
      const newReport = {
        id: `report_${Date.now()}`,
        ...reportData,
        timestamp: new Date().toISOString()
      };

      reportsList.push(newReport);
      await AsyncStorage.setItem('shiftReports', JSON.stringify(reportsList));

      return this.createAPIResponse({
        reportId: newReport.id,
        status: 'submitted',
        message: 'Shift report successfully submitted to event management'
      });

    } catch (error) {
      return this.createAPIResponse(null, false);
    }
  }

  // Simulate coordinated worker activity
  private async simulateOtherWorkerActivity(triggerCanId: string) {
    // 30% chance another worker does something
    if (Math.random() > 0.7) {
      const randomWorker = mockWorkers[Math.floor(Math.random() * mockWorkers.length)];
      const activities = [
        `started inspection in Region ${randomWorker.region}`,
        'completed area sweep',
        'flagged can for maintenance',
        'reported high traffic area'
      ];

      const activity: ActivityLog = {
        id: `activity_${Date.now()}`,
        workerId: randomWorker.id,
        workerName: randomWorker.name,
        action: activities[Math.floor(Math.random() * activities.length)],
        timestamp: new Date().toISOString(),
        timeAgo: 'just now'
      };

      // Store the simulated activity
      const storedActivity = await AsyncStorage.getItem('liveActivity') || '[]';
      const activityList = JSON.parse(storedActivity);
      activityList.unshift(activity); // Add to front
      
      // Keep only last 20 activities
      if (activityList.length > 20) {
        activityList.splice(20);
      }

      await AsyncStorage.setItem('liveActivity', JSON.stringify(activityList));

      // Notify about the update (you could use a callback here)
      console.log(`Simulated activity: ${randomWorker.name} ${activity.action}`);
    }
  }

  // Get team coordination data
  async getTeamStatus(): Promise<any> {
    await this.simulateNetworkDelay(300);

    try {
      const storedCans = await AsyncStorage.getItem('trashCans');
      const allCans: TrashCan[] = storedCans ? JSON.parse(storedCans) : [];

      // Calculate team performance
      const regionStats = ['A', 'B', 'C'].map(region => {
        const regionCans = allCans.filter(can => can.region === region);
        const urgent = regionCans.filter(can => can.isOverdue).length;
        const total = regionCans.length;

        return {
          region,
          urgent,
          total,
          completion: total > 0 ? Math.round(((total - urgent) / total) * 100) : 0,
          assignedWorker: mockWorkers.find(w => w.region === region)?.name
        };
      });

      return this.createAPIResponse({
        regions: regionStats,
        totalWorkers: mockWorkers.length,
        globalCompletion: Math.round(
          regionStats.reduce((acc, r) => acc + r.completion, 0) / regionStats.length
        )
      });

    } catch (error) {
      return this.createAPIResponse(null, false);
    }
  }

  // Simulate emergency alert to all workers
  async sendEmergencyAlert(alertData: { message: string; canId?: string }): Promise<any> {
    await this.simulateNetworkDelay(100);

    try {
      // In a real app, this would push to all devices
      const alert = {
        id: `alert_${Date.now()}`,
        type: 'EMERGENCY',
        message: alertData.message,
        canId: alertData.canId,
        timestamp: new Date().toISOString(),
        acknowledged: false
      };

      // Store alert
      const alerts = await AsyncStorage.getItem('emergencyAlerts') || '[]';
      const alertsList = JSON.parse(alerts);
      alertsList.unshift(alert);

      await AsyncStorage.setItem('emergencyAlerts', JSON.stringify(alertsList));

      return this.createAPIResponse({
        alertId: alert.id,
        sentToWorkers: mockWorkers.length,
        status: 'broadcast'
      });

    } catch (error) {
      return this.createAPIResponse(null, false);
    }
  }
}

// Export singleton instance
export const httpService = HTTPService.getInstance();