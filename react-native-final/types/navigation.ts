// Navigation type definitions following Week 3 patterns

export type RootStackParamList = {
  EventDashboard: undefined;
  MainApp: undefined;
};

export type RootTabParamList = {
  RegionATab: undefined;
  RegionBTab: undefined;
  RegionCTab: undefined;
  AdminTab: undefined;
};

export type RegionStackParamList = {
  RegionList: undefined;
  TrashCanDetail: { canId: string };
};

export type AdminStackParamList = {
  AdminOverview: undefined;
  Reports: undefined;
  Settings: undefined;
};