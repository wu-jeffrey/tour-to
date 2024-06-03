import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { useTourContext } from '../context/TourContext';

jest.mock('../context/TourContext', () => ({
  TourContextProvider: ({ children }) => <div>{children}</div>,
  useTourContext: jest.fn(),
}));

jest.mock('../components/Map.js', () => ({ style }) => (
  <div data-testid="map" style={style}>
    <div data-testid="marker">245 Queens Quay W</div>
    <div data-testid="marker">CN Tower</div>
    <div data-testid="marker">Nathan Phillips Square</div>
    <div data-testid="marker">Kensington Market</div>
    <div data-testid="marker">Eaton Centre</div>
  </div>
));

describe('App', () => {
  const mockLocations = [
    { name: '245 Queens Quay W', visiting: true, lat: 43.639, lng: -79.381 },
    { name: 'CN Tower', visiting: true, lat: 43.6426, lng: -79.3871 },
    { name: 'Nathan Phillips Square', visiting: true, lat: 43.652, lng: -79.383 },
    { name: 'Kensington Market', visiting: true, lat: 43.654, lng: -79.402 },
    { name: 'Eaton Centre', visiting: true, lat: 43.654, lng: -79.380 },
  ];

  beforeEach(() => {
    useTourContext.mockReturnValue({
      locations: mockLocations,
    });
  });

  it('renders map with locations', () => {
    render(<App />);

    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(5);

    const locationNames = [
      "245 Queens Quay W",
      "CN Tower",
      "Nathan Phillips Square",
      "Kensington Market",
      "Eaton Centre"
    ];

    locationNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('renders TourContextProvider', () => {
    render(<App />);
    expect(useTourContext).toHaveBeenCalled();
    const locations = useTourContext().locations;
    expect(locations).toEqual(mockLocations);
  });
});
