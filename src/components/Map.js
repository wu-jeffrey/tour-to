import React, { useState, useEffect } from 'react';
import { Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

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
  const { locations, directions } = useTourContext();
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: true,
      suppressInfoWindows: true,
    }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsRenderer) return;

    directionsRenderer.setDirections(directions);
  }, [directionsRenderer, directions])

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
