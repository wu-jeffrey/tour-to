import React, { useEffect, useRef } from 'react';
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
  const directionsRendererRef = useRef(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;

    directionsRendererRef.current = new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: true,
      suppressInfoWindows: true,
    });

    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
    };
  }, [routesLibrary, map]);

  useEffect(() => {
    if (directionsRendererRef.current && directions) {
      directionsRendererRef.current.setDirections(directions);
    }
  }, [directions]);

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
