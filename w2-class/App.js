import { SafeAreaView, StyleSheet } from 'react-native';
import ContactList from './components/ContactList.jsx';

const CONTACTS = [
  {
    id: '1',
    name: 'Dennis',
    image: 'https://reactnative.dev/img/tiny_logo.png',
  },
  {
    id: '2',
    name: 'Sweet Dee',
    image: 'https://reactnative.dev/img/tiny_logo.png',
  },
  {
    id: '3',
    name: 'Frank',
    image: 'https://reactnative.dev/img/tiny_logo.png',
  },
  {
    id: '4',
    name: 'Mac',
    image: 'https://reactnative.dev/img/tiny_logo.png',
  },
];

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ContactList contacts={CONTACTS} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: 'fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

 

export default App;
