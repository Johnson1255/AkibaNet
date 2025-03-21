import { Service,ServicesByCategory } from "@/types/services";
import { Product } from "@/types/product";
export interface Reservation {
  id?: string;  // Made optional since it might not be available during creation
  roomId?: string | number;  // Added to match usage in components
  roomName?: string;  // Made optional since it might not be set initially
  date?: string;  // Made optional to match actual usage
  hours: number;
  price?: number;
  totalPrice?: number;  // Added to match usage in handleConfirmAndPay
  selectedDate?: string;
  selectedTime?: string;
  servicesByCategory?: ServicesByCategory;
  baseRoomPrice?: number;
  selectedServices?: Set<string>;  // Added to match usage in context
  hourlyRate?: number;  // Added to match usage in context
}

export interface ConfirmedReservationDetails {
  id?: string;
  roomId?: string;
  hours?: number;
  basePrice?: number;
  totalPrice?: number;
  startTime?: string;
  endTime?: string;
  status?: string;
  selectedDate?: string;
  selectedTime?: string;
  services?: Array<{ serviceId: string; price: number; name: string }>;
}

export interface DetailedReservation {
  id: string;
  startTime: string;
  endTime: string;
  roomId: string;
  userId: string;
  status: "pending" | "active" | "completed" | "cancelled";
  services?: Service[];
  products?: Product[];
}
