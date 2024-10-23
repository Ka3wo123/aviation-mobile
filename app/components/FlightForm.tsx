import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Picker from 'react-native-picker-select';
import FlightData from '../types/FlightData';
import Airport from '../types/Airport';
import { BE_FLIGHT_HOST } from '@env';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

function FlightForm() {
    const navigation = useNavigation();
    const [airports, setAirports] = useState<Airport[]>([]);
    const [departure, setDeparture] = useState<FlightData | null>(null);
    const [arrival, setArrival] = useState<FlightData | null>(null);
    const [flightDate, setFlightDate] = useState<Date>(new Date());
    const [searchTriggered, setSearchTriggered] = useState(false);
    const [retrievedFlights, setRetrievedFlights] = useState<FlightData[]>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await axios.get(`${BE_FLIGHT_HOST}/api/flight-data/airports`);
                const sortedAirports = response.data.sort((a: Airport, b: Airport) =>
                    a.airportName.localeCompare(b.airportName));
                setAirports(sortedAirports);
            } catch (error) {
                console.error('Error fetching airports:', error);
            }
        };

        fetchAirports();
    }, []);

    const handleSearch = async () => {
        setSearchTriggered(true);

        const formattedDate = flightDate.toISOString().slice(0, 10);
        try {
            const response = await axios.get(`${BE_FLIGHT_HOST}/api/flight-data/flights`, {
                params: {
                    departureIata: departure?.departure.iata,
                    arrivalIata: arrival?.arrival.iata,
                    flightDate: formattedDate
                }
            });

            response.data.length === 0 ? ToastAndroid.show("No flights found", ToastAndroid.SHORT) : setRetrievedFlights(response.data);
        } catch (err) {
            console.error(err);
        }

    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFlightDate(selectedDate);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Search Flight</Text>

            <Text style={styles.label}>Origin Airport</Text>
            <Picker
                value={departure?.departure.iata}
                onValueChange={(value) => {
                    const selectedAirport = airports.find(airport => airport.iataCode === value);
                    setDeparture(prevDeparture => ({
                        ...prevDeparture,
                        departure: {
                            ...(prevDeparture?.departure || {}),
                            airport: selectedAirport?.airportName,
                            iata: selectedAirport?.iataCode
                        }
                    } as FlightData));
                }}
                items={airports.map((airport) => ({
                    label: `${airport.airportName} (${airport.iataCode})`,
                    value: airport.iataCode,
                }))}
                style={pickerSelectStyles}
            />

            <Text style={styles.label}>Destination Airport</Text>
            <Picker
                value={arrival?.arrival.iata}
                onValueChange={(value) => {
                    const selectedAirport = airports.find(airport => airport.iataCode === value);
                    setArrival(prevArrival => ({
                        ...prevArrival,
                        arrival: {
                            ...(prevArrival?.arrival || {}),
                            airport: selectedAirport?.airportName,
                            iata: selectedAirport?.iataCode
                        }
                    } as FlightData));
                }}
                items={airports.map((airport) => ({
                    label: `${airport.airportName} (${airport.iataCode})`,
                    value: airport.iataCode,
                }))}
                style={pickerSelectStyles}

            />

            <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text style={styles.label}>Flight Date</Text>
                {flightDate && (
                    <Text style={styles.label}>
                        {flightDate.toLocaleDateString()}
                    </Text>
                )}
            </View>

            <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
                <DateTimePicker
                    value={flightDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <Button title="Search" onPress={handleSearch} />

            {searchTriggered && retrievedFlights.length > 0 && retrievedFlights.map((flight, index) => (
                <View key={index} style={styles.flightContainer}>
                    <Text style={styles.text}>{flight.airline.name || "N/A"}</Text>
                    <Text style={styles.text}>Origin: {flight.departure?.airport || "N/A"}</Text>
                    <Text style={styles.text}>Destination: {flight.arrival?.airport || "N/A"}</Text>
                    <Button title="Add to your flights" onPress={() => { }} />
                </View>
            ))}
        </ScrollView>
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        marginBottom: 20,
    },

});

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: 'black'
    },
    text: {
        fontSize: 14,
        color: 'black'
    },
    flightContainer: {
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
    },
    icon: {
        width: 40,
        height: 40,
        alignSelf: 'center',
    },
});

export default FlightForm;
