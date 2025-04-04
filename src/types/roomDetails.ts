export interface Equipment {
  type: string;
  name: string;
  quantity: number;
}

export interface Room {
  _id: string; // Aseguramos que _id es una propiedad obligatoria
  id: string;
  capacity: number;
  hourlyRate: number;
  status: string;
  minHours: number;
  maxHours: number;
  equipment: Equipment[];
  images: string[];
  category?: string;
}

export interface BookingPayload {
  userId: number;
  roomId: number;
  startTime: string;
  endTime: string;
  duration: number;
  basePrice: number;
  status: string;
  services: string[];
  products: any[];
}
