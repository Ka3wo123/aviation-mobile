import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }: any) => {
  const features = [
    { id: '1', title: 'Airports', screen: 'AirportsScreen' },
    { id: '2', title: 'Cities', screen: 'CitiesScreen' },
    { id: '3', title: 'Airlines', screen: 'AirlinesScreen' },
    { id: '4', title: 'Flights', screen: 'FlightsScreen' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Aviation App</Text>
      <FlatList
        data={features}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.buttonText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
      <Button 
        title="Log Out" 
        onPress={() => {
          // Handle logout logic here
        }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default HomeScreen;
