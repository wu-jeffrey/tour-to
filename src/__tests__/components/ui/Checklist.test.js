import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Checklist from '../../../components/ui/Checklist';

describe('Checklist Component', () => {
  const options = [
    { id: 1, label: 'Item 1', checked: false, disabled: false },
    { id: 2, label: 'Item 2', checked: false, disabled: true },
    { id: 3, label: 'Item 3', checked: true, disabled: false },
  ];

  test('renders checklist items', () => {
    render(<Checklist options={options} onChange={() => { }} />);

    options.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  test('toggles checkbox on item click', () => {
    const handleChange = jest.fn();
    render(<Checklist options={options} onChange={handleChange} />);

    const item1 = screen.getByText('Item 1');
    fireEvent.click(item1);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith([
      { id: 1, label: 'Item 1', checked: true, disabled: false },
      { id: 2, label: 'Item 2', checked: false, disabled: true },
      { id: 3, label: 'Item 3', checked: true, disabled: false },
    ]);
  });

  test('handles direct checkbox change', () => {
    const handleChange = jest.fn();
    render(<Checklist options={options} onChange={handleChange} />);

    const checkbox1 = screen.getByTestId('Item 1');
    fireEvent.click(checkbox1);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith([
      { id: 1, label: 'Item 1', checked: true, disabled: false },
      { id: 2, label: 'Item 2', checked: false, disabled: true },
      { id: 3, label: 'Item 3', checked: true, disabled: false },
    ]);
  });

  test('does not toggle disabled items', () => {
    const handleChange = jest.fn();
    render(<Checklist options={options} onChange={handleChange} />);

    const item2 = screen.getByText('Item 2');
    fireEvent.click(item2);

    expect(handleChange).not.toHaveBeenCalled();
  });
});
