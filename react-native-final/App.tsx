// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import { StatusBar } from 'expo-status-bar';

// // Import screens
// import { EventDashboardScreen } from './screens/EventDashboardScreen';
// import { RegionListScreen } from './screens/RegionListScreen';
// import { TrashCanDetailScreen } from './screens/TrashCanDetailScreen';
// import { AdminOverviewScreen } from './screens/AdminOverviewScreen';
// import { ReportsScreen } from './screens/ReportsScreen';
// import { SettingsScreen } from './screens/SettingsScreen';

// // Import types
// import { RootStackParamList, RootTabParamList, RegionStackParamList, AdminStackParamList } from './types/navigation';

// // Create navigators
// const RootStack = createNativeStackNavigator<RootStackParamList>();
// const Tab = createBottomTabNavigator<RootTabParamList>();
// const RegionStack = createNativeStackNavigator<RegionStackParamList>();
// const AdminStack = createNativeStackNavigator<AdminStackParamList>();

// // Region Stack Navigator Components
// function RegionANavigator() {
//   return (
//     <RegionStack.Navigator>
//       <RegionStack.Screen 
//         name="RegionList" 
//         options={{ title: "Region A" }}
//       >
//         {(props) => <RegionListScreen {...props} region="A" />}
//       </RegionStack.Screen>
//       <RegionStack.Screen 
//         name="TrashCanDetail" 
//         component={TrashCanDetailScreen}
//         options={{ title: 'Trash Can Details' }}
//       />
//     </RegionStack.Navigator>
//   );
// }

// function RegionBNavigator() {
//   return (
//     <RegionStack.Navigator>
//       <RegionStack.Screen 
//         name="RegionList" 
//         options={{ title: "Region B" }}
//       >
//         {(props) => <RegionListScreen {...props} region="B" />}
//       </RegionStack.Screen>
//       <RegionStack.Screen 
//         name="TrashCanDetail" 
//         component={TrashCanDetailScreen}
//         options={{ title: 'Trash Can Details' }}
//       />
//     </RegionStack.Navigator>
//   );
// }

// function RegionCNavigator() {
//   return (
//     <RegionStack.Navigator>
//       <RegionStack.Screen 
//         name="RegionList" 
//         options={{ title: "Region C" }}
//       >
//         {(props) => <RegionListScreen {...props} region="C" />}
//       </RegionStack.Screen>
//       <RegionStack.Screen 
//         name="TrashCanDetail" 
//         component={TrashCanDetailScreen}
//         options={{ title: 'Trash Can Details' }}
//       />
//     </RegionStack.Navigator>
//   );
// }

// // Admin Stack Navigator
// function AdminStackNavigator() {
//   return (
//     <AdminStack.Navigator>
//       <AdminStack.Screen 
//         name="AdminOverview" 
//         component={AdminOverviewScreen}
//         options={{ title: 'Admin Overview' }}
//       />
//       <AdminStack.Screen 
//         name="Reports" 
//         component={ReportsScreen}
//         options={{ title: 'Reports' }}
//       />
//       <AdminStack.Screen 
//         name="Settings" 
//         component={SettingsScreen}
//         options={{ title: 'Settings' }}
//       />
//     </AdminStack.Navigator>
//   );
// }

// // Main Tab Navigator
// function MainTabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName: any;

//           if (route.name === 'RegionATab') {
//             iconName = focused ? 'location' : 'location-outline';
//           } else if (route.name === 'RegionBTab') {
//             iconName = focused ? 'business' : 'business-outline';
//           } else if (route.name === 'RegionCTab') {
//             iconName = focused ? 'musical-notes' : 'musical-notes-outline';
//           } else if (route.name === 'AdminTab') {
//             iconName = focused ? 'settings' : 'settings-outline';
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: '#2196F3',
//         tabBarInactiveTintColor: 'gray',
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen 
//         name="RegionATab" 
//         component={RegionANavigator}
//         options={{ title: 'Region A' }}
//       />
//       <Tab.Screen 
//         name="RegionBTab" 
//         component={RegionBNavigator}
//         options={{ title: 'Region B' }}
//       />
//       <Tab.Screen 
//         name="RegionCTab" 
//         component={RegionCNavigator}
//         options={{ title: 'Region C' }}
//       />
//       <Tab.Screen 
//         name="AdminTab" 
//         component={AdminStackNavigator}
//         options={{ title: 'Admin' }}
//       />
//     </Tab.Navigator>
//   );
// }

