import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { obtenirAnuncisPropis, eliminarAnunci } from '../services/anuncioService';
import Header from '../components/Header';
import { styles } from '../styles/misAnunciosStyles';

const API_URL = 'http://localhost:9090';

interface Anuncio {
  id: number;
  latitud: number;
  longitud: number;
  nomMascota: string;
  especie: string;
  raca: string;
  estat: string;
  imatgeUrl: string | null;
  ciutat: string;
  provincia: string;
}

const getItemsPerPage = (isMobile: boolean) => isMobile ? 2 : 6;

const MisAnunciosPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMisAnuncios();
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funció per carregar els anuncis propis de l'usuari
  const fetchMisAnuncios = async () => {
    if (!user?.usuariId) return;
    
    try {
      setLoading(true);
      const response = await obtenirAnuncisPropis(user.usuariId);
      setAnuncios(response.data);
    } catch (error) {
      console.error('Error carregant els teus anuncis:', error);
    } finally {
      setLoading(false);
    }
  };

  // Funció per eliminar un anunci
  const handleDelete = async (anunciId: number) => {
    if (!user?.usuariId) return;
    
    setDeleting(true);
    try {
      await eliminarAnunci(anunciId, user.usuariId);
      setAnuncios(anuncios.filter(a => a.id !== anunciId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error eliminant anunci:', error);
      alert('Error eliminant l\'anunci');
    } finally {
      setDeleting(false);
    }
  };

  const itemsPerPage = getItemsPerPage(isMobile);
  const totalPages = Math.ceil(anuncios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnuncios = anuncios.slice(startIndex, endIndex);

  // Funció per canviar de pàgina en cas de paginació
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getImatgeUrl = (imatgeUrl: string | null) => {
    if (!imatgeUrl) return null;
    if (imatgeUrl.startsWith('http')) return imatgeUrl;
    return `${API_URL}${imatgeUrl}`;
  };

  const getRacaText = (raca: string | undefined) => {
    return raca && raca.trim() !== '' ? raca : 'Sense raça';
  };

  const getUbicacioText = (anuncio: Anuncio) => {
    if (anuncio.provincia && anuncio.ciutat) {
      return `${anuncio.provincia} - ${anuncio.ciutat}`;
    }
    if (anuncio.ciutat) return anuncio.ciutat;
    if (anuncio.provincia) return anuncio.provincia;
    return 'Ubicació no disponible';
  };

  const placeholderImageUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect width="200" height="150" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3E🐾%3C/text%3E%3C/svg%3E';

  // TODO -> Moure estils a un fitxer separat
  const cardsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: '20px',
  };

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    height: '100%',
    position: 'relative',
  };

  const imageContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '160px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const actionsOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    display: 'flex',
    gap: '8px',
    zIndex: 10,
  };

  const editButtonStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#06682D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid #fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
    fontSize: '18px',
    color: '#fff',
  };

  const deleteButtonStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#e53935',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid #fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
    fontSize: '18px',
    color: '#fff',
  };

  const contentStyle: React.CSSProperties = {
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  };

  const petNameStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#1a1a1a',
  };

  const breedStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '13px',
    color: '#666',
  };

  const ubicacioStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '11px',
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const statusStyle = (estat: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: estat === 'Perdut' ? '#FFEBEE' : '#E8F5E9',
    color: estat === 'Perdut' ? '#C62828' : '#2E7D32',
    alignSelf: 'flex-start',
    marginTop: '8px',
  });

  const paginationContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginTop: '32px',
    padding: '20px 0',
  };

  const pageButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: '#06682D',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.2s',
  };

  const pageButtonDisabledStyle: React.CSSProperties = {
    ...pageButtonStyle,
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  };

  const pageInfoStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    margin: '0 12px',
  };

  const emptyContainerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    color: '#999',
  };

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '16px',
    maxWidth: '400px',
    textAlign: 'center',
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
        <Header />
        <div style={styles.content}>
          <p>Carregant els teus anuncis...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header />

      <div style={styles.content}>
        <div style={styles.headerSection}>
          <h1 style={styles.title}>Els meus anuncis</h1>
          {anuncios.length > 0 && (
            <p style={styles.subtitle}>
              Tens {anuncios.length} anunci{anuncios.length !== 1 ? 's' : ''}
              {totalPages > 1 && ` · Pàgina ${currentPage} de ${totalPages}`}
            </p>
          )}
        </div>

        {anuncios.length === 0 ? (
          <div style={emptyContainerStyle}>
            <span style={{ fontSize: '48px' }}>📋</span>
            <p style={{ marginTop: '16px' }}>Encara no has creat cap anunci.</p>
            <button 
              style={styles.createButton}
              onClick={() => navigate('/crear')}
            >
              + Crear el meu primer anunci
            </button>
          </div>
        ) : (
          <>
            <div style={cardsGridStyle}>
              {currentAnuncios.map((anuncio) => (
                <div key={anuncio.id} style={cardStyle}>
                  <div style={imageContainerStyle}>
                    <img
                      src={getImatgeUrl(anuncio.imatgeUrl) || placeholderImageUrl}
                      alt={anuncio.nomMascota}
                      style={imageStyle}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = placeholderImageUrl;
                      }}
                    />
                    <div style={actionsOverlayStyle}>
                      <div
                        style={editButtonStyle}
                        onClick={() => navigate(`/editar-anunci/${anuncio.id}`)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        ✏️
                      </div>
                      <div
                        style={deleteButtonStyle}
                        onClick={() => setShowDeleteConfirm(anuncio.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        🗑️
                      </div>
                    </div>
                  </div>

                  <div style={contentStyle}>
                    <h3 style={petNameStyle}>{anuncio.nomMascota}</h3>
                    <p style={breedStyle}>
                      {anuncio.especie} - {getRacaText(anuncio.raca)}
                    </p>
                    <p style={ubicacioStyle}>
                      📍 {getUbicacioText(anuncio)}
                    </p>
                    <span style={statusStyle(anuncio.estat)}>
                      {anuncio.estat}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={paginationContainerStyle}>
                <button
                  style={currentPage === 1 ? pageButtonDisabledStyle : pageButtonStyle}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ◀ Anterior
                </button>
                
                <span style={pageInfoStyle}>
                  Pàgina {currentPage} de {totalPages}
                </span>
                
                <button
                  style={currentPage === totalPages ? pageButtonDisabledStyle : pageButtonStyle}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Següent ▶
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showDeleteConfirm !== null && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>⚠️ Eliminar anunci</h3>
            <p>Estàs segur que vols eliminar aquest anunci? Aquesta acció no es pot desfer.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => handleDelete(showDeleteConfirm)} 
                disabled={deleting}
                style={{ padding: '10px 20px', backgroundColor: '#e53935', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                {deleting ? 'Eliminant...' : 'Sí, eliminar'}
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(null)} 
                style={{ padding: '10px 20px', backgroundColor: '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancel·lar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisAnunciosPage;