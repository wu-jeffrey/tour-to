const fetchPlacesData = async (placeId, fieldMask) => {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    'X-Goog-FieldMask': fieldMask
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

export const getPlaceLocation = async (placeId) => {
  const fieldMask = 'location,displayName,formattedAddress';
  return await fetchPlacesData(placeId, fieldMask);
};

export const getPlaceDetails = async (placeId) => {
  const fieldMask = 'displayName,formattedAddress,editorialSummary,regularOpeningHours,photos,priceLevel,rating,reviews,primaryType';
  return await fetchPlacesData(placeId, fieldMask);
};
