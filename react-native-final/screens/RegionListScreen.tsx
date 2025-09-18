import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue
} from 'react-native-reanimated';

import { RegionStackParamList } from '../types/navigation';
import { TrashCan } from '../types/data';
import { generateTrashCans } from '../data/mockData';
import { TrashCanItem } from '../components/TrashCanItem';

type RegionListNavigationProp = NativeStackNavigationProp<RegionStackParamList, 'RegionList'>;

type Props = {
  region: string;
};

export const RegionListScreen: React.FC<Props> = ({ region }) => {
  const navigation = useNavigation<RegionListNavigationProp>();

  const [trashCans, setTrashCans] = useState<TrashCan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Animation values for scroll-based highlighting
  const scrollY = useSharedValue(0);
  const listHeight = useSharedValue(600); // Approximate list height

  useEffect(() => {
    loadTrashCans();
  }, [region]);

  // Animated scroll handler for center highlighting
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const loadTrashCans = async () => {
    try {
      // Try to load from AsyncStorage first
      const storedCans = await AsyncStorage.getItem('trashCans');
      let allCans: TrashCan[];

      if (storedCans) {
        allCans = JSON.parse(storedCans);
      } else {
        // Generate initial data if none exists
        allCans = generateTrashCans();
        await AsyncStorage.setItem('trashCans', JSON.stringify(allCans));
      }

      // Filter for this region
      const regionCans = allCans.filter(can => can.region === region);
      setTrashCans(regionCans);
    } catch (error) {
      console.error('Error loading trash cans:', error);
      // Fallback to generated data
      const allCans = generateTrashCans();
      const regionCans = allCans.filter(can => can.region === region);
      setTrashCans(regionCans);
    }
  };

  const filteredCans = trashCans.filter(can =>
    can.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    can.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCanPress = (canId: string) => {
    navigation.navigate('TrashCanDetail', { canId });
  };

  const renderTrashCan = ({ item, index }: { item: TrashCan; index: number }) => {
    return (
      <TrashCanItem
        item={item}
        index={index}
        scrollY={scrollY}
        listHeight={listHeight}
        onPress={handleCanPress}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Region {region} - Trash Cans</Text>
        <Text style={styles.subtitle}>{filteredCans.length} cans</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID or location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Animated.FlatList
        data={filteredCans}
        renderItem={renderTrashCan}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onLayout={(event) => {
          listHeight.value = event.nativeEvent.layout.height;
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 15,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    padding: 15,
  },
});