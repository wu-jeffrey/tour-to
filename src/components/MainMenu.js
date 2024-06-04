import React, { useState, useEffect } from "react";

import { useTourContext } from '../context/TourContext';
import Sidebar from "./ui/Sidebar"
import Checklist from "./ui/Checklist"

const MainMenu = () => {
  const locationToOption = (location, index) => ({
    id: index,
    label: location.name,
    checked: location.visiting,
    disabled: location.required,
  });

  const { locations, setLocations, currentLocationId, setCurrentLocationId } = useTourContext();
  const [locationOptions, setLocationOptions] = useState(locations.map(locationToOption));

  useEffect(() => {
    setLocationOptions(locations.map(locationToOption));
  }, [locations]);

  const handleChecklistChange = (updatedItems) => {
    const updatedLocations = locations.map((location, index) => ({
      ...location,
      visiting: updatedItems[index].checked,
    }));

    setLocations(updatedLocations);
    if (updatedLocations.find((location) => location.id === currentLocationId)?.visiting === false) {
      setCurrentLocationId(null);
    }
  };

  const handleNavigation = (direction) => {
    if (!currentLocationId) {
      setCurrentLocationId(locations.find((location) => location.visiting).id); // Go to the first location to visit
      return;
    }

    const locationsToVisit = locations.filter((location) => location.visiting);

    const currentIndex = locationsToVisit.findIndex((location) => location.id === currentLocationId);
    let newIndex;


    if (direction === 'next') {
      newIndex = (currentIndex + 1) % locationsToVisit.length;
    } else if (direction === 'prev') {
      newIndex = (currentIndex - 1 + locationsToVisit.length) % locationsToVisit.length;
    }

    setCurrentLocationId(locationsToVisit[newIndex].id);
  };

  const handleNextClicked = () => handleNavigation('next');
  const handlePrevClicked = () => handleNavigation('prev');

  const expandedContent = (
    <div>
      <h1 className="text-xl font-bold mb-4">TourTo</h1>
      <h2 className="text-l font-bold mb-4">🌏 Where do you want to visit?</h2>
      <Checklist key={JSON.stringify(locationOptions)} options={locationOptions} onChange={handleChecklistChange} />
      <h2 className="text-l font-bold mt-8">🚀 Ready to start your tour?</h2>
      {currentLocationId && ("Current Location: " + locations.find((location) => location.id === currentLocationId).name)}
      <div className="flex mt-2 justify-center">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-l" onClick={handlePrevClicked}>
          Prev
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r" onClick={handleNextClicked}>
          Next
        </button>
      </div>
    </div>
  );

  return (
    <Sidebar expandedContent={expandedContent} />
  )
}

export default MainMenu;
