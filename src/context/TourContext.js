import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getPlaceLocation } from '../api/googlePlacesApi';
import { initializeDirectionsWS } from '../api/directionsWSApi';

const places = [
  { id: "ChIJAxd7Nio1K4gRcH7M1JG4vdA", visiting: true, required: true }, // 245 Queens Quay W
  { id: "ChIJmzrzi9Y0K4gRgXUc3sTY7RU", visiting: true }, // CN Tower
  { id: "ChIJBxZ2UMw0K4gR1LmKMBvveP0", visiting: true }, // Nathan Phillips Square
  { id: "ChIJ68ICPcI0K4gRDOBbkTJRLUc", visiting: true }, // Kensington Market
  { id: "ChIJvUYHUcs0K4gRN8i7jHsUiYs", visiting: true, required: true }, // Eaton Centre
];

const TourContext = createContext();

export const TourContextProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [currentLocationId, setCurrentLocationId] = useState(null);
  const [directions, setDirections] = useState(null);
  const wsRef = useRef(null);
  const isWebSocketInitialized = useRef(false);

  const getWSPayload = (locations) => {
    const originPlaceId = locations[0]?.id;
    const destinationPlaceId = locations[locations.length - 1]?.id;
    const waypointPlaceIds = locations.slice(1, locations.length - 1).filter(l => l.visiting).map(l => l.id);
    return JSON.stringify({ originPlaceId, destinationPlaceId, waypointPlaceIds })
  }

  useEffect(() => {
    const fetchLocations = async () => {
      const promises = places.map(async (location) => {
        try {
          const place = await getPlaceLocation(location.id);
          return {
            ...location,
            lat: place?.location.latitude,
            lng: place?.location.longitude,
            name: place?.displayName.text,
            address: place?.formattedAddress,
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      });

      const _locations = await Promise.all(promises);
      setLocations(_locations.filter(Boolean));

      if (!isWebSocketInitialized.current) {
        wsRef.current = initializeDirectionsWS({
          onOpen: () => {
            wsRef.current.send(getWSPayload(_locations))
          },
          onMessage: setDirections
        });
        isWebSocketInitialized.current = true;
      }
    };

    fetchLocations();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    }
  }, []);

  useEffect(() => {
    if (locations.length === 0) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(getWSPayload(locations));
  }, [locations]);

  const value = {
    locations,
    setLocations,
    currentLocationId,
    setCurrentLocationId,
    directions,
    setDirections,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
};

export const useTourContext = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTourContext must be used within a TourContextProvider');
  }
  return context;
};
