require('dotenv').config();
const express = require('express');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 8080;

const POLLING_INTERVAL = 60000; // milliseconds (1 minute)

const fetchDirections = async (originPlaceId, destinationPlaceId, waypointPlaceIds) => {
  const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
  url.searchParams.append('origin', `place_id:${originPlaceId}`);
  url.searchParams.append('destination', `place_id:${destinationPlaceId}`);
  if (waypointPlaceIds.length > 0) {
    url.searchParams.append('waypoints', `optimize:true|${waypointPlaceIds.map(id => `place_id:${id}`).join('|')}`);
  }
  url.searchParams.append('departure_time', 'now');
  url.searchParams.append('traffic_model', 'best_guess');
  url.searchParams.append('key', process.env.GOOGLE_MAPS_API_KEY);

  try {
    const response = await fetch(url, { method: 'GET' });
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

const respondToMessage = async (ws, originPlaceId, destinationPlaceId, waypointPlaceIds) => {
  const data = await fetchDirections(originPlaceId, destinationPlaceId, waypointPlaceIds);
  if (ws.readyState === WebSocket.OPEN) {
    console.log("Sending message: ", JSON.stringify(data))
    ws.send(JSON.stringify(data));
  }
}

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('New client connected');
  let intervalId;

  ws.on('message', async (message) => {
    if (intervalId) {
      clearInterval(intervalId)
    }

    const { originPlaceId, destinationPlaceId, waypointPlaceIds } = JSON.parse(message);
    console.log('Received parameters:', { originPlaceId, destinationPlaceId, waypointPlaceIds });
    respondToMessage(ws, originPlaceId, destinationPlaceId, waypointPlaceIds)

    const pollDirections = () => {
      intervalId = setInterval(async () => {
        try {
          respondToMessage(ws, originPlaceId, destinationPlaceId, waypointPlaceIds)
        } catch (error) {
          console.error('Error during polling:', error);
        }
      }, POLLING_INTERVAL);
    };

    pollDirections();
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(intervalId)
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});
