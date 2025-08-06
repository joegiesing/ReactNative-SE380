import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const ContactCard = ({ name, image }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    minWidth: '100%',
    marginTop: 10,
    padding: 5,
    backgroundColor: 'lightgray',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginEnd: 10,
  },
  name: {
    fontSize: 30,
  }
});
 

export default ContactCard;