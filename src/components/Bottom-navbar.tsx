import { Link } from "react-router-dom";
import { HelpCircle, Coffee, Home, User } from "lucide-react";

export default function BottomNavBar() {
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t mt-8">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className="p-2">
            <Home className="w-6 h-6" />
          </Link>
          <Link to="/reserve" className="p-2 bg-gray-300">
            <Coffee className="w-6 h-6" />
          </Link>
          <Link to="/account" className="p-2">
            <User className="w-6 h-6" />
          </Link>
          <Link to="/help" className="p-2">
            <HelpCircle className="w-6 h-6" />
          </Link>
        </div>
      </nav>
    </>
  );
}
