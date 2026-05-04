import React from 'react';
import { styles } from '../styles/adminStyles';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div style={styles.paginationContainer}>
      <button
        style={currentPage === 1 ? styles.pageButtonDisabled : styles.pageButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ◀ Anterior
      </button>
      
      <span style={styles.pageInfo}>
        Pàgina {currentPage} de {totalPages}
      </span>
      
      <button
        style={currentPage === totalPages ? styles.pageButtonDisabled : styles.pageButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Següent ▶
      </button>
    </div>
  );
};

export default AdminPagination;