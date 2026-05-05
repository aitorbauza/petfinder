import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { obtenirAnunciPerId } from '../services/anuncioService';
import Header from '../components/Header';
import { styles, getStatusBadgeStyle, getChatButtonStyle, getHalfRowStyle } from '../styles/detallAnunciStyles';

const API_URL = 'http://localhost:9090';

interface AnunciDetall {
  id: number;
  nomMascota: string;
  especie: string;
  raca: string;
  descripcio: string;
  estat: string;
  latitud: number;
  longitud: number;
  imatgeUrl: string | null;
  ciutat: string;
  provincia: string;
  data: string;
  usuariId: number;
  usuariNom: string;
  usuariTelefon: string;
}

const DetallAnunciPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [anunci, setAnunci] = useState<AnunciDetall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (id) {
      fetchAnunci();
    }
  }, [id]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funció per carregar l'anunci per ID
  const fetchAnunci = async () => {
    try {
      setLoading(true);
      const response = await obtenirAnunciPerId(Number(id));
      console.log('📢 Anunci rebut:', response.data);
      console.log('👤 Usuari loguejat:', user?.usuariId);
      console.log('👤 Propietari anunci:', response.data.usuariId);
      setAnunci(response.data);
    } catch (error) {
      console.error('Error carregant anunci:', error);
      setError('No s\'ha pogut carregar l\'anunci');
    } finally {
      setLoading(false);
    }
  };

  const getImatgeUrl = (imatgeUrl: string | null) => {
    if (!imatgeUrl) return null;
    if (imatgeUrl.startsWith('http')) return imatgeUrl;
    return `${API_URL}${imatgeUrl}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ca-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // En cas que no hi hagi imatge, utilitzem una imatge placeholder (un SVG simple amb una petjada)
  const placeholderImageUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="20"%3E🐾%3C/text%3E%3C/svg%3E';

  const isOwner = user?.usuariId === anunci?.usuariId;
  const showChatButton = !isOwner && anunci !== null;

  // Funció per obrir el xat des del detall
  const handleOpenChat = () => {
  if (!anunci) return;
  
  const nom = anunci.usuariNom || 'Usuari';
  
  console.log('📤 Navegant a xat amb:', { 
    destinatariId: anunci.usuariId, 
    destinatariNom: nom 
  });
  
  // S'obri el xat en la pantala del mapa
  navigate('/mapa', { 
    state: { 
      openChat: true, 
      destinatariId: anunci.usuariId,
      destinatariNom: nom,
      anunciId: anunci.id 
    } 
  });
};

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Header />
        <div style={styles.loadingText}>Carregant anunci...</div>
      </div>
    );
  }

  if (error || !anunci) {
    return (
      <div style={styles.errorContainer}>
        <Header />
        <div style={styles.errorText}>
          <p>{error || 'Anunci no trobat'}</p>
          <button 
            onClick={() => navigate('/mapa')} 
            style={styles.backButton}
          >
            Tornar al mapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header />

      <div style={{ ...styles.content, ...(isMobile ? styles.contentMobile : styles.contentDesktop) }}>
        <div style={styles.card}>
          {/* Imatge */}
          <div style={{ 
            ...styles.imageContainer, 
            ...(isMobile ? styles.imageContainerMobile : styles.imageContainerDesktop) 
          }}>
            <img
              src={getImatgeUrl(anunci.imatgeUrl) || placeholderImageUrl}
              alt={anunci.nomMascota}
              style={styles.image}
              onError={(e) => {
                (e.target as HTMLImageElement).src = placeholderImageUrl;
              }}
            />
          </div>

          {/* Informació */}
          <div style={{ ...styles.infoContainer, ...(isMobile && styles.infoContainerMobile) }}>
            <div style={styles.header}>
              <h1 style={{ ...styles.petName, ...(isMobile ? styles.petNameMobile : styles.petNameDesktop) }}>
                {anunci.nomMascota}
              </h1>
              <span style={getStatusBadgeStyle(anunci.estat)}>{anunci.estat}</span>
            </div>

            {/* Descripció */}
            {anunci.descripcio && (
              <div style={styles.section}>
                <p style={{ ...styles.sectionValue, ...(isMobile ? styles.sectionValueMobile : styles.sectionValueDesktop) }}>
                  {anunci.descripcio}
                </p>
              </div>
            )}

            {/* Detalls en fila */}
            <div style={styles.row}>
              <div style={getHalfRowStyle(isMobile)}>
                <p style={styles.sectionTitle}>Espècie</p>
                <p style={{ ...styles.sectionValue, ...(isMobile ? styles.sectionValueMobile : styles.sectionValueDesktop) }}>
                  {anunci.especie || 'No especificat'}
                </p>
              </div>
              <div style={getHalfRowStyle(isMobile)}>
                <p style={styles.sectionTitle}>Raça</p>
                <p style={{ ...styles.sectionValue, ...(isMobile ? styles.sectionValueMobile : styles.sectionValueDesktop) }}>
                  {anunci.raca || 'Sense raça'}
                </p>
              </div>
            </div>

            <div style={styles.row}>
              <div style={getHalfRowStyle(isMobile)}>
                <p style={styles.sectionTitle}>Data de publicació</p>
                <p style={{ ...styles.sectionValue, ...(isMobile ? styles.sectionValueMobile : styles.sectionValueDesktop) }}>
                  {formatDate(anunci.data)}
                </p>
              </div>
              <div style={getHalfRowStyle(isMobile)}>
                <p style={styles.sectionTitle}>Ubicació</p>
                <p style={{ ...styles.sectionValue, ...(isMobile ? styles.sectionValueMobile : styles.sectionValueDesktop) }}>
                  📍 {anunci.provincia && anunci.ciutat 
                      ? `${anunci.provincia} - ${anunci.ciutat}` 
                      : anunci.ciutat || anunci.provincia || 'Ubicació no disponible'}
                </p>
              </div>
            </div>

            {showChatButton && (
              <button
                style={getChatButtonStyle(false)}
                onClick={handleOpenChat}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#055523';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#06682D';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                💬 Envia un missatge a l'amo
              </button>
            )}

            {/* Missatge si és el propi anunci */}
            {isOwner && (
              <div style={styles.ownerMessage}>
                📝 El teu anunci
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallAnunciPage;