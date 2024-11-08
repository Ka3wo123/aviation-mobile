export default interface Departure {
    airport: string,
    timezone: string,
    iata: string,
    icao: string, 
    terminal: string,
    gate: string,
    delay: number,
    scheduled: string,
    estimated: string,
    actual: string,
    estimatedRunway: string,
    actualRunway: string
};
