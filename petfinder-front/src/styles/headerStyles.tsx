import type { CSSProperties } from 'react';

export const styles: { [key: string]: CSSProperties } = {
  header: {
    width: '100%',
    height: '60px',
    backgroundColor: '#06682D',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  avatarContainer: {
    cursor: 'pointer',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
  },
  avatarContainerHover: {
    transform: 'scale(1.05)',
    opacity: 0.85,
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '2px solid #fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  avatarPlaceholder: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#06682D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '18px',
    border: '2px solid #fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  rightSection: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
};