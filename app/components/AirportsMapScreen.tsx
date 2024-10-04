import React, { useState, useEffect } from "react";
import { SafeAreaView, TouchableOpacity, Text, Modal, View, TextInput, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import Airport from "../types/Airport";
import { DrawerLayoutAndroid } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BE_HOST } from '@env';

export default function MapScreen() {
    const [airports, setAirports] = useState<Airport[]>([]);
    const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
    const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchCountry, setSearchCountry] = useState('');     

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                console.log(BE_HOST)
                const response = await axios.get(`${BE_HOST}/api/flight-data/airports`);
                setAirports(response.data);
                setFilteredAirports(response.data);
            } catch (error) {
                console.error('Error fetching airports:', error);
            }
        };

        fetchAirports();
    }, []);

    const handleMarkerPress = (airport: Airport) => {
        setSelectedAirport(airport);
    };

    const filterAirports = () => {
        const filtered = airports.filter(airport => 
            airport.airportName && airport.countryName &&
            airport.airportName.toLowerCase().startsWith(searchText.toLowerCase()) &&
            airport.countryName.toLowerCase().startsWith(searchCountry.toLowerCase())
        );
        setFilteredAirports(filtered);
    };

    useEffect(() => {
        filterAirports();
    }, [searchText, searchCountry]);

    const renderDrawerContent = () => (
        <View style={styles.drawerContent}>
            <Text style={styles.heading}>Find Airports</Text>
            <TextInput
                style={styles.input}
                placeholder="Search by airport name"
                value={searchText}
                onChangeText={setSearchText}
            />
            <TextInput
                style={styles.input}
                placeholder="Search by country"
                value={searchCountry}
                onChangeText={setSearchCountry}
            />            
        </View>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition="left"
                renderNavigationView={renderDrawerContent}                
                
            >
                <SafeAreaView style={styles.container}>
                    <MapView
                        showsUserLocation
                        style={styles.map}
                        initialRegion={{
                            latitude: 37.7749,
                            longitude: -122.4194,
                            latitudeDelta: 10,
                            longitudeDelta: 10,
                        }}
                    >
                        {filteredAirports.map((airport) => (
                            <Marker
                                key={airport.id}
                                title={airport.airportName}
                                onPress={() => handleMarkerPress(airport)}
                                coordinate={{
                                    latitude: parseFloat(airport.latitude),
                                    longitude: parseFloat(airport.longitude),
                                }}
                            />
                        ))}
                    </MapView>

                    {selectedAirport && (
                        <TouchableOpacity style={styles.showMoreButton} onPress={() => setModalVisible(true)}>
                            <Text style={styles.showMoreText}>Show More</Text>
                        </TouchableOpacity>
                    )}

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                            setSelectedAirport(null);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            {selectedAirport && (
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>{selectedAirport.airportName}</Text>
                                    <Text>Country: {selectedAirport.countryName}</Text>
                                    <Text>City: {selectedAirport.cityName ? selectedAirport.cityName : "N/A"}</Text>
                                    <Text>IATA Code: {selectedAirport.iataCode}</Text>
                                    <Text>Phone Number: {selectedAirport.phoneNumber || 'N/A'}</Text>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => {
                                            setModalVisible(!modalVisible);
                                            setSelectedAirport(null);
                                        }}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </Modal>

                </SafeAreaView>
            </DrawerLayoutAndroid>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    drawerContent: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
        height: '100%',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#B9B9B9',
    },
    showMoreButton: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        marginLeft: -50,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    showMoreText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'black',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    drawerButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    drawerButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
