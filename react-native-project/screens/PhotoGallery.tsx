import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PhotoGalleryStackParamList, ImageData } from '../App';
import PhotoCard from '../components/PhotoCard';

type PhotoGalleryNavigationProp = StackNavigationProp<PhotoGalleryStackParamList, 'PhotoGallery'>;

const PhotoGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<PhotoGalleryNavigationProp>();

  // Generate image data
  const imageData: ImageData[] = [];
  for (let i = 1; i < 70; i++) {
    imageData.push({ id: i, url: `https://picsum.photos/id/${i}/200` });
  }

  // Filter images based on search query
  const filteredImages = imageData.filter(image =>
    image.id.toString().includes(searchQuery)
  );

  const handlePhotoPress = (photo: ImageData) => {
    navigation.navigate('PhotoDetail', { photo });
  };

  const screenWidth = Dimensions.get('window').width;
  const numColumns = 3;
  const imageSize = (screenWidth - 40) / numColumns;

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
      
      <FlatList
        data={filteredImages}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <PhotoCard 
            photo={item} 
            onPress={() => handlePhotoPress(item)}
            imageSize={imageSize}
          />
        )}
        style={styles.flatList}
        columnWrapperStyle={numColumns > 1 ? styles.row : null}
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