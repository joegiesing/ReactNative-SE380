import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Platform, Text } from 'react-native';

// Photo Gallery Screens
import PhotoGallery from './screens/PhotoGallery';
import PhotoDetailScreen from './screens/PhotoDetailScreen';
import PhotoModal from './screens/PhotoModal';

// Weather App Screens  
import CurrentWeatherScreen from './screens/CurrentWeatherScreen';
import ForecastTabScreen from './screens/ForecastTabScreen';

// Scanner App Screens
import ScannerScreen from './screens/ScannerScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';

// Week 6 Screens
import ShakeToChargeScreen from './screens/ShakeToChargeScreen'; // Class assignment
import ShakeChargeHomeworkScreen from './screens/ShakeChargeHomeworkScreen'; // Homework assignment

// Data Types
export interface ImageData {
  id: number;
  url: string;
}

// Navigation Types
export type PhotoGalleryStackParamList = {
  PhotoGallery: undefined;
  PhotoDetail: { photo: ImageData };
  PhotoModal: { photo: ImageData };
};

export type WeatherStackParamList = {
  WeatherTabs: undefined;
};

export type ScannerStackParamList = {
  Scanner: undefined;
  ProductDetail: { productId: number; productUrl: string };
  Favorites: undefined;
};

export type DrawerParamList = {
  PhotoGalleryStack: undefined;
  WeatherAppStack: undefined;
  ScannerAppStack: undefined;
  ShakeToChargeStack: undefined;
  ShakeChargeHomeworkStack: undefined;
};

// Create navigators
const Drawer = createDrawerNavigator<DrawerParamList>();
const PhotoGalleryStack = createStackNavigator<PhotoGalleryStackParamList>();
const WeatherStack = createStackNavigator<WeatherStackParamList>();
const ScannerTab = createBottomTabNavigator<ScannerStackParamList>();

// Photo Gallery Stack Navigator
const PhotoGalleryStackNavigator = () => {
  return (
    <PhotoGalleryStack.Navigator>
      <PhotoGalleryStack.Screen 
        name="PhotoGallery" 
        component={PhotoGallery}
        options={{ title: 'Photo Gallery' }}
      />
      <PhotoGalleryStack.Screen 
        name="PhotoDetail" 
        component={PhotoDetailScreen}
        options={{ title: 'Photo Detail', headerShown: false }}
      />
      <PhotoGalleryStack.Screen 
        name="PhotoModal" 
        component={PhotoModal}
        options={{ 
          presentation: 'modal',
          headerShown: false
        }}
      />
    </PhotoGalleryStack.Navigator>
  );
};

// Weather Stack Navigator
const WeatherStackNavigator = () => {
  return (
    <WeatherStack.Navigator>
      <WeatherStack.Screen 
        name="WeatherTabs" 
        component={ForecastTabScreen}
        options={{ headerShown: false }}
      />
    </WeatherStack.Navigator>
  );
};

// Scanner Tab Navigator (Midterm Project)
const ScannerTabNavigator = () => {
  return (
    <ScannerTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E1E1E1',
        },
      }}
    >
      <ScannerTab.Screen 
        name="Scanner" 
        component={ScannerScreen}
        options={{
          tabBarLabel: 'Scanner',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📱</Text>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Scanner');
          },
        })}
      />
      <ScannerTab.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{
          tabBarLabel: 'Product',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📦</Text>
          ),
        }}
      />
      <ScannerTab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>♥</Text>
          ),
        }}
      />
    </ScannerTab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === 'android'}
      />
      <Drawer.Navigator
        initialRouteName="PhotoGalleryStack"
        screenOptions={{
          headerShown: false,
          drawerPosition: 'right',
          drawerType: 'back',
          swipeEnabled: true,
          drawerStyle: {
            backgroundColor: '#f8f9fa',
            width: 300,
          },
          drawerActiveTintColor: '#007AFF',
          drawerInactiveTintColor: '#666',
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
          },
        }}
      >
        <Drawer.Screen 
          name="PhotoGalleryStack" 
          component={PhotoGalleryStackNavigator}
          options={{ 
            drawerLabel: 'Photo Gallery (HW2 & HW3 + Week 7)',
            title: 'Photo Gallery'
          }}
        />
        <Drawer.Screen 
          name="WeatherAppStack" 
          component={WeatherStackNavigator}
          options={{ 
            drawerLabel: 'Weather App (HW4)',
            title: 'Weather App'
          }}
        />
        <Drawer.Screen 
          name="ScannerAppStack" 
          component={ScannerTabNavigator}
          options={{ 
            drawerLabel: 'QR Scanner (Midterm)',
            title: 'QR Scanner'
          }}
        />
        <Drawer.Screen 
          name="ShakeToChargeStack" 
          component={ShakeToChargeScreen}
          options={{ 
            drawerLabel: 'Shake to Charge (Week 6 Class)',
            title: 'Shake to Charge - Class',
            headerShown: true,
          }}
        />
        <Drawer.Screen 
          name="ShakeChargeHomeworkStack" 
          component={ShakeChargeHomeworkScreen}
          options={{ 
            drawerLabel: 'Shake to Charge (Week 6 HW)',
            title: 'Shake to Charge - Homework',
            headerShown: true,
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;