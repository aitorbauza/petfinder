import React, { useEffect, useState, useContext, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { obtenerAnuncios } from '../services/anuncioService';
import { geolocalitzacioService } from '../services/geolocalitzacioService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { styles, mobileStyles } from '../styles/mapaStyles';
import Header from '../components/Header';
import ChatFloatingButton from '../components/ChatFloatingButton';
import { UserContext } from '../context/UserContext';
import FiltresMapa, { type Filters } from '../components/FiltresMapa';
import { EspecieEnum } from '../enums/EspecieEnum';
import type { UbicacioTempsReal } from '../interfaces/geolocalitzacio';

// Configuración iconos Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Icono estándar para mascotas sin geolocalización
const petIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1998/1998625.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Icono para mascotas con geolocalización activa (GPS)
const petIconGPS = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const API_URL = 'http://localhost:9090';
const PLACEHOLDER_URL = `${API_URL}/uploads/mascotes/placeholder-logo-3-300x300.png`;

interface Anuncio {
  id: number;
  mascotaId: number;
  latitud: number;
  longitud: number;
  nomMascota: string;
  especie: string;
  especieId?: number;
  raca: string;
  estat: string;
  imatgeUrl: string | null;
  ciutat?: string;
  provincia?: string;
  teGeolocalitzacio?: boolean;
  microchipId?: string | null;
}

// Mapa d'ubicacions en temps real per mascotaId
interface UbicacioMap {
  [mascotaId: number]: UbicacioTempsReal;
}

// 🔥 Funció per desplaçar markers a la mateixa posició (spiderfying)
const getOffsetPosition = (baseLat: number, baseLng: number, index: number, total: number): { lat: number; lng: number } => {
  if (total === 1) {
    return { lat: baseLat, lng: baseLng };
  }
  
  // Radi de desplaçament en graus (~30 metres)
  const radius = 0.0003;
  const angle = (index / total) * Math.PI * 2;
  const offsetLat = Math.cos(angle) * radius;
  const offsetLng = Math.sin(angle) * radius;
  
  return {
    lat: baseLat + offsetLat,
    lng: baseLng + offsetLng
  };
};

const MapaPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessedState = useRef(false);
  
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedAnuncio, setSelectedAnuncio] = useState<Anuncio | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Estat per a ubicacions en temps real
  const [ubicacionsTempsReal, setUbicacionsTempsReal] = useState<UbicacioMap>({});

  const [openChatConversaId, setOpenChatConversaId] = useState<number | null>(null);
  const [openChatDestinatariId, setOpenChatDestinatariId] = useState<number | null>(null);
  const [openChatDestinatariNom, setOpenChatDestinatariNom] = useState<string | null>(null);
  const [openChatAnunciId, setOpenChatAnunciId] = useState<number | null>(null);

  // Estat dels filtres
  const [filters, setFilters] = useState<Filters>({
    especie: 'tots',
    estat: 'tots',
    distancia: 5,
    teGeolocalitzacio: false
  });

  // Funció per carregar ubicacions actives
  const carregarUbicacionsActives = useCallback(async () => {
    try {
      const ubicacions = await geolocalitzacioService.obtenirTotesUbicacionsActives();
      const nouMap: UbicacioMap = {};
      ubicacions.forEach(ubicacio => {
        if (ubicacio.mascotaId) {
          nouMap[ubicacio.mascotaId] = ubicacio;
        }
      });
      setUbicacionsTempsReal(nouMap);
    } catch (error) {
      console.error('Error carregant ubicacions actives:', error);
    }
  }, []);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      carregarUbicacionsActives();
      isFirstRender.current = false;
    }
    
    const interval = setInterval(() => {
      carregarUbicacionsActives();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carregarUbicacionsActives]);

  // Aplicar filtres als anuncis
  const anunciosFiltrats = useMemo(() => {
    return anuncios.filter(anuncio => {
      // Filtre per espècie
      if (filters.especie !== 'tots') {
        const especieId = anuncio.especieId;
        if (especieId === undefined) return false;
        
        switch (filters.especie) {
          case 'gos':
            if (especieId !== EspecieEnum.GOS) return false;
            break;
          case 'gat':
            if (especieId !== EspecieEnum.GAT) return false;
            break;
          case 'conill':
            if (especieId !== EspecieEnum.CONILL) return false;
            break;
          case 'altres':
            if (especieId !== EspecieEnum.OTRO) return false;
            break;
          default:
            break;
        }
      }
      
      // Filtre per estat
      if (filters.estat !== 'tots') {
        const estatLower = anuncio.estat?.toLowerCase() || '';
        if (filters.estat === 'perdut' && estatLower !== 'perdut') return false;
        if (filters.estat === 'trobat' && estatLower !== 'trobat') return false;
      }
      
      // Filtre per geolocalització activa
      const teGeolocalitzacioActiva = anuncio.teGeolocalitzacio === true;
      if (filters.teGeolocalitzacio && !teGeolocalitzacioActiva) {
        return false;
      }
      
      return true;
    });
  }, [anuncios, filters]);

  // Funció per obtenir la posició actual d'una mascota (temps real o estàtica)
  const getPosicioAnunci = useCallback((anuncio: Anuncio): { lat: number; lng: number } => {
    if (anuncio.teGeolocalitzacio === true && ubicacionsTempsReal[anuncio.mascotaId]) {
      const ubicacio = ubicacionsTempsReal[anuncio.mascotaId];
      return { lat: ubicacio.latitud, lng: ubicacio.longitud };
    }
    return { lat: anuncio.latitud, lng: anuncio.longitud };
  }, [ubicacionsTempsReal]);

  // 🔥 Agrupar anuncis per ubicació (per aplicar desplaçament)
  const markersAmbDesplacament = useMemo(() => {
    const groups = new Map<string, Anuncio[]>();
    
    anunciosFiltrats.forEach(anuncio => {
      const posicio = getPosicioAnunci(anuncio);
      const key = `${posicio.lat.toFixed(6)},${posicio.lng.toFixed(6)}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(anuncio);
    });
    
    // Generar markers amb desplaçament
    const result: { anuncio: Anuncio; lat: number; lng: number; icon: L.Icon }[] = [];
    
    groups.forEach((anuncis, key) => {
      const [baseLat, baseLng] = key.split(',').map(Number);
      anuncis.forEach((anuncio, idx) => {
        const posicioOffset = getOffsetPosition(baseLat, baseLng, idx, anuncis.length);
        result.push({
          anuncio,
          lat: posicioOffset.lat,
          lng: posicioOffset.lng,
          icon: anuncio.teGeolocalitzacio === true ? petIconGPS : petIcon
        });
      });
    });
    
    return result;
  }, [anunciosFiltrats, getPosicioAnunci]);

  // 🔥 Efecte per rebre l'estat de navegació del xat (amb nom del destinatari)
  useEffect(() => {
    if (hasProcessedState.current) return;
    
    if (location.state && location.state.openChat && location.state.destinatariId) {
      hasProcessedState.current = true;
      
      const destinatariId = location.state.destinatariId;
      const destinatariNom = location.state.destinatariNom || null;
      const anunciId = location.state.anunciId || null;
      
      console.log('📥 Map rep estat del xat:', { destinatariId, destinatariNom });
      
      // Establir els estats
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenChatDestinatariId(destinatariId);
      setOpenChatDestinatariNom(destinatariNom);
      setOpenChatAnunciId(anunciId);
      
      // Netejar l'estat de navegació
      navigate('/mapa', { replace: true, state: {} });
    }
  }, [location, navigate]);

  // 🔥 Efecte per obrir el xat automàticament quan es reben les dades
  useEffect(() => {
    if (openChatDestinatariId && openChatDestinatariNom !== undefined && !openChatConversaId) {
      console.log('🚀 Preparat per obrir xat amb:', openChatDestinatariNom);
      // El ChatFloatingButton obrirà automàticament el xat gràcies al prop openDestinatariId
    }
  }, [openChatDestinatariId, openChatDestinatariNom, openChatConversaId]);

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
    return {
      ...styles.leftPanel,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%',
    } as React.CSSProperties;
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

  // Verificar si hi ha filtres actius
  const hasActiveFilters = filters.especie !== 'tots' || filters.estat !== 'tots';

  const getUltimaActualitzacio = (anuncio: Anuncio): string | null => {
    if (anuncio.teGeolocalitzacio === true && ubicacionsTempsReal[anuncio.mascotaId]) {
      const timestamp = ubicacionsTempsReal[anuncio.mascotaId].timestamp;
      if (timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    }
    return null;
  };

  return (
    <div style={styles.container}>
      <Header />

      <div style={getMainContentStyle()}>
        <div style={getLeftPanelStyle()}>
          <div style={{ flexShrink: 0 }}>
            {!isMobile && (
              <FiltresMapa
                onFilterChange={setFilters}
                isMobile={isMobile}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
              />
            )}

            {isMobile && (
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#06682D',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '40px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginBottom: '16px',
                  width: '100%',
                  justifyContent: 'center',
                }}
                onClick={() => setIsFilterOpen(true)}
              >
                🔍 Filtres
                {hasActiveFilters && (
                  <span style={{
                    backgroundColor: '#fff',
                    color: '#06682D',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '12px',
                  }}>
                    Actiu
                  </span>
                )}
              </button>
            )}
          </div>

          <div style={{ 
            flex: 1,
            overflowY: 'auto',
            minHeight: 0,
            marginTop: '16px',
          }}>
            <div style={getCardsGridStyle()}>
              {anunciosFiltrats.map((anuncio) => (
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
                    <h3 style={styles.petName}>
                      {anuncio.nomMascota}
                    </h3>
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
            
            {anunciosFiltrats.length === 0 && (
              <div style={styles.emptyMessage}>
                No hi ha anuncis que coincideixin amb els filtres seleccionats
              </div>
            )}
          </div>
        </div>

        <div style={getMapPanelStyle()}>
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

          <MapContainer
            center={[41.3851, 2.1734]}
            zoom={13}
            style={styles.map}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* 🔥 MOSTRAR TOTS ELS MARKERS AMB DESPLAÇAMENT */}
            {markersAmbDesplacament.map((item, idx) => (
              <Marker
                key={`marker-${item.anuncio.id}-${idx}`}
                position={[item.lat, item.lng]}
                icon={item.icon}
              >
                <Popup>
                  <div style={styles.popupContent}>
                    <img 
                      src={getImatgeUrl(item.anuncio.imatgeUrl)} 
                      alt={item.anuncio.nomMascota}
                      style={styles.popupImage}
                      onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_URL; }}
                    />
                    <div style={styles.popupName}>{item.anuncio.nomMascota}</div>
                    <div style={styles.popupBreed}>
                      {item.anuncio.especie} - {getRacaText(item.anuncio.raca)}
                    </div>
                    <div style={item.anuncio.estat === 'Perdut' ? styles.popupStatusPerdut : styles.popupStatusTrobat}>
                      {item.anuncio.estat}
                    </div>
                    {item.anuncio.teGeolocalitzacio === true && (
                      <div style={{ fontSize: '10px', color: '#06682D', marginTop: '8px' }}>
                        📡 En temps real
                        {getUltimaActualitzacio(item.anuncio) && (
                          <span style={{ display: 'block', fontSize: '9px', color: '#888' }}>
                            Actualitzat: {getUltimaActualitzacio(item.anuncio)}
                          </span>
                        )}
                      </div>
                    )}
                    <button 
                      onClick={() => goToAnunciDetail(item.anuncio.id)}
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
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* 🔥 Botó flotant del xat - amb suport per nom del destinatari */}
          <ChatFloatingButton 
            key={`chat-${openChatDestinatariId}-${openChatDestinatariNom}`}
            usuariId={user?.usuariId || 0}
            openConversaId={openChatConversaId}
            openDestinatariId={openChatDestinatariId}
            openDestinatariNom={openChatDestinatariNom}
            anunciId={openChatAnunciId}
            isInsideMap={true}
            onClose={() => {
              setOpenChatConversaId(null);
              setOpenChatDestinatariId(null);
              setOpenChatDestinatariNom(null);
              setOpenChatAnunciId(null);
            }}
          />
        </div>
      </div>

      {isMobile && (
        <FiltresMapa
          onFilterChange={setFilters}
          isMobile={isMobile}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

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
                <h2 style={popupTitleStyle}>
                  {selectedAnuncio.nomMascota}
                </h2>
                <button style={closeButtonStyle} onClick={closePopup}>✕</button>
              </div>
              <p><strong>Espècie:</strong> {selectedAnuncio.especie}</p>
              <p><strong>Raça:</strong> {getRacaText(selectedAnuncio.raca)}</p>
              <p><strong>Estat:</strong> {selectedAnuncio.estat}</p>
              <p><strong>Ubicació:</strong> {getUbicacioText(selectedAnuncio)}</p>
              {selectedAnuncio.teGeolocalitzacio === true && selectedAnuncio.microchipId && (
                <p><strong>🔢 Microchip ID:</strong> {selectedAnuncio.microchipId}</p>
              )}
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