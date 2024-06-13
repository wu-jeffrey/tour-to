export const getDirections = async (originPlaceId, destinationPlaceId, waypointPlaceIds) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  };

  const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
  url.searchParams.append('origin', `place_id:${originPlaceId}`);
  url.searchParams.append('destination', `place_id:${destinationPlaceId}`);
  if (waypointPlaceIds.length > 0) {
    url.searchParams.append('waypoints', `optimize:true|${waypointPlaceIds.map(id => `place_id:${id}`).join('|')}`);
  }
  url.searchParams.append('departure_time', 'now');
  url.searchParams.append('traffic_model', 'best_guess');

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
