import React from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';

import { useTourContext } from '../context/TourContext';

const MapWrapper = ({
  style,
  mapId,
  defaultZoom = 14,
  defaultCenter = { lat: 43.6532, lng: -79.3832 },
  defaultTilt = 30,
  ...props
}) => {
  const { locations } = useTourContext();

  return (
    <Map
      style={style}
      defaultZoom={defaultZoom}
      defaultCenter={defaultCenter}
      defaultTilt={defaultTilt}
      mapId={mapId}
      {...props}
    >
      {locations.filter(l => l.visiting).map((location, index) => (
        <AdvancedMarker
          key={index}
          position={{ lat: location.lat, lng: location.lng }}
          title={location.name}
          onClick={() => console.log(`Clicked on ${location.name}`)}
        />
      ))}
    </Map>
  );
};

export default MapWrapper;
