import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { styles } from "../styles/headerStyles";

const API_URL = 'http://localhost:9090';

interface HeaderProps {
  style?: React.CSSProperties;
}

const Header: React.FC<HeaderProps> = ({ style }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/perfil');
  };

  // Obtenir la URL de la imatge de perfil
  const getImatgePerfilUrl = () => {
    if (!user?.imatgeUrl) return null;
    if (user.imatgeUrl.startsWith('http')) return user.imatgeUrl;
    return `${API_URL}${user.imatgeUrl}`;
  };

  const avatarStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    cursor: 'pointer',
    border: '2px solid #fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const avatarPlaceholderStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#06682D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '18px',
    border: '2px solid #fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  return (
    <div style={{ ...styles.header, ...style }}>
      <div style={styles.title} onClick={() => navigate('/mapa')}>PETFINDER</div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* Botó de perfil circular */}
        {user && (
          <div onClick={handleProfile}>
            {getImatgePerfilUrl() ? (
              <img 
                src={getImatgePerfilUrl()} 
                alt="Perfil" 
                style={avatarStyle}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextSibling?.style?.setProperty('display', 'flex');
                }}
              />
            ) : null}
            <div 
              style={{ 
                ...avatarPlaceholderStyle, 
                display: getImatgePerfilUrl() ? 'none' : 'flex' 
              }}
            >
              {user.nom?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        )}
        <button style={styles.button} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Header;