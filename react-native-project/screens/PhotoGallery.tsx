import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PhotoGalleryStackParamList, ImageData } from '../App';
import PhotoCard from '../components/PhotoCard';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type PhotoGalleryNavigationProp = StackNavigationProp<PhotoGalleryStackParamList, 'PhotoGallery'>;

const PhotoGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<PhotoGalleryNavigationProp>();

  // Shared values for animations
  const marginVertical = useSharedValue(2);
  const rotation = useSharedValue(0);

  // Generate image data
  const imageData: ImageData[] = [];
  for (let i = 1; i < 70; i++) {
    imageData.push({ id: i, url: `https://picsum.photos/id/${i}/200` });
  }

  // Filter images based on search query
  const filteredImages = imageData.filter(image =>
    image.id.toString().includes(searchQuery)
  );

  // Scroll handler for animations
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // Calculate new margin based on scroll offset
      const newMargin = 2 + event.contentOffset.y / 30;
      // Calculate rotation based on scroll offset
      rotation.value = event.contentOffset.y / 5;

      // Apply margin limits
      if (newMargin < 2) {
        marginVertical.value = 2;
      } else if (newMargin > 20) {
        marginVertical.value = 20;
      } else {
        marginVertical.value = newMargin;
      }
    },
  });

  // Animated style for images
  const animatedStyle = useAnimatedStyle(() => {
    return {
      marginVertical: marginVertical.value,
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handlePhotoPress = (photo: ImageData) => {
    navigation.navigate('PhotoDetail', { photo });
  };

  const screenWidth = Dimensions.get('window').width;
  const numColumns = 3;
  const imageSize = (screenWidth - 40) / numColumns;

  const renderPhotoItem = ({ item }: { item: ImageData }) => (
    <TouchableOpacity 
      onPress={() => handlePhotoPress(item)}
      activeOpacity={0.7}
      style={{ margin: 5 }}
    >
      <Animated.Image
        source={{ uri: item.url }}
        style={[
          {
            width: imageSize,
            height: imageSize,
            borderRadius: 8,
          },
          animatedStyle
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID (e.g., 1, 10, 31)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <Animated.FlatList
        data={filteredImages}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        renderItem={renderPhotoItem}
        style={styles.flatList}
        columnWrapperStyle={numColumns > 1 ? styles.row : null}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ alignItems: 'center', paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  flatList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: 'space-around',
  },
});

export default PhotoGallery;