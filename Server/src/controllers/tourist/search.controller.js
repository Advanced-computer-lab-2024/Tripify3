import axios from "axios";
import { log } from "console";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const getFlightsData = async (req, res) => {
  try {
    const { departure_id, arrival_id, outbound_date, currency, adults, children, travel_class } = req.query;

    const api_key = process.env.GOOGLE_API_KEY;

    const apiUrl = `https://serpapi.com/search.json?engine=google_flights&departure_id=${departure_id}&arrival_id=${arrival_id}&outbound_date=${outbound_date}&currency=${currency}&hl=en&api_key=${api_key}&adults=${adults}&children=${children}&travel_class=${travel_class}&stops=1&type=2`;
    console.log(apiUrl);

    const response = await axios.get(apiUrl);
    const flightData = response.data;

    console.log("status", response.status);

    console.log(flightData);

    // Format the flight data
    // Finna use a spread operator to merge 2 arrays one of best_flights and the other of other_flights
    const formattedData = [
      ...(flightData.best_flights || [])
        .filter((flight) => flight.price != null) // Filter out flights with no price
        .map((flight) => ({
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
      ...(flightData.other_flights || [])
        .filter((flight) => flight.price != null) // Filter out flights with no price
        .map((flight) => ({
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

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cityData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../utils/eg.json"), "utf-8"));

// find the nearest city
const getCityFromCoordinates = (latitude, longitude) => {
  let closestCity = null;
  let minDistance = Infinity;

  cityData.forEach((city) => {
    const cityLat = parseFloat(city.lat);
    const cityLng = parseFloat(city.lng);

    // Calculate distance using Haversine formula
    const distance = Math.sqrt(Math.pow(cityLat - latitude, 2) + Math.pow(cityLng - longitude, 2));

    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city.city;
    }
  });

  return closestCity || "Unknown City";
};

export const getHotels = async (req, res) => {
  try {
    const { check_in_date, check_out_date, adults, children, children_ages } = req.query;
    const api_key = process.env.GOOGLE_API_KEY;

    let apiUrl = `https://serpapi.com/search?engine=google_hotels&gl=eg&hl=en&q=egypt hotels&api_key=${api_key}&check_in_date=${check_in_date}&check_out_date=${check_out_date}&adults=${adults}`;

    if (children > 0) {
      apiUrl += `&children=${children}&children_ages=${children_ages}`;
    }

    console.log(apiUrl);
    const response = await axios.get(apiUrl);
    const hotelData = response.data.properties;

    const filteredHotels = hotelData.filter((hotel) => hotel.total_rate && hotel.images);

    // Add city to each filtered hotel
    const hotelsWithCity = filteredHotels.map((hotel) => {
      const { latitude, longitude } = hotel.gps_coordinates;
      const city = getCityFromCoordinates(latitude, longitude);
      return { ...hotel, city };
    });

    res.status(200).json({ Hotels: hotelsWithCity });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get directions of start address to end address
export const getDirections = async (req, res) => {
  try {
    const { src, dest } = req.query;
    const api_key = process.env.GOOGLE_API_KEY;

    let apiUrl = `https://serpapi.com/search?engine=google_maps_directions&api_key=${api_key}&gl=eg&hl=en&start_addr=${src}&end_addr=${dest}&travel_mode=0`;

    const response = await axios.get(apiUrl);
    console.log(response.data);

    const details = response.data.places_info;
    const distance = response.data.directions[0].formatted_distance;
    console.log(distance);
    const distanceInKm = parseFloat(distance.replace(/[^\d.-]/g, ""));
    console.log(distanceInKm);

    const time = response.data.directions[0].formatted_duration;
    console.log(time);

    const directions = response.data.directions[0].trips[0];
    const price = 200;

    res.status(200).json({ detials: details, directions: directions, distance: distance, time: time, distanceInKm: distanceInKm });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

//Get suggestions for places as i'm typing
export const getSuggestions = async (req, res) => {
  try {
    const { city, place } = req.query;
    const coards = getcoards(city);
    console.log(coards);
    const api_key = process.env.GOOGLE_API_KEY;

    let apiUrl = `https://serpapi.com/search.json?engine=google_maps_autocomplete&hl=en&gl=eg&api_key=${api_key}&q=${place}&ll=@${coards.lat},${coards.lng},16z`;

    console.log(apiUrl);

    const response = await axios.get(apiUrl);
    const suggestions = response.data.suggestions;
    if (!suggestions || suggestions.length === 0) {
      return res.status(404).json({ message: "No suggestions found." });
    }

    const filteredSuggestions = suggestions.map((suggestion) => ({
      value: suggestion.value,
      subtext: suggestion.subtext,
    }));
    res.status(200).json(filteredSuggestions);
  } catch (error) {
    console.error("Error in getSuggestions:", error);
  }
};

const getcoards = (cityName) => {
  // Read and parse the JSON file
  const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../utils/eg.json"), "utf-8"));
  // Find the city in the JSON data
  const cityData = data.find((city) => city.city.toLowerCase() === cityName.toLowerCase());

  // Return lat and lng if city is found, otherwise null
  if (cityData) {
    return { lat: cityData.lat, lng: cityData.lng };
  } else {
    return null; // City not found
  }
};
