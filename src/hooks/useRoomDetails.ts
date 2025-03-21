import { useState, useEffect } from 'react';
import { Room } from '../types/roomDetails';
import { useTranslation } from 'react-i18next';

interface UseRoomDetailsReturn {
  room: Room | null;
  loading: boolean;
  error: string | null;
}

export const useRoomDetails = (roomId: string | null): UseRoomDetailsReturn => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/rooms/${roomId}`);

        if (!response.ok) {
          throw new Error(t('reservation.errors.roomLoadError', 'Error al cargar los detalles de la habitación: {{statusText}}', { statusText: response.statusText }));
        }

        const roomData = await response.json();
        setRoom(roomData);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('reservation.errors.unknownError', 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId, t]);

  return { room, loading, error };
};
