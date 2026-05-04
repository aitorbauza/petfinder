import React from 'react';
import { styles } from '../styles/adminStyles';

interface AdminCardProps {
  id: number;
  title: string;
  subtitle?: string;
  details: { label?: string; value: string }[];
  imageUrl: string | null;
  placeholderImage: string;
  onEdit: () => void;
  onDelete: () => void;
  isMobile: boolean;
  getImageUrl: (url: string | null) => string | null;
}

const AdminCard: React.FC<AdminCardProps> = ({
  title,
  subtitle,
  details,
  imageUrl,
  placeholderImage,
  onEdit,
  onDelete,
  isMobile,
  getImageUrl,
}) => {
  const getCardImageStyle = () => ({
    ...styles.cardImage,
    ...(isMobile ? { height: '140px' } : {}),
  });

  return (
    <div style={styles.card}>
      <img
        src={getImageUrl(imageUrl) || placeholderImage}
        alt={title}
        style={getCardImageStyle()}
        onError={(e) => { (e.target as HTMLImageElement).src = placeholderImage; }}
      />
      
      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>{title}</h3>
        {subtitle && <p style={styles.cardText}>{subtitle}</p>}
        {details.map((detail, idx) => (
          <p key={idx} style={styles.cardSmallText}>
            {detail.label ? `${detail.label} ${detail.value}` : detail.value}
          </p>
        ))}
        
        <div style={styles.actionsContainer}>
          <button
            style={styles.editButton}
            onClick={onEdit}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#0b5ed7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#2196F3'; }}
          >
            ✏️ Editar
          </button>
          <button
            style={styles.deleteButton}
            onClick={onDelete}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#c62828'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#e53935'; }}
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;