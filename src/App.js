import './App.css';
import { APIProvider, Map } from '@vis.gl/react-google-maps';


function App() {
  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ width: '100vw', height: '100vh' }}
        defaultZoom={14}
        defaultCenter={{ lat: 43.6532, lng: -79.3832 }}
        onCameraChanged={(ev) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }
      />
    </APIProvider>
  );
}

export default App;
