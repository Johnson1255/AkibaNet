import { useState, useEffect } from "react";
import {
  ArrowLeft,
  LogOut,
  Clock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BottomNavBar from "./Bottom-navbar";


enum ReservationStatus {
  Waiting = 0,
  Active = 1,
  Completed = 2,
  Cancelled = 3,
}

interface Reservation {
  id: string;
  roomNumber: number;
  startTime: Date;
  duration: number;
  status: ReservationStatus;
}

export default function MyReservation() {
    const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation>({
    id: "123",
    roomNumber: 14,
    // 28th February 2025, 4:40 PM
    startTime: new Date(2025, 1, 28, 16, 40),
    duration: 2,
    status: ReservationStatus.Waiting,
  });
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (reservation.status === ReservationStatus.Waiting) {
        const diff = reservation.startTime.getTime() - now.getTime();
        if (diff <= 0) {
          setReservation((prev) => ({
            ...prev,
            status: ReservationStatus.Active,
          }));
        } else {
          setTimeRemaining({
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
          });
        }
      } else if (reservation.status === ReservationStatus.Active) {
        const endTime = new Date(
          reservation.startTime.getTime() +
            reservation.duration * 60 * 60 * 1000
        );
        const diff = endTime.getTime() - now.getTime();
        if (diff <= 0) {
          setReservation((prev) => ({
            ...prev,
            status: ReservationStatus.Completed,
          }));
        } else {
          setTimeRemaining({
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
          });
        }
      }
    }, 1000); // Update every second for more precise countdown

    return () => clearInterval(timer);
  }, [reservation]);

  const handleCancelReservation = () => {
    setReservation((prev) => ({
      ...prev,
      status: ReservationStatus.Cancelled,
    }));
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-normal">My Reservation</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      {reservation.status === ReservationStatus.Waiting && (
        <div className="px-6 py-8 space-y-6">
          <Card className="p-6 rounded-xl border flex flex-col items-center justify-center">
            <Clock className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Waiting for your reservation
            </h2>
            <p className="text-gray-500 text-center mb-4">
              Your reservation for Room #{reservation.roomNumber} starts in:
            </p>
            <div className="text-4xl font-mono tracking-wider">
              {String(timeRemaining.hours).padStart(2, "0")}:
              {String(timeRemaining.minutes).padStart(2, "0")}:
              {String(Math.floor(timeRemaining.seconds)).padStart(2, "0")}
            </div>
          </Card>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-12">
                Cancel Reservation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure you want to cancel?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. You may be subject to
                  cancellation fees.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  No, keep my reservation
                </Button>
                <Button variant="destructive" onClick={handleCancelReservation}>
                  Yes, cancel reservation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {reservation.status === ReservationStatus.Active && (
        <>
          {/* Timer Display */}
          <div className="flex justify-center px-6 py-8">
            <div className="w-72 h-72 rounded-full bg-gray-100 flex flex-col items-center justify-center">
              <div className="text-6xl font-mono tracking-wider">
                <span className="relative">
                  {String(timeRemaining.hours).padStart(2, "0")}
                  <span className="absolute -top-4 left-0 text-xs">hh</span>
                </span>
                :
                <span className="relative">
                  {String(timeRemaining.minutes).padStart(2, "0")}
                  <span className="absolute -top-4 left-0 text-xs">mm</span>
                </span>
              </div>
              <div className="mt-2 text-lg">Remaining</div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="px-6 space-y-6">
            <Card className="p-4 rounded-xl border flex justify-between items-center">
              <div>
                <h2 className="text-xl font-normal">
                  Gaming Room #{reservation.roomNumber}
                </h2>
                <p className="text-gray-500">{reservation.duration} hours</p>
              </div>
              <span className="text-xl">¥ 2700</span>
            </Card>

            {/* Extra Costs */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Extra costs</h2>
              <div className="space-y-3">
                <Card className="p-4 rounded-xl border flex justify-between items-center">
                  <span className="text-lg">1 x Extra hour</span>
                  <span className="text-lg">¥ 900</span>
                </Card>
                <Card className="p-4 rounded-xl border flex justify-between items-center">
                  <span className="text-lg">3 x Monster Energy 500ml</span>
                  <span className="text-lg">¥ 1500</span>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  className="h-12 bg-gray-100 hover:bg-gray-200"
                >
                  + Extend time
                </Button>
                <Button
                  variant="secondary"
                  className="h-12 bg-gray-100 hover:bg-gray-200"
                >
                  ? Request Help
                </Button>
              </div>
              <Button
                variant="default"
                className="w-full h-12 bg-black text-white hover:bg-black/90"
              >
                <LogOut className="mr-2 h-4 w-4" /> End Session
              </Button>
            </div>
          </div>
        </>
      )}

      {reservation.status === ReservationStatus.Completed && (
        <div className="px-6 py-8 space-y-6">
          <Card className="p-6 rounded-xl border flex flex-col items-center justify-center">
            <LogOut className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Reservation Completed
            </h2>
            <p className="text-gray-500 text-center mb-4">
              Thank you for using our services. We hope you enjoyed your time!
            </p>
            <Button
              variant="default"
              className="w-full h-12 bg-black text-white hover:bg-black/90"
            >
              Book Another Session
            </Button>
          </Card>
        </div>
      )}

      {reservation.status === ReservationStatus.Cancelled && (
        <div className="px-6 py-8 space-y-6">
          <Card className="p-6 rounded-xl border flex flex-col items-center justify-center">
            <X className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Reservation Cancelled
            </h2>
            <p className="text-gray-500 text-center mb-4">
              Your reservation has been cancelled. We hope to see you again
              soon!
            </p>
            <Button
              variant="default"
              className="w-full h-12 bg-black text-white hover:bg-black/90"
              onClick={() => navigate("/reserve")}
            >
              Make a New Reservation
            </Button>
          </Card>
        </div>
      )}
      <BottomNavBar />  
    </div>
  );
}
