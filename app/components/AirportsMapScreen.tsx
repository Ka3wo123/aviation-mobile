import React, { useState, useEffect } from "react";
import { SafeAreaView, TouchableOpacity, Text, Modal, View, TextInput, StyleSheet, ScrollView, ActivityIndicator, ToastAndroid, Dimensions, LogBox } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import axios from "axios";
import Airport from "../types/Airport";
import { DrawerLayoutAndroid } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BE_FLIGHT_HOST } from '@env';
import FlighData from "../types/FlightData";
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from "@react-navigation/native";
import NetInfo from '@react-native-community/netinfo';
import { NoInternetView } from "./NoInternet";


const { width, height } = Dimensions.get('window');

LogBox.ignoreLogs(["Warning"]);
export default function MapScreen() {
    const navigation = useNavigation();
    const [airports, setAirports] = useState<Airport[]>([]);
    const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
    const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchCountry, setSearchCountry] = useState('');
    const [arrivals, setArrivals] = useState<FlighData[]>([]);
    const [departures, setDepartures] = useState<FlighData[]>([]);
    const [dataType, setDataType] = useState<'arrivals' | 'departures' | null>(null);
    const [userLocation, setUserLocation] = useState<Region | null>(null);
    const [isConnected, setIsConnected] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {

        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 });
            },
            error => {
                if (error.code === 1) {
                    console.log("Location permission denied. Please enable location services for the app.");
                } else if (error.code === 2) {
                    console.log("Location unavailable. Please check if location services are enabled.");
                } else if (error.code === 3) {
                    console.log("Location request timed out.");
                } else {
                    console.error("Location error:", error);
                }
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );

        const fetchAirports = async () => {
            try {
                const response = await axios.get(`${BE_FLIGHT_HOST}/api/flight-data/airports`);
                setAirports(response.data);
                setFilteredAirports(response.data);
            } catch (error) {
                console.error('Error fetching airports:', error);
            }
        };

        if (isConnected) {
            fetchAirports();
        }

    }, [isConnected]);

    const handleMarkerPress = async (airport: Airport) => {
        setSelectedAirport(airport);

        if(isConnected) {

            try {
                const responseArrivals = await axios.get(`${BE_FLIGHT_HOST}/api/flight-data/arrivals/${airport.iataCode}`);
                const responseDepartures = await axios.get(`${BE_FLIGHT_HOST}/api/flight-data/departures/${airport.iataCode}`);
                setArrivals(responseArrivals.data);
                setDepartures(responseDepartures.data);
            } catch (error) {
                console.error(error);
            }
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

    const handleDepartureClick = (flightData: FlighData) => {
        // @ts-ignore
        navigation.navigate('Flight search', { flightData: flightData });

    };

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
                        initialRegion={userLocation || {
                            latitude: 0,
                            longitude: 0,
                            latitudeDelta: 20,
                            longitudeDelta: 20,
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

                    {!isConnected && <NoInternetView text="To load airports connect with Internet."></NoInternetView>}

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
                                <View style={[styles.modalContent, {
                                    width: width - 40,
                                    height: height - 80
                                }]}>
                                    <Text style={styles.modalTitle}>{selectedAirport.airportName}</Text>
                                    <Text style={{ color: 'black' }}>Country: {selectedAirport.countryName}</Text>
                                    <Text style={{ color: 'black' }}>City: {selectedAirport.cityName ? selectedAirport.cityName : "N/A"}</Text>
                                    <Text style={{ color: 'black' }}>IATA Code: {selectedAirport.iataCode}</Text>
                                    <Text style={{ color: 'black' }}>Phone Number: {selectedAirport.phoneNumber || 'N/A'}</Text>
                                    <Text style={styles.modalSubTitle}>
                                        {dataType === 'arrivals' ? 'Arrivals:' : 'Departures:'}
                                    </Text>
                                    <ScrollView style={styles.arrivalsList}>
                                        {dataType === 'arrivals' ? (
                                            arrivals.length > 0 ? (
                                                arrivals.map((arrival, index) => (
                                                    <View key={index} style={styles.flightItem}>
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
                                                    <TouchableOpacity onPress={() => handleDepartureClick(departure)}>
                                                        <View key={index} style={styles.flightItem}>
                                                            <Text style={styles.arrivalText}>Flight: {departure.airline.name}</Text>
                                                            <Text style={styles.arrivalText}>To: {departure.arrival.airport}</Text>
                                                            <Text style={styles.arrivalText}>Scheduled: {departure.flightDate}</Text>
                                                            <Text style={styles.arrivalText}>Status: {departure.flightStatus}</Text>
                                                        </View>
                                                    </TouchableOpacity>
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
        width: '100%'
    },
    flightItem: {
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#0055ff',
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
    },
});