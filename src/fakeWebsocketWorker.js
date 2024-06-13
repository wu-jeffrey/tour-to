/* eslint-disable no-restricted-globals */
import { getDirections } from './api/googleRoutesApi';

const POLLING_INTERVAL = 60000;

self.onmessage = function (e) {
  const { originPlaceId, destinationPlaceId, waypointPlaceIds } = e.data;

  const fetchData = async () => {
    try {
      if (originPlaceId && destinationPlaceId) {
        const response = await getDirections(originPlaceId, destinationPlaceId, waypointPlaceIds);
        const data = await response.json();
        postMessage(data);
      }
    } catch (error) {
      postMessage({ error: error.message });
    }
  };

  fetchData();

  const timer = setInterval(fetchData, POLLING_INTERVAL);

  self.onmessage = function (e) {
    if (e.data === 'terminate') {
      clearInterval(timer);
      self.close();
    }
  };
};
