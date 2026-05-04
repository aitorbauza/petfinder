import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { obtenirAnunciPerId } from '../services/anuncioService';
import { editarAnunciAdmin } from '../services/adminService';
import { getUbicacioFromCoords } from '../services/ubicacioService';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import Header from '../components/Header';
import { EspecieEnum, EspeciesOptions } from '../enums/EspecieEnum';
import axios from 'axios';
import { styles } from '../styles/crearAnuncioStyles';

// Configuración iconos Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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

const AdminEditarAnuncioPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDragging, setIsDragging] = useState(false);
  
  const [nomMascota, setNomMascota] = useState('');
  const [especieId, setEspecieId] = useState<EspecieEnumType | null>(null);
  const [raca, setRaca] = useState('');
  const [descripcio, setDescripcio] = useState('');
  const [latitud, setLatitud] = useState(41.3851);
  const [longitud, setLongitud] = useState(2.1734);
  const [estatId, setEstatId] = useState(1);
  const [imatgeUrl, setImatgeUrl] = useState<string | null>(null);
  const [ciutat, setCiutat] = useState('');
  const [provincia, setProvincia] = useState('');
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pujantImatge, setPujantImatge] = useState(false);
  const [eliminarImatgeEdit, setEliminarImatgeEdit] = useState(false);
  const [obtenintUbicacio, setObtenintUbicacio] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.rol !== 'ADMIN') {
      navigate('/mapa');
      return;
    }
    if (id) {
      fetchAnunci();
    }
  }, [user, id]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAnunci = async () => {
    try {
      setLoading(true);
      const response = await obtenirAnunciPerId(Number(id));
      const anunci = response.data;
      
      setNomMascota(anunci.nomMascota || '');
      setEspecieId(anunci.especieId || null);
      setRaca(anunci.raca || '');
      setDescripcio(anunci.descripcio || '');
      setLatitud(anunci.latitud || 41.3851);
      setLongitud(anunci.longitud || 2.1734);
      setEstatId(anunci.estat === 'Perdut' ? 1 : 2);
      setImatgeUrl(anunci.imatgeUrl || null);
      setCiutat(anunci.ciutat || '');
      setProvincia(anunci.provincia || '');
    } catch (error) {
      console.error('Error carregant anunci:', error);
      setError('No s\'ha pogut carregar l\'anunci');
    } finally {
      setLoading(false);
    }
  };

  const obtenirUbicacioPerCoordenades = async (lat: number, lng: number) => {
    setObtenintUbicacio(true);
    try {
      const ubicacio = await getUbicacioFromCoords(lat, lng);
      if (ubicacio) {
        setCiutat(ubicacio.ciutat);
        setProvincia(ubicacio.provincia);
      }
    } catch (error) {
      console.error('Error obtenint ubicació:', error);
    } finally {
      setObtenintUbicacio(false);
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitud(lat);
    setLongitud(lng);
    obtenirUbicacioPerCoordenades(lat, lng);
  };

  const pujarImatge = async (file: File): Promise<string | null> => {
    setPujantImatge(true);
    const formData = new FormData();
    formData.append('fitxer', file);

    try {
      const response = await axios.post('http://localhost:9090/api/imatges/pujar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.url;
    } catch (error) {
      alert('Error pujant la imatge');
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
    
    setPreviewUrl(URL.createObjectURL(file));
    setEliminarImatgeEdit(false);
    
    const url = await pujarImatge(file);
    if (url) {
      setImatgeUrl(url);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setImatgeUrl(null);
    setEliminarImatgeEdit(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      const anunciData = {
        nomMascota,
        especieId: Number(especieId),
        raca: raca || '',
        descripcio: descripcio || '',
        latitud: Number(latitud),
        longitud: Number(longitud),
        estatId: Number(estatId),
        imatgeUrl: eliminarImatgeEdit ? null : imatgeUrl,
        ciutat,
        provincia
      };
      
      await editarAnunciAdmin(Number(id), anunciData);
      alert('✅ Anunci actualitzat correctament!');
      navigate('/admin/anuncis');
    } catch (err) {
      console.error('Error actualitzant anunci:', err);
      setError('Error actualitzant l\'anunci');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/anuncis');
  };

  const getImatgePreview = () => {
    if (previewUrl) return previewUrl;
    if (imatgeUrl) {
      if (imatgeUrl.startsWith('http')) return imatgeUrl;
      return `http://localhost:9090${imatgeUrl}`;
    }
    return null;
  };

  const dragDropZoneStyle: React.CSSProperties = {
    border: `2px dashed ${isDragging ? '#06682D' : '#ccc'}`,
    borderRadius: '16px',
    padding: '0',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: isDragging ? '#e8f5e9' : '#f9f9f9',
    transition: 'all 0.2s ease',
    width: isMobile ? '100%' : '300px',
    maxWidth: isMobile ? '100%' : '300px',
    height: isMobile ? '200px' : '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: '0 auto',
  };

  if (loading) {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ textAlign: 'center', padding: '50px' }}>Carregant anunci...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header />

      <div style={isMobile ? { padding: '20px' } : styles.desktopLayout}>
        <div style={isMobile ? {} : styles.formSection}>
          <h2 style={styles.title}>Editar Anunci (Admin)</h2>

          <input
            style={styles.input}
            placeholder="Nom de la mascota"
            value={nomMascota}
            onChange={(e) => setNomMascota(e.target.value)}
          />

          <select
            style={styles.select}
            value={especieId ?? ''}
            onChange={(e) => setEspecieId(Number(e.target.value) as EspecieEnumType)}
          >
            <option value="">Selecciona especie</option>
            {EspeciesOptions.map((op) => (
              <option key={op.id} value={op.id}>{op.label}</option>
            ))}
          </select>

          <input
            style={styles.input}
            placeholder="Raça (opcional)"
            value={raca}
            onChange={(e) => setRaca(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Descripció"
            value={descripcio}
            onChange={(e) => setDescripcio(e.target.value)}
          />

          <select
            style={styles.select}
            value={estatId}
            onChange={(e) => setEstatId(Number(e.target.value))}
          >
            <option value={1}>Perdut</option>
            <option value={2}>Trobat</option>
          </select>

          {/* Imatge */}
          <div>
            <label style={styles.label}>Imatge de la mascota</label>
            <div
              style={dragDropZoneStyle}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processImageFile(e.dataTransfer.files[0]);
                }
              }}
            >
              {pujantImatge ? (
                <p>⏳ Pujant imatge...</p>
              ) : getImatgePreview() ? (
                <img src={getImatgePreview()!} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <span style={{ fontSize: '48px' }}>🐾</span>
                  <p>Arrossega una imatge o fes clic</p>
                  <p style={{ fontSize: '12px', color: '#999' }}>JPG, PNG (max 5MB)</p>
                </>
              )}
            </div>
            {getImatgePreview() && (
              <button 
                onClick={handleRemoveImage} 
                style={{ marginTop: '10px', color: 'red', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                🗑️ Eliminar imatge
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={handleSave} disabled={saving} style={styles.button}>
              {saving ? 'Guardant...' : '💾 Guardar canvis'}
            </button>
            <button onClick={handleCancel} style={{ ...styles.button, background: '#666' }}>
              ❌ Cancel·lar
            </button>
          </div>
        </div>

        {/* Mapa */}
        <div style={isMobile ? {} : styles.mapSection}>
          <h3>On s'ha perdut/trobat?</h3>
          {obtenintUbicacio && <p>⏳ Obtenint ubicació...</p>}
          {!obtenintUbicacio && (ciutat || provincia) && (
            <p style={{ fontSize: '12px', color: '#06682D' }}>
              📍 {provincia && ciutat ? `${provincia} - ${ciutat}` : ciutat || provincia}
            </p>
          )}
          <MapContainer center={[latitud, longitud]} zoom={13} style={{ height: '400px', width: '100%', borderRadius: '12px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationSelector lat={latitud} lng={longitud} setLat={setLatitud} setLng={setLongitud} onLocationChange={handleLocationChange} />
          </MapContainer>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>💡 Fes clic al mapa per canviar la ubicació</p>
        </div>
      </div>
    </div>
  );
};

export default AdminEditarAnuncioPage;