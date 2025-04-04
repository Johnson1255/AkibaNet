export interface ProductCardProps {
  product: Product;
  selectedProducts: Map<string, number>; // Ensure the map uses string keys
  toggleProduct: (id: string) => void; // Ensure the function accepts a string ID
  showButton: boolean;
}

export interface Product {
  id: string;
  productId: string;
  name: string;
  price: number;
  category: string;
  quantity: number;  
  description?: string; // Added missing property
}

export interface ProductData {
  [key: string]: Product[];
}
