import React, { createContext, useContext, useState, useEffect } from 'react';

const _locations = [
  { id: "ChIJAxd7Nio1K4gRcH7M1JG4vdA", name: "245 Queens Quay W", lat: 43.63774957110286, lng: -79.38722802360513, visiting: true, required: true },
  { id: "ChIJmzrzi9Y0K4gRgXUc3sTY7RU", name: "CN Tower", lat: 43.6426, lng: -79.3871, visiting: true },
  { id: "ChIJBxZ2UMw0K4gR1LmKMBvveP0", name: "Nathan Phillips Square", lat: 43.6527069, lng: -79.3859886, visiting: true },
  { id: "ChIJ68ICPcI0K4gRDOBbkTJRLUc", name: "Kensington Market", lat: 43.6548336, lng: -79.4131749, visiting: true },
  { id: "ChIJvUYHUcs0K4gRN8i7jHsUiYs", name: "Eaton Centre", lat: 43.6544382, lng: -79.3832743, visiting: true, required: true },
];

const TourContext = createContext();

export const TourContextProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [currentLocationId, setCurrentLocationId] = useState(null);

  useEffect(() => {
    // Mock initial API call to fetch landmarks from server
    setLocations(_locations);
  }, [setLocations]);

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
