import React, { createContext, useContext, useState, useEffect } from 'react';

const _locations = [
  { name: "245 Queens Quay W", lat: 43.63774957110286, lng: -79.38722802360513, visiting: true, required: true },
  { name: "CN Tower", lat: 43.6426, lng: -79.3871, visiting: true },
  { name: "Nathan Phillips Square", lat: 43.6527069, lng: -79.3859886, visiting: true },
  { name: "Kensington Market", lat: 43.6548336, lng: -79.4131749, visiting: true },
  { name: "Eaton Centre", lat: 43.6544382, lng: -79.3832743, visiting: true, required: true },
];

const TourContext = createContext();

export const TourContextProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Mock initial API call to fetch landmarks from server
    setLocations(_locations);
  }, [setLocations]);

  const value = {
    locations,
    setLocations,
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
