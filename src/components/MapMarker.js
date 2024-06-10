import React from 'react';
import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { useTourContext } from '../context/TourContext';
import { useModalContext } from '../context/ModalContext';

const MapMarker = ({ location }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const { currentLocationId, setCurrentLocationId } = useTourContext();
  const { openModal } = useModalContext();

  if (!location.id || !location.name || !location.lat || !location.lng) {
    return;
  }

  const handleClick = () => {
    setCurrentLocationId(location.id);
  };

  const getTriangleWidthPx = (locationId) => {
    return currentLocationId === locationId ? '20px' : '10px';
  }

  const getTriangleHeightPx = (locationId) => {
    return currentLocationId === locationId ? '50px' : '35px';
  }

  const getCircleRadiusPx = (locationId) => {
    return currentLocationId === locationId ? '60px' : '30px';
  }

  return (
    <>
      {currentLocationId === location.id && (
        <InfoWindow
          onClose={() => setCurrentLocationId(null)}
          anchor={marker}
          minWidth={200}
          pixelOffset={[0, -90]}
          headerContent={location.name}
        >
          <div>{location.address}</div>
          <button
            className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-md'
            onClick={openModal}
          >Details</button>
        </InfoWindow>
      )}
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: location.lat, lng: location.lng }}
        title={location.name}
        onClick={handleClick}
        zIndex={currentLocationId === location.id ? 99 : 0}
      >
        <div
          className={`
            ${currentLocationId === location.id && "spin3d"}
            ${location.visiting ? "" : "hidden"}
          `}
          style={{
            // border: '2px solid black', // useful for debugging the pinpoint lat/long of the marker
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'translate(-50%, -50%)',
          }}>
          <div
            className="triangle"
            style={{
              position: 'absolute',
              left: '50%',
              transform: `translate(-50%, -${getTriangleHeightPx(location.id)})`,
              width: '0',
              height: '0',
              borderLeft: `${getTriangleWidthPx(location.id)} solid transparent`,
              borderRight: `${getTriangleWidthPx(location.id)} solid transparent`,
              borderTop: `${getTriangleHeightPx(location.id)} solid #ff5722`,
              transition: `
                border-width 0.2s cubic-bezier(.58,-0.41,.49,1.8),
                border-height 0.2s cubic-bezier(.58,-0.41,.49,1.8),
                transform 0.2s linear
              `,
            }}></div>
          <div
            className="cicle"
            style={{
              width: getCircleRadiusPx(location.id),
              height: getCircleRadiusPx(location.id),
              position: 'absolute',
              top: 0,
              left: 0,
              background: '#ffbca6',
              border: '5px solid #ff5722',
              borderRadius: '50%',
              transform: 'translate(-50%, -150%)',
              transition: `
                width 0.2s cubic-bezier(.58,-0.41,.49,1.8),
                height 0.2s cubic-bezier(.58,-0.41,.49,1.8),
                transform 0.2s linear
              `,
            }}></div>

        </div>
      </AdvancedMarker>
    </>
  );
};

export default MapMarker;
