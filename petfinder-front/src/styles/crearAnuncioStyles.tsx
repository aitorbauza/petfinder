import type { CSSProperties } from 'react';

export const styles: { [key: string]: CSSProperties } = {
  container: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column', // 👈 Vertical
    alignItems: 'center',    // Centrar horizontalmente
    boxSizing: 'border-box',
    gap: '20px',             // Espacio entre elementos
  },
  title: {
    color: '#06682D',
    marginBottom: '10px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: '500px',       // Limitar ancho para inputs
    padding: '12px',
    margin: '8px 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    maxWidth: '500px',
    padding: '14px',
    marginTop: '15px',
    borderRadius: '8px',
    border: 'none',
    background: '#06682D',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
  mapContainer: {
    width: '100%',
    maxWidth: '500px',       // Limitar ancho del mapa
    height: '40vh',          // Altura responsive
    borderRadius: '12px',
  },
};