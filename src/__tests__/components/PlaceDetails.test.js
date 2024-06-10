import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useTourContext } from '../../context/TourContext';
import PlaceDetails from '../../components/PlaceDetails';
import { getPlaceDetails } from '../../api/googlePlacesApi';

jest.mock('../../context/TourContext');
jest.mock('../../api/googlePlacesApi');

const mockPlace = {
  displayName: { text: 'Test Place' },
  editorialSummary: { text: 'A wonderful place to visit' },
  photos: [
    { name: 'photos/test_photo_1' },
    { name: 'photos/test_photo_2' },
  ],
  formattedAddress: '123 Test St, Test City, TC',
  rating: 4.5,
  regularOpeningHours: {
    openNow: true,
    periods: [
      { open: { day: 0, hour: 9, minute: 0 }, close: { day: 0, hour: 17, minute: 0 } },
      { open: { day: 1, hour: 9, minute: 0 }, close: { day: 1, hour: 17, minute: 0 } },
      { open: { day: 2, hour: 9, minute: 0 }, close: { day: 2, hour: 17, minute: 0 } },
      { open: { day: 3, hour: 9, minute: 0 }, close: { day: 3, hour: 17, minute: 0 } },
      { open: { day: 4, hour: 9, minute: 0 }, close: { day: 4, hour: 17, minute: 0 } },
      { open: { day: 5, hour: 9, minute: 0 }, close: { day: 5, hour: 17, minute: 0 } },
      { open: { day: 6, hour: 9, minute: 0 }, close: { day: 6, hour: 17, minute: 0 } },
    ],
  },
  reviews: [
    {
      authorAttribution: {
        photoUri: 'https://testphoto.com/photo.jpg',
        displayName: 'John Doe',
      },
      relativePublishTimeDescription: '2 days ago',
      text: { text: 'Great place to visit!' },
    },
  ],
};

const mockContext = {
  currentLocationId: 'test-location-id',
};

describe('PlaceDetails', () => {
  beforeEach(() => {
    useTourContext.mockReturnValue(mockContext);
    getPlaceDetails.mockResolvedValue(mockPlace);
  });

  it('renders without crashing', async () => {
    render(<PlaceDetails />);
    expect(await screen.findByText('Test Place')).toBeInTheDocument();
  });

  it('displays the place name correctly', async () => {
    render(<PlaceDetails />);
    expect(await screen.findByText('Test Place')).toBeInTheDocument();
  });

  it('displays the editorial summary correctly', async () => {
    render(<PlaceDetails />);
    expect(await screen.findByText('A wonderful place to visit')).toBeInTheDocument();
  });

  it('displays the formatted address correctly', async () => {
    render(<PlaceDetails />);
    expect(await screen.findByText('123 Test St, Test City, TC')).toBeInTheDocument();
  });

  it('displays the rating correctly', async () => {
    render(<PlaceDetails />);
    expect(await screen.findByText('4.5')).toBeInTheDocument();
  });

  it('toggles opening hours dropdown', async () => {
    render(<PlaceDetails />);
    const clockIcon = await screen.findByText('Open Now');
    fireEvent.click(clockIcon);
    expect(await screen.findByText('Sunday')).toBeInTheDocument();
    fireEvent.click(clockIcon);
    expect(screen.queryByText('Sunday')).toBeNull();
  });

  it('displays reviews correctly', async () => {
    render(<PlaceDetails />);
    expect(await screen.findByText('Great place to visit!')).toBeInTheDocument();
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(await screen.findByText('2 days ago')).toBeInTheDocument();
  });
});
