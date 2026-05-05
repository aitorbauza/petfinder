import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { crearAnuncio } from '../services/anuncioService';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { styles } from '../styles/crearAnuncioStyles';
import L from 'leaflet';
import Header from '../components/Header';
import { EspecieEnum, EspeciesOptions } from '../enums/EspecieEnum';
import axios from 'axios';
import { getUbicacioFromCoords } from '../services/ubicacioService';

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

interface LocationSelectorProps {
  lat: number;
  lng: number;
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
  onLocationChange: (lat: number, lng: number) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ lat, lng, setLat, setLng, onLocationChange }) => {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={[lat, lng]}
      icon={petIcon}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setLat(position.lat);
          setLng(position.lng);
          onLocationChange(position.lat, position.lng);
        },
      }}
    />
  );
};

type EspecieEnumType = typeof EspecieEnum[keyof typeof EspecieEnum];

/**
 * Genera un ID de microchip simulat amb format estàndard
 * Format: PET-XXXXXXXXXX (10 caràcters alfanumèrics)
 */
const generarMicrochipId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const padding = '0'.repeat(Math.max(0, 4 - timestamp.length));
  return `PET-${padding}${timestamp}${random}`;
};

const CrearAnuncioPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nomMascota, setNomMascota] = useState('');
  const [especieId, setEspecieId] = useState<EspecieEnumType | null>(null);
  const [raca, setRaca] = useState('');
  const [descripcio, setDescripcio] = useState('');
  const [latitud, setLatitud] = useState(41.3851);
  const [longitud, setLongitud] = useState(2.1734);
  const [estatId] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [imatge, setImatge] = useState<File | null>(null);
  const [imatgeUrl, setImatgeUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pujantImatge, setPujantImatge] = useState(false);

  const [ciutat, setCiutat] = useState('');
  const [provincia, setProvincia] = useState('');
  const [obtenintUbicacio, setObtenintUbicacio] = useState(false);

  const [teGeolocalitzacio, setTeGeolocalitzacio] = useState(false);
  const [microchipId, setMicrochipId] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Obtenir ubicació textual en canviar les coordenades
  const obtenirUbicacioPerCoordenades = async (lat: number, lng: number) => {
    setObtenintUbicacio(true);
    try {
      const ubicacio = await getUbicacioFromCoords(lat, lng);
      if (ubicacio) {
        setCiutat(ubicacio.ciutat);
        setProvincia(ubicacio.provincia);
      } else {
        setCiutat('');
        setProvincia('');
      }
    } catch (error) {
      console.error('Error obtenint ubicació:', error);
      setCiutat('');
      setProvincia('');
    } finally {
      setObtenintUbicacio(false);
    }
  };

  // Quan canvien les coordenades inicials (per defecte), obtenir ubicació
  useEffect(() => {
    if (latitud && longitud) {
      obtenirUbicacioPerCoordenades(latitud, longitud);
    }
  }, []);

  // Quan s'activa la geolocalització, generar microchip ID automàticament
  const handleTeGeolocalitzacioChange = (checked: boolean) => {
    setTeGeolocalitzacio(checked);
    if (checked && !microchipId) {
      setMicrochipId(generarMicrochipId());
    } else if (!checked) {
      setMicrochipId('');
    }
  };

  const pujarImatge = async (file: File): Promise<string | null> => {
    setPujantImatge(true);
    const formData = new FormData();
    formData.append('fitxer', file);

    try {
      const response = await axios.post('http://localhost:9090/api/imatges/pujar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = response.data.url;
      return url;
    } catch (error) {
      alert('Error pujant la imatge. Es crearà l\'anunci sense imatge.');
      return null;
    } finally {
      setPujantImatge(false);
    }
  };

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Si us plau, selecciona una imatge vàlida');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La imatge no pot superar els 5MB');
      return;
    }
    
    setImatge(file);
    setPreviewUrl(URL.createObjectURL(file));
    const url = await pujarImatge(file);
    if (url) {
      setImatgeUrl(url);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processImageFile(e.target.files[0]);
    }
  };

  // Manejar drag & drop per a la imatge
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitud(lat);
    setLongitud(lng);
    obtenirUbicacioPerCoordenades(lat, lng);
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!nomMascota.trim()) return alert('Introdueix el nom de la mascota');
    if (!especieId) return alert('Selecciona una espècie');

    try {
      setLoading(true);
      
      const anunciData = {
        nomMascota,
        especieId: Number(especieId),
        raca: raca || '',
        descripcio: descripcio || '',
        latitud: Number(latitud),
        longitud: Number(longitud),
        estatId: Number(estatId),
        imatgeUrl: imatgeUrl || null,
        ciutat: ciutat,
        provincia: provincia,
        teGeolocalitzacio: teGeolocalitzacio,
        microchipId: teGeolocalitzacio ? microchipId : null,
      };
            
      await crearAnuncio(user.usuariId, anunciData);
      
      alert('✅ Anunci creat correctament!');
      navigate('/mapa');
    } catch (err) {
      console.error('Error creant anunci:', err);
      if (err.response?.data) {
        alert(`Error: ${err.response.data}`);
      } else {
        alert('Error creant anunci. Intenta-ho de nou.');
      }
    } finally {
      setLoading(false);
    }
  };

  // TODO -> Moure estils a un fitxer separat
  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
  };

  const microchipContainerStyle: React.CSSProperties = {
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: '#e8f5e9',
    borderRadius: '12px',
    border: '1px solid #c8e6c9',
  };

  const microchipInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'monospace',
    color: '#333',
  };

  const hintTextStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#666',
    marginTop: '6px',
    marginBottom: 0,
  };

  const mobileMapStyle: React.CSSProperties = {
    width: '100%',
    height: '40vh',
    borderRadius: '12px',
  };

  // Layout mòbil
  if (isMobile) {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Header style={{ marginBottom: '20px' }} />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          width: '100%',
          padding: '0 15px',
          boxSizing: 'border-box',
        }}>
          <h2 style={styles.title}>Crear Anuncio</h2>

          <input
            style={{ ...styles.input, maxWidth: '100%' }}
            placeholder="Nombre Mascota"
            value={nomMascota}
            onChange={(e) => setNomMascota(e.target.value)}
          />

          <select
            style={{ ...styles.select, maxWidth: '100%' }}
            value={especieId ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) return setEspecieId(null);
              setEspecieId(Number(value) as EspecieEnumType);
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
            style={{ ...styles.input, maxWidth: '100%' }}
            placeholder="Raça (opcional)"
            value={raca}
            onChange={(e) => setRaca(e.target.value)}
          />
          
          <input
            style={{ ...styles.input, maxWidth: '100%' }}
            placeholder="Descripció"
            value={descripcio}
            onChange={(e) => setDescripcio(e.target.value)}
          />

          <div style={checkboxContainerStyle}>
            <input
              type="checkbox"
              id="teGeolocalitzacio"
              checked={teGeolocalitzacio}
              onChange={(e) => handleTeGeolocalitzacioChange(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="teGeolocalitzacio" style={{ cursor: 'pointer', fontWeight: 500 }}>
              Disposa de geolocalització en temps real (microchip GPS)
            </label>
          </div>

          {/* MICROCHIP ID, només si té geolocalització */}
          {teGeolocalitzacio && (
            <div style={microchipContainerStyle}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                🔢 Microchip ID
              </label>
              <input
                type="text"
                style={microchipInputStyle}
                value={microchipId}
                readOnly
                disabled
              />
              <p style={hintTextStyle}>
                💡 ID únic generat automàticament per al microchip simulat. Aquest ID permetrà identificar la mascota en el sistema de geolocalització.
              </p>
            </div>
          )}

          <div style={{ width: '100%' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Imatge de la mascota (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={pujantImatge}
              style={{ marginBottom: '10px', width: '100%' }}
            />
            {pujantImatge && <p style={{ color: '#666' }}>⏳ Pujant imatge...</p>}
            {previewUrl && (
              <img 
                src={previewUrl} 
                alt="Previsualització" 
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} 
              />
            )}
          </div>

          <button style={{ ...styles.button, maxWidth: '100%' }} onClick={handleSubmit} disabled={loading || pujantImatge}>
            {loading ? 'Creant...' : 'Crear Anuncio'}
          </button>

          <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>On s'ha perdut?</h3>
          
          {obtenintUbicacio && (
            <p style={{ fontSize: '12px', color: '#666' }}>⏳ Obtenint ubicació...</p>
          )}
          {!obtenintUbicacio && (ciutat || provincia) && (
            <p style={{ fontSize: '12px', color: '#06682D', marginTop: '-10px' }}>
              📍 {provincia && ciutat ? `${provincia} - ${ciutat}` : ciutat || provincia}
            </p>
          )}
          
          {/* Mapa */}
          <MapContainer 
            center={[latitud, longitud]} 
            zoom={13} 
            style={mobileMapStyle}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationSelector 
              lat={latitud} 
              lng={longitud} 
              setLat={setLatitud} 
              setLng={setLongitud} 
              onLocationChange={handleLocationChange}
            />
          </MapContainer>
        </div>
      </div>
    );
  }

  // Layout Desktop
  const desktopMapStyle: React.CSSProperties = {
    height: '450px',
    width: '100%',
    borderRadius: '12px',
  };

  return (
    <div style={styles.container}>
      <Header style={{ marginBottom: '20px' }} />

      <div style={styles.desktopLayout}>
        {/* Secció esquerra: Formulari */}
        <div style={styles.formSection}>
          <h2 style={{ ...styles.title, textAlign: 'left', marginTop: 0, marginBottom: '10px' }}>Crear Anuncio</h2>

          <input
            style={{ ...styles.input, maxWidth: '100%' }}
            placeholder="Nom de la Mascota"
            value={nomMascota}
            onChange={(e) => setNomMascota(e.target.value)}
          />

          <select
            style={{ ...styles.select, maxWidth: '100%' }}
            value={especieId ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) return setEspecieId(null);
              setEspecieId(Number(value) as EspecieEnumType);
            }}
          >
            <option value="">Selecciona l'espècie</option>
            {EspeciesOptions.map((op) => (
              <option key={op.id} value={op.id}>
                {op.label}
              </option>
            ))}
          </select>

          <input
            style={{ ...styles.input, maxWidth: '100%' }}
            placeholder="Raça (opcional)"
            value={raca}
            onChange={(e) => setRaca(e.target.value)}
          />
          
          <input
            style={{ ...styles.input, maxWidth: '100%' }}
            placeholder="Descripció"
            value={descripcio}
            onChange={(e) => setDescripcio(e.target.value)}
          />

          <div style={checkboxContainerStyle}>
            <input
              type="checkbox"
              id="teGeolocalitzacio"
              checked={teGeolocalitzacio}
              onChange={(e) => handleTeGeolocalitzacioChange(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="teGeolocalitzacio" style={{ cursor: 'pointer', fontWeight: 500 }}>
              Disposa de geolocalització en temps real (microchip GPS)
            </label>
          </div>

          {teGeolocalitzacio && (
            <div style={microchipContainerStyle}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                🔢 Microchip ID
              </label>
              <input
                type="text"
                style={microchipInputStyle}
                value={microchipId}
                readOnly
                disabled
              />
              <p style={hintTextStyle}>
                💡 ID únic generat automàticament per al microchip simulat. Aquest ID permetrà identificar la mascota en el sistema de geolocalització.
              </p>
            </div>
          )}

          <div>
            <label style={{ ...styles.label, textAlign: 'left' }}>
              Imatge de la mascota (opcional)
            </label>
            <div
              style={{
                ...styles.dragDropZone,
                border: `2px dashed ${isDragging ? '#06682D' : '#d0d0d0'}`,
                backgroundColor: isDragging ? '#e8f5e9' : '#fafafa',
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {pujantImatge ? (
                <p>⏳ Pujant imatge...</p>
              ) : previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Previsualització" 
                  style={styles.previewImageDesktop} 
                />
              ) : (
                <>
                  <span style={styles.dragDropIcon}>🐾</span>
                  <p style={styles.dragDropText}>Arrossega una imatge</p>
                  <p style={styles.dragDropSubtext}>o fes clic per seleccionar</p>
                  <p style={styles.dragDropSmallText}>JPG, PNG, GIF (max 5MB)</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          <button 
            style={{ ...styles.button, maxWidth: '100%' }} 
            onClick={handleSubmit} 
            disabled={loading || pujantImatge}
            onMouseEnter={(e) => {
              if (!loading && !pujantImatge) {
                e.currentTarget.style.background = '#055523';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#06682D';
            }}
          >
            {loading ? 'Creant...' : 'Crear Anuncio'}
          </button>
        </div>

        {/* Secció dreta: Mapa */}
        <div style={styles.mapSection}>
          <h3 style={{ ...styles.sectionTitle, marginBottom: '10px' }}>On s'ha perdut?</h3>
          
          {obtenintUbicacio && (
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>⏳ Obtenint ubicació...</p>
          )}
          {!obtenintUbicacio && (ciutat || provincia) && (
            <p style={{ fontSize: '12px', color: '#06682D', marginBottom: '8px' }}>
              📍 {provincia && ciutat ? `${provincia} - ${ciutat}` : ciutat || provincia}
            </p>
          )}
          
          <MapContainer 
            center={[latitud, longitud]} 
            zoom={13} 
            style={desktopMapStyle}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationSelector 
              lat={latitud} 
              lng={longitud} 
              setLat={setLatitud} 
              setLng={setLongitud} 
              onLocationChange={handleLocationChange}
            />
          </MapContainer>
          <p style={styles.mapHint}>
            💡 Fes clic al mapa per canviar la ubicació
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrearAnuncioPage;