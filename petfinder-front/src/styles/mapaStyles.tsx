import type { CSSProperties } from 'react';

export const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  
  mainContent: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  
  leftPanel: {
    flex: '0 0 35%',
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    height: '100%',
  },
  
  mapPanel: {
    flex: 1,
    position: 'relative',
    margin: '10px 10px 10px 0',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  
  map: {
    height: '100%',
    width: '100%',
  },
  
  fab: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    background: '#06682D',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    fontSize: '28px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease, background 0.2s ease',
  },
  
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    padding: '10px',
  },
  
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  
  cardImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
    backgroundColor: '#e0e0e0',
  },
  
  cardContent: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  
  petName: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  
  breedText: {
    margin: 0,
    fontSize: '13px',
    color: '#666666',
  },
  
  statusPerdut: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 'bold',
    marginTop: '10px',
    backgroundColor: '#FFEBEE',
    color: '#C62828',
    alignSelf: 'flex-start',
  },
  
  statusTrobat: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 'bold',
    marginTop: '10px',
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
    alignSelf: 'flex-start',
  },
  
  emptyMessage: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: '#999999',
    fontSize: '14px',
  },
  
  popupContent: {
    textAlign: 'center' as const,
    minWidth: '150px',
  },
  
  popupImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover' as const,
    borderRadius: '8px',
    marginBottom: '8px',
    backgroundColor: '#e0e0e0',
  },
  
  popupName: {
    fontWeight: 600,
    fontSize: '14px',
    marginBottom: '4px',
  },
  
  popupBreed: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '6px',
  },
  
  popupStatusPerdut: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#C62828',
  },
  
  popupStatusTrobat: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#2E7D32',
  },
};

export const mobileStyles = {
  mainContent: {
    flexDirection: 'column' as const,  // Mòbil: column (mapa dalt, cards baix)
  },
  leftPanel: {
    flex: 'none',
    width: '100%',
    height: '50%', 
    order: 2, 
  },
  mapPanel: {
    flex: 'none',
    height: '50%',  
    margin: '0',
    borderRadius: '0',
    order: 1,  
  },
  cardsGrid: {
    gridTemplateColumns: '1fr',  
    gap: '10px',
  },
  cardImage: {
    height: '160px',  
  },
  fab: {
    bottom: '16px',
    right: '16px',
    width: '48px',
    height: '48px',
    fontSize: '24px',
  },
};