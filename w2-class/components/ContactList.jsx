import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import ContactCard from './ContactCard.jsx';
import Search from './Search.jsx';

const ContactList = ({ contacts }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      <Search onSearchChange ={handleSearchChange} placeholder="Search" />
      <FlatList
        data={filteredContacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ContactCard name={item.name} image={item.image} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create ({
  container: {
    margin: 10,
    flex: 1,
    backgroundColor: 'fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
 

export default ContactList;