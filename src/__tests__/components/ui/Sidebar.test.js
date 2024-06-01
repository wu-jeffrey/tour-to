import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Sidebar from '../../../components/ui/Sidebar';

describe('Sidebar Component', () => {
  const expandedContent = <div>Expanded Content</div>;
  const collapsedContent = <div>Collapsed Content</div>;

  test('should render with collapsed state initially', () => {
    render(<Sidebar expandedContent={expandedContent} collapsedContent={collapsedContent} />);
    
    expect(screen.getByText('Collapsed Content')).toBeInTheDocument();
    expect(screen.getByRole('button')).toContainHTML('<svg');
    expect(screen.queryByText('Expanded Content')).not.toBeInTheDocument();
  });

  test('should toggle to expanded state on button click', () => {
    render(<Sidebar expandedContent={expandedContent} collapsedContent={collapsedContent} />);

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Expanded Content')).toBeInTheDocument();
    expect(screen.getByRole('button')).toContainHTML('<svg');
    expect(screen.queryByText('Collapsed Content')).not.toBeInTheDocument();
  });

  test('should toggle back to collapsed state on button click again', () => {
    render(<Sidebar expandedContent={expandedContent} collapsedContent={collapsedContent} />);

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    fireEvent.click(toggleButton);

    expect(screen.getByText('Collapsed Content')).toBeInTheDocument();
    expect(screen.queryByText('Expanded Content')).not.toBeInTheDocument();
  });
});
