export interface ProductCardProps {
  product: Product;
  selectedProducts: Map<number, number>;
  toggleProduct: (id: number) => void;
  showButton: boolean;
}

export interface Product {
  id: number; // Changed from string to number to match how it's used
  name: string;
  price: number;
  quantity: number;
  description?: string; // Added missing property
}

export interface ProductData {
  [key: string]: Product[];
}
