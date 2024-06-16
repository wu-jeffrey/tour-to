import React from 'react';
import './App.css';

import PlaceDetails from './components/PlaceDetails.js';
import Map from './components/Map.js'
import MainMenu from './components/MainMenu.js'
import Modal from './components/ui/Modal.js'
import TravelTime from './components/TravelTime.js';

import { useModalContext } from './context/ModalContext.js';

function App() {
  const { isOpen, closeModal } = useModalContext();

  return (
    <div className='relative'>
      <div className="absolute right-0 bottom-0 z-10">
        <TravelTime />
      </div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <PlaceDetails />
      </Modal>
      <Map
        // TODO: Remove coupling here with the w-16 == 4rem which is used to get the width of the map so that the sidebar doesn't obscure it
        style={{ marginLeft: '4rem', width: 'calc(100vw - 4rem)', height: '100vh' }}
        mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID}
      />
      <MainMenu />
    </div>
  );
}

export default App;
