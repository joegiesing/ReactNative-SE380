// Data type definitions for the app

export type FillLevel = 'empty' | '1/4' | '1/2' | '3/4' | 'full';

export type TrashCan = {
  id: string;
  region: string;
  location: string;
  lastEmptied: string;
  fillLevel: FillLevel;
  alertThreshold: number; // minutes
  isOverdue: boolean;
};

export type Worker = {
  id: string;
  name: string;
  region: string;
};

export type EmptyingLog = {
  id: string;
  canId: string;
  workerId: string;
  timestamp: string;
  fillLevelWhenEmptied: FillLevel;
  region: string;
};

export type ActivityLog = {
  id: string;
  workerId: string;
  workerName: string;
  action: string;
  canId?: string;
  timestamp: string;
  timeAgo: string;
};

export type RegionStats = {
  urgent: number;
  attention: number;
  recent: number;
  unknown: number;
};