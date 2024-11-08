export default interface UserFlight {
    id: number,
    airline: string,
    aviationUserEmail: string,
    departureAirport: string,
    arrivalAirport: string,
    flightDate: Date,
    departureTerminal: string,
    departureGate: string,
    arrivalTerminal: string,
    arrivalGate: string
};
