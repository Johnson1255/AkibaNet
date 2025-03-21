import { Link } from "react-router-dom";
import { HelpCircle, Coffee, Home, User, ConciergeBell } from "lucide-react";

export default function BottomNavBar() {
  const lastReservation = localStorage.getItem("lastReservation");
  let HaveReservation = false;
  if(lastReservation != null) {
    HaveReservation = true;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex justify-around items-center h-16">
        <Link to="/home" className="p-2 text-foreground hover:text-primary transition-colors">
          <Home className="w-6 h-6" />
        </Link>
        {!HaveReservation && (
          <Link to="/reserve" className="p-2 text-foreground hover:text-primary transition-colors">
            <Coffee className="w-6 h-6" />
          </Link>
        )}
        {HaveReservation && (
          <Link to="/active-reservation" className="p-2 text-foreground hover:text-primary transition-colors">
            <ConciergeBell className="w-6 h-6" />
          </Link>
        )}
        <Link to="/account" className="p-2 text-foreground hover:text-primary transition-colors">
          <User className="w-6 h-6" />
        </Link>
        <Link to="/help-services" className="p-2 text-foreground hover:text-primary transition-colors">
          <HelpCircle className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
}
