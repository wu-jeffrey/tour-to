import { initializeDirectionsWS } from '../../api/directionsWSApi';

global.WebSocket = jest.fn(() => ({
  onopen: jest.fn(),
  onmessage: jest.fn(),
  onclose: jest.fn(),
  onerror: jest.fn(),
  close: jest.fn(),
}));

describe('initializeDirectionsWS', () => {
  const mockOnOpen = jest.fn();
  const mockOnMessage = jest.fn();
  const mockOnError = jest.fn();
  const mockOnClose = jest.fn();

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterAll(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });


  it('should call onOpen callback when WebSocket is opened', () => {
    const socket = initializeDirectionsWS({
      onOpen: mockOnOpen,
      onMessage: mockOnMessage,
      onError: mockOnError,
      onClose: mockOnClose,
    });

    socket.onopen();

    expect(mockOnOpen).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('WebSocket is connected.');
  });

  it('should call onMessage callback when a message is received', () => {
    const messageData = { type: 'test' };
    const socket = initializeDirectionsWS({
      onOpen: mockOnOpen,
      onMessage: mockOnMessage,
      onError: mockOnError,
      onClose: mockOnClose,
    });

    socket.onmessage({ data: JSON.stringify(messageData) });

    expect(mockOnMessage).toHaveBeenCalledTimes(1);
    expect(mockOnMessage).toHaveBeenCalledWith(messageData);
    expect(console.log).toHaveBeenCalledWith(messageData);
  });

  it('should call onError callback when an error occurs', () => {
    const error = new Error('WebSocket error');
    const socket = initializeDirectionsWS({
      onOpen: mockOnOpen,
      onMessage: mockOnMessage,
      onError: mockOnError,
      onClose: mockOnClose,
    });

    socket.onerror(error);

    expect(mockOnError).toHaveBeenCalledTimes(1);
    expect(mockOnError).toHaveBeenCalledWith(error);
    expect(console.error).toHaveBeenCalledWith('WebSocket error:', error);
  });

  // it('should call onClose callback when WebSocket is closed', () => {
  //   initializeDirectionsWS({
  //     onOpen: mockOnOpen,
  //     onMessage: mockOnMessage,
  //     onError: mockOnError,
  //     onClose: mockOnClose,
  //   });

  //   mockWebSocket.onclose();

  //   expect(mockOnClose).toHaveBeenCalledTimes(1);
  //   expect(console.log).toHaveBeenCalledWith('WebSocket is closed.');
  // });
});
