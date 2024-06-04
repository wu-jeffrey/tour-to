import React from 'react';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

import { useTourContext } from '../context/TourContext';

const MapWrapper = ({
  style,
  mapId,
  defaultZoom = 14,
  defaultCenter = { lat: 43.6532, lng: -79.4132 },
  defaultTilt = 30,
  ...props
}) => {
  const { locations, currentLocationId } = useTourContext();

  return (
    <Map
      data-testid="map"
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
        >
          <Pin
            background={'#22ccff'}
            borderColor={'#1e89a1'}
            glyphColor={'#0f677a'}
            scale={location.id === currentLocationId ? 2 : 1}
          />
        </AdvancedMarker>
      ))}
    </Map>
  );
};

export default MapWrapper;
