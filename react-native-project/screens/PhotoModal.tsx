import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PhotoGalleryStackParamList } from '../App';

type PhotoModalNavigationProp = StackNavigationProp<PhotoGalleryStackParamList, 'PhotoModal'>;
type PhotoModalRouteProp = RouteProp<PhotoGalleryStackParamList, 'PhotoModal'>;

const PhotoModal = () => {
  const navigation = useNavigation<PhotoModalNavigationProp>();
  const route = useRoute<PhotoModalRouteProp>();
  const { photo } = route.params;

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const imageSize = Math.min(screenWidth * 0.9, screenHeight * 0.7);
  
  // Use high quality image for modal
  const modalImageUrl = `https://picsum.photos/id/${photo.id}/600`;

  // Set modal header options
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#000',
        borderBottomWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
      },
      headerTintColor: '#fff',
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: modalImageUrl }} 
          style={[styles.image, { 
            width: imageSize, 
            height: imageSize 
          }]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 8,
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PhotoModal;