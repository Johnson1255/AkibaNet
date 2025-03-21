import { DetailedReservation } from "@/types/reservation";

export enum ReservationTimeStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface ReservationTimeInfo {
  status: ReservationTimeStatus;
  timeRemaining: number; // en milisegundos
  formattedTimeRemaining: string; // en formato HH:MM:SS
}

export function getReservationTimeInfo(reservation: DetailedReservation): ReservationTimeInfo {
  const now = new Date();
  const startTime = new Date(reservation.startTime);
  const endTime = new Date(reservation.endTime);

  let status: ReservationTimeStatus;
  let timeRemaining: number;

  if (now < startTime) {
    // La reserva aún no inicia
    status = ReservationTimeStatus.NOT_STARTED;
    timeRemaining = startTime.getTime() - now.getTime();
  } else if (now >= startTime && now < endTime) {
    // La reserva está en progreso
    status = ReservationTimeStatus.IN_PROGRESS;
    timeRemaining = endTime.getTime() - now.getTime();
  } else {
    // La reserva ya terminó
    status = ReservationTimeStatus.COMPLETED;
    timeRemaining = 0;
  }

  return {
    status,
    timeRemaining,
    formattedTimeRemaining: formatTimeRemaining(timeRemaining)
  };
}

function formatTimeRemaining(milliseconds: number): string {
  if (milliseconds <= 0) return '00:00:00';
  
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
}
