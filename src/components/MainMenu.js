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

  const { locations, setLocations } = useTourContext();
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
  };

  const expandedContent = (
    <div>
      <h1 className="text-xl font-bold mb-4">TourTo</h1>
      <h2 className="text-l font-bold mb-4">🌏 Where do you want to visit?</h2>
      <Checklist options={locationOptions} onChange={handleChecklistChange} />
    </div>
  );

  return (
    <Sidebar expandedContent={expandedContent} />
  )
}

export default MainMenu;
