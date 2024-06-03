import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useTourContext } from '../../context/TourContext';
import MainMenu from '../../components/MainMenu';

jest.mock('../../context/TourContext');
jest.mock('../../components/ui/Sidebar', () => ({ expandedContent }) => <div>{expandedContent}</div>);
jest.mock('../../components/ui/Checklist', () => ({ options, onChange }) => (
  <div>
    {options.map((option) => (
      <div key={option.id}>
        <input
          data-testid={option.label}
          type="checkbox"
          checked={option.checked}
          disabled={option.disabled}
          onChange={() => {
            const updatedItems = options.map((o) =>
              o.id === option.id ? { ...o, checked: !o.checked } : o
            );
            onChange(updatedItems);
          }}
        />
        <label>{option.label}</label>
      </div>
    ))}
  </div>
));

const mockLocations = [
  { name: 'Location 1', visiting: false, required: false },
  { name: 'Location 2', visiting: true, required: true },
];

describe('MainMenu', () => {
  beforeEach(() => {
    useTourContext.mockReturnValue({
      locations: mockLocations,
      setLocations: jest.fn(),
    });
  });

  it('renders without crashing', () => {
    render(<MainMenu />);
    expect(screen.getByText('TourTo')).toBeInTheDocument();
    expect(screen.getByText('🌏 Where do you want to visit?')).toBeInTheDocument();
    expect(screen.getByTestId('Location 1')).toBeInTheDocument();
    expect(screen.getByTestId('Location 2')).toBeInTheDocument();
  });

  it('initially sets the checklist options correctly', () => {
    render(<MainMenu />);
    const location1Checkbox = screen.getByTestId('Location 1');
    const location2Checkbox = screen.getByTestId('Location 2');
    expect(location1Checkbox.checked).toBe(false);
    expect(location2Checkbox.checked).toBe(true);
    expect(location2Checkbox.disabled).toBe(true);
  });

  it('updates the locations when a checklist item is changed', () => {
    const { setLocations } = useTourContext();
    render(<MainMenu />);
    const location1Checkbox = screen.getByTestId('Location 1');

    fireEvent.click(location1Checkbox);

    expect(setLocations).toHaveBeenCalledWith([
      { name: 'Location 1', visiting: true, required: false },
      { name: 'Location 2', visiting: true, required: true },
    ]);
  });

  it('disables the required locations', () => {
    render(<MainMenu />);
    const location2Checkbox = screen.getByTestId('Location 2');
    expect(location2Checkbox).toBeDisabled();
  });
});
