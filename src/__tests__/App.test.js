import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the @vis.gl/react-google-maps module
jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }) => <div>{children}</div>,
  Map: ({ children }) => <div>{children}</div>,
  AdvancedMarker: ({ position, title, onClick }) => (
    <div data-testid="marker" onClick={onClick}>
      {title}
    </div>
  ),
}));

test('renders map with locations', () => {
  render(<App />);

  const markers = screen.getAllByTestId('marker');
  expect(markers).toHaveLength(5);

  const locationNames = [
    "245 Queens Quay W",
    "CN Tower",
    "Nathan Phillips Square",
    "Kensington Market",
    "Eaton Centre"
  ];

  locationNames.forEach((name) => {
    expect(screen.getByText(name)).toBeInTheDocument();
  });
});
