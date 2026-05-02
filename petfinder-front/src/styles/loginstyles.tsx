import type { CSSProperties } from 'react';

export const styles: { [key: string]: CSSProperties } = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b8d0b8' stroke-width='0.5'%3E%3Cpath d='M12 2L15 7H9L12 2Z'/%3E%3Cpath d='M5 15L2 12L5 9L8 12L5 15Z'/%3E%3Cpath d='M19 15L22 12L19 9L16 12L19 15Z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '40px',
    backgroundColor: '#e8f0e8',    
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