import Airline from './Airline';
import Arrival from './Arrival';
import Departure from './Departure';
import LiveFlight from './LiveFlight';

export type FlightId = {
    $oid: string, 
}

export default interface FlightData {
    id: FlightId,
    flightDate: string,
    flightStatus: string,
    departure: Departure,
    arrival: Arrival,
    airline: Airline,
    cityName: string,
    liveFlight: LiveFlight
};
