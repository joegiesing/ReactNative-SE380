import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, Platform } from 'react-native';
import PhotoGallery from './components/PhotoGallery';
import PhotoDetailScreen from './components/PhotoDetailScreen';
import PhotoModal from './components/PhotoModal';

export interface ImageData {
  id: number;
  url: string;
}

export type StackParamList = {
  PhotoGallery: undefined;
  PhotoDetail: { photo: ImageData };
  PhotoModal: { photo: ImageData };
};

const Stack = createStackNavigator<StackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === 'android'}
      />
      <Stack.Navigator
        initialRouteName="PhotoGallery"
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
        <Stack.Screen 
          name="PhotoGallery" 
          component={PhotoGallery}
          options={{ title: 'Photo Gallery' }}
        />
        <Stack.Screen 
          name="PhotoDetail" 
          component={PhotoDetailScreen}
          options={{ title: 'Photo Detail' }}
        />
        <Stack.Screen 
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;