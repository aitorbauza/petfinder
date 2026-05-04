import React from 'react';
import { styles } from '../styles/adminStyles';

interface AdminDeleteModalProps {
  title: string;
  message: string;
  warning?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const AdminDeleteModal: React.FC<AdminDeleteModalProps> = ({
  title,
  message,
  warning,
  onConfirm,
  onCancel,
}) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h3>{title}</h3>
        <p>{message}</p>
        {warning && <p style={{ fontSize: '12px', color: '#e53935' }}>{warning}</p>}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={onConfirm} style={styles.modalConfirmButton}>
            Sí, eliminar
          </button>
          <button onClick={onCancel} style={styles.modalCancelButton}>
            Cancel·lar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDeleteModal;