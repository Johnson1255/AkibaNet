export interface ProductCardProps {
  product: Product;
  selectedProducts: Map<number, number>;
  toggleProduct: (id: number) => void;
  showButton: boolean;
}

export interface Product {
  id: string;
  productId: string;
  name: string;
  price: number;
  category: string;
  description?: string; // Added missing property
}

export interface ProductData {
  [key: string]: Product[];
}
