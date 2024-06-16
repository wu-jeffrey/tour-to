export const initializeDirectionsWS = ({
  onOpen = () => { },
  onMessage = () => { },
  onError = () => { },
  onClose = () => { },
}) => {
  const socket = new WebSocket(`ws://${process.env.REACT_APP_SERVER_DOMAIN}`);

  socket.onopen = () => {
    console.log('WebSocket is connected.');
    onOpen();
  };

  socket.onmessage = (event) => {
    console.log(JSON.parse(event.data))
    onMessage(JSON.parse(event.data));
  };

  socket.onclose = () => {
    console.log('WebSocket is closed.');
    onClose();
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    onError(error);
  };

  return socket;
}
