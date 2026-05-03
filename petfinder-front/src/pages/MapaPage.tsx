import React, { useEffect, useState, useContext, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { obtenerAnuncios } from '../services/anuncioService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { styles, mobileStyles } from '../styles/mapaStyles';
import Header from '../components/Header';
import ChatFloatingButton from '../components/ChatFloatingButton';
import { UserContext } from '../context/UserContext';

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
  ciutat?: string;
  provincia?: string;
}

interface MarkerGroup {
  lat: number;
  lng: number;
  anuncios: Anuncio[];
}

const MapaPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessedState = useRef(false);
  
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedAnuncio, setSelectedAnuncio] = useState<Anuncio | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const [openChatConversaId, setOpenChatConversaId] = useState<number | null>(null);
  const [openChatDestinatariId, setOpenChatDestinatariId] = useState<number | null>(null);
  const [openChatAnunciId, setOpenChatAnunciId] = useState<number | null>(null);

  // 🔥 Usar useMemo per evitar cascading renders
  const markerGroups = useMemo(() => {
    const groups = new Map<string, MarkerGroup>();
    
    anuncios.forEach(anuncio => {
      const key = `${anuncio.latitud},${anuncio.longitud}`;
      if (groups.has(key)) {
        groups.get(key)!.anuncios.push(anuncio);
      } else {
        groups.set(key, {
          lat: anuncio.latitud,
          lng: anuncio.longitud,
          anuncios: [anuncio]
        });
      }
    });
    
    return Array.from(groups.values());
  }, [anuncios]);

  // Efecte per rebre l'estat de navegació del xat
  useEffect(() => {
    if (hasProcessedState.current) return;
    
    if (location.state && location.state.openChat && location.state.destinatariId) {
      hasProcessedState.current = true;
      
      setTimeout(() => {
        setOpenChatDestinatariId(location.state.destinatariId);
        setOpenChatAnunciId(location.state.anunciId || null);
        navigate('/mapa', { replace: true, state: {} });
      }, 0);
    }
  }, [location, navigate]);

  useEffect(() => {
    return () => {
      hasProcessedState.current = false;
    };
  }, []);

  // Carregar anuncis
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

  const getUbicacioText = (anuncio: Anuncio) => {
    if (anuncio.provincia && anuncio.ciutat) {
      return `${anuncio.provincia} - ${anuncio.ciutat}`;
    }
    if (anuncio.ciutat) return anuncio.ciutat;
    if (anuncio.provincia) return anuncio.provincia;
    return 'Ubicació no disponible';
  };

  const goToAnunciDetail = (anunciId: number) => {
    setShowPopup(false);
    setSelectedAnuncio(null);
    navigate(`/anunci/${anunciId}`);
  };

  const openDetailPopup = (anuncio: Anuncio) => {
    setSelectedAnuncio(anuncio);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedAnuncio(null);
  };

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

  const detailButtonStyle: React.CSSProperties = {
    marginTop: '10px',
    padding: '6px 12px',
    backgroundColor: '#06682D',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    width: 'auto',
    minWidth: '100px',
    maxWidth: '120px',
    transition: 'background 0.2s',
    display: 'inline-block',
  };

  const floatingPopupStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    zIndex: 2000,
    width: isMobile ? '90%' : '450px',
    maxWidth: '450px',
    overflow: 'hidden',
  };

  const popupOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const popupImageStyle: React.CSSProperties = {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
  };

  const popupContentStyle: React.CSSProperties = {
    padding: '20px',
  };

  const popupHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const popupTitleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
    color: '#1a1a1a',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
  };

  const popupDetailButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#06682D',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '16px',
  };

  return (
    <div style={styles.container}>
      <Header />

      <div style={getMainContentStyle()}>
        {/* PANELL ESQUERRE: LLISTA D'ANUNCIS */}
        <div style={getLeftPanelStyle()}>
          <div style={getCardsGridStyle()}>
            {anuncios.map((anuncio) => (
              <div
                key={anuncio.id}
                style={styles.card}
                onClick={() => openDetailPopup(anuncio)}
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
                  <p style={{ ...styles.breedText, fontSize: '11px', color: '#888', marginTop: '4px' }}>
                    📍 {getUbicacioText(anuncio)}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <span style={anuncio.estat === 'Perdut' ? styles.statusPerdut : styles.statusTrobat}>
                      {anuncio.estat}
                    </span>
                    <button
                      style={detailButtonStyle}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToAnunciDetail(anuncio.id);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#055523';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#06682D';
                      }}
                    >
                      Veure detall →
                    </button>
                  </div>
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

        {/* PANELL DRET: MAPA */}
        <div style={getMapPanelStyle()}>
          {/* Botó "Crear anunci" */}
          <button
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: '#06682D',
              color: '#fff',
              border: 'none',
              borderRadius: '40px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
            onClick={() => navigate('/crear')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#055523';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#06682D';
            }}
          >
            + Crear anunci
          </button>

          {/* MAPCONTAINER */}
          <MapContainer
            center={[41.3851, 2.1734]}
            zoom={13}
            style={styles.map}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {markerGroups.map((group, idx) => (
              <Marker
                key={idx}
                position={[group.lat, group.lng]}
                icon={petIcon}
              >
                <Popup>
                  <div style={styles.popupContent}>
                    {group.anuncios.length === 1 ? (
                      <>
                        <img 
                          src={getImatgeUrl(group.anuncios[0].imatgeUrl)} 
                          alt={group.anuncios[0].nomMascota}
                          style={styles.popupImage}
                          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_URL; }}
                        />
                        <div style={styles.popupName}>{group.anuncios[0].nomMascota}</div>
                        <div style={styles.popupBreed}>
                          {group.anuncios[0].especie} - {getRacaText(group.anuncios[0].raca)}
                        </div>
                        <div style={group.anuncios[0].estat === 'Perdut' ? styles.popupStatusPerdut : styles.popupStatusTrobat}>
                          {group.anuncios[0].estat}
                        </div>
                        <button 
                          onClick={() => goToAnunciDetail(group.anuncios[0].id)}
                          style={{
                            marginTop: '10px',
                            padding: '6px 12px',
                            backgroundColor: '#06682D',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            width: '100%',
                          }}
                        >
                          Veure detall
                        </button>
                      </>
                    ) : (
                      <>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                          📍 {group.anuncios.length} mascotes en aquesta ubicació
                        </div>
                        {group.anuncios.map(anuncio => (
                          <div 
                            key={anuncio.id}
                            style={{ 
                              padding: '8px', 
                              borderBottom: '1px solid #eee', 
                              cursor: 'pointer',
                              marginBottom: '4px'
                            }}
                            onClick={() => goToAnunciDetail(anuncio.id)}
                          >
                            <strong>{anuncio.nomMascota}</strong> - {anuncio.especie}
                            <span style={{ 
                              display: 'inline-block', 
                              marginLeft: '8px',
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              backgroundColor: anuncio.estat === 'Perdut' ? '#ffebee' : '#e8f5e9',
                              color: anuncio.estat === 'Perdut' ? '#c62828' : '#2e7d32'
                            }}>
                              {anuncio.estat}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* 🔥 Botó flotant del xat - DINS del mateix contenidor que el mapa */}
          <ChatFloatingButton 
            usuariId={user?.usuariId || 0}
            openConversaId={openChatConversaId}
            openDestinatariId={openChatDestinatariId}
            anunciId={openChatAnunciId}
            isInsideMap={true}
            onClose={() => {
              setOpenChatConversaId(null);
              setOpenChatDestinatariId(null);
              setOpenChatAnunciId(null);
            }}
          />
        </div>
      </div>

      {/* Popup flotant de detall ràpid */}
      {showPopup && selectedAnuncio && (
        <div style={popupOverlayStyle} onClick={closePopup}>
          <div style={floatingPopupStyle} onClick={(e) => e.stopPropagation()}>
            <img
              src={getImatgeUrl(selectedAnuncio.imatgeUrl)}
              alt={selectedAnuncio.nomMascota}
              style={popupImageStyle}
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER_URL;
              }}
            />
            <div style={popupContentStyle}>
              <div style={popupHeaderStyle}>
                <h2 style={popupTitleStyle}>{selectedAnuncio.nomMascota}</h2>
                <button style={closeButtonStyle} onClick={closePopup}>✕</button>
              </div>
              <p><strong>Espècie:</strong> {selectedAnuncio.especie}</p>
              <p><strong>Raça:</strong> {getRacaText(selectedAnuncio.raca)}</p>
              <p><strong>Estat:</strong> {selectedAnuncio.estat}</p>
              <p><strong>Ubicació:</strong> {getUbicacioText(selectedAnuncio)}</p>
              <button
                style={popupDetailButtonStyle}
                onClick={() => goToAnunciDetail(selectedAnuncio.id)}
              >
                Veure detall complet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaPage;