import React from 'react';
import { render, screen } from '@testing-library/react';
import TravelTime from '../../components/TravelTime';
import { useTourContext } from '../../context/TourContext';
import '@testing-library/jest-dom/extend-expect'; // for the "toBeInTheDocument" matcher

jest.mock('../../context/TourContext');
jest.mock('../../components/ui/LoadingDots', () => ({ color }) => (
  <div data-testid="loading-dots">Loading...</div>
));

describe('TravelTime', () => {
  const mockUseTourContext = useTourContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders LoadingDots when travelTimeSeconds is null', () => {
    mockUseTourContext.mockReturnValue({ travelTimeSeconds: null });

    render(<TravelTime />);

    expect(screen.getAllByTestId('loading-dots')).toHaveLength(2);
  });

  it('renders travel time and ETA correctly when travelTimeSeconds is provided', () => {
    const travelTimeSeconds = 3665; // 1 hour, 1 minute, and 5 seconds
    mockUseTourContext.mockReturnValue({ travelTimeSeconds });

    render(<TravelTime />);

    const travelTimeDisplay = screen.getByText('1h 1m 5s');
    const etaString = getExpectedEtaString(travelTimeSeconds);

    expect(travelTimeDisplay).toBeInTheDocument();
    expect(screen.getByText(etaString)).toBeInTheDocument();
  });

  it('renders travel time correctly for short durations', () => {
    const travelTimeSeconds = 65; // 1 minute and 5 seconds
    mockUseTourContext.mockReturnValue({ travelTimeSeconds });

    render(<TravelTime />);

    const travelTimeDisplay = screen.getByText('1m 5s');
    const etaString = getExpectedEtaString(travelTimeSeconds);

    expect(travelTimeDisplay).toBeInTheDocument();
    expect(screen.getByText(etaString)).toBeInTheDocument();
  });

  it('renders travel time correctly for super short durations', () => {
    const travelTimeSeconds = 59; // 59 seconds
    mockUseTourContext.mockReturnValue({ travelTimeSeconds });

    render(<TravelTime />);

    const travelTimeDisplay = screen.getByText('59s');
    const etaString = getExpectedEtaString(travelTimeSeconds);

    expect(travelTimeDisplay).toBeInTheDocument();
    expect(screen.getByText(etaString)).toBeInTheDocument();
  });
});

function getExpectedEtaString(travelTimeSeconds) {
  const travelHours = Math.floor(travelTimeSeconds / 3600);
  const travelMinutes = Math.floor((travelTimeSeconds % 3600) / 60);
  const travelSeconds = travelTimeSeconds % 60;

  let timeString = '';
  if (travelHours > 0) timeString += `${travelHours}h `;
  if (travelMinutes > 0) timeString += `${travelMinutes}m `;
  timeString += `${travelSeconds}s`;

  return timeString;
}
