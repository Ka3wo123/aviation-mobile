import React, { useState, useEffect } from "react";
import { SafeAreaView, TouchableOpacity, Text, Modal, View, TextInput, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import Airport from "../types/Airport";
import { DrawerLayoutAndroid } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BE_FLIGHT_HOST } from '@env';
import FlighData from "../types/FlightData";

export default function MapScreen() {
    const [airports, setAirports] = useState<Airport[]>([]);
    const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
    const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchCountry, setSearchCountry] = useState('');
    const [arrivals, setArrivals] = useState<FlighData[]>([]);
    const [departures, setDepartures] = useState<FlighData[]>([]);
    const [dataType, setDataType] = useState<'arrivals' | 'departures' | null>(null);
    const [loading, setLoading] = useState(false); // New loading state

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await axios.get(`${BE_FLIGHT_HOST}/api/flight-data/airports`);
                setAirports(response.data);
                setFilteredAirports(response.data);
            } catch (error) {
                console.error('Error fetching airports:', error);
            }
        };

        fetchAirports();
    }, []);

    const handleMarkerPress = async (airport: Airport) => {
        setSelectedAirport(airport);

        try {
            setLoading(true);
            const responseArrivals = await axios.get(`${BE_FLIGHT_HOST}/api/flight-data/arrivals/${airport.iataCode}`);
            const responseDepartures = await axios.get(`${BE_FLIGHT_HOST}/api/flight-data/departures/${airport.iataCode}`);
            setArrivals(responseArrivals.data);
            setDepartures(responseDepartures.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
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
                        onPress={() => setSelectedAirport(null)}
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
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.detailsButton} onPress={() => {
                                setDataType('arrivals');
                                setModalVisible(true);
                            }}>
                                <Text style={styles.showMoreText}>Show arrivals</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.detailsButton} onPress={() => {
                                setDataType('departures');
                                setModalVisible(true);
                            }}>
                                <Text style={styles.showMoreText}>Show departures</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                            setSelectedAirport(null);
                            setDataType(null);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            {selectedAirport && (
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>{selectedAirport.airportName}</Text>
                                    <Text style={{ color: 'black' }}>Country: {selectedAirport.countryName}</Text>
                                    <Text style={{ color: 'black' }}>City: {selectedAirport.cityName ? selectedAirport.cityName : "N/A"}</Text>
                                    <Text style={{ color: 'black' }}>IATA Code: {selectedAirport.iataCode}</Text>
                                    <Text style={{ color: 'black' }}>Phone Number: {selectedAirport.phoneNumber || 'N/A'}</Text>
                                    <Text style={styles.modalSubTitle}>
                                        {dataType === 'arrivals' ? 'Arrivals:' : 'Departures:'}
                                    </Text>
                                    <ScrollView style={styles.arrivalsList}>
                                        {loading ? (
                                            <ActivityIndicator size="large" color="#0055ff" />
                                        ) : dataType === 'arrivals' ? (
                                            arrivals.length > 0 ? (
                                                arrivals.map((arrival, index) => (
                                                    <View key={index} style={styles.arrivalItem}>
                                                        <Text style={styles.arrivalText}>Airline: {arrival.airline.name}</Text>
                                                        <Text style={styles.arrivalText}>From: {arrival.departure.airport}</Text>
                                                        <Text style={styles.arrivalText}>Scheduled: {arrival.flightDate}</Text>
                                                        <Text style={styles.arrivalText}>Status: {arrival.flightStatus}</Text>
                                                    </View>
                                                ))
                                            ) : (
                                                <Text style={styles.noArrivalsText}>No arrivals available</Text>
                                            )
                                        ) : (
                                            departures.length > 0 ? (
                                                departures.map((departure, index) => (
                                                    <View key={index} style={styles.arrivalItem}>
                                                        <Text style={styles.arrivalText}>Flight: {departure.airline.name}</Text>
                                                        <Text style={styles.arrivalText}>To: {departure.arrival.airport}</Text>
                                                        <Text style={styles.arrivalText}>Scheduled: {departure.flightDate}</Text>
                                                        <Text style={styles.arrivalText}>Status: {departure.flightStatus}</Text>
                                                    </View>
                                                ))
                                            ) : (
                                                <Text style={styles.noArrivalsText}>No departures available</Text>
                                            )
                                        )}
                                    </ScrollView>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => {
                                            setModalVisible(!modalVisible);

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
    buttonContainer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
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
    detailsButton: {
        backgroundColor: '#0055ff',
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
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black'
    },
    modalSubTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    arrivalsList: {
        maxHeight: 200,
        width: '100%',
    },
    arrivalItem: {
        marginVertical: 5,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    arrivalText: {
        color: 'black',
    },
    noArrivalsText: {
        textAlign: 'center',
        color: 'black',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
