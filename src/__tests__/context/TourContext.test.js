import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { TourContextProvider, useTourContext } from '../../context/TourContext';
import { getPlaceLocation } from '../../api/googlePlacesApi';

const TestComponent = () => {
  const {
    locations, setLocations,
    currentLocationId, setCurrentLocationId
  } = useTourContext();

  return (
    <div>
      {currentLocationId && <div data-testid="current-location-id">{currentLocationId.name}</div>}
      <ul>
        {locations.map((location) => (
          <li key={location.name}>{location.name}</li>
        ))}
      </ul>
      <button onClick={() => setLocations([{ name: 'New Location', lat: 43.7, lng: -79.4, visiting: false }])}>
        Update Locations
      </button>
      <button onClick={() => setCurrentLocationId("currentLocationId")}>
        Update Current Location ID
      </button>
    </div>
  );
};

describe('TourContext', () => {
  it('allows updating the locations', () => {
    render(
      <TourContextProvider>
        <TestComponent />
      </TourContextProvider>
    );

    const updateButton = screen.getByText('Update Locations');
    act(() => {
      updateButton.click();
    });
    expect(screen.queryByText('245 Queens Quay W')).toBeNull();
    expect(screen.getByText('New Location')).toBeInTheDocument();
  });

  it('allows updating the current location ID', () => {
    render(
      <TourContextProvider>
        <TestComponent />
      </TourContextProvider>
    );

    const updateButton = screen.getByText('Update Current Location ID');
    act(() => {
      updateButton.click();
    });
    expect(screen.getByTestId('current-location-id')).toBeInTheDocument();
  });

  it('throws an error if useTourContext is used outside of TourContextProvider', () => {
    const ErrorComponent = () => {
      try {
        useTourContext();
      } catch (error) {
        return <div>{error.message}</div>;
      }
      return null;
    };

    render(<ErrorComponent />);

    expect(screen.getByText('useTourContext must be used within a TourContextProvider')).toBeInTheDocument();
  });
});
