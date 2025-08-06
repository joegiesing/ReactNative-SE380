import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const Search = ({ onSearchChange, placeholder = "Search" }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    onSearchChange(text);
  };

  return (
    <View style={styles.searchContainer}>
        <Icon name="search" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
    </View>
  );
  
};

const styles = StyleSheet.create ({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginTop: 25,
    margin: 10,
    width: '90%',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  }
});

export default Search;