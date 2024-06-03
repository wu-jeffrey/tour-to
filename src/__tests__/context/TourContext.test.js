import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { TourContextProvider, useTourContext } from '../../context/TourContext';

const TestComponent = () => {
  const { locations, setLocations } = useTourContext();

  return (
    <div>
      <ul>
        {locations.map((location) => (
          <li key={location.name}>{location.name}</li>
        ))}
      </ul>
      <button onClick={() => setLocations([{ name: 'New Location', lat: 43.7, lng: -79.4, visiting: false }])}>
        Update Locations
      </button>
    </div>
  );
};

describe('TourContext', () => {
  it('initializes with the correct locations', () => {
    render(
      <TourContextProvider>
        <TestComponent />
      </TourContextProvider>
    );

    expect(screen.getByText('245 Queens Quay W')).toBeInTheDocument();
    expect(screen.getByText('CN Tower')).toBeInTheDocument();
    expect(screen.getByText('Nathan Phillips Square')).toBeInTheDocument();
    expect(screen.getByText('Kensington Market')).toBeInTheDocument();
    expect(screen.getByText('Eaton Centre')).toBeInTheDocument();
  });

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