import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { loginUser, registerUser } from '../services/userService';
import { styles } from '../styles/loginstyles';

const LoginPage: React.FC = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefon, setTelefon] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    // ✅ Validación frontend
    if (!email || !password) {
      setError('Email y contraseña son obligatorios');
      return;
    }

    if (!isLogin && (!nom || !telefon)) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      if (isLogin) {
        const res = await loginUser(email, password);
        setUser(res.data);
        navigate('/mapa');
      } else {
        await registerUser({
          nom,
          email,
          password,
          telefon,
          rol: 'USER',
        });

        setIsLogin(true);
        setError('Usuario creado correctamente');
      }
    } catch (err: any) {
        setError('Credenciales inválidas');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isLogin ? 'Iniciar sesión' : 'Registrarse'}
        </h2>

        {!isLogin && (
          <>
            <input
              style={styles.input}
              type="text"
              placeholder="Nombre"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />

            <input
              style={styles.input}
              type="tel" 
              pattern="[0-9+ ]{9,15}"
              placeholder="Teléfono"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
            />
          </>
        )}

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleSubmit}>
          {isLogin ? 'Entrar' : 'Registrarse'}
        </button>

        <p style={styles.switchText}>
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <span
            style={styles.link}
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? ' Regístrate' : ' Inicia sesión'}
          </span>
        </p>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;