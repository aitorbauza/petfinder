import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapaPage from './pages/MapaPage';
import CrearAnuncioPage from './pages/CrearAnuncioPage';
import PerfilPage from './pages/PerfilPage';
import MisAnunciosPage from './pages/MisAnunciosPage';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirige raíz al mapa */}
          <Route path="/" element={<Navigate to="/mapa" replace />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* App */}
          <Route path="/mapa" element={<MapaPage />} />
          <Route path="/crear" element={<CrearAnuncioPage />} />

          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/mis-anuncios" element={<MisAnunciosPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;