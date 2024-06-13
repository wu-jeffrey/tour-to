import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPlaceLocation } from '../api/googlePlacesApi';
import { getDirections } from '../api/googleRoutesApi';


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

      Promise.all(promises).then(_locations => {
        setLocations(_locations)
      });
    };

    fetchLocations();
  }, [setLocations]);

  useEffect(() => {
    async function fetchData() {
      if (locations.length === 0) {
        return;
      }
      const originPlaceId = locations[0]?.id;
      const destinationPlaceId = locations[locations.length - 1]?.id;
      const waypointPlaceIds = locations.slice(1, locations.length - 1).filter(l => l.visiting).map(l => l.id);

      const response = await getDirections(originPlaceId, destinationPlaceId, waypointPlaceIds);
      const data = await response.json();
      console.log(data);
    }
    fetchData();

    // const worker = new Worker(new URL('../fakeWebsocketWorker.js', import.meta.url));

    // worker.postMessage({
    //   originPlaceId: locations[0]?.id,
    //   destinationPlaceId: locations[locations.length - 1]?.id,
    //   waypointPlaceIds: locations.slice(1, locations.length - 1).filter(l => l.visiting).map(l => l.id),
    // });

    // worker.onmessage = function (e) {
    //   console.log('Message received from worker:', e.data);
    // };

    // return () => {
    //   worker.postMessage('terminate');
    // };
  }, [locations]);

  const value = {
    locations,
    setLocations,
    currentLocationId,
    setCurrentLocationId,
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
