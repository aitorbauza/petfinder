import type { CSSProperties } from 'react';

export const styles: { [key: string]: CSSProperties } = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b8d0b8' stroke-width='0.5'%3E%3Cpath d='M12 2L15 7H9L12 2Z'/%3E%3Cpath d='M5 15L2 12L5 9L8 12L5 15Z'/%3E%3Cpath d='M19 15L22 12L19 9L16 12L19 15Z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '40px',
    backgroundColor: '#e8f0e8',
  },

  content: {
    flex: 1,
    padding: '24px 20px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },

  headerSection: {
    marginBottom: '24px',
  },

  title: {
    fontSize: '28px',
    fontWeight: 600,
    color: '#1a1a1a',
    margin: 0,
    marginBottom: '8px',
  },

  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },

  createButton: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#06682D',
    color: '#fff',
    border: 'none',
    borderRadius: '40px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};