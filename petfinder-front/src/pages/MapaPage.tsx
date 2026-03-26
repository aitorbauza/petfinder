import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerAnuncios } from '../services/anuncioService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { styles } from '../styles/mapaStyles';
import Header from '../components/Header';

// Configuración iconos Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Anuncio {
  id: number;
  latitud: number;
  longitud: number;
  nomMascota: string;
  estat: string;
}

const MapaPage: React.FC = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await obtenerAnuncios();
      setAnuncios(res.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',       // 👈 ocupar toda la pantalla
        overflow: 'hidden',    // 👈 evitar scroll vertical
      }}
    >
      <Header />

      <div
        style={{
          display: 'flex',
          flex: 1,              // 👈 ocupar todo el espacio disponible
          flexDirection: isMobile ? 'column' : 'row',
          overflow: 'hidden',   // 👈 evitar scroll externo
        }}
      >
        {/* 📋 ANUNCIOS */}
        <div
          style={{
            ...styles.leftPanel,
            order: isMobile ? 2 : 1,
            width: isMobile ? '100%' : '30%',   // ancho en desktop, full en móvil
            maxHeight: '100%',                  // no crecer más que la pantalla
            overflowY: 'auto',                  // scroll solo aquí si hay muchos anuncios
          }}
        >
          {anuncios.map(a => (
            <div key={a.id} style={styles.anuncioBox}>
              <strong>{a.nomMascota}</strong><br />
              Estado: {a.estat}
            </div>
          ))}
        </div>

        {/* 🗺️ MAPA */}
        <div
          style={{
            ...styles.mapPanel,
            flex: 1,               // 👈 mapa ocupa todo lo que queda
            order: isMobile ? 1 : 2,
            position: 'relative',  // para el FAB
          }}
        >
          <MapContainer
            center={[41.3851, 2.1734]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}  // 👈 mapa siempre 100%
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {anuncios.map((a) => (
              <Marker key={a.id} position={[a.latitud, a.longitud]}>
                <Popup>{a.nomMascota}</Popup>
              </Marker>
            ))}
          </MapContainer>

          <button
            style={styles.fab}
            onClick={() => navigate('/crear')}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapaPage;