import { TrashCan, Worker, ActivityLog } from '../types/data';

// Generate initial trash can data - 8 cans per region
export const generateTrashCans = (): TrashCan[] => {
  const regionALocations = [
    'Main Gate', 'Info Booth', 'Ticket Counter', 'Entrance Plaza',
    'Parking Lot A', 'Bus Stop', 'Main Walkway', 'Security Checkpoint'
  ];

  const regionBLocations = [
    'Food Court Center', 'Pizza Stand', 'Ice Cream Vendor', 'BBQ Area',
    'Beverage Station', 'Picnic Tables', 'Food Truck Row', 'Vendor Plaza'
  ];

  const regionCLocations = [
    'Main Stage', 'Kids Area', 'Game Booths', 'Ferris Wheel',
    'Concert Lawn', 'Dance Floor', 'Photo Booth', 'Entertainment Tent'
  ];

  const allLocations = [
    ...regionALocations.map((location, index) => ({ region: 'A', location, id: `A-${String(index + 1).padStart(3, '0')}` })),
    ...regionBLocations.map((location, index) => ({ region: 'B', location, id: `B-${String(index + 1).padStart(3, '0')}` })),
    ...regionCLocations.map((location, index) => ({ region: 'C', location, id: `C-${String(index + 1).padStart(3, '0')}` }))
  ];

  return allLocations.map(({ id, region, location }) => {
    const hoursAgo = Math.floor(Math.random() * 8) + 1;
    const lastEmptied = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
    const fillLevels: Array<'empty' | '1/4' | '1/2' | '3/4' | 'full'> = ['empty', '1/4', '1/2', '3/4', 'full'];
    const fillLevel = fillLevels[Math.floor(Math.random() * fillLevels.length)];
    const alertThreshold = 120; // 2 hours in minutes

    return {
      id,
      region,
      location,
      lastEmptied,
      fillLevel,
      alertThreshold,
      isOverdue: hoursAgo > 2
    };
  });
};

// Mock workers for simulation
export const mockWorkers: Worker[] = [
  { id: 'worker123', name: 'John Smith', region: 'A' },
  { id: 'worker456', name: 'Sarah Johnson', region: 'B' },
  { id: 'worker789', name: 'Mike Chen', region: 'C' }
];

// Generate mock activity log for landing page
export const generateMockActivity = (): ActivityLog[] => {
  const activities = [
    'emptied A-001 (was 3/4 full)',
    'flagged B-007 as urgent',
    'completed Region A sweep',
    'emptied C-003 (was 1/2 full)',
    'started Region B inspection',
    'reported C-005 overflow'
  ];

  return activities.map((action, index) => {
    const minutesAgo = (index + 1) * 3 + Math.floor(Math.random() * 5);
    const worker = mockWorkers[Math.floor(Math.random() * mockWorkers.length)];
    
    return {
      id: `activity_${index}`,
      workerId: worker.id,
      workerName: worker.name,
      action,
      timestamp: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
      timeAgo: `${minutesAgo} min ago`
    };
  });
};