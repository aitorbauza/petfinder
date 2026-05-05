import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { actualitzarUsuari, pujarImatgePerfil, eliminarImatgePerfil } from '../services/userService';
import Header from '../components/Header';
import { styles } from '../styles/perfilStyles';

const API_URL = 'http://localhost:9090';

const PerfilPage: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [originalNom, setOriginalNom] = useState('');
  const [originalTelefon, setOriginalTelefon] = useState('');
  const [originalImatgeUrl, setOriginalImatgeUrl] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  
  const [editNom, setEditNom] = useState('');
  const [editTelefon, setEditTelefon] = useState('');
  const [editImatgeFile, setEditImatgeFile] = useState<File | null>(null);
  const [editImatgePreview, setEditImatgePreview] = useState<string | null>(null);
  const [eliminarImatgeEdit, setEliminarImatgeEdit] = useState(false);
  
  const [pujantImatge, setPujantImatge] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isAdmin = user?.rol === 'ADMIN';

  // Carregar dades de l'usuari al muntatge del component
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setOriginalNom(user.nom || '');
      setOriginalTelefon(user.telefon || '');
      setOriginalImatgeUrl(user.imatgeUrl || null);
      setEmail(user.email || '');
      
      setEditNom(user.nom || '');
      setEditTelefon(user.telefon || '');
      setEditImatgeFile(null);
      setEditImatgePreview(null);
      setEliminarImatgeEdit(false);
    }
  }, [user, navigate]);

  // Detectar canvis en la mida de la pantalla per a disseny responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleMyAnuncis = () => {
    navigate('/mis-anuncios');
  };

  // Navegació per a admin
  const handleAllAnuncis = () => {
    navigate('/admin/anuncis');
  };

  const handleAllUsuaris = () => {
    navigate('/admin/usuaris');
  };

  // Funció per obtenir la inicial del nom per al placeholder de l'avatar
  const getInitial = () => {
    const displayNom = isEditing ? editNom : originalNom;
    if (!displayNom) return '?';
    return displayNom.charAt(0).toUpperCase();
  };

  const getCurrentImageUrl = () => {
    if (isEditing) {
      if (eliminarImatgeEdit) return null;
      if (editImatgePreview) return editImatgePreview;
      if (originalImatgeUrl) {
        if (originalImatgeUrl.startsWith('http')) return originalImatgeUrl;
        return `${API_URL}${originalImatgeUrl}`;
      }
      return null;
    } else {
      if (originalImatgeUrl) {
        if (originalImatgeUrl.startsWith('http')) return originalImatgeUrl;
        return `${API_URL}${originalImatgeUrl}`;
      }
      return null;
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Si us plau, selecciona una imatge vàlida');
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('La imatge no pot superar els 2MB');
      return false;
    }
    
    setError('');
    setEditImatgeFile(file);
    setEditImatgePreview(URL.createObjectURL(file));
    setEliminarImatgeEdit(false);
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImageEdit = () => {
    if (editImatgePreview) {
      URL.revokeObjectURL(editImatgePreview);
    }
    setEditImatgeFile(null);
    setEditImatgePreview(null);
    setEliminarImatgeEdit(true);
  };

  const handleSave = async () => {
    if (!user?.usuariId) return;
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      let finalImatgeUrl = originalImatgeUrl;
      
      if (eliminarImatgeEdit) {
        await eliminarImatgePerfil(user.usuariId);
        finalImatgeUrl = null;
      }
      
      if (editImatgeFile) {
        setPujantImatge(true);
        const url = await pujarImatgePerfil(editImatgeFile, user.usuariId);
        finalImatgeUrl = url;
        setPujantImatge(false);
      }
      
      const updatedUser = await actualitzarUsuari(user.usuariId, {
        nom: editNom,
        telefon: editTelefon,
      });
      
      setUser({ 
        ...user, 
        nom: updatedUser.nom, 
        telefon: updatedUser.telefon,
        imatgeUrl: finalImatgeUrl
      });
      
      setOriginalNom(editNom);
      setOriginalTelefon(editTelefon);
      setOriginalImatgeUrl(finalImatgeUrl);
      
      if (editImatgePreview) {
        URL.revokeObjectURL(editImatgePreview);
      }
      setEditImatgeFile(null);
      setEditImatgePreview(null);
      setEliminarImatgeEdit(false);
      
      setSuccess('Perfil actualitzat correctament!');
      setIsEditing(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Aquest número de telèfon ja està registrat per un altre usuari');
      } else {
        setError(err.response?.data?.error || 'Error actualitzant el perfil');
      }
    } finally {
      setLoading(false);
      setPujantImatge(false);
    }
  };

  const handleCancel = () => {
    setEditNom(originalNom);
    setEditTelefon(originalTelefon);
    
    if (editImatgePreview) {
      URL.revokeObjectURL(editImatgePreview);
    }
    setEditImatgeFile(null);
    setEditImatgePreview(null);
    setEliminarImatgeEdit(false);
    setError('');
    
    setIsEditing(false);
  };

  useEffect(() => {
    return () => {
      if (editImatgePreview) {
        URL.revokeObjectURL(editImatgePreview);
      }
    };
  }, [editImatgePreview]);

  // TODO -> Moure estils a un fitxer separat
  const avatarPlaceholderStyle: React.CSSProperties = {
    width: isMobile ? '120px' : '150px',
    height: isMobile ? '120px' : '150px',
    borderRadius: '50%',
    backgroundColor: '#06682D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: isMobile ? '48px' : '60px',
    border: '3px solid #fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  };

  const avatarStyle: React.CSSProperties = {
    width: isMobile ? '120px' : '150px',
    height: isMobile ? '120px' : '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #06682D',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#f0f0f0',
  };

  const avatarContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
    position: 'relative',
  };

  const editAvatarOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '10px',
    right: 'calc(50% - 60px)',
    backgroundColor: '#06682D',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid #fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
  };

  const removeImageOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '10px',
    left: 'calc(50% - 60px)',
    backgroundColor: '#e53935',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid #fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
  };

  const currentImageUrl = getCurrentImageUrl();
  const showImage = currentImageUrl !== null && currentImageUrl !== undefined;
  // Comprovar si hi ha canvis per habilitar/deshabilitar el botó de guardar
  const hasChanges = (editNom !== originalNom || 
                      editTelefon !== originalTelefon || 
                      editImatgeFile !== null || 
                      eliminarImatgeEdit);

  return (
    <div style={styles.container}>
      <Header />

      <div style={styles.content}>
        <div style={isMobile ? styles.cardMobile : styles.cardDesktop}>
          
          <div style={avatarContainerStyle}>
            {showImage ? (
              <img
                src={currentImageUrl!}
                alt="Avatar"
                style={avatarStyle}
                onError={(e) => {
                  console.error('Error carregant imatge:', currentImageUrl);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div style={avatarPlaceholderStyle}>
                {getInitial()}
              </div>
            )}
             {/* Si l'usuari està editant el perfil */}
            {isEditing && (
              <>
                <div
                  style={editAvatarOverlayStyle}
                  onClick={() => fileInputRef.current?.click()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <span style={{ fontSize: '18px', color: '#fff' }}>✏️</span>
                </div>
                
                {(originalImatgeUrl || editImatgePreview || eliminarImatgeEdit) && !eliminarImatgeEdit && (
                  <div
                    style={removeImageOverlayStyle}
                    onClick={handleRemoveImageEdit}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <span style={{ fontSize: '18px', color: '#fff' }}>🗑️</span>
                  </div>
                )}
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          </div>

          {pujantImatge && (
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span>⏳ Pujant imatge...</span>
            </div>
          )}

          <div style={styles.infoContainer}>
            {isEditing ? (
              <>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nom complet</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={editNom}
                    onChange={(e) => setEditNom(e.target.value)}
                  />
                </div>

                <div style={styles.readonlyGroup}>
                  <label style={styles.label}>Email</label>
                  <div style={styles.readonlyValue}>{email}</div>
                  <p style={styles.hint}>L'email no es pot modificar</p>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Telèfon</label>
                  <input
                    type="tel"
                    style={styles.input}
                    value={editTelefon}
                    onChange={(e) => setEditTelefon(e.target.value)}
                    placeholder="Número de telèfon"
                  />
                </div>
              </>
            ) : (
              // I si no està editant, mostrar la informació com a text normal
              <> 
                <div style={styles.infoRow}>
                  <span style={styles.infoIcon}>👤</span>
                  <div>
                    <p style={styles.infoLabel}>Nom complet</p>
                    <p style={styles.infoValue}>{originalNom || 'No especificat'}</p>
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoIcon}>📧</span>
                  <div>
                    <p style={styles.infoLabel}>Email</p>
                    <p style={styles.infoValue}>{email || 'No especificat'}</p>
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoIcon}>📞</span>
                  <div>
                    <p style={styles.infoLabel}>Telèfon</p>
                    <p style={styles.infoValue}>{originalTelefon || 'No especificat'}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}
          {success && <div style={styles.successMessage}>{success}</div>}

          <div style={styles.actionsContainer}>
            {isEditing ? (
              <>
                <button 
                  style={styles.saveButton}
                  onClick={handleSave}
                  disabled={loading || pujantImatge || (!hasChanges)}
                >
                  {loading ? 'Guardant...' : '💾 Guardar canvis'}
                </button>
                <button 
                  style={styles.cancelButton}
                  onClick={handleCancel}
                  disabled={loading}
                >
                  ❌ Cancel·lar
                </button>
              </>
            ) : (
              <>
                <button 
                  style={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Editar perfil
                </button>
                
                {/* ADMIN */}
                {isAdmin && (
                  <>
                    <button 
                      style={styles.adminButton}
                      onClick={handleAllAnuncis}
                    >
                      📋 VEURE ANUNCIS
                    </button>
                    <button 
                      style={styles.adminButton}
                      onClick={handleAllUsuaris}
                    >
                      👥 VEURE USUARIS
                    </button>
                  </>
                )}
                
                <button 
                  style={styles.myAnuncisButton}
                  onClick={handleMyAnuncis}
                >
                  📋 Els meus anuncis
                </button>
                <button 
                  style={styles.logoutButton}
                  onClick={handleLogout}
                >
                  🚪 Tancar Sessió
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;