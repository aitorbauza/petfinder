import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { styles } from '../styles/headerStyles';

const API_URL = 'http://localhost:9090';

interface HeaderProps {
  style?: React.CSSProperties;
}

const Header: React.FC<HeaderProps> = ({ style }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleProfile = (): void => {
    navigate('/perfil');
  };

  const getImatgePerfilUrl = (): string | null => {
    if (!user?.imatgeUrl) return null;
    if (user.imatgeUrl.startsWith('http')) return user.imatgeUrl;
    return `${API_URL}${user.imatgeUrl}`;
  };

  const getInitial = (): string => {
    if (!user?.nom) return '?';
    return user.nom.charAt(0).toUpperCase();
  };

  const hasImage = (): boolean => {
    return !!getImatgePerfilUrl();
  };

  return (
    <div style={{ ...styles.header, ...style }}>
      <div style={styles.title} onClick={() => navigate('/mapa')}>
        PETFINDER
      </div>
      
      <div style={styles.rightSection}>
        {user && (
          <div
            onClick={handleProfile}
            style={styles.avatarContainer}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.avatarContainerHover);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.opacity = '';
            }}
          >
            {hasImage() ? (
              <img 
                src={getImatgePerfilUrl()!} 
                alt="Perfil" 
                style={styles.avatar}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {getInitial()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;