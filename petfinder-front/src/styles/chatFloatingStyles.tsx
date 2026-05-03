import type { CSSProperties } from 'react';

export const getButtonStyle = (): CSSProperties => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  background: '#06682D',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '56px',
  height: '56px',
  fontSize: '24px',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.2s ease, background 0.2s ease',
});

export const getNotificationBadgeStyle = (): CSSProperties => ({
  position: 'absolute',
  top: '-5px',
  right: '-5px',
  background: '#e53935',
  color: '#fff',
  borderRadius: '50%',
  minWidth: '20px',
  height: '20px',
  fontSize: '11px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 4px',
});

export const getPopupOverlayStyle = (): CSSProperties => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  zIndex: 1999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const getPopupStyle = (isMobile: boolean): CSSProperties => ({
  position: 'fixed',
  bottom: isMobile ? 0 : '80px',
  right: isMobile ? 0 : '20px',
  left: isMobile ? 0 : 'auto',
  top: isMobile ? 'auto' : 'auto',
  width: isMobile ? '100%' : '380px',
  height: isMobile ? '80%' : '500px',
  backgroundColor: '#fff',
  borderRadius: isMobile ? '16px 16px 0 0' : '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  zIndex: 2000,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const getPopupHeaderStyle = (): CSSProperties => ({
  padding: '16px',
  backgroundColor: '#06682D',
  color: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const getPopupTitleStyle = (): CSSProperties => ({
  margin: 0,
  fontSize: '18px',
  fontWeight: 'bold',
});

export const getCloseButtonStyle = (): CSSProperties => ({
  background: 'none',
  border: 'none',
  color: '#fff',
  fontSize: '24px',
  cursor: 'pointer',
});

export const getConversesListStyle = (isMobile: boolean): CSSProperties => ({
  flex: 1,
  overflowY: 'auto',
  borderRight: isMobile ? 'none' : '1px solid #eee',
  width: isMobile ? '100%' : '250px',
});

export const getChatAreaStyle = (): CSSProperties => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const getMessagesContainerStyle = (): CSSProperties => ({
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const getMessageBubbleStyle = (esMeu: boolean): CSSProperties => ({
  maxWidth: '70%',
  padding: '10px 14px',
  borderRadius: '18px',
  backgroundColor: esMeu ? '#06682D' : '#f0f0f0',
  color: esMeu ? '#fff' : '#333',
  alignSelf: esMeu ? 'flex-end' : 'flex-start',
  wordBreak: 'break-word',
});

export const getMessageTimeStyle = (): CSSProperties => ({
  fontSize: '10px',
  color: '#999',
  marginTop: '4px',
  textAlign: 'right',
});

export const getInputContainerStyle = (): CSSProperties => ({
  padding: '12px',
  borderTop: '1px solid #eee',
  display: 'flex',
  gap: '8px',
});

export const getInputStyle = (): CSSProperties => ({
  flex: 1,
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '20px',
  outline: 'none',
  fontSize: '14px',
});

export const getSendButtonStyle = (): CSSProperties => ({
  padding: '8px 16px',
  backgroundColor: '#06682D',
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  cursor: 'pointer',
});

export const getConversaItemStyle = (): CSSProperties => ({
  padding: '12px',
  borderBottom: '1px solid #eee',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  transition: 'background 0.2s',
});

export const getConversaAvatarStyle = (): CSSProperties => ({
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
  overflow: 'hidden',
});

export const getConversaAvatarImgStyle = (): CSSProperties => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const getConversaInfoStyle = (): CSSProperties => ({
  flex: 1,
});

export const getConversaNomStyle = (): CSSProperties => ({
  margin: 0,
  fontSize: '14px',
  fontWeight: 'bold',
});

export const getConversaUltimMissatgeStyle = (): CSSProperties => ({
  margin: 0,
  fontSize: '12px',
  color: '#888',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const getBadgeNoLlegitsStyle = (): CSSProperties => ({
  backgroundColor: '#e53935',
  color: '#fff',
  borderRadius: '50%',
  minWidth: '20px',
  height: '20px',
  fontSize: '11px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 4px',
});

export const getButtonStyleInsideMap = (): CSSProperties => ({
  position: 'absolute', 
  bottom: '20px',
  right: '20px',
  background: '#06682D',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '56px',
  height: '56px',
  fontSize: '24px',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.2s ease, background 0.2s ease',
});