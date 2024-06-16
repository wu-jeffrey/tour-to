import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTourContext } from '../../context/TourContext';
import MapWrapper from '../../components/Map';

jest.mock('../../context/TourContext');
jest.mock('@vis.gl/react-google-maps', () => ({
  Map: ({ children, defaultZoom, defaultCenter, defaultTilt, mapId, disableDefaultUI, ...props }) => (
    <div {...props}>{children}</div>
  ),
  useMap: () => ({}),
  useMapsLibrary: (library) => {
    if (library === 'routes') {
      return {
        DirectionsRenderer: jest.fn().mockImplementation(() => ({
          setMap: jest.fn(),
          setDirections: jest.fn(),
        })),
      };
    }
    return null;
  },
}));

jest.mock('../../components/MapMarker', () => ({ location }) => (
  <div data-testid="marker" data-title={location.name}>
    {location.name}
  </div>
));

const mockLocations = [
  { name: 'Location 1', visiting: true, lat: 43.6532, lng: -79.3832 },
  { name: 'Location 2', visiting: false, lat: 43.6510, lng: -79.3800 },
  { name: 'Location 3', visiting: true, lat: 43.6500, lng: -79.3870 },
];

const mockDirections = {
  routes: [{
    legs: [
      { start_address: 'Location 1', end_address: 'Location 3' }
    ]
  }]
};

describe('MapWrapper', () => {
  beforeEach(() => {
    useTourContext.mockReturnValue({
      locations: mockLocations,
      directions: mockDirections,
    });
  });

  it('renders without crashing', () => {
    render(<MapWrapper style={{ height: '100vh', width: '100%' }} />);
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  it('renders markers for all locations', () => {
    render(<MapWrapper style={{ height: '100vh', width: '100%' }} />);
    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(3);
    expect(markers[0]).toHaveAttribute('data-title', 'Location 1');
    expect(markers[1]).toHaveAttribute('data-title', 'Location 2');
    expect(markers[2]).toHaveAttribute('data-title', 'Location 3');
  });

  it('renders markers with correct location names', () => {
    render(<MapWrapper style={{ height: '100vh', width: '100%' }} />);
    const markers = screen.getAllByTestId('marker');
    const visitingMarkers = markers.filter(marker => mockLocations.find(location => location.name === marker.getAttribute('data-title') && location.visiting));
    expect(visitingMarkers).toHaveLength(2);
    expect(visitingMarkers[0]).toHaveAttribute('data-title', 'Location 1');
    expect(visitingMarkers[1]).toHaveAttribute('data-title', 'Location 3');
  });
});
