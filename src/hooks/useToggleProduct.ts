// src/components/FoodPage/useToggleProduct.ts

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export const useToggleProduct = (selectedProducts: Map<number, number>, setSelectedProducts: React.Dispatch<React.SetStateAction<Map<number, number>>>) => {
  const toggleProduct = (id: number): void => {
    setSelectedProducts(
      (prevSelected: Map<number, number>): Map<number, number> => {
        const newSelected = new Map(prevSelected);
        const currentCount: number = newSelected.get(id) || 0;
        if (currentCount < 5) {
          newSelected.set(id, currentCount + 1);
        } else {
          newSelected.delete(id);
        }
        return newSelected;
      }
    );
  };

  return { toggleProduct };
};