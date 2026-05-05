import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/userService';
import { styles } from '../styles/loginstyles';
import axios from 'axios';

const API_URL = 'http://localhost:9090';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefon, setTelefon] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [imatgePerfil, setImatgePerfil] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pujantImatge, setPujantImatge] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const pujarImatgePerfil = async (file: File, usuariId: number): Promise<string | null> => {
    const formData = new FormData();
    formData.append('fitxer', file);

    try {
      const response = await axios.post(`${API_URL}/api/usuaris/pujar-perfil?usuariId=${usuariId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.url;
    } catch (error) {
      console.error('Error pujant imatge de perfil:', error);
      return null;
    }
  };

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Si us plau, selecciona una imatge vàlida');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('La imatge no pot superar els 2MB');
      return;
    }
    
    setImatgePerfil(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  // Funció per gestionar el registre de l'usuari
  const handleSubmit = async () => {
    setError('');

    if (!nom || !email || !password || !telefon) {
      setError('Tots els camps són obligatoris');
      return;
    }

    try {
      setLoading(true);
      
      // 1. Crear usuari sense imatge
      const response = await registerUser({ 
        nom, 
        email, 
        password, 
        telefon, 
        rol: 'USER', // Per defecte, el rol serà USER. L'admin es crearà manualment a la base de dades.
        imatgeUrl: null 
      });
      
      const usuariId = response.data.usuariId;
      
      // 2. Si hi ha imatge, pujar-la
      if (imatgePerfil && usuariId) {
        setPujantImatge(true);
        await pujarImatgePerfil(imatgePerfil, usuariId);
      }
      
      navigate('/login', { state: { registered: true } });
    } catch (err: any) {
      console.error('Error registrant usuari:', err);
      setError("Error en registrar l'usuari. L'email o el telèfon ja poden estar en ús.");
    } finally {
      setLoading(false);
      setPujantImatge(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  // TODO -> Moure estils a un fitxer separat
  const circularDragDropStyle: React.CSSProperties = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: `3px dashed ${isDragging ? '#06682D' : '#ccc'}`,
    backgroundColor: isDragging ? '#e8f5e9' : '#f9f9f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    margin: '0 auto 20px auto',
    transition: 'all 0.2s ease',
  };

  const previewImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Registrar-se</h2>

        <div
          style={circularDragDropStyle}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Perfil" style={previewImageStyle} />
          ) : (
            <span style={{ fontSize: '40px' }}>🐾</span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '-10px', marginBottom: '10px' }}>
          Foto de perfil (opcional)
        </p>

        <input
          style={styles.input}
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          style={styles.input}
          type="tel"
          placeholder="Telèfon"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Contrassenya"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? (pujantImatge ? 'Guardant imatge...' : 'Registrant...') : 'Registrar-se'}
        </button>

        <p style={styles.switchText}>
          ¿Ja tens compte?{' '}
          <Link to="/login" style={styles.link}>
            Inicia sessió!
          </Link>
        </p>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;