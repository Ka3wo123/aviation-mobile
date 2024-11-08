import Airline from './Airline';
import Arrival from './Arrival';
import Departure from './Departure';
import LiveFlight from './LiveFlight';

export default interface FlighData {
    flightDate: string,
    flightStatus: string,
    departure: Departure,
    arrival: Arrival,
    airline: Airline,
    cityName: string,
    liveFlight: LiveFlight
};
