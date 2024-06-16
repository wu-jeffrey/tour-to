import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoadingDots from '../../../components/ui/LoadingDots';

describe('LoadingDots', () => {
  it('renders correctly with default color', () => {
    render(<LoadingDots />);

    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('text-blue-500');
  });

  it('renders correctly with custom color', () => {
    const customColor = 'text-red-500';
    render(<LoadingDots color={customColor} />);

    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass(customColor);
  });
});
