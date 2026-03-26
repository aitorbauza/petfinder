import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/userService';
import { styles } from '../styles/loginstyles';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefon, setTelefon] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!nom || !email || !password || !telefon) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      setLoading(true);
      await registerUser({ nom, email, password, telefon, rol: 'USER' });
      // Redirige al login con mensaje de éxito via state
      navigate('/login', { state: { registered: true } });
    } catch (err: any) {
      setError('Error al registrar el usuario. El email ya puede estar en uso.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Registrarse</h2>

        <input
          style={styles.input}
          type="text"
          placeholder="Nombre"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          style={styles.input}
          type="tel"
          pattern="[0-9+ ]{9,15}"
          placeholder="Teléfono"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <p style={styles.switchText}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={styles.link}>
            Inicia sesión
          </Link>
        </p>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;