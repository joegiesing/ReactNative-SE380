import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

interface ImageData {
  id: number;
  url: string;
}

interface PhotoModalProps {
  photo: ImageData;
  onClose: () => void;
}

const PhotoModal = ({ photo, onClose }: PhotoModalProps) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  const largerImageUrl = `https://picsum.photos/id/${photo.id}/400`;

  return (
    <TouchableOpacity 
      style={styles.modalOverlay}
      onPress={onClose}
      activeOpacity={1}
    >
      <Image 
        source={{ uri: largerImageUrl }} 
        style={[styles.modalImage, { 
          width: screenWidth * 0.9, 
          height: screenWidth * 0.9 
        }]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalImage: {
    borderRadius: 8,
  },
});

export default PhotoModal;