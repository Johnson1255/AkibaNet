import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  type: 'start' | 'end';
  roomId?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetDate, 
  onComplete, 
  type,
  roomId 
}) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsCompleted(true);
        if (onComplete) onComplete();
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      };
    };

    setTimeRemaining(calculateTimeRemaining());
    
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (isCompleted && type === 'end') {
    return (
      <div className="rounded-xl bg-white border p-6 shadow-sm text-center">
        <h2 className="text-2xl font-medium mb-3">Tu reserva ha finalizado</h2>
        <p className="text-gray-600 mb-5">No tienes ninguna reserva pendiente</p>
        <button
          onClick={() => navigate('/reserve')}
          className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Hacer una nueva reserva
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-6 shadow-sm text-center ${type === 'start' ? 'bg-amber-50' : 'bg-green-50'}`}>
      <h2 className="text-2xl font-medium mb-3">
        {type === 'start' ? 'Tu reserva inicia en:' : 'Tu reserva termina en:'}
      </h2>
      
      {roomId && (
        <p className="text-gray-600 mb-3">
          {type === 'start' ? `Para la sala: ${roomId}` : `Sala actual: ${roomId}`}
        </p>
      )}
      
      <div className="text-5xl font-mono font-medium tracking-wider my-5">
        {String(timeRemaining.hours).padStart(2, "0")}:
        {String(timeRemaining.minutes).padStart(2, "0")}:
        {String(timeRemaining.seconds).padStart(2, "0")}
      </div>
    </div>
  );
};

export default CountdownTimer;
