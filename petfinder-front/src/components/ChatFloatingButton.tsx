import React, { useState, useEffect, useRef } from 'react';
import { obtenirMissatges, enviarMissatge, obtenirMissatgesNoLlegits, type ConversaDTO, type MissatgeDTO, obtenirConverses } from '../services/chatService';
import {
  getBadgeNoLlegitsStyle,
  getButtonStyle,
  getButtonStyleInsideMap,
  getChatAreaStyle,
  getCloseButtonStyle,
  getConversaAvatarImgStyle,
  getConversaAvatarStyle,
  getConversaInfoStyle,
  getConversaItemStyle,
  getConversaNomStyle,
  getConversaUltimMissatgeStyle,
  getConversesListStyle,
  getInputContainerStyle,
  getInputStyle,
  getMessageBubbleStyle,
  getMessagesContainerStyle,
  getMessageTimeStyle,
  getNotificationBadgeStyle,
  getPopupHeaderStyle,
  getPopupOverlayStyle,
  getPopupStyle,
  getPopupTitleStyle,
  getSendButtonStyle,
} from '../styles/chatFloatingStyles';

const API_URL = 'http://localhost:9090';

interface ChatFloatingButtonProps {
  usuariId: number;
  openConversaId?: number | null;
  openDestinatariId?: number | null;
  anunciId?: number | null;
  onClose?: () => void;
  isInsideMap?: boolean; // 🔥 Nou prop
}

