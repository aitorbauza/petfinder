import type { CSSProperties } from 'react';

export const getItemsPerPage = (isMobile: boolean) => isMobile ? 2 : 6;

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
    paddingBottom: '40px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    backgroundColor: 'transparent',
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

  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },

  cardsGridMobile: {
    gridTemplateColumns: '1fr',
    gap: '16px',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },

  cardContent: {
    padding: '16px',
    flex: 1,
  },

  cardImage: {
    width: '100%',
    height: '160px',
    objectFit: 'cover' as const,
    backgroundColor: '#e0e0e0',
  },

  cardTitle: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: 600,
    color: '#1a1a1a',
  },

  cardText: {
    margin: '4px 0',
    fontSize: '13px',
    color: '#666',
  },

  cardSmallText: {
    margin: '4px 0',
    fontSize: '11px',
    color: '#888',
  },

  actionsContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },

  editButton: {
    flex: 1,
    padding: '8px 12px',
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'background 0.2s',
  },

  deleteButton: {
    flex: 1,
    padding: '8px 12px',
    backgroundColor: '#e53935',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'background 0.2s',
  },

  emptyContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    color: '#999',
  },

  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginTop: '32px',
    padding: '20px 0 0 0',
  },

  pageButton: {
    padding: '8px 16px',
    backgroundColor: '#06682D',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  pageButtonDisabled: {
    padding: '8px 16px',
    backgroundColor: '#ccc',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'not-allowed',
  },

  pageInfo: {
    fontSize: '14px',
    color: '#666',
    margin: '0 12px',
  },

  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '16px',
    maxWidth: '400px',
    textAlign: 'center' as const,
  },

  modalConfirmButton: {
    padding: '10px 20px',
    backgroundColor: '#e53935',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  modalCancelButton: {
    padding: '10px 20px',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  loadingContainer: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#e8f0e8',
  },

  loadingText: {
    textAlign: 'center' as const,
    padding: '50px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    color: '#666',
    margin: 'auto',
  },
};

// Estils per a mòbil (sobreescriuen)
export const mobileStyles = {
  cardsGrid: {
    gridTemplateColumns: '1fr',
    gap: '16px',
  },
  cardImage: {
    height: '140px',
  },
  pageButton: {
    padding: '6px 12px',
    fontSize: '12px',
  },
};