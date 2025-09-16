import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, Platform } from 'react-native';
import PhotoGallery from './screens/PhotoGallery';
import PhotoDetailScreen from './screens/PhotoDetailScreen';
import PhotoModal from './screens/PhotoModal';
import WeatherAppScreen from './screens/WeatherAppScreen';

export interface ImageData {
  id: number;
  url: string;
}

export type PhotoGalleryStackParamList = {
  PhotoGallery: undefined;
  PhotoDetail: { photo: ImageData };
  PhotoModal: { photo: ImageData };
};

export type WeatherStackParamList = {
  WeatherApp: undefined;
};

export type DrawerParamList = {
  PhotoGalleryStack: undefined;
  WeatherAppStack: undefined;
};

const PhotoGalleryStack = createStackNavigator<PhotoGalleryStackParamList>();
const WeatherStack = createStackNavigator<WeatherStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Photo Gallery Stack Navigator
const PhotoGalleryStackNavigator = () => {
  return (
    <PhotoGalleryStack.Navigator
      id={undefined}
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

// Weather App Stack Navigator
const WeatherStackNavigator = () => {
  return (
    <WeatherStack.Navigator
      id={undefined}
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
      <WeatherStack.Screen 
        name="WeatherApp" 
        component={WeatherAppScreen}
        options={{ title: 'Weather App' }}
      />
    </WeatherStack.Navigator>
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
        id={undefined}
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
            drawerLabel: '📸 Photo Gallery (HW2 & HW3)',
            title: 'Photo Gallery'
          }}
        />
        <Drawer.Screen 
          name="WeatherAppStack" 
          component={WeatherStackNavigator}
          options={{ 
            drawerLabel: '🌤️ Weather App (HW4)',
            title: 'Weather App'
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;