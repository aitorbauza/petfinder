import type { CSSProperties } from 'react';

export const styles: { [key: string]: CSSProperties } = {
  
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    gap: '20px',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b8d0b8' stroke-width='0.5'%3E%3Cpath d='M12 2L15 7H9L12 2Z'/%3E%3Cpath d='M5 15L2 12L5 9L8 12L5 15Z'/%3E%3Cpath d='M19 15L22 12L19 9L16 12L19 15Z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '40px',
    backgroundColor: '#e8f0e8',
  },

  title: {
    color: '#06682D',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 600,
  },
  
  input: {
    width: '100%',
    maxWidth: '500px',
    padding: '14px 16px',
    margin: '8px 0',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    fontSize: '16px',
    backgroundColor: '#fff',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
  },
  
  inputFocus: {
    borderColor: '#06682D',
    boxShadow: '0 0 0 2px rgba(6, 104, 45, 0.1)',
  },
  
  select: {
    width: '100%',
    maxWidth: '500px',
    padding: '14px 16px',
    margin: '8px 0',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    fontSize: '16px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    outline: 'none',
  },
  
  button: {
    width: '100%',
    maxWidth: '500px',
    padding: '14px',
    marginTop: '15px',
    borderRadius: '12px',
    border: 'none',
    background: '#06682D',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s',
  },
  
  buttonHover: {
    background: '#055523',
  },
  
  buttonDisabled: {
    background: '#aaa',
    cursor: 'not-allowed',
  },
  
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    color: '#333',
    fontSize: '14px',
  },
  
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#06682D',
    marginBottom: '12px',
  },
  
  mapContainer: {
    width: '100%',
    maxWidth: '500px',
    height: '40vh',
    borderRadius: '12px',
  },
  
  desktopLayout: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '40px',
    padding: '30px',
    width: '100%',
    maxWidth: '1100px',  // Reduït per millor alineació
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  },

  formSection: {
    flex: '0 0 58%', 
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },

  mapSection: {
    flex: '0 0 38%', 
    position: 'sticky' as const,
    top: '30px',
    alignSelf: 'flex-start',
  },

  desktopMap: {
    height: '380px',
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  
  // Drag & Drop zone
  dragDropZone: {
    border: '2px dashed #d0d0d0',
    borderRadius: '20px',
    padding: 0,
    textAlign: 'center' as const,
    cursor: 'pointer',
    backgroundColor: '#fafafa',
    transition: 'all 0.2s ease',
    width: '100%',
    maxWidth: '280px',
    height: '280px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: '0 auto 0 0',
  },
  
  dragDropZoneDragging: {
    border: '2px dashed #06682D',
    backgroundColor: '#e8f5e9',
  },
  
  mobileMap: {
    width: '100%',
    height: '40vh',
    borderRadius: '12px',
  },
  
  previewImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover' as const,
    borderRadius: '8px',
    marginTop: '10px',
    border: '2px solid #06682D',
  },
  
  previewImageDesktop: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  
  // Missatge informatiu del mapa
  mapHint: {
    fontSize: '12px',
    color: '#666',
    marginTop: '8px',
    textAlign: 'center' as const,
  },
  
  dragDropIcon: {
    fontSize: '48px',
    marginBottom: '10px',
  },
  
  dragDropText: {
    margin: '15px 0 5px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
  },
  
  dragDropSubtext: {
    fontSize: '12px',
    color: '#999',
  },
  
  dragDropSmallText: {
    fontSize: '11px',
    color: '#bbb',
    marginTop: '10px',
  },
};