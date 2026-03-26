export const EspecieEnum = {
  GOS: 1,
  GAT: 2,
  CONILL: 3,
} as const;

// Para mostrar opciones en el selector
export const EspeciesOptions = [
  { id: EspecieEnum.GOS, label: 'Gos' },
  { id: EspecieEnum.GAT, label: 'Gat' },
  { id: EspecieEnum.CONILL, label: 'Conill' },
];