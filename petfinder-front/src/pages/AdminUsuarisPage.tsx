import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { obtenirTotsElsUsuaris, eliminarUsuariAdmin, editarUsuariAdmin } from '../services/adminService';
import Header from '../components/Header';
import AdminPagination from '../components/AdminPagination';
import AdminDeleteModal from '../components/AdminDeleteModal';
import { styles, getItemsPerPage, mobileStyles } from '../styles/adminStyles';

const API_URL = 'http://localhost:9090';

interface Usuari {
  usuariId: number;
  nom: string;
  email: string;
  telefon: string;
  rol: string;
  imatgeUrl: string | null;
}

const AdminUsuarisPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [usuaris, setUsuaris] = useState<Usuari[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ nom: '', telefon: '', rol: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);

  // 6 cards per pàgina a desktop (2x3), 2 cards a mòbil (2x1)
  const getItemsPerPageCustom = () => isMobile ? 2 : 6;
  const itemsPerPage = getItemsPerPageCustom();
  const totalPages = Math.ceil(usuaris.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsuaris = usuaris.slice(startIndex, endIndex);

  useEffect(() => {
    if (!user || user.rol !== 'ADMIN') {
      navigate('/mapa');
      return;
    }
    fetchUsuaris();
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchUsuaris = async () => {
    try {
      setLoading(true);
      const response = await obtenirTotsElsUsuaris();
      setUsuaris(response.data);
    } catch (error) {
      console.error('Error carregant usuaris:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (usuariId: number) => {
    try {
      await eliminarUsuariAdmin(usuariId);
      setUsuaris(usuaris.filter(u => u.usuariId !== usuariId));
      setShowDeleteConfirm(null);
      if (currentUsuaris.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error eliminant usuari:', error);
      alert('Error eliminant l\'usuari');
    }
  };

  const handleEdit = (usuari: Usuari) => {
    setEditingId(usuari.usuariId);
    setEditForm({
      nom: usuari.nom,
      telefon: usuari.telefon || '',
      rol: usuari.rol,
    });
  };

  const handleSaveEdit = async (usuariId: number) => {
    try {
      await editarUsuariAdmin(usuariId, editForm);
      setUsuaris(usuaris.map(u =>
        u.usuariId === usuariId
          ? { ...u, nom: editForm.nom, telefon: editForm.telefon, rol: editForm.rol }
          : u
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error editant usuari:', error);
      alert('Error editant l\'usuari');
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getImatgeUrl = (imatgeUrl: string | null) => {
    if (!imatgeUrl) return null;
    if (imatgeUrl.startsWith('http')) return imatgeUrl;
    return `${API_URL}${imatgeUrl}`;
  };

  // 🔥 Obté la primera lletra del nom per al placeholder
  const getInitial = (nom: string) => {
    return nom ? nom.charAt(0).toUpperCase() : '?';
  };

  // 🔥 Placeholder amb inicial
  const getPlaceholderAvatar = (nom: string) => {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%2306682D'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-size='40' font-weight='bold'%3E${getInitial(nom)}%3C/text%3E%3C/svg%3E`;
  };

  const getCardsGridStyle = () => {
    if (isMobile) {
      return { ...styles.cardsGrid, ...mobileStyles.cardsGrid };
    }
    return styles.cardsGrid;
  };

  const getCardImageStyle = () => ({
    width: '100%',
    height: '120px',
    objectFit: 'cover' as const,
    backgroundColor: '#e0e0e0',
    ...(isMobile ? { height: '100px' } : {}),
  });

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Header />
        <div style={styles.loadingText}>Carregant usuaris...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header />

      <div style={styles.content}>
        <div style={styles.headerSection}>
          <h1 style={styles.title}>Administració - Usuaris</h1>
          <p style={styles.subtitle}>
            Tots els usuaris de la plataforma
            {totalPages > 1 && ` · Pàgina ${currentPage} de ${totalPages}`}
          </p>
        </div>

        {usuaris.length === 0 ? (
          <div style={styles.emptyContainer}>
            <p>No hi ha usuaris.</p>
          </div>
        ) : (
          <>
            <div style={getCardsGridStyle()}>
              {currentUsuaris.map(usuari => {
                const imageUrl = getImatgeUrl(usuari.imatgeUrl);
                const placeholderUrl = getPlaceholderAvatar(usuari.nom);
                
                return (
                  <div key={usuari.usuariId} style={styles.card}>
                    <img
                      src={imageUrl || placeholderUrl}
                      alt={usuari.nom}
                      style={getCardImageStyle()}
                      onError={(e) => { (e.target as HTMLImageElement).src = placeholderUrl; }}
                    />
                    
                    <div style={styles.cardContent}>
                      {editingId === usuari.usuariId ? (
                        <>
                          <input
                            type="text"
                            value={editForm.nom}
                            onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                            style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                            placeholder="Nom"
                          />
                          <input
                            type="tel"
                            value={editForm.telefon}
                            onChange={(e) => setEditForm({ ...editForm, telefon: e.target.value })}
                            style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                            placeholder="Telèfon"
                          />
                          <select
                            value={editForm.rol}
                            onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })}
                            style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                          >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <button
                              onClick={() => handleSaveEdit(usuari.usuariId)}
                              style={{ flex: 1, padding: '8px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              💾 Guardar
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              style={{ flex: 1, padding: '8px', backgroundColor: '#666', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              ❌ Cancel·lar
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 style={styles.cardTitle}>{usuari.nom}</h3>
                          <p style={styles.cardText}>📧 {usuari.email}</p>
                          <p style={styles.cardText}>📞 {usuari.telefon || 'No especificat'}</p>
                          <p style={styles.cardSmallText}>🔑 Rol: {usuari.rol}</p>
                          
                          <div style={styles.actionsContainer}>
                            <button
                              style={styles.editButton}
                              onClick={() => handleEdit(usuari)}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#0b5ed7'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#2196F3'; }}
                            >
                              ✏️ Editar
                            </button>
                            <button
                              style={styles.deleteButton}
                              onClick={() => setShowDeleteConfirm(usuari.usuariId)}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#c62828'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#e53935'; }}
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>

      {showDeleteConfirm !== null && (
        <AdminDeleteModal
          title="⚠️ Eliminar usuari"
          message="Estàs segur que vols eliminar aquest usuari? Aquesta acció no es pot desfer."
          warning="S'eliminaran també tots els anuncis i mascotes associades."
          onConfirm={() => handleDelete(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default AdminUsuarisPage;