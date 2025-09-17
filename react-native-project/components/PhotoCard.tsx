import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ImageData } from '../App';

interface PhotoCardProps {
  photo: ImageData;
  onPress: () => void;
  imageSize: number;
}

const PhotoCard = ({ photo, onPress, imageSize }: PhotoCardProps) => {
  return (
    <TouchableOpacity 
      style={[styles.container, { width: imageSize, height: imageSize }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: photo.url }} 
        style={[styles.image, { width: imageSize, height: imageSize }]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 8,
  },
});

export default PhotoCard;