const ChatFloatingButton: React.FC<ChatFloatingButtonProps> = ({ 
  usuariId, 
  openConversaId, 
  openDestinatariId, 
  anunciId,
  onClose,
  isInsideMap = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [converses, setConverses] = useState<ConversaDTO[]>([]);
  const [selectedConversa, setSelectedConversa] = useState<ConversaDTO | null>(null);
  const [missatges, setMissatges] = useState<MissatgeDTO[]>([]);
  const [nouMissatge, setNouMissatge] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviant, setEnviant] = useState(false);
  const [noLlegits, setNoLlegits] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (usuariId) {
      carregarConverses();
      carregarNoLlegits();
      
      const interval = setInterval(() => {
        carregarNoLlegits();
        if (selectedConversa && isOpen) {
          carregarMissatges(selectedConversa.conversaId);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [usuariId, selectedConversa, isOpen]);

  useEffect(() => {
    if (openConversaId && !isOpen) {
      obrirConversaPerId(openConversaId);
    } else if (openDestinatariId && !isOpen) {
      obrirConversaAmbUsuari(openDestinatariId);
    }
  }, [openConversaId, openDestinatariId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [missatges]);

  const carregarConverses = async () => {
    try {
      const response = await obtenirConverses(usuariId);
      setConverses(response.data);
    } catch (error) {
      console.error('Error carregant converses:', error);
    }
  };

  const carregarNoLlegits = async () => {
    try {
      const response = await obtenirMissatgesNoLlegits(usuariId);
      setNoLlegits(response.data);
    } catch (error) {
      console.error('Error carregant no llegits:', error);
    }
  };

  const carregarMissatges = async (conversaId: number) => {
    try {
      const response = await obtenirMissatges(conversaId, usuariId);
      setMissatges(response.data);
      await new Promise(resolve => setTimeout(resolve, 500));
      await Promise.all([
        carregarNoLlegits(),
        carregarConverses()
      ]);
    } catch (error) {
      console.error('Error carregant missatges:', error);
    }
  };

  const obrirConversaPerId = async (conversaId: number) => {
    setLoading(true);
    await carregarConverses();
    const conversa = converses.find(c => c.conversaId === conversaId);
    if (conversa) {
      setSelectedConversa(conversa);
      await carregarMissatges(conversaId);
    }
    setIsOpen(true);
    setLoading(false);
  };

  const obrirConversaAmbUsuari = async (destinatariId: number) => {
    setLoading(true);
    await carregarConverses();
    const conversaExistent = converses.find(c => c.altreUsuariId === destinatariId);
    
    if (conversaExistent) {
      setSelectedConversa(conversaExistent);
      await carregarMissatges(conversaExistent.conversaId);
    } else {
      setSelectedConversa({
        conversaId: 0,
        altreUsuariId: destinatariId,
        altreUsuariNom: 'Carregant...',
        altreUsuariImatgeUrl: null,
        ultimMissatge: '',
        ultimMissatgeData: new Date().toISOString(),
        missatgesNoLlegits: 0
      });
      setMissatges([]);
    }
    setIsOpen(true);
    setLoading(false);
  };

  const handleEnviarMissatge = async () => {
    if (!nouMissatge.trim() || !selectedConversa) return;
    
    setEnviant(true);
    try {
      const dto = {
        conversaId: selectedConversa.conversaId !== 0 ? selectedConversa.conversaId : undefined,
        destinatariId: selectedConversa.altreUsuariId,
        contingut: nouMissatge,
        usuariId: usuariId,
        anunciId: anunciId || undefined
      };
      
      await enviarMissatge(dto);
      setNouMissatge('');
      
      await carregarConverses();
      if (selectedConversa.conversaId !== 0) {
        await carregarMissatges(selectedConversa.conversaId);
      } else {
        await carregarConverses();
        const novaConversa = converses.find(c => c.altreUsuariId === selectedConversa.altreUsuariId);
        if (novaConversa) {
          setSelectedConversa(novaConversa);
          await carregarMissatges(novaConversa.conversaId);
        }
      }
      await carregarNoLlegits();
    } catch (error) {
      console.error('Error enviant missatge:', error);
    } finally {
      setEnviant(false);
    }
  };

  const seleccionarConversa = async (conversa: ConversaDTO) => {
    setSelectedConversa(conversa);
    await carregarMissatges(conversa.conversaId);
    await carregarConverses();
  };

  const tancarPopup = () => {
    setIsOpen(false);
    setSelectedConversa(null);
    setMissatges([]);
    if (onClose) onClose();
  };

  const getImatgeUrl = (imatgeUrl: string | null) => {
    if (!imatgeUrl) return null;
    if (imatgeUrl.startsWith('http')) return imatgeUrl;
    return `${API_URL}${imatgeUrl}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // 🔥 Seleccionar l'estil del botó segons si està dins del mapa o no
  const buttonStyle = isInsideMap ? getButtonStyleInsideMap() : getButtonStyle();

  return (
    <>
      <button
        style={buttonStyle}
        onClick={() => setIsOpen(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.background = '#055523';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = '#06682D';
        }}
      >
        💬
        {noLlegits > 0 && (
          <span style={getNotificationBadgeStyle()}>
            {noLlegits > 9 ? '9+' : noLlegits}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={getPopupOverlayStyle()} onClick={tancarPopup}>
          <div style={getPopupStyle(isMobile)} onClick={(e) => e.stopPropagation()}>
            <div style={getPopupHeaderStyle()}>
              <h3 style={getPopupTitleStyle()}>
                {selectedConversa ? `Xat amb ${selectedConversa.altreUsuariNom}` : 'Missatges'}
              </h3>
              <button style={getCloseButtonStyle()} onClick={tancarPopup}>✕</button>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>
              {!selectedConversa && (
                <div style={getConversesListStyle(isMobile)}>
                  {converses.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                      No tens converses
                    </div>
                  ) : (
                    converses.map(conversa => (
                      <div
                        key={conversa.conversaId}
                        style={getConversaItemStyle()}
                        onClick={() => seleccionarConversa(conversa)}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f5f5'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={getConversaAvatarStyle()}>
                          {conversa.altreUsuariImatgeUrl ? (
                            <img 
                              src={getImatgeUrl(conversa.altreUsuariImatgeUrl) || undefined}
                              alt={conversa.altreUsuariNom}
                              style={getConversaAvatarImgStyle()}
                            />
                          ) : (
                            conversa.altreUsuariNom?.charAt(0).toUpperCase() || '?'
                          )}
                        </div>
                        <div style={getConversaInfoStyle()}>
                          <p style={getConversaNomStyle()}>{conversa.altreUsuariNom}</p>
                          <p style={getConversaUltimMissatgeStyle()}>{conversa.ultimMissatge || 'Nou missatge'}</p>
                        </div>
                        {conversa.missatgesNoLlegits > 0 && (
                          <span style={getBadgeNoLlegitsStyle()}>{conversa.missatgesNoLlegits}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {selectedConversa && (
                <div style={getChatAreaStyle()}>
                  <div style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                      onClick={() => setSelectedConversa(null)}
                      style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#000000' }}
                    >
                      ←
                    </button>
                    <div style={getConversaAvatarStyle()}>
                      {selectedConversa.altreUsuariImatgeUrl ? (
                        <img 
                          src={getImatgeUrl(selectedConversa.altreUsuariImatgeUrl) || undefined}
                          alt={selectedConversa.altreUsuariNom}
                          style={getConversaAvatarImgStyle()}
                        />
                      ) : (
                        selectedConversa.altreUsuariNom?.charAt(0).toUpperCase() || '?'
                      )}
                    </div>
                    <h4 style={{ margin: 0 }}>{selectedConversa.altreUsuariNom}</h4>
                  </div>

                  <div style={getMessagesContainerStyle()}>
                    {loading ? (
                      <p style={{ textAlign: 'center' }}>Carregant...</p>
                    ) : missatges.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#999' }}>No hi ha missatges. Envia el primer!</p>
                    ) : (
                      missatges.map((msg, idx) => (
                        <div key={msg.id || idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.esMeu ? 'flex-end' : 'flex-start' }}>
                          <div style={getMessageBubbleStyle(msg.esMeu)}>
                            {msg.contingut}
                          </div>
                          <div style={getMessageTimeStyle()}>
                            {formatDate(msg.data)}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div style={getInputContainerStyle()}>
                    <input
                      type="text"
                      style={getInputStyle()}
                      placeholder="Escriu un missatge..."
                      value={nouMissatge}
                      onChange={(e) => setNouMissatge(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleEnviarMissatge()}
                      disabled={enviant}
                    />
                    <button
                      style={getSendButtonStyle()}
                      onClick={handleEnviarMissatge}
                      disabled={enviant || !nouMissatge.trim()}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#055523'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#06682D'; }}
                    >
                      {enviant ? '...' : 'Enviar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatFloatingButton;