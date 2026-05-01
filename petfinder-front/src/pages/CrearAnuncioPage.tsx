import React, { useContext, useState, useEffect } from 'react';
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

type EspecieEnumType = typeof EspecieEnum[keyof typeof EspecieEnum];

const CrearAnuncioPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [nomMascota, setNomMascota] = useState('');
  const [especieId, setEspecieId] = useState<EspecieEnumType | null>(null);
  const [raca, setRaca] = useState('');
  const [descripcio, setDescripcio] = useState('');
  const [latitud, setLatitud] = useState(41.3851);
  const [longitud, setLongitud] = useState(2.1734);
  const [estatId] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(false);
  
  const [imatge, setImatge] = useState<File | null>(null);
  const [imatgeUrl, setImatgeUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pujantImatge, setPujantImatge] = useState(false);

  // Redirige si no hay sesión
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Detecta tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funció per pujar la imatge al backend
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

  // Quan es selecciona una imatge
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImatge(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      // Pujar-la automàticament
      const url = await pujarImatge(file);
      if (url) {
        setImatgeUrl(url);
      }
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
    
    // Preparar dades
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
    
    // 🔍 LOG per depurar
    // console.log('📤 Enviant dades:', JSON.stringify(anunciData, null, 2));
    // console.log('👤 usuariId:', user.usuariId);
    
    await crearAnuncio(user.usuariId, anunciData);
    
    alert('✅ Anunci creat correctament!');
    navigate('/mapa');
  } catch (err) {
    console.error('Error creant anunci:', err);
    if (err.response?.data) {
      console.error('Error del backend:', err.response.data);
      alert(`Error: ${err.response.data}`);
    } else {
      alert('Error creant anunci. Intenta-ho de nou.');
    }
  } finally {
    setLoading(false);
  }
};

  const contentContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    width: '100%',
    padding: isMobile ? '0 15px' : 0,
    boxSizing: 'border-box',
  };

  const imagePreviewStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginTop: '10px',
    border: '1px solid #ddd'
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header style={isMobile ? { marginBottom: '20px' } : { marginBottom: '20px' }} />

      <div style={contentContainerStyle}>
        <h2 style={styles.title}>Crear Anuncio</h2>

        <input
          style={styles.input}
          placeholder="Nombre Mascota"
          value={nomMascota}
          onChange={(e) => setNomMascota(e.target.value)}
        />

        <select
          style={styles.input}
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
          style={styles.input}
          placeholder="Raza (opcional)"
          value={raca}
          onChange={(e) => setRaca(e.target.value)}
        />
        
        <input
          style={styles.input}
          placeholder="Descripción"
          value={descripcio}
          onChange={(e) => setDescripcio(e.target.value)}
        />

        {/* Input per a la imatge */}
        <div style={{ width: '100%', textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Imatge de la mascota (opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={pujantImatge}
            style={{ marginBottom: '10px' }}
          />
          {pujantImatge && <p style={{ color: '#666' }}>⏳ Pujant imatge...</p>}
          {previewUrl && (
            <img src={previewUrl} alt="Previsualització" style={imagePreviewStyle} />
          )}
        </div>

        <button style={styles.button} onClick={handleSubmit} disabled={loading || pujantImatge}>
          {loading ? 'Creant...' : 'Crear Anuncio'}
        </button>

        <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>On s'ha perdut?</h3>
        <MapContainer center={[latitud, longitud]} zoom={13} style={styles.mapContainer}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector lat={latitud} lng={longitud} setLat={setLatitud} setLng={setLongitud} />
        </MapContainer>
      </div>
    </div>
  );
};

export default CrearAnuncioPage;