import type { CSSProperties } from 'react';

export const styles: { [key: string]: CSSProperties } = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f5fdf7', // blanco verdoso suave
    padding: '20px',
  },

  card: {
    background: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },

  title: {
    marginBottom: '20px',
    color: '#06682D',
  },

  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
  },

  button: {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    borderRadius: '8px',
    border: 'none',
    background: '#06682D',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },

  switchText: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#555',
  },

  link: {
    color: '#06682D',
    cursor: 'pointer',
    marginLeft: '5px',
    fontWeight: 'bold',
  },

  error: {
    color: 'red',
    marginTop: '10px',
  },
};