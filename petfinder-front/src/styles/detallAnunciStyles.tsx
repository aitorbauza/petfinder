import type { CSSProperties } from 'react';

export const getStatusBadgeStyle = (estat: string): CSSProperties => ({
  display: 'inline-block',
  padding: '6px 16px',
  borderRadius: '40px',
  fontSize: '14px',
  fontWeight: 600,
  backgroundColor: estat === 'Perdut' ? '#FFEBEE' : '#E8F5E9',
  color: estat === 'Perdut' ? '#c62828' : '#2e7d32',
});

export const getChatButtonStyle = (isOwner: boolean): CSSProperties => ({
  width: '100%',
  padding: '16px',
  backgroundColor: isOwner ? '#ccc' : '#06682D',
  color: isOwner ? '#666' : '#fff',
  border: 'none',
  borderRadius: '16px',
  fontSize: '18px',
  fontWeight: 600,
  cursor: isOwner ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'background 0.2s, transform 0.1s',
  marginTop: '16px',
});

export const getHalfRowStyle = (isMobile: boolean): CSSProperties => ({
  flex: isMobile ? '1 1 100%' : '1 1 calc(50% - 8px)',
});

export const styles: { [key: string]: CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23b8d0b8' stroke-width='0.5'%3E%3Cpath d='M12 2L15 7H9L12 2Z'/%3E%3Cpath d='M5 15L2 12L5 9L8 12L5 15Z'/%3E%3Cpath d='M19 15L22 12L19 9L16 12L19 15Z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '40px',
    backgroundColor: '#e8f0e8',    
  },

  content: {
    maxWidth: '800px',
    margin: '0 auto',
  },

  contentMobile: {
    padding: '16px',
  },

  contentDesktop: {
    padding: '24px',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },

  imageContainer: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },

  imageContainerMobile: {
    height: '250px',
  },

  imageContainerDesktop: {
    height: '550px',
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },

  infoContainer: {
    padding: '30px',
  },

  infoContainerMobile: {
    padding: '20px',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap' as const,
    marginBottom: '16px',
  },

  petName: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    margin: 0,
  },

  petNameMobile: {
    fontSize: '24px',
  },

  petNameDesktop: {
    fontSize: '32px',
  },

  section: {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #eee',
  },

  sectionTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#999',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },

  sectionValue: {
    color: '#333',
    margin: 0,
    lineHeight: 1.4,
  },

  sectionValueMobile: {
    fontSize: '16px',
  },

  sectionValueDesktop: {
    fontSize: '18px',
  },

  row: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px',
    marginTop: '16px',
  },

  ownerMessage: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#f0f0f0',
    color: '#999',
    border: 'none',
    borderRadius: '16px',
    fontSize: '18px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '16px',
    cursor: 'default' as const,
  },

  loadingContainer: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    textAlign: 'center' as const,
    padding: '50px',
  },

  errorContainer: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' as const,
  },

  errorText: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#666',
  },

  backButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#06682D',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};