const CACHE_EXPIRATION_MINUTES = 1440; // (24hx60min/h) cache for a day (Gcloud API is expensive! (': )

const fetchPlacesData = async (placeId, fieldMask) => {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
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

const isCacheExpired = (timestamp) => {
  const now = new Date().getTime();
  return (now - timestamp) > CACHE_EXPIRATION_MINUTES * 60 * 1000;
};

const cacheFetchData = async (placeId, fieldMask, storageKey) => {
  const cachedData = localStorage.getItem(storageKey);
  if (cachedData) {
    console.log('Using cached data for:', storageKey);
    const { data, timestamp } = JSON.parse(cachedData);
    if (!isCacheExpired(timestamp)) {
      return data;
    }
  }

  const data = await fetchPlacesData(placeId, fieldMask);
  localStorage.setItem(storageKey, JSON.stringify({ data, timestamp: new Date().getTime() }));
  return data;
};

export const getPlaceLocation = async (placeId) => {
  const fieldMask = 'location,displayName,formattedAddress';
  const storageKey = `placeLocation-${placeId}`;
  return await cacheFetchData(placeId, fieldMask, storageKey);
};

export const getPlaceDetails = async (placeId) => {
  const fieldMask = 'id,displayName,formattedAddress,editorialSummary,regularOpeningHours,photos,priceLevel,rating,reviews,primaryType';
  const storageKey = `placeDetails-${placeId}`;
  return await cacheFetchData(placeId, fieldMask, storageKey);
};
