import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTourContext } from '../../context/TourContext';
import MapWrapper from '../../components/Map';

jest.mock('../../context/TourContext');
jest.mock('@vis.gl/react-google-maps', () => ({
  Map: ({ children, defaultZoom, defaultCenter, defaultTilt, mapId, ...props }) => (
    <div {...props}>{children}</div>
  ),
  AdvancedMarker: ({ position, title, onClick }) => (
    <div data-testid="marker" data-title={title} onClick={onClick}>
      {title}
    </div>
  ),
  Pin: ({ background, borderColor, glyphColor, scale }) => (
    <div
      data-testid="pin"
      style={{
        background,
        borderColor,
        glyphColor,
        transform: `scale(${scale})`
      }}
    />
  ),
}));

const mockLocations = [
  { name: 'Location 1', visiting: true, lat: 43.6532, lng: -79.3832 },
  { name: 'Location 2', visiting: false, lat: 43.6510, lng: -79.3800 },
  { name: 'Location 3', visiting: true, lat: 43.6500, lng: -79.3870 },
];

describe('MapWrapper', () => {
  beforeEach(() => {
    useTourContext.mockReturnValue({
      locations: mockLocations,
    });
  });

  it('renders without crashing', () => {
    render(<MapWrapper style={{ height: '100vh', width: '100%' }} />);
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  it('renders markers for visiting locations', () => {
    render(<MapWrapper style={{ height: '100vh', width: '100%' }} />);
    const markers = screen.getAllByTestId('marker');
    expect(markers).toHaveLength(2);
    expect(markers[0]).toHaveAttribute('data-title', 'Location 1');
    expect(markers[1]).toHaveAttribute('data-title', 'Location 3');
  });

  it('does not render markers for non-visiting locations', () => {
    render(<MapWrapper style={{ height: '100vh', width: '100%' }} />);
    expect(screen.queryByTestId('Location 2')).toBeNull();
  });

});
