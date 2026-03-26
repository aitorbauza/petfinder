import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import CrearAnuncioPage from './pages/CrearAnuncioPage';
import LoginPage from './pages/LoginPage';
import MapaPage from './pages/MapaPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Redirección inicial */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Rutas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mapa" element={<MapaPage />} />
          <Route path="/crear" element={<CrearAnuncioPage />} />

          {/* Ruta fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;