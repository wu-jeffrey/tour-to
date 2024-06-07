import React from 'react';
import { Map } from '@vis.gl/react-google-maps';

import MapMarker from './MapMarker';
import { useTourContext } from '../context/TourContext';

const MapWrapper = ({
  style,
  mapId,
  defaultZoom = 14,
  defaultCenter = { lat: 43.6532, lng: -79.4132 },
  defaultTilt = 30,
  ...props
}) => {
  const { locations } = useTourContext();

  return (
    <Map
      data-testid="map"
      style={style}
      defaultZoom={defaultZoom}
      defaultCenter={defaultCenter}
      defaultTilt={defaultTilt}
      mapId={mapId}
      disableDefaultUI
      {...props}
    >
      {locations.map((location, index) => (
        <MapMarker location={location} key={index} />
      ))}
    </Map>
  );
};

export default MapWrapper;
