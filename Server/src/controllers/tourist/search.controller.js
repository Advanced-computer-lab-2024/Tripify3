
export const getFlightsData = async (req, res) => {
  try {
    const { departure_id, arrival_id, outbound_date, return_date, currency, adults, children, travel_class } = req.query;

    const api_key = "de80a715fb7b2a263088186c9dfee87c570a478b991ed8ada2eb4de009f86ad5";

    const apiUrl = `https://serpapi.com/search.json?engine=google_flights&departure_id=${departure_id}&arrival_id=${arrival_id}&outbound_date=${outbound_date}&return_date=${return_date}&currency=${currency}&hl=en&api_key=${api_key}&adults=${adults}&children=${children}&travel_class=${travel_class}`;

    const response = await axios.get(apiUrl);
    const flightData = response.data;

    console.log("status", response.status);

    console.log(flightData);

    // Format the flight data
    // Finna use a spread operator to merge 2 arrays one of best_flights and the other of other_flights
    const formattedData = [
      ...flightData.best_flights.map((flight) => ({
        airline: flight.flights[0].airline,
        flightNumber: flight.flights[0].flight_number,
        departure: {
          airport: flight.flights[0].departure_airport.name,
          time: flight.flights[0].departure_airport.time,
        },
        arrival: {
          airport: flight.flights[0].arrival_airport.name,
          time: flight.flights[0].arrival_airport.time,
        },
        duration: flight.total_duration,
        price: flight.price,
        travelClass: flight.flights[0].travel_class,
        airlineLogo: flight.airline_logo,
      })),
      ...flightData.other_flights.map((flight) => ({
        airline: flight.flights[0].airline,
        flightNumber: flight.flights[0].flight_number,
        departure: {
          airport: flight.flights[0].departure_airport.name,
          time: flight.flights[0].departure_airport.time,
        },
        arrival: {
          airport: flight.flights[0].arrival_airport.name,
          time: flight.flights[0].arrival_airport.time,
        },
        duration: flight.total_duration,
        price: flight.price,
        travelClass: flight.flights[0].travel_class,
        airlineLogo: flight.airline_logo,
      })),
    ];

    // Send the formatted data back to the frontend
    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching flight data:", error);
    res.status(500).json({ message: "Error fetching flight data" });
  }
};
