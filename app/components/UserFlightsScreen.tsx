import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ToastAndroid, ScrollView } from 'react-native';
import UserFlight from '../types/UserFlight';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BE_USER_HOST } from '@env';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

const CACHE_KEY = "@user_flights_cache";

const YourFlightsScreen = () => {
    const [flights, setFlights] = useState<UserFlight[]>([]);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean | null>(true);

    useFocusEffect(
        useCallback(() => {
            const getEmail = async () => {
                const email = await AsyncStorage.getItem("@user_email");
                setUserEmail(email);
            };

            const getToken = async () => {
                const token = await AsyncStorage.getItem("@access_token");
                setAccessToken(token);
            };

            getEmail();
            getToken();
        }, [])
    );

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchFlights = async () => {
            if (userEmail && accessToken && isConnected) {
                try {
                    const response = await axios.get(`${BE_USER_HOST}/api/user/${userEmail}/flights`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    setFlights(response.data);
                    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
                } catch (err) {
                    console.error(err);
                    ToastAndroid.show(`Error while fetching ${userEmail}'s flights`, ToastAndroid.SHORT);
                }
            } else {
                console.log("userEmail, accessToken, or network connection is missing. Loading cached flights...");
                loadCachedFlights();
            }
        };

        fetchFlights();
    }, [userEmail, accessToken, isConnected]);

    const loadCachedFlights = async () => {
        try {
            const cachedFlights = await AsyncStorage.getItem(CACHE_KEY);
            if (cachedFlights) {
                setFlights(JSON.parse(cachedFlights));
            } else {
                console.log("No cached flights found.");
            }
        } catch (error) {
            console.error("Failed to load cached flights:", error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {!isConnected && (
                <View style={styles.offlineContainer}>
                    <Text style={styles.offlineText}>You are offline. Showing cached flights.</Text>
                </View>
            )}
            {flights.length > 0 ? (
                flights.map((flight) => (
                    <View style={styles.card} key={flight.id}>
                        <Text style={styles.airline}>{flight.airline}</Text>
                        <Text style={styles.flightDetail}>Departure: {flight.departureAirport}</Text>
                        <Text style={styles.flightDetail}>Arrival: {flight.arrivalAirport}</Text>
                        <Text style={styles.flightDetail}>Flight Date: {new Date(flight.flightDate).toLocaleString()}</Text>
                        <Text style={styles.flightDetail}>Departure Terminal: {flight.departureTerminal}</Text>
                        <Text style={styles.flightDetail}>Arrival Terminal: {flight.arrivalTerminal}</Text>
                        <Text style={styles.flightDetail}>Departure Gate: {flight.departureGate}</Text>
                        <Text style={styles.flightDetail}>Arrival Gate: {flight.arrivalGate}</Text>
                    </View>
                ))
            ) : (
                <Text style={{color: 'black'}}>No flights found</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    airline: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'black',
    },
    flightDetail: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    offlineContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    offlineText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});

export default YourFlightsScreen;
