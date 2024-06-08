import React, { useState, useContext, createContext } from 'react';

const ModalContext = createContext();

const ModalContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider
      value={{ isOpen, openModal, closeModal, modalContent, setModalContent }}
    >
      {children}
    </ModalContext.Provider>
  );
}

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
}

export { ModalContextProvider, useModalContext };
