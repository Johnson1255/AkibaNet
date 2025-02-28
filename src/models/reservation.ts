export interface Reservation {
  id: string;
  startTime: string; // Formato ISO
  endTime: string;   // Formato ISO
  roomId: string;
  userId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

// Ejemplo de una reserva
export const sampleReservation: Reservation = {
  id: '12345',
  startTime: '2023-11-10T16:45:00',
  endTime: '2023-11-10T18:45:00',
  roomId: 'room-01',
  userId: 'user-123',
  status: 'pending'
};
