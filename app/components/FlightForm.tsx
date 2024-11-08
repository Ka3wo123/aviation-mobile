import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ToastAndroid, TouchableOpacity, TextInput } from 'react-native';
import Picker from 'react-native-picker-select';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BE_FLIGHT_HOST } from '@env';
import FlightData from '../types/FlightData';
import Airport from '../types/Airport';

function FlightForm({ route, navigation }: any) {
    const { flightData } = route?.params || {};
    const [airports, setAirports] = useState<Airport[]>([]);
    const [filteredDepartureAirports, setFilteredDepartureAirports] = useState<Airport[]>([]);
    const [filteredArrivalAirports, setFilteredArrivalAirports] = useState<Airport[]>([]);
    const [departure, setDeparture] = useState<FlightData | null>(null);
    const [arrival, setArrival] = useState<FlightData | null>(null);
    const [flightDate, setFlightDate] = useState<Date>(new Date());
    const [searchTriggered, setSearchTriggered] = useState(false);
    const [retrievedFlights, setRetrievedFlights] = useState<FlightData[]>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [originAirportSearch, setOriginAirportSearch] = useState('');
    const [destinationAirportSearch, setDestinationAirportSearch] = useState('');

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await axios.get(`${BE_FLIGHT_HOST}/api/flight-data/airports`);
                const sortedAirports = response.data.sort((a: Airport, b: Airport) =>
                    a.airportName.localeCompare(b.airportName));
                setAirports(sortedAirports);
                setFilteredDepartureAirports(sortedAirports);
                setFilteredArrivalAirports(sortedAirports);
            } catch (error) {
                ToastAndroid.show('Cannot connect to server', ToastAndroid.SHORT);
            }
        };

        fetchAirports();
    }, []);

    useEffect(() => {
        const filteredDepartures = airports.filter((airport) =>
            airport.airportName.toLowerCase().includes(originAirportSearch.toLowerCase())
        );
        setFilteredDepartureAirports(filteredDepartures);

        const filteredArrivals = airports.filter((airport) =>
            airport.airportName.toLowerCase().includes(destinationAirportSearch.toLowerCase())
        );
        setFilteredArrivalAirports(filteredArrivals);
    }, [originAirportSearch, destinationAirportSearch, airports]);

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
            ToastAndroid.show("Error occurred while fetching airports", ToastAndroid.SHORT);
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFlightDate(selectedDate);
        }
    };

    const handleSaveFlightForUser = () => {

    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Origin airport</Text>
            <TextInput
                style={styles.input}
                value={originAirportSearch}
                onChangeText={(text) => setOriginAirportSearch(text)}
            />

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
                items={filteredDepartureAirports.map((airport) => ({
                    label: `${airport.airportName} (${airport.iataCode})`,
                    value: airport.iataCode,
                }))}
                style={pickerSelectStyles}
            />

            <Text style={styles.label}>Destination airport</Text>
            <TextInput
                style={styles.input}
                value={destinationAirportSearch}
                onChangeText={(text) => setDestinationAirportSearch(text)}
            />

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
                items={filteredArrivalAirports.map((airport) => ({
                    label: `${airport.airportName} (${airport.iataCode})`,
                    value: airport.iataCode,
                }))}
                style={pickerSelectStyles}
            />

            <View style={styles.dateContainer}>
                <Text style={styles.label}>Flight Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.label}>{flightDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
            </View>

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
                    <Button title="Add to your flights" onPress={() => handleSaveFlightForUser()} />
                </View>
            ))}
        </ScrollView>
    );
}

const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        color: 'black',
        paddingRight: 30,
        marginBottom: 20,
        backgroundColor: '#DBDBDB'
    },
});

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: 'black'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
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
    dateContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        marginBottom: 20,
    },
});

export default FlightForm;
