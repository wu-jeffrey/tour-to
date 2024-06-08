import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen: propIsOpen, onClose: propOnClose, children }) => {
  const [isOpen, setIsOpen] = useState(propIsOpen || false);

  useEffect(() => {
    if (typeof propIsOpen === 'boolean') {
      setIsOpen(propIsOpen);
    }
  }, [propIsOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (propOnClose) {
      propOnClose();
    }
  };

  return (
    <div
      data-testid="modal"
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity
        ${isOpen ? 'visible' : 'invisible'}`
      }
    >
      <div
        data-testid="overlay"
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      ></div>
      <div className="relative bg-white w-[90vw] h-[90vh] p-4 md:p-10 rounded-md shadow-lg overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <FaTimes />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
