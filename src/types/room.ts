export interface Equipment {
  type: string;
  name: string;
  quantity: number;
}

export interface Room {
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
