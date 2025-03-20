export interface Reservation {
    id: string;
    roomName: string;
    date: string;
    hours: number;
    price: number;
  }
export interface Service {
  serviceId: string;
  serviceName: string;
  price: number;
}

export interface Product {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Reservation {
  id: string;
  startTime: string;
  endTime: string;
  roomId: string;
  userId: string;
  status: "pending" | "active" | "completed" | "cancelled";
  services: Service[];
  products: Product[];
}