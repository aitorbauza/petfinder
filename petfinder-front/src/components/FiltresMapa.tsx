import React, { useState } from 'react';
import { styles } from '../styles/filtresMapaStyles';

interface FiltresMapaProps {
  onFilterChange: (filters: Filters) => void;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export interface Filters {
  especie: string;
  estat: string;
  distancia: number;
  teGeolocalitzacio: boolean;
}

const FiltresMapa: React.FC<FiltresMapaProps> = ({ onFilterChange, isMobile, isOpen, onClose }) => {
  const [filters, setFilters] = useState<Filters>({
    especie: 'tots',
    estat: 'tots',
    distancia: 5,
    teGeolocalitzacio: false
  });

  const handleFilterChange = (key: keyof Filters, value: string | number | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      especie: 'tots',
      estat: 'tots',
      distancia: 5,
      teGeolocalitzacio: false
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const filterContent = (
    <div style={styles.filterContainer}>
      <div style={styles.filterHeader}>
        <h3 style={styles.filterTitle}>Filtres</h3>
        <button style={styles.resetButton} onClick={handleReset}>
          Reiniciar
        </button>
      </div>

      {/* Filtre per espècie - 5 botons en grid de 3 columnes */}
      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>Tipus d'animal</label>
        <div style={styles.optionsGrid}>
          <button
            style={filters.especie === 'tots' ? styles.optionActive : styles.option}
            onClick={() => handleFilterChange('especie', 'tots')}
          >
            Tots
          </button>
          <button
            style={filters.especie === 'gos' ? styles.optionActive : styles.option}
            onClick={() => handleFilterChange('especie', 'gos')}
          >
            🐶 Gos
          </button>
          <button
            style={filters.especie === 'gat' ? styles.optionActive : styles.option}
            onClick={() => handleFilterChange('especie', 'gat')}
          >
            🐱 Gat
          </button>
          <button
            style={filters.especie === 'conill' ? styles.optionActive : styles.option}
            onClick={() => handleFilterChange('especie', 'conill')}
          >
            🐰 Conill
          </button>
          <button
            style={filters.especie === 'altres' ? styles.optionActive : styles.option}
            onClick={() => handleFilterChange('especie', 'altres')}
          >
            🐹 Altres
          </button>
        </div>
      </div>

      {/* Filtre per estat - 3 botons per fila */}
      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>Estat</label>
        <div style={styles.optionsGrid}>
          <button
            style={filters.estat === 'tots' ? styles.optionActive : styles.option}
            onClick={() => handleFilterChange('estat', 'tots')}
          >
            ✅ Tots
          </button>
          <button
            style={filters.estat === 'perdut' ? styles.optionActive : styles.option}
            onClick={() => handleFilterChange('estat', 'perdut')}
          >
            ❌ Perduts
          </button>
          <button
            style={filters.estat === 'trobat' ? styles.optionActive : styles.option}
            onClick={() => handleFilterChange('estat', 'trobat')}
          >
            🟢 Trobats
          </button>
        </div>
      </div>

      {/* 🔥 Filtre per geolocalització en temps real - JA FUNCIONAL */}
      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>Geolocalització en temps real</label>
        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="teGeolocalitzacio"
            checked={filters.teGeolocalitzacio}
            onChange={(e) => handleFilterChange('teGeolocalitzacio', e.target.checked)}
            style={styles.checkbox}
          />
          <label htmlFor="teGeolocalitzacio" style={styles.checkboxLabel}>
            📡 Mostrar només animals amb geolocalització activa
          </label>
        </div>
        <p style={styles.hintText}>
          💡 Els animals amb geolocalització activa es mouen en temps real al mapa
        </p>
      </div>
    </div>
  );

  // Versió mòbil (modal)
  if (isMobile) {
    if (!isOpen) return null;
    return (
      <div style={styles.modalOverlay} onClick={onClose}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button style={styles.modalCloseButton} onClick={onClose}>✕</button>
          {filterContent}
        </div>
      </div>
    );
  }

  // Versió desktop (inline)
  return filterContent;
};

export default FiltresMapa;