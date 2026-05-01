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
      icon={petIcon}
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

type EspecieEnumType = typeof EspecieEnum[keyof typeof EspecieEnum];

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
        imatgeUrl: imatgeUrl || null
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

  // Estils per al layout desktop
  const desktopLayoutStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '30px',
    padding: '20px',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const formSectionStyle: React.CSSProperties = {
    flex: '0 0 66%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const mapSectionStyle: React.CSSProperties = {
    flex: '0 0 34%',
    position: 'sticky',
    top: '20px',
    alignSelf: 'flex-start',
  };

  // Drag & Drop per a desktop (més gran)
  const dragDropZoneStyle: React.CSSProperties = {
    border: `2px dashed ${isDragging ? '#06682D' : '#ccc'}`,
    borderRadius: '16px',
    padding: '0',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: isDragging ? '#e8f5e9' : '#f9f9f9',
    transition: 'all 0.2s ease',
    width: '100%',
    maxWidth: '300px',
    height: '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  // Mapa desktop (més gran)
  const desktopMapStyle: React.CSSProperties = {
    height: '450px',
    width: '100%',
    borderRadius: '12px',
  };

  // Mapa mòbil (ample complet)
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
            style={{ ...styles.input, maxWidth: '100%' }}
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
            placeholder="Raza (opcional)"
            value={raca}
            onChange={(e) => setRaca(e.target.value)}
          />
          
          <input
            style={{ ...styles.input, maxWidth: '100%' }}
            placeholder="Descripción"
            value={descripcio}
            onChange={(e) => setDescripcio(e.target.value)}
          />

          {/* Input normal per a mòbil (sense drag & drop) */}
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
          <MapContainer center={[latitud, longitud]} zoom={13} style={mobileMapStyle}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationSelector lat={latitud} lng={longitud} setLat={setLatitud} setLng={setLongitud} />
          </MapContainer>
        </div>
      </div>
    );
  }

return (
  <div style={styles.container}>
    <Header style={{ marginBottom: '20px' }} />

    <div style={styles.desktopLayout}>
      {/* Secció esquerra: Formulari (60%) */}
      <div style={styles.formSection}>
        <h2 style={{ ...styles.title, textAlign: 'left', marginTop: 0, marginBottom: '10px' }}>Crear Anuncio</h2>

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
          placeholder="Raza (opcional)"
          value={raca}
          onChange={(e) => setRaca(e.target.value)}
        />
        
        <input
          style={{ ...styles.input, maxWidth: '100%' }}
          placeholder="Descripción"
          value={descripcio}
          onChange={(e) => setDescripcio(e.target.value)}
        />

        {/* Drag & Drop per a desktop - Títol alineat a l'esquerra */}
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

      {/* Secció dreta: Mapa (40%) - Ara amb ample alineat */}
      <div style={styles.mapSection}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: '10px' }}>On s'ha perdut?</h3>
        <MapContainer 
          center={[latitud, longitud]} 
          zoom={13} 
          style={styles.desktopMap}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector lat={latitud} lng={longitud} setLat={setLatitud} setLng={setLongitud} />
        </MapContainer>
        <p style={styles.mapHint}>
          💡 Fes clic al mapa per canviar la ubicació
        </p>
      </div>
    </div>
  </div>
);
}

export default CrearAnuncioPage;