import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { obtenirTotsElsAnuncis, eliminarAnunciAdmin } from '../services/adminService';
import Header from '../components/Header';
import AdminCard from '../components/AdminCard';
import AdminPagination from '../components/AdminPagination';
import AdminDeleteModal from '../components/AdminDeleteModal';
import { styles, getItemsPerPage, mobileStyles } from '../styles/adminStyles';

const API_URL = 'http://localhost:9090';

interface Anunci {
  id: number;
  nomMascota: string;
  especie: string;
  raca: string;
  estat: string;
  usuariNom: string;
  usuariId: number;
  imatgeUrl: string | null;
  ciutat: string;
  provincia: string;
  data: string;
}

const AdminAnuncisPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [anuncis, setAnuncis] = useState<Anunci[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = getItemsPerPage(isMobile);
  const totalPages = Math.ceil(anuncis.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnuncis = anuncis.slice(startIndex, endIndex);

  useEffect(() => {
    if (!user || user.rol !== 'ADMIN') {
      navigate('/mapa');
      return;
    }
    fetchAnuncis();
  }, [user, navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAnuncis = async () => {
    try {
      setLoading(true);
      const response = await obtenirTotsElsAnuncis();
      setAnuncis(response.data);
    } catch (error) {
      console.error('Error carregant anuncis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (anunciId: number) => {
    try {
      await eliminarAnunciAdmin(anunciId);
      setAnuncis(anuncis.filter(a => a.id !== anunciId));
      setShowDeleteConfirm(null);
      if (currentAnuncis.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error eliminant anunci:', error);
      alert('Error eliminant l\'anunci');
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

  const placeholderImageUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect width="200" height="150" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3E🐾%3C/text%3E%3C/svg%3E';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ca-ES');
  };

  const getCardsGridStyle = () => {
    if (isMobile) {
      return { ...styles.cardsGrid, ...mobileStyles.cardsGrid };
    }
    return styles.cardsGrid;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Header />
        <div style={styles.loadingText}>Carregant anuncis...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header />

      <div style={styles.content}>
        <div style={styles.headerSection}>
          <h1 style={styles.title}>Administració - Anuncis</h1>
          <p style={styles.subtitle}>
            Tots els anuncis de la plataforma
            {totalPages > 1 && ` · Pàgina ${currentPage} de ${totalPages}`}
          </p>
        </div>

        {anuncis.length === 0 ? (
          <div style={styles.emptyContainer}>
            <p>No hi ha anuncis.</p>
          </div>
        ) : (
          <>
            <div style={getCardsGridStyle()}>
              {currentAnuncis.map(anunci => (
                <AdminCard
                  key={anunci.id}
                  id={anunci.id}
                  title={anunci.nomMascota}
                  subtitle={`${anunci.especie} - ${anunci.raca || 'Sense raça'}`}
                  details={[
                    { label: '👤', value: anunci.usuariNom },
                    { label: '📍', value: anunci.ciutat || anunci.provincia || 'Ubicació no disponible' },
                    { value: `📅 ${formatDate(anunci.data)} | ${anunci.estat}` },
                  ]}
                  imageUrl={anunci.imatgeUrl}
                  placeholderImage={placeholderImageUrl}
                  onEdit={() => navigate(`/admin/editar-anunci/${anunci.id}`)}
                  onDelete={() => setShowDeleteConfirm(anunci.id)}
                  isMobile={isMobile}
                  getImageUrl={getImatgeUrl}
                />
              ))}
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
          title="⚠️ Eliminar anunci"
          message="Estàs segur que vols eliminar aquest anunci? Aquesta acció no es pot desfer."
          onConfirm={() => handleDelete(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default AdminAnuncisPage;