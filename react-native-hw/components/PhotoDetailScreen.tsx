import React, { useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../App';

type PhotoDetailNavigationProp = StackNavigationProp<StackParamList, 'PhotoDetail'>;
type PhotoDetailRouteProp = RouteProp<StackParamList, 'PhotoDetail'>;

const PhotoDetailScreen = () => {
  const navigation = useNavigation<PhotoDetailNavigationProp>();
  const route = useRoute<PhotoDetailRouteProp>();
  const { photo } = route.params;

  const screenWidth = Dimensions.get('window').width;
  const imageSize = screenWidth * 0.9;
  
  // Use larger image for detail view
  const detailImageUrl = `https://picsum.photos/id/${photo.id}/400`;

  useEffect(() => {
    navigation.setOptions({
      title: `Photo ${photo.id}`,
      headerRight: () => null,
      headerBackTitle: 'Gallery',
    });
  }, [navigation, photo.id, photo.url]);

  const handleImagePress = () => {
    navigation.navigate('PhotoModal', { photo });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handleImagePress} activeOpacity={0.8}>
          <Image 
            source={{ uri: detailImageUrl }} 
            style={[styles.image, { 
              width: imageSize, 
              height: imageSize 
            }]}
          />
        </TouchableOpacity>
        <Text style={styles.photoUrl}>
          {detailImageUrl}
        </Text>
        <Text style={styles.photoDescription}>
          Photo details: A description of the photo you clicked.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  photoUrl: {
    marginTop: 15,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  photoDescription: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
});

export default PhotoDetailScreen;