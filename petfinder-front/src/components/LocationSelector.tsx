import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

interface LocationSelectorProps {
  lat: number;
  lng: number;
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ lat, lng, setLat, setLng }) => {
  const map = useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });

  return <Marker position={[lat, lng]} draggable eventHandlers={{
    dragend: (e) => {
      const marker = e.target;
      const position = marker.getLatLng();
      setLat(position.lat);
      setLng(position.lng);
    }
  }} />;
};

export const CrearAnuncioMapa: React.FC<{
  lat: number;
  lng: number;
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
}> = ({ lat, lng, setLat, setLng }) => (
  <MapContainer center={[lat, lng]} zoom={13} style={{ height: '300px', width: '100%', borderRadius: '12px', marginBottom: '20px' }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <LocationSelector lat={lat} lng={lng} setLat={setLat} setLng={setLng} />
  </MapContainer>
);