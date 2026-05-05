import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { loginUser } from '../services/userService';
import { styles } from '../styles/loginstyles';

const LoginPage: React.FC = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!email || !password) {
      setError('Email i contrassenya són obligatoris');
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(email, password);
      setUser(res.data);     // setUser ya guarda en localStorage automáticamente
      navigate('/mapa');
    } catch (err: any) {
      setError('Credencials invàlides');
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
        <h2 style={styles.title}>Iniciar Sessió</h2>

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
          placeholder="Contrassenya"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Entrant...' : 'Entrar'}
        </button>

        <p style={styles.switchText}>
          ¿No tens compte?{' '}
          <Link to="/register" style={styles.link}>
            Registra't!
          </Link>
        </p>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;