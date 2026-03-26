import type { CSSProperties } from 'react';

export const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 0px)',
    width: '100%',
    position: 'relative',
    gap: '10px',
  },
  leftPanel: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
  },
  anuncioBox: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#f7f7f7',
  },
  mapPanel: {
    flex: 2,
    position: 'relative',
  },
  map: {
    height: '100%',
    width: '100%',
    borderRadius: '12px',
  },
  fab: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    background: '#06682D',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    fontSize: '30px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Media query para móvil
  '@media (max-width: 768px)': {
    container: {
      flexDirection: 'column',
    },
    mapPanel: {
      flex: 'none',
      height: '300px',
    },
    leftPanel: {
      flex: 'none',
      height: 'auto',
    },
  },
};