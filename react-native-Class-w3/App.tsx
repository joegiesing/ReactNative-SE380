import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type StackParamList = {
  Home: undefined;
  Details: { itemId: number; otherParam?: string };
  Modal: undefined;
  Profile: { userId: number };
};

const Stack = createStackNavigator<StackParamList>();

// Home Screen
type HomeScreenNavigationProp = StackNavigationProp<StackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() =>
          navigation.navigate('Details', { itemId: 123, otherParam: 'test' })
        }
      />
      <Button
        title="Open Modal"
        onPress={() => navigation.navigate('Modal')}
      />
      <Button
        title="View Profile"
        onPress={() => navigation.navigate('Profile', { userId: 456 })}
      />
    </View>
  );
}

// Details Screen
type DetailsScreenNavigationProp = StackNavigationProp<StackParamList, 'Details'>;
type DetailsScreenRouteProp = RouteProp<StackParamList, 'Details'>;

export function DetailsScreen() {
  const { params } = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<DetailsScreenNavigationProp>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {params.itemId}</Text>
      <Text>otherParam: {params.otherParam}</Text>
      <Button title="Go to Home" onPress={() => navigation.goBack()} />
    </View>
  );
}

// Modal Screen
type ModalScreenNavigationProp = StackNavigationProp<StackParamList, 'Modal'>;

export function ModalScreen() {
  const navigation = useNavigation<ModalScreenNavigationProp>();

  const closeAndNavigate = () => {
    const unsubscribe = navigation.addListener('transitionEnd', () => {
      navigation.navigate('Details', { itemId: 123, otherParam: 'test' });
      unsubscribe();
    });

    navigation.dispatch(StackActions.pop(1));
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Modal</Text>
      <Button title="Go to details" onPress={closeAndNavigate} />
    </View>
  );
}

// Profile Screen - NEW SCREEN FOR ASSIGNMENT
type ProfileScreenNavigationProp = StackNavigationProp<StackParamList, 'Profile'>;
type ProfileScreenRouteProp = RouteProp<StackParamList, 'Profile'>;

export function ProfileScreen() {
  const { params } = useRoute<ProfileScreenRouteProp>();
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Text>User ID: {params.userId}</Text>
      <Text>Welcome to your profile!</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details', { itemId: 789, otherParam: 'from profile' })}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            headerTitle: 'My Custom Title',
            headerTitleStyle: { color: 'red' },
            headerStyle: { backgroundColor: 'pink' },
            headerBackTitle: 'Custom Back',
          }}
        />
        <Stack.Screen
          name="Modal"
          component={ModalScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerTitle: 'User Profile',
            headerStyle: { backgroundColor: '#4CAF50' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}