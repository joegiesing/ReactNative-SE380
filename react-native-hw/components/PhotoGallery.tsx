import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, Dimensions } from 'react-native';
import PhotoCard from './PhotoCard';
import PhotoModal from './PhotoModal';

interface ImageData {
  id: number;
  url: string;
}

const PhotoGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<ImageData | null>(null);

  const imageData: ImageData[] = [];
  for (let i = 1; i < 70; i++) {
    imageData.push({ id: i, url: `https://picsum.photos/id/${i}/200` });
  }

  // Filter images based on search query (searching by ID)
  const filteredImages = imageData.filter(image =>
    image.id.toString().includes(searchQuery)
  );

  const handlePhotoPress = (photo: ImageData) => {
    setSelectedPhoto(photo);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const screenWidth = Dimensions.get('window').width;
  const numColumns = 3;
  const imageSize = (screenWidth - 40) / numColumns; // 40 for padding

  return (
    <View style={styles.container}>
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

      {selectedPhoto && (
        <PhotoModal 
          photo={selectedPhoto} 
          onClose={handleCloseModal} 
        />
      )}
    </View>
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