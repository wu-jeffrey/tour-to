import './App.css';
import { APIProvider } from '@vis.gl/react-google-maps';

import { TourContextProvider } from './context/TourContext.js';
import Map from './components/Map.js'
import MainMenu from './components/MainMenu.js'

function App() {
  return (
    <TourContextProvider>
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} version="beta">
        <div className='relative'>
          <Map
            // TODO: Remove coupling here with the w-16 == 4rem which is used to get the width of the map so that the sidebar doesn't obscure it
            style={{ marginLeft: '4rem', width: 'calc(100vw - 4rem)', height: '100vh' }}
            mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID}
          />
          <MainMenu />
        </div>
      </APIProvider>
    </TourContextProvider>
  );
}

export default App;
