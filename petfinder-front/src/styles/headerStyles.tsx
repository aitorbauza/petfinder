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
  button: {
    backgroundColor: '#ffffff',
    color: '#06682D',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};