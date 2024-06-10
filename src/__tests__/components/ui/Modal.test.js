import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Modal from '../../../components/ui/Modal';

describe('Modal Component', () => {
  it('should render modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => { }}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeVisible();
  });

  it('should not render modal when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => { }}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByTestId('modal')).toHaveClass("invisible");
  });

  it('should call onClose when clicking the close button', () => {
    const handleClose = jest.fn();

    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking the overlay', () => {
    const handleClose = jest.fn();

    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByTestId('overlay'));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not close modal when clicking inside content', () => {
    const handleClose = jest.fn();

    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByText('Modal Content'));

    expect(handleClose).not.toHaveBeenCalled();
  });
});
