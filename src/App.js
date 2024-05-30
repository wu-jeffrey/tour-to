import './App.css';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';


function App() {
  const locations = [
    { name: "245 Queens Quay W", lat: 43.63774957110286, lng: -79.38722802360513 },
    { name: "CN Tower", lat: 43.6426, lng: -79.3871 },
    { name: "Nathan Phillips Square", lat: 43.6527069, lng: -79.3859886 },
    { name: "Kensington Market", lat: 43.6548336, lng: -79.4131749 },
    { name: "Eaton Centre", lat: 43.6544382, lng: -79.3832743 },
  ]

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ width: '100vw', height: '100vh' }}
        defaultZoom={14}
        defaultCenter={{ lat: 43.6532, lng: -79.3832 }}
        defaultTilt={30}
        onCameraChanged={(ev) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }
        mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID}
      >
        {locations.map((location, index) => (
          <AdvancedMarker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.name}
            onClick={() => console.log(`Clicked on ${location.name}`)}
          />
        ))}
      </Map>
    </APIProvider>
  );
}

export default App;
