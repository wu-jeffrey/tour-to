import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalContextProvider, useModalContext } from '../../context/ModalContext';

const TestComponent = () => {
  const {
    isOpen, openModal, closeModal,
    modalContent, setModalContent
  } = useModalContext();

  return (
    <div>
      {isOpen && <div data-testid="modal-content">{modalContent}</div>}
      <button onClick={openModal}>Open Modal</button>
      <button onClick={closeModal}>Close Modal</button>
      <button onClick={() => setModalContent('New Content')}>Set Content</button>
    </div>
  );
};

describe('ModalContext', () => {
  it('initializes with modal closed', () => {
    render(
      <ModalContextProvider>
        <TestComponent />
      </ModalContextProvider>
    );

    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });

  it('opens and closes the modal', () => {
    render(
      <ModalContextProvider>
        <TestComponent />
      </ModalContextProvider>
    );

    const openButton = screen.getByText('Open Modal');
    const closeButton = screen.getByText('Close Modal');

    act(() => {
      openButton.click();
    });
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();

    act(() => {
      closeButton.click()
    });
    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
  });

  it('sets the modal content', () => {
    render(
      <ModalContextProvider>
        <TestComponent />
      </ModalContextProvider>
    );

    const openButton = screen.getByText('Open Modal');
    const setContentButton = screen.getByText('Set Content');

    act(() => {
      openButton.click();
      setContentButton.click();
    });

    expect(screen.getByText('New Content')).toBeInTheDocument();
  });

  it('throws an error if useModalContext is used outside of ModalContextProvider', () => {
    const ErrorComponent = () => {
      try {
        useModalContext();
      } catch (error) {
        return <div>{error.message}</div>;
      }
      return null;
    };

    render(<ErrorComponent />);

    expect(screen.getByText('useModalContext must be used within a ModalProvider')).toBeInTheDocument();
  });
});