// // Root App Component
// export default function App() {
//   return (
//     <NavigationContainer>
//       <StatusBar style="auto" />
//       <RootStack.Navigator screenOptions={{ headerShown: false }}>
//         <RootStack.Screen 
//           name="EventDashboard" 
//           component={EventDashboardScreen} 
//         />
//         <RootStack.Screen 
//           name="MainApp" 
//           component={MainTabNavigator} 
//         />
//       </RootStack.Navigator>
//     </NavigationContainer>
//   );
// }

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Import screens
import { EventDashboardScreen } from './screens/EventDashboardScreen';
import { RegionListScreen } from './screens/RegionListScreen';
import { TrashCanDetailScreen } from './screens/TrashCanDetailScreen';
import { AdminOverviewScreen } from './screens/AdminOverviewScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

// Import types
import { RootStackParamList, RootTabParamList, RegionStackParamList, AdminStackParamList } from './types/navigation';

// Create navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const RegionStack = createNativeStackNavigator<RegionStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();

// Create individual region screen components
const RegionAScreen = () => <RegionListScreen region="A" />;
const RegionBScreen = () => <RegionListScreen region="B" />;
const RegionCScreen = () => <RegionListScreen region="C" />;

// Region Stack Navigator Components
function RegionANavigator() {
  return (
    <RegionStack.Navigator>
      <RegionStack.Screen 
        name="RegionList" 
        component={RegionAScreen}
        options={{ title: "Region A" }}
      />
      <RegionStack.Screen 
        name="TrashCanDetail" 
        component={TrashCanDetailScreen}
        options={{ title: 'Trash Can Details' }}
      />
    </RegionStack.Navigator>
  );
}

function RegionBNavigator() {
  return (
    <RegionStack.Navigator>
      <RegionStack.Screen 
        name="RegionList" 
        component={RegionBScreen}
        options={{ title: "Region B" }}
      />
      <RegionStack.Screen 
        name="TrashCanDetail" 
        component={TrashCanDetailScreen}
        options={{ title: 'Trash Can Details' }}
      />
    </RegionStack.Navigator>
  );
}

function RegionCNavigator() {
  return (
    <RegionStack.Navigator>
      <RegionStack.Screen 
        name="RegionList" 
        component={RegionCScreen}
        options={{ title: "Region C" }}
      />
      <RegionStack.Screen 
        name="TrashCanDetail" 
        component={TrashCanDetailScreen}
        options={{ title: 'Trash Can Details' }}
      />
    </RegionStack.Navigator>
  );
}

// Admin Stack Navigator
function AdminStackNavigator() {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen 
        name="AdminOverview" 
        component={AdminOverviewScreen}
        options={{ title: 'Admin Overview' }}
      />
      <AdminStack.Screen 
        name="Reports" 
        component={ReportsScreen}
        options={{ title: 'Reports' }}
      />
      <AdminStack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </AdminStack.Navigator>
  );
}

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'RegionATab') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'RegionBTab') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'RegionCTab') {
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          } else if (route.name === 'AdminTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="RegionATab" 
        component={RegionANavigator}
        options={{ title: 'Region A' }}
      />
      <Tab.Screen 
        name="RegionBTab" 
        component={RegionBNavigator}
        options={{ title: 'Region B' }}
      />
      <Tab.Screen 
        name="RegionCTab" 
        component={RegionCNavigator}
        options={{ title: 'Region C' }}
      />
      <Tab.Screen 
        name="AdminTab" 
        component={AdminStackNavigator}
        options={{ title: 'Admin' }}
      />
    </Tab.Navigator>
  );
}

// Root App Component
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen 
          name="EventDashboard" 
          component={EventDashboardScreen} 
        />
        <RootStack.Screen 
          name="MainApp" 
          component={MainTabNavigator} 
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}