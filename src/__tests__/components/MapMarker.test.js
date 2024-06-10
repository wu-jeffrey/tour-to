import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useTourContext } from '../../context/TourContext';
import { useModalContext } from '../../context/ModalContext';
import MapMarker from '../../components/MapMarker';

jest.mock('../../context/TourContext');
jest.mock('../../context/ModalContext.js');
jest.mock('@vis.gl/react-google-maps', () => {
  // Need Re-declare variables (i.e. React) inside the mock scope otherwise we'll get a ReferenceError
  const React = require('react');
  return {
    AdvancedMarker: React.forwardRef(({ children, position, title, onClick, zIndex }, ref) => (
      <div data-testid="advanced-marker" data-title={title} onClick={onClick} style={{ zIndex }} ref={ref}>
        {children}
      </div>
    )),
    InfoWindow: ({ children, onClose, anchor }) => (
      <div data-testid="info-window">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ),
    useAdvancedMarkerRef: () => [React.createRef(), {}],
  };
});

const mockLocation = {
  id: 1,
  name: 'Test Location',
  lat: 43.6532,
  lng: -79.3832,
  visiting: true,
};

const mockContext = {
  currentLocationId: 1,
  setCurrentLocationId: jest.fn(),
};

describe('MapMarker', () => {
  beforeEach(() => {
    useTourContext.mockReturnValue(mockContext);
    useModalContext.mockReturnValue({
      isOpen: false,
      closeModal: jest.fn(),
      modalContent: null,
    });
  });

  it('renders without crashing', () => {
    render(<MapMarker location={mockLocation} />);
    expect(screen.getByTestId('advanced-marker')).toBeInTheDocument();
  });

  it('displays the location name correctly', () => {
    render(<MapMarker location={mockLocation} />);
    expect(screen.getByTestId('advanced-marker')).toHaveAttribute('data-title', 'Test Location');
  });

  it('calls setCurrentLocationId on marker click', () => {
    render(<MapMarker location={mockLocation} />);
    fireEvent.click(screen.getByTestId('advanced-marker'));
    expect(mockContext.setCurrentLocationId).toHaveBeenCalledWith(mockLocation.id);
  });

  it('renders InfoWindow when the current location ID matches', () => {
    render(<MapMarker location={mockLocation} />);
    expect(screen.getByTestId('info-window')).toBeInTheDocument();
  });

  it('does not render InfoWindow when the current location ID does not match', () => {
    useTourContext.mockReturnValue({
      ...mockContext,
      currentLocationId: 2,
    });
    render(<MapMarker location={mockLocation} />);
    expect(screen.queryByTestId('info-window')).toBeNull();
  });

  it('handles close button in InfoWindow', () => {
    render(<MapMarker location={mockLocation} />);
    fireEvent.click(screen.getByText('Close'));
    expect(mockContext.setCurrentLocationId).toHaveBeenCalledWith(null);
  });

  it('does not render marker if location is invalid', () => {
    const invalidLocation = { id: null, name: null, lat: null, lng: null };
    render(<MapMarker location={invalidLocation} />);
    expect(screen.queryByTestId('advanced-marker')).toBeNull();
  });
});
