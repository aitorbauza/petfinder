import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { styles } from "../styles/headerStyles";

// Header.tsx
interface HeaderProps {
  style?: React.CSSProperties;
}
// holaa
const Header: React.FC<HeaderProps> = ({ style }) => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // <-- limpiar localStorage
    navigate('/login');
  };

  return (
    <div style={{ ...styles.header, ...style }}>
      <div style={styles.title} onClick={() => navigate('/mapa')}>PETFINDER</div>
      <button style={styles.button} onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Header;