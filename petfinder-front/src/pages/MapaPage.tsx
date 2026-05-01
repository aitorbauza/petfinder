import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerAnuncios } from '../services/anuncioService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { styles, mobileStyles } from '../styles/mapaStyles';
import Header from '../components/Header';

// Configuración iconos Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Icono personalizado para el mapa
const petIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1998/1998625.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const API_URL = 'http://localhost:9090';
const PLACEHOLDER_URL = `${API_URL}/uploads/mascotes/placeholder-logo-3-300x300.png`;

interface Anuncio {
  id: number;
  latitud: number;
  longitud: number;
  nomMascota: string;
  especie: string;
  raca: string;
  estat: string;
  imatgeUrl: string | null;
}

const MapaPage: React.FC = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await obtenerAnuncios();
        setAnuncios(res.data);
      } catch (error) {
        console.error('Error cargando anuncios:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRacaText = (raca: string | undefined) => {
    return raca && raca.trim() !== '' ? raca : 'Sense raça';
  };

  const getImatgeUrl = (imatgeUrl: string | null) => {
    if (!imatgeUrl) return PLACEHOLDER_URL;
    if (imatgeUrl.startsWith('http')) return imatgeUrl;
    return `${API_URL}${imatgeUrl}`;
  };

  // Combinar estils segons dispositiu
  const getMainContentStyle = (): React.CSSProperties => {
    if (isMobile) {
      return { ...styles.mainContent, ...mobileStyles.mainContent } as React.CSSProperties;
    }
    return styles.mainContent as React.CSSProperties;
  };

  const getLeftPanelStyle = (): React.CSSProperties => {
    if (isMobile) {
      return { ...styles.leftPanel, ...mobileStyles.leftPanel } as React.CSSProperties;
    }
    return styles.leftPanel as React.CSSProperties;
  };

  const getMapPanelStyle = (): React.CSSProperties => {
    if (isMobile) {
      return { ...styles.mapPanel, ...mobileStyles.mapPanel } as React.CSSProperties;
    }
    return styles.mapPanel as React.CSSProperties;
  };

  const getCardsGridStyle = (): React.CSSProperties => {
    if (isMobile) {
      return mobileStyles.cardsGrid as React.CSSProperties;
    }
    return styles.cardsGrid as React.CSSProperties;
  };

  const getCardImageStyle = (): React.CSSProperties => {
    if (isMobile) {
      return { ...styles.cardImage, ...mobileStyles.cardImage } as React.CSSProperties;
    }
    return styles.cardImage as React.CSSProperties;
  };

  const getFabStyle = (): React.CSSProperties => {
    if (isMobile) {
      return { ...styles.fab, ...mobileStyles.fab } as React.CSSProperties;
    }
    return styles.fab as React.CSSProperties;
  };

  return (
    <div style={styles.container}>
      <Header />

      <div style={getMainContentStyle()}>
        <div style={getLeftPanelStyle()}>
          <div style={getCardsGridStyle()}>
            {anuncios.map((anuncio) => (
              <div
                key={anuncio.id}
                style={styles.card}
                onClick={() => {
                  const mapElement = document.querySelector('.leaflet-container');
                  if (mapElement && (mapElement as any).__leaflet_map) {
                    const map = (mapElement as any).__leaflet_map;
                    map.setView([anuncio.latitud, anuncio.longitud], 15);
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                <img
                  src={getImatgeUrl(anuncio.imatgeUrl)}
                  alt={anuncio.nomMascota}
                  style={getCardImageStyle()}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_URL;
                  }}
                />
                
                <div style={styles.cardContent}>
                  <h3 style={styles.petName}>{anuncio.nomMascota}</h3>
                  <p style={styles.breedText}>
                    {anuncio.especie} - {getRacaText(anuncio.raca)}
                  </p>
                  <span style={anuncio.estat === 'Perdut' ? styles.statusPerdut : styles.statusTrobat}>
                    {anuncio.estat}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {anuncios.length === 0 && (
            <div style={styles.emptyMessage}>
              No hi ha anuncis. Sigues el primer en crear-ne un!
            </div>
          )}
        </div>

        {/* MAPA */}
        <div style={getMapPanelStyle()}>
          <MapContainer
            center={[41.3851, 2.1734]}
            zoom={13}
            style={styles.map}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {anuncios.map((anuncio) => (
              <Marker
                key={anuncio.id}
                position={[anuncio.latitud, anuncio.longitud]}
                icon={petIcon}
              >
                <Popup>
                  <div style={styles.popupContent}>
                    <img 
                      src={getImatgeUrl(anuncio.imatgeUrl)} 
                      alt={anuncio.nomMascota}
                      style={styles.popupImage}
                      onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_URL; }}
                    />
                    <div style={styles.popupName}>{anuncio.nomMascota}</div>
                    <div style={styles.popupBreed}>
                      {anuncio.especie} - {getRacaText(anuncio.raca)}
                    </div>
                    <div style={anuncio.estat === 'Perdut' ? styles.popupStatusPerdut : styles.popupStatusTrobat}>
                      {anuncio.estat}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <button
            style={getFabStyle()}
            onClick={() => navigate('/crear')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = '#055523';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = '#06682D';
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapaPage;