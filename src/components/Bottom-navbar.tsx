import { Link } from "react-router-dom";
import { HelpCircle, Coffee, Home, User, ConciergeBell } from "lucide-react";

export default function BottomNavBar() {
  const lastReservation = localStorage.getItem("lastReservation");
  let HaveReservation= false;
  if(lastReservation!=null){
    HaveReservation=true;
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t mt-8">
        <div className="flex justify-around items-center h-16">
          <Link to="/home" className="p-2">
            <Home className="w-6 h-6" />
          </Link>
          { !HaveReservation &&
            <Link to="/reserve" className="p-2">
            <Coffee className="w-6 h-6" />
            </Link>
          }
          { HaveReservation &&
            <Link to="/active-reservation" className="p-2">
            <ConciergeBell className="w-6 h-6" />
            </Link>
          }
          <Link to="/account" className="p-2">
            <User className="w-6 h-6" />
          </Link>
          <Link to="/help-services" className="p-2">
            <HelpCircle className="w-6 h-6" />
          </Link>
        </div>
      </nav>
    </>
  );
}
