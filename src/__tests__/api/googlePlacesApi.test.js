import { getPlaceLocation, getPlaceDetails } from '../../api/googlePlacesApi';

// Mock the fetch function
global.fetch = jest.fn();

const mockResponse = (status, data) => {
  return Promise.resolve({
    ok: status === 200,
    status: status,
    json: () => Promise.resolve(data),
  });
};

describe('Google Places API functions', () => {
  const placeId = 'test-place-id';
  const API_KEY = 'test-api-key';
  const originalEnv = process.env;

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY = API_KEY;
  });

  afterAll(() => {
    console.log.mockRestore();
    console.error.mockRestore();
    process.env = originalEnv;
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear(); // Clear localStorage after each test
  });

  describe('fetchPlacesData', () => {
    it('fetches place data successfully', async () => {
      const fieldMask = 'location,displayName,formattedAddress';
      const data = { location: { lat: 43.6532, lng: -79.3832 } };

      fetch.mockImplementationOnce(() => mockResponse(200, data));

      const fetchPlacesData = async (placeId, fieldMask) => {
        const url = `https://places.googleapis.com/v1/places/${placeId}`;
        const headers = {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': fieldMask,
        };

        try {
          const response = await fetch(url, { method: 'GET', headers });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
      };

      const result = await fetchPlacesData(placeId, fieldMask);

      expect(fetch).toHaveBeenCalledWith(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': fieldMask,
          },
        }
      );

      expect(result).toEqual(data);
    });

    it('handles fetch error', async () => {
      const fieldMask = 'location,displayName,formattedAddress';

      fetch.mockImplementationOnce(() => mockResponse(500, { message: 'Server error' }));

      const fetchPlacesData = async (placeId, fieldMask) => {
        const url = `https://places.googleapis.com/v1/places/${placeId}`;
        const headers = {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': fieldMask,
        };

        try {
          const response = await fetch(url, { method: 'GET', headers });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
      };

      await expect(fetchPlacesData(placeId, fieldMask)).rejects.toThrow('HTTP error! status: 500');

      expect(fetch).toHaveBeenCalledWith(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': fieldMask,
          },
        }
      );
    });
  });

  describe('getPlaceLocation', () => {
    it('fetches place location successfully and caches the result', async () => {
      const fieldMask = 'location,displayName,formattedAddress';
      const data = { location: { lat: 43.6532, lng: -79.3832 } };

      fetch.mockImplementationOnce(() => mockResponse(200, data));

      const result = await getPlaceLocation(placeId);

      expect(fetch).toHaveBeenCalledWith(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': fieldMask,
          },
        }
      );

      expect(result).toEqual(data);

      // Check that the result is cached
      const cachedData = JSON.parse(localStorage.getItem(`placeLocation-${placeId}`));
      expect(cachedData).toBeDefined();
      expect(cachedData.data).toEqual(data);
    });

    it('uses cached place location data', async () => {
      const fieldMask = 'location,displayName,formattedAddress';
      const data = { location: { lat: 43.6532, lng: -79.3832 } };

      localStorage.setItem(`placeLocation-${placeId}`, JSON.stringify({ data, timestamp: new Date().getTime() }));

      const result = await getPlaceLocation(placeId);

      expect(fetch).not.toHaveBeenCalled();
      expect(result).toEqual(data);
    });

    it('handles fetch error', async () => {
      const fieldMask = 'location,displayName,formattedAddress';

      fetch.mockImplementationOnce(() => mockResponse(500, { message: 'Server error' }));

      await expect(getPlaceLocation(placeId)).rejects.toThrow('HTTP error! status: 500');

      expect(fetch).toHaveBeenCalledWith(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': fieldMask,
          },
        }
      );
    });
  });

  describe('getPlaceDetails', () => {
    it('fetches place details successfully and caches the result', async () => {
      const fieldMask = 'id,displayName,formattedAddress,editorialSummary,regularOpeningHours,photos,priceLevel,rating,reviews,primaryType';
      const data = {
        displayName: { text: 'Test Place' },
        formattedAddress: '123 Test St, Test City, TC',
        editorialSummary: { text: 'A wonderful place to visit' },
        regularOpeningHours: { openNow: true },
        photos: [{ name: 'photos/test_photo_1' }],
        priceLevel: 2,
        rating: 4.5,
        reviews: [{ text: { text: 'Great place!' } }],
        primaryType: 'restaurant',
      };

      fetch.mockImplementationOnce(() => mockResponse(200, data));

      const result = await getPlaceDetails(placeId);

      expect(fetch).toHaveBeenCalledWith(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': fieldMask,
          },
        }
      );

      expect(result).toEqual(data);

      // Check that the result is cached
      const cachedData = JSON.parse(localStorage.getItem(`placeDetails-${placeId}`));
      expect(cachedData).toBeDefined();
      expect(cachedData.data).toEqual(data);
    });

    it('uses cached place details data', async () => {
      const data = {
        displayName: { text: 'Test Place' },
        formattedAddress: '123 Test St, Test City, TC',
        editorialSummary: { text: 'A wonderful place to visit' },
        regularOpeningHours: { openNow: true },
        photos: [{ name: 'photos/test_photo_1' }],
        priceLevel: 2,
        rating: 4.5,
        reviews: [{ text: { text: 'Great place!' } }],
        primaryType: 'restaurant',
      };

      localStorage.setItem(`placeDetails-${placeId}`, JSON.stringify({ data, timestamp: new Date().getTime() }));

      const result = await getPlaceDetails(placeId);

      expect(fetch).not.toHaveBeenCalled();
      expect(result).toEqual(data);
    });

    it('handles fetch error', async () => {
      const fieldMask = 'id,displayName,formattedAddress,editorialSummary,regularOpeningHours,photos,priceLevel,rating,reviews,primaryType';

      fetch.mockImplementationOnce(() => mockResponse(500, { message: 'Server error' }));

      await expect(getPlaceDetails(placeId)).rejects.toThrow('HTTP error! status: 500');

      expect(fetch).toHaveBeenCalledWith(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': fieldMask,
          },
        }
      );
    });
  });
});
