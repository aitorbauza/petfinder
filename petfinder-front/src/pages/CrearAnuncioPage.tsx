import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { crearAnuncio } from '../services/anuncioService';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { styles } from '../styles/crearAnuncioStyles';
import L from 'leaflet';
import Header from '../components/Header';
import { EspecieEnum, EspeciesOptions } from '../enums/EspecieEnum';

// Configuración iconos Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationSelectorProps {
  lat: number;
  lng: number;
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ lat, lng, setLat, setLng }) => {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });

  return (
    <Marker
      position={[lat, lng]}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setLat(position.lat);
          setLng(position.lng);
        },
      }}
    />
  );
};

const CrearAnuncioPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [nomMascota, setNomMascota] = useState('');
type EspecieEnumType = typeof EspecieEnum[keyof typeof EspecieEnum];
const [especieId, setEspecieId] = useState<EspecieEnumType | null>(null);
  const [raca, setRaca] = useState('');
  const [descripcio, setDescripcio] = useState('');
  const [latitud, setLatitud] = useState(41.3851);
  const [longitud, setLongitud] = useState(2.1734);
  const [estatId] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detecta tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async () => {
      console.log("El user es:", user?.email);
    if (!user) return alert('Inicia sesión primero');
    if (!especieId) return alert('Selecciona una especie');

    try {
      await crearAnuncio(user.usuariId, {
        nomMascota,
        especieId,
        raca,
        descripcio,
        latitud,
        longitud,
        estatId,
      });
      alert('Anuncio creado');
      navigate('/mapa');
    } catch (err) {
      alert('Error creando anuncio');
    }
  };

  // Contenedor del contenido, con padding solo en móvil
  const contentContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    width: '100%',
    padding: isMobile ? '0 15px' : 0,
    boxSizing: 'border-box',
  };

  return (
    <div style={{width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header mantiene su responsive */}
      <Header style={isMobile ? { marginBottom: '20px'} : {marginBottom: '20px'}} />

      <div style={contentContainerStyle}>
        <h2 style={styles.title}>Crear Anuncio</h2>

        <input
          style={styles.input}
          placeholder="Nombre Mascota"
          value={nomMascota}
          onChange={(e) => setNomMascota(e.target.value)}
        />

        {/* Selector de especie */}
        <select
          style={styles.input}
          value={especieId ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            if (!value) return setEspecieId(null); // Nada seleccionado
            setEspecieId(Number(value) as EspecieEnumType); // Convierte string a número
          }}
        >
          <option value="">Selecciona especie</option>
          {EspeciesOptions.map((op) => (
            <option key={op.id} value={op.id}>
              {op.label}
            </option>
          ))}
        </select>

        <input
          style={styles.input}
          placeholder="Raza"
          value={raca}
          onChange={(e) => setRaca(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Descripción"
          value={descripcio}
          onChange={(e) => setDescripcio(e.target.value)}
        />

        <button style={styles.button} onClick={handleSubmit}>
          Crear Anuncio
        </button>

        <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Dónde se ha perdido</h3>
        <MapContainer center={[latitud, longitud]} zoom={13} style={styles.mapContainer}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector lat={latitud} lng={longitud} setLat={setLatitud} setLng={setLongitud} />
        </MapContainer>
      </div>
    </div>
  );
};

export default CrearAnuncioPage;