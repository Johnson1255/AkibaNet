export interface Service {
  id: string;
  name: string;
  price: number;
}
export interface OrderSummaryProps {
  roomId: string;
  baseRoomPrice: number;
  selectedServices: ApiService[];
  calculateTotal: () => number;
}

export interface BottomActionsProps {
  handleConfirmAndPay: () => void;
}

export interface ServiceCardProps {
  service: ApiService;
  isSelected: boolean;
  toggleService: (serviceId: string) => void;
}

export interface ServiceSpecifications {
    brand?: string;
    model?: string;
    features?: string[];
    options?: string[];
    contents?: string[];
    details?: string;
    speed?: string;
    resolution?: string;
  }
  
  export interface ApiService {
    id: string;
    name: string;
    description: string;
    price: number;
    available: boolean;
    stock: number;
    specifications: ServiceSpecifications;
    category: string;
  }
  
  export interface ServicesByCategory {
    gaming: ApiService[];
    working: ApiService[];
    thinking: ApiService[];
  }
