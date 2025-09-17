import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { StatusBar, Platform, Text } from 'react-native';
import PhotoGallery from './screens/PhotoGallery';
import PhotoDetailScreen from './screens/PhotoDetailScreen';
import PhotoModal from './screens/PhotoModal';
import CurrentWeatherScreen from './screens/CurrentWeatherScreen';
import ForecastTabScreen from './screens/ForecastTabScreen';
import ScannerScreen from './screens/ScannerScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';

export interface ImageData {
  id: number;
  url: string;
}

export type PhotoGalleryStackParamList = {
  PhotoGallery: undefined;
  PhotoDetail: { photo: ImageData };
  PhotoModal: { photo: ImageData };
};

export type WeatherDrawerParamList = {
  CurrentWeather: undefined;
  Forecast: undefined;
};

export type WeatherStackParamList = {
  WeatherDrawer: undefined;
};

export type ScannerStackParamList = {
  Scanner: undefined;
  ProductDetail: { 
    productId: number; 
    productUrl: string; 
  };
};

export type ScannerTabParamList = {
  ScannerTab: NavigatorScreenParams<ScannerStackParamList>;
  FavoritesTab: undefined;
};

export type DrawerParamList = {
  PhotoGalleryStack: undefined;
  WeatherAppStack: undefined;
  ScannerAppStack: NavigatorScreenParams<ScannerTabParamList>;
};

const PhotoGalleryStack = createStackNavigator<PhotoGalleryStackParamList>();
const WeatherStack = createStackNavigator<WeatherStackParamList>();
const WeatherDrawer = createDrawerNavigator<WeatherDrawerParamList>();
const ScannerStack = createStackNavigator<ScannerStackParamList>();
const ScannerTab = createBottomTabNavigator<ScannerTabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Photo Gallery Stack Navigator
const PhotoGalleryStackNavigator = () => {
  return (
    <PhotoGalleryStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <PhotoGalleryStack.Screen 
        name="PhotoGallery" 
        component={PhotoGallery}
        options={{ title: 'Photo Gallery' }}
      />
      <PhotoGalleryStack.Screen 
        name="PhotoDetail" 
        component={PhotoDetailScreen}
        options={{ title: 'Photo Detail' }}
      />
      <PhotoGalleryStack.Screen 
        name="PhotoModal" 
        component={PhotoModal}
        options={{
          presentation: 'modal',
          headerStyle: {
            backgroundColor: '#000',
            borderBottomWidth: 0,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTintColor: '#fff',
          headerTitle: '',
        }}
      />
    </PhotoGalleryStack.Navigator>
  );
};

// Weather App Drawer Navigator
const WeatherDrawerNavigator = () => {
  return (
    <WeatherDrawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerPosition: 'left',
        drawerType: 'back',
        swipeEnabled: true,
        drawerStyle: {
          backgroundColor: '#f8f9fa',
          width: 280,
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#666',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <WeatherDrawer.Screen 
        name="CurrentWeather" 
        component={CurrentWeatherScreen}
        options={{ 
          drawerLabel: 'Current Weather',
          title: 'Current Weather'
        }}
      />
      <WeatherDrawer.Screen 
        name="Forecast" 
        component={ForecastTabScreen}
        options={{ 
          drawerLabel: 'Forecast',
          title: 'Weather Forecast'
        }}
      />
    </WeatherDrawer.Navigator>
  );
};

// Weather App Stack Navigator
const WeatherStackNavigator = () => {
  return (
    <WeatherStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <WeatherStack.Screen 
        name="WeatherDrawer" 
        component={WeatherDrawerNavigator}
      />
    </WeatherStack.Navigator>
  );
};

// Scanner Stack Navigator (contains Scanner and ProductDetail)
const ScannerStackNavigator = () => {
  return (
    <ScannerStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <ScannerStack.Screen 
        name="Scanner" 
        component={ScannerScreen}
        options={{ 
          title: 'QR Code Scanner',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
        }}
      />
      <ScannerStack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ 
          title: 'Product Details',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
        }}
      />
    </ScannerStack.Navigator>
  );
};

// Scanner Tab Navigator (main scanner app structure)
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
          borderTopColor: '#e0e0e0',
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
      }}
    >
      <ScannerTab.Screen 
        name="ScannerTab" 
        component={ScannerStackNavigator}
        options={{
          tabBarLabel: 'Scanner',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📷</Text>
          ),
        }}
      />
      <ScannerTab.Screen 
        name="FavoritesTab" 
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
            width: 280,
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
            drawerLabel: 'Photo Gallery (HW2 & HW3)',
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
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;