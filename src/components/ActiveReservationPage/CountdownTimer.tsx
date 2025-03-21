import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  type: 'start' | 'end';
  roomId?: string;
  formatDate: (date: Date) => string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetDate, 
  onComplete, 
  type,
  roomId,
  formatDate
}) => {
  const { t } = useTranslation();
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
      <div className="rounded-xl bg-card border border-border p-6 shadow-sm text-center bg-secondary">
        <h2 className="text-2xl font-medium mb-3">{t('reservation.completed')}</h2>
        <p className="text-muted-foreground mb-5">{t('reservation.noPendingReservation')}</p>
        <button
          onClick={() => navigate('/reserve')}
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {t('reservation.newReservation')}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border p-6 shadow-sm text-center bg-secondary">
      <h2 className="text-2xl font-medium mb-3">
        {type === 'start' ? t('reservation.startsIn') : t('reservation.endsIn')}
      </h2>
      
      {roomId && (
        <p className="text-muted-foreground mb-3">
          {type === 'start' ? `Para la sala: ${roomId}` : `Sala actual: ${roomId}`}
        </p>
      )}
      
      <p className="text-muted-foreground mb-2">
        {type === 'start' ? t('reservation.startDate') : t('reservation.endDate')}: {formatDate(targetDate)}
      </p>
      
      <div className="text-5xl font-mono font-medium tracking-wider my-5">
        {String(timeRemaining.hours).padStart(2, "0")}:
        {String(timeRemaining.minutes).padStart(2, "0")}:
        {String(timeRemaining.seconds).padStart(2, "0")}
      </div>
    </div>
  );
};

export default CountdownTimer;
