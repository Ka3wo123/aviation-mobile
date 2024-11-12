import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';

const HomeScreen = ({ navigation }: any) => {
  const features = [
    { id: '1', title: 'Airlines', description: 'Get familiar with airlines you want to fly.', screen: 'AirlinesScreen', image: require('../assets/images/airlines.jpg') },
    { id: '2', title: 'Airports Map', description: 'Find airports worldwide.', screen: 'Airports Map', image: require('../assets/images/airports_map.png') },
    { id: '4', title: 'Flights', description: 'Find your flight to your destination.', screen: 'Flight search', image: require('../assets/images/airline-tickets.webp') },
  ];

  const renderCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={features}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardList}
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
  cardList: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black'
  },
  cardDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  cardButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
