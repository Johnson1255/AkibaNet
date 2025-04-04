// src/hooks/useToggleProduct.ts
import { useCallback } from 'react';

// Cambia la firma para esperar Map<string, number>
export const useToggleProduct = (setSelectedProducts: React.Dispatch<React.SetStateAction<Map<string, number>>>) => {
  // Cambia el tipo del parámetro 'id' a string
  const toggleProduct = useCallback((id: string): void => {
    // Cambia el tipo del Map interno a string como key
    setSelectedProducts((prevSelected: Map<string, number>): Map<string, number> => {
      const newSelected = new Map(prevSelected);
      const currentCount: number = newSelected.get(id) || 0; // Usa string 'id'
      if (currentCount < 5) { // Lógica de límite (5)
        newSelected.set(id, currentCount + 1); // Usa string 'id'
      } else {
        // Si llega a 5, al siguiente click lo elimina (lo pone en 0)
        newSelected.delete(id); // Usa string 'id'
      }
      console.log('Updated selected products:', newSelected);
      return newSelected;
    });
  }, [setSelectedProducts]);

  return { toggleProduct };
